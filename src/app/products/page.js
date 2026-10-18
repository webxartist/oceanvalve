import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { catalogueProducts } from "@/data/catalogue";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Industrial Valves & Products | OVETA",
  description:
    "Explore OVETA industrial valves, flow-control products, strainers, flanges and fittings.",
};

function createSlug(title = "") {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getProducts() {
  try {
    await connectDB();

    const items = await Product.find({ published: true })
      .sort({ sortOrder: 1, updatedAt: -1 })
      .lean();

    if (items.length) {
      return items.map((p) => ({
        ...p,
        _id: String(p._id),
        slug: p.slug || createSlug(p.title),
        images: Array.isArray(p.images) ? p.images : [],
      }));
    }
  } catch (error) {
    console.error("Unable to load OVETA products:", error);
  }

  return catalogueProducts.map((p, i) => ({
    ...p,
    _id: p._id || `catalogue-${i + 1}`,
    slug: `catalogue-${i + 1}`,
    images: p.image ? [p.image] : [],
    description: p.summary || p.description,
    published: true,
  }));
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#f4f7f9] pb-20 pt-36">
      <div className="container-butterfly">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-cyan-700">
          OVETA product range
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-[#082338] md:text-6xl">
          Valve technology for critical flow control.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Browse product families from Ocean Valves & Equipments. Final
          specifications depend on selected size, pressure class, material and
          configuration; contact our team to confirm your requirement.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p, i) => {
            const slug = p.slug || `catalogue-${i + 1}`;
            const href = `/products/${slug}`;
            const image =
              p.image || p.images?.[0] || "/images/hero-valve-1.jpg";

            return (
              <article
                id={`product-${i}`}
                key={p._id || slug}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Makes the entire card clickable */}
                <Link
                  href={href}
                  aria-label={`View ${p.title} product details`}
                  className="absolute inset-0 z-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
                />

                {/* Image container: fixed ratio, no image distortion */}
                <div className="relative h-[260px] w-full overflow-hidden bg-white sm:h-[280px]">
                  <Image
                    src={image}
                    alt={`${p.title} - OCEAN industrial product`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1279px) 50vw, 33vw"
                    className="object-contain p-1 transition-transform duration-500 group-hover:scale-105"
                  />

                  {p.category && (
                    <span className="absolute left-4 top-4 rounded-full border border-slate-200/70 bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0a4055]">
                      {p.category}
                    </span>
                  )}
                </div>

                <div className="pointer-events-none relative z-10 flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-semibold leading-snug text-[#082338] transition-colors group-hover:text-cyan-800">
                    {p.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
                    {p.summary || p.description}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-600">
                    {p.rating && (
                      <p>
                        <strong className="text-slate-800">Pressure:</strong>{" "}
                        {p.rating}
                      </p>
                    )}

                    {p.sizes && (
                      <p>
                        <strong className="text-slate-800">Sizes:</strong>{" "}
                        {p.sizes}
                      </p>
                    )}

                    {p.materials && (
                      <p>
                        <strong className="text-slate-800">Materials:</strong>{" "}
                        {p.materials}
                      </p>
                    )}

                    {p.standards && (
                      <p>
                        <strong className="text-slate-800">Standards:</strong>{" "}
                        {p.standards}
                      </p>
                    )}
                  </div>

                  {p.images?.length > 1 && (
                    <p className="mt-3 text-xs text-slate-500">
                      {p.images.length} product images available
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
                    <Link
                      href={href}
                      className="pointer-events-auto inline-flex items-center gap-2 text-sm font-bold text-cyan-800 hover:text-cyan-950"
                    >
                      View details
                      <ArrowUpRight size={16} />
                    </Link>

                    <Link
                      href={`/contact?product=${encodeURIComponent(p.title || "")}`}
                      className="pointer-events-auto inline-flex items-center gap-2 text-sm font-bold text-cyan-800 hover:text-cyan-950"
                    >
                      Enquire
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-xs leading-5 text-slate-500">
          Please verify exact technical requirements with the company before
          specification or purchase.
        </p>
      </div>
    </main>
  );
}
