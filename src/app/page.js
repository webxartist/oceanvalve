import Hero from "@/Components/Hero";
import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import Product from "@/models/Product";
import { catalogueProducts } from "@/data/catalogue";
import {
  ArrowUpRight,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Settings2,
} from "lucide-react";

export const dynamic = "force-dynamic";

/**
 * Convert MongoDB/Mongoose values into plain, serializable JavaScript data.
 * This is safe to use before passing Server Component props to Client Components.
 */
function toPlainValue(value) {
  if (value == null) return value;

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(toPlainValue);
  }

  if (typeof value !== "object") {
    return value;
  }

  // MongoDB ObjectId, including nested ObjectIds.
  if (
    value._bsontype === "ObjectId" ||
    value.constructor?.name === "ObjectId"
  ) {
    return value.toString();
  }

  // Convert other common BSON scalar types into plain values.
  if (
    ["Long", "Int32", "Double", "Decimal128", "Timestamp"].includes(
      value._bsontype,
    )
  ) {
    return value.toString();
  }

  // Convert BSON Binary to a serializable Base64 string.
  if (value._bsontype === "Binary") {
    return value.value(true).toString("base64");
  }

  // Handle Map values.
  if (value instanceof Map) {
    return Object.fromEntries(
      Array.from(value.entries(), ([key, item]) => [
        String(key),
        toPlainValue(item),
      ]),
    );
  }

  // Handle ordinary objects and nested MongoDB documents.
  const result = {};

  for (const [key, item] of Object.entries(value)) {
    // Do not expose internal Mongoose version metadata.
    if (key === "__v") continue;

    result[key] = toPlainValue(item);
  }

  return result;
}

function createSlug(title = "") {
  return String(title)
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
      return items.map((product) => {
        const p = toPlainValue(product);

        return {
          ...p,
          _id: String(p._id),
          title: p.title || "Industrial Valve",
          slug: p.slug || createSlug(p.title),
          images: Array.isArray(p.images) ? p.images : [],
          description: p.description || p.summary || "",
        };
      });
    }
  } catch (error) {
    console.error("Unable to load homepage products:", error);
  }

  return catalogueProducts.map((product, index) => {
    const p = toPlainValue(product);

    return {
      ...p,
      _id: String(p._id || `catalogue-${index + 1}`),
      title: p.title || "Industrial Valve",
      slug: p.slug || `catalogue-${index + 1}`,
      images: Array.isArray(p.images) ? p.images : p.image ? [p.image] : [],
      description: p.description || p.summary || "",
      published: true,
    };
  });
}

