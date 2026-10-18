import connectDB from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

export default async function SiteStructuredData() {
  let settings = {};
  try {
    await connectDB();
    settings = await SiteSettings.findOne({ key: "global" }).lean() || {};
  } catch {}
  const base = (settings.canonicalBaseUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: settings.siteName && !settings.siteName.toLowerCase().includes("butterfly") ? settings.siteName : "Ocean Valves & Equipments",
    url: base,
    description: settings.organizationDescription || settings.seoDescription || "Industrial valves, fittings and flow-control solutions from Ocean Valves & Equipments.",
    image: settings.defaultOgImage ? (settings.defaultOgImage.startsWith("http") ? settings.defaultOgImage : `${base}${settings.defaultOgImage.startsWith("/") ? "" : "/"}${settings.defaultOgImage}`) : undefined,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: settings.address ? { "@type": "PostalAddress", streetAddress: settings.address, addressCountry: "IN" } : undefined,
    areaServed: (settings.serviceAreas || "").split(",").map(x => x.trim()).filter(Boolean).map(name => ({ "@type": "Place", name })),
    sameAs: [settings.instagram, settings.facebook, settings.googleBusinessUrl, settings.founderLinkedIn].filter(Boolean),
    founder: settings.founderName ? { "@type": "Person", name: settings.founderName, jobTitle: settings.founderRole || "Founder", description: settings.founderBio || undefined, image: settings.founderImage || undefined, sameAs: settings.founderLinkedIn ? [settings.founderLinkedIn] : undefined } : undefined,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />;
}
