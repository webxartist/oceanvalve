import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ImageOff } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { catalogueProducts } from "@/data/catalogue";

function createSlug(title = "") {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeProduct(p, slug) {
  if (!p) return null;

  return {
    ...p,
    _id: String(p._id || p.title || slug),
    slug: p.slug || slug,
    images: Array.isArray(p.images) ? p.images : [],
  };
}

async function getProduct(slug) {
  try {
    await connectDB();

    // First try the product's stored slug.
    let p = await Product.findOne({
      slug,
      published: true,
    }).lean();

    // Support older database records that do not have a stored slug.
    if (!p && !slug.startsWith("catalogue-")) {
      const possibleProducts = await Product.find({
        published: true,
        $or: [{ slug: { $exists: false } }, { slug: "" }, { slug: null }],
      }).lean();

      p = possibleProducts.find((item) => createSlug(item.title) === slug);
    }

    if (p) {
      return normalizeProduct(p, slug);
    }
  } catch (error) {
    console.error("Unable to load OVETA product:", error);
  }

  // Catalogue fallback for products without database records.
  const catalogueIndex = /^catalogue-(\d+)$/.exec(slug);

  const p = catalogueProducts.find(
    (item, index) =>
      createSlug(item.title) === slug ||
      (catalogueIndex && index + 1 === Number(catalogueIndex[1])),
  );

  if (!p) return null;

  return {
    ...p,
    _id: p._id || slug,
    slug,
    images: p.image ? [p.image] : [],
    description: p.description || p.summary || "",
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getProduct(slug);

  if (!p) {
    return {
      title: "Product Not Found | OVETA",
      robots: { index: false, follow: false },
    };
  }

  const description =
    p.seoDescription ||
    p.summary ||
    p.description ||
    `Explore ${p.title} from OVETA. Contact our team for product specifications and availability.`;

  const image = p.image || p.images?.[0];

  return {
    title: p.seoTitle || `${p.title} | OVETA Industrial Valves`,
    description,
    alternates: {
      canonical: `/products/${p.slug}`,
    },
    openGraph: {
      title: p.seoTitle || `${p.title} | OVETA Industrial Valves`,
      description,
      url: `/products/${p.slug}`,
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const p = await getProduct(slug);

  if (!p) notFound();

  const images = [
    ...new Set(
      [p.image, ...(p.images || [])].filter(
        (src) => typeof src === "string" && src.trim().length > 0,
      ),
    ),
  ];

  const specifications = [
    ["Pressure / rating", p.rating],
    ["Available sizes", p.sizes],
    ["Materials", p.materials],
    ["Standards", p.standards],
  ].filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );

  return (
    <main className="min-h-screen bg-[#f4f7f9] pb-20 pt-40 md:pt-36">
      <div className="container-butterfly mx-auto">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 transition hover:text-cyan-950"
        >
          <ArrowLeft size={16} />
          All products
        </Link>

        <div className="mt-7 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product image gallery */}
          <section className="min-w-0 space-y-4">
            {images.length > 0 ? (
              images.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="relative flex min-h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-[#f7f9fb] to-[#eaf1f5] sm:min-h-[380px] md:min-h-[460px]"
                >
                  <Image
                    src={src}
                    alt={`${p.title} - product image ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="object-contain p-2 transition-transform duration-500 hover:scale-[1.02] sm:p-3 md:p-4"
                  />
                </div>
              ))
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                <ImageOff size={36} strokeWidth={1.5} />
                <p className="font-medium">No product images available</p>
                <p className="text-sm">
                  Contact our team for product images and specifications.
                </p>
              </div>
            )}

            {images.length > 1 && (
              <p className="text-xs text-slate-500">
                {images.length} product images
              </p>
            )}
          </section>

          {/* Product information */}
          <section className="min-w-0 lg:sticky lg:top-28">
            {p.category && (
              <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-700">
                {p.category}
              </p>
            )}

            <h1 className="mt-3 break-words text-3xl font-semibold leading-tight text-[#082338] sm:text-4xl md:text-5xl">
              {p.title}
            </h1>

            <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
              {p.description || p.summary}
            </p>

            {specifications.length > 0 && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <h2 className="mb-5 text-lg font-semibold text-[#082338]">
                  Product specifications
                </h2>

                <dl className="divide-y divide-slate-100">
                  {specifications.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-1 gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(130px,0.8fr)_1.2fr] sm:gap-4"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                      </dt>

                      <dd className="break-words text-sm leading-6 text-slate-800">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {p.seoDescription && p.seoDescription !== p.summary && (
              <p className="mt-5 text-sm leading-7 text-slate-600">
                {p.seoDescription}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/contact?product=${encodeURIComponent(p.title || "")}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#062237] px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-cyan-900"
              >
                Enquire about this product
                <ArrowUpRight size={17} />
              </Link>

              <Link
                href="/products"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-[#082338] transition hover:border-cyan-700 hover:text-cyan-800"
              >
                Explore all products
              </Link>
            </div>

            <p className="mt-5 text-xs leading-5 text-slate-500">
              Specifications may vary by size, material, pressure class and
              configuration. Confirm final requirements with our team.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