export default async function HomePage() {
  let settings = {};

  try {
    await connectDB();

    const document = await SiteSettings.findOne({
      key: "global",
    }).lean();

    // Normalize the MongoDB document immediately.
    settings = document ? toPlainValue(document) : {};
  } catch (error) {
    console.error("Unable to load site settings:", error);
  }

  // Preserve existing OVETA branding overrides.
  if (
    String(settings.siteName || "")
      .toLowerCase()
      .includes("butterfly")
  ) {
    settings.siteName = "Ocean Valves & Equipments";
  }

  if (
    /home|place|property|residential/i.test(String(settings.heroTitle || ""))
  ) {
    settings.heroTitle = "Engineered for critical flow.";
  }

  if (
    /home|property|residential|real estate/i.test(
      String(settings.heroDescription || ""),
    )
  ) {
    settings.heroDescription =
      "OCEAN industrial valves and flow-control solutions engineered for demanding applications.";
  }

  if (settings.heroImage === "/hero-home.jpg" || !settings.heroImage) {
    settings.heroImage = "/images/hero-valve-1.jpg";
  }

  if (/place|home/i.test(String(settings.aboutTitle || ""))) {
    settings.aboutTitle = "Masters in Valve Technology.";
  }

  // Always pass plain arrays and plain objects to the UI.
  const brands = Array.isArray(settings.trustedBrands)
    ? settings.trustedBrands
    : [];

  const international = Array.isArray(settings.internationalClients)
    ? settings.internationalClients
    : [];

  // Normalize the complete props object before crossing the component boundary.
  const heroSettings = toPlainValue(settings);

  // Load products independently so a product error doesn't break the homepage.
  const products = (await getProducts()).slice(0, 8);

  return (
    <>
      <Hero settings={heroSettings} />

      {/* Trusted brands */}
      {brands.length > 0 && (
        <section className="border-b border-slate-100 bg-white py-8">
          <div className="container-butterfly">
            <p className="mb-5 text-center text-[10px] font-bold uppercase tracking-[.25em] text-slate-400">
              Trusted brands & partners
            </p>

            <div className="logo-marquee">
              <div className="logo-marquee-track">
                {[...brands, ...brands].map((brand, index) => (
                  <div
                    key={`${brand.name || "brand"}-${index}`}
                    className="flex h-16 min-w-36 items-center justify-center px-7"
                  >
                    {brand.image ? (
                      <Image
                        src={brand.image}
                        alt={brand.name || "OVETA partner"}
                        width={150}
                        height={58}
                        className="max-h-12 w-auto object-contain grayscale transition hover:grayscale-0"
                        unoptimized
                      />
                    ) : (
                      <span className="font-semibold text-slate-500">
                        {brand.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Homepage products */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-butterfly">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.25em] text-cyan-700">
                Our product portfolio
              </p>

              <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-[#082338] md:text-5xl">
                Solutions for demanding industrial applications.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                Explore valves, flow-control products and pipeline accessories
                from the OCEAN catalogue.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold transition hover:border-cyan-600"
            >
              View all products <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product, index) => {
              const slug = product.slug || createSlug(product.title);
              const href = `/products/${slug}`;
              const image =
                product.image ||
                product.images?.[0] ||
                "/images/hero-valve-1.jpg";

              return (
                <Link
                  key={product._id || slug || index}
                  href={href}
                  aria-label={`View ${product.title} details`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-700"
                >
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gradient-to-br from-[#f7fafb] to-[#e4edf2]">
                    <Image
                      src={image}
                      alt={`${product.title} - OVETA industrial product`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-contain p-1 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    {product.category && (
                      <p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-700">
                        {product.category}
                      </p>
                    )}

                    <h3 className="mt-2 text-lg font-semibold leading-snug text-[#082338] transition-colors group-hover:text-cyan-800">
                      {product.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                      {product.summary ||
                        product.description ||
                        "Explore product details and specifications."}
                    </p>

                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-cyan-800">
                      View details <ArrowUpRight size={15} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {products.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-[#f7fafb] px-6 py-12 text-center">
              <h3 className="text-lg font-semibold text-[#082338]">
                Products coming soon
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Please contact our team for product information.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About section */}
      <section className="bg-[#f2f6f8] py-20 md:py-24">
        <div className="container-butterfly grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-cyan-700">
              About Ocean Valves
            </p>

            <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#082338] md:text-5xl">
              Masters in valve technology, driven by engineering.
            </h2>

            <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600">
              {settings.aboutBody &&
              !settings.aboutBody.toLowerCase().includes("butterfly") &&
              !settings.aboutBody.toLowerCase().includes("homes")
                ? settings.aboutBody
                : "Ocean Valves & Equipments, known by its trademark OVETA, has developed experience in industrial valves, fittings and instrumentation solutions. The catalogue highlights customer-specific valves for demanding services, including corrosive fluids, high temperatures and cryogenic service up to -196°C."}
            </p>

            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#082338] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-cyan-800"
            >
              Discover Ocean <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: ShieldCheck,
                title: "Quality focus",
                body: "Quality commitment and manufacturing practices are central to the company profile.",
              },
              {
                icon: Settings2,
                title: "Engineering experience",
                body: "Product development and customer-specific requirements across valve applications.",
              },
              {
                icon: CheckCircle2,
                title: "Wide product range",
                body: "Isolation, check, control, safety valves and pipeline accessories.",
              },
              {
                icon: Globe2,
                title: "Global outlook",
                body: "The catalogue describes a market for its products around the globe.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white bg-white p-6 shadow-sm"
              >
                <item.icon className="text-cyan-700" size={25} />
                <h3 className="mt-4 font-semibold text-[#082338]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* International clients */}
      {international.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-butterfly">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[.25em] text-cyan-700">
                International presence
              </p>

              <h2 className="mt-3 text-3xl font-semibold text-[#082338] md:text-4xl">
                Working across borders.
              </h2>

              <p className="mt-3 text-slate-600">
                International clients and project logos managed by your team.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {international.map((client, index) => (
                <div
                  key={`${client.name || "client"}-${index}`}
                  className="flex min-h-24 items-center justify-center rounded-2xl border border-slate-100 bg-white p-5"
                >
                  {client.image ? (
                    <Image
                      src={client.image}
                      alt={client.name || "International client"}
                      width={160}
                      height={70}
                      className="max-h-12 w-auto object-contain"
                      unoptimized
                    />
                  ) : (
                    <span className="text-sm font-semibold text-slate-500">
                      {client.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="bg-[#061a2b] py-16 text-white">
        <div className="container-butterfly flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-cyan-300">
              Discuss your application
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Need a valve for a critical service?
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Share your operating conditions, size, material and pressure
              requirements with our team.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-cyan-400 px-6 py-4 text-sm font-bold text-[#061a2b] transition hover:bg-white"
          >
            Contact Ocean Valves <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
