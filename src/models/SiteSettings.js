import mongoose from "mongoose";
const SiteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "global" },
    siteName: { type: String, default: "Ocean Valves & Equipments" },
    tagline: { type: String, default: "Innovation. Integrity. Performance." },
    heroTitle: { type: String, default: "Engineered for critical flow." },
    heroDescription: {
      type: String,
      default:
        "OCEAN industrial valves and flow-control solutions engineered for demanding applications.",
    },
    heroImage: { type: String, default: "/images/hero-valve-1.jpg" },
    heroSlides: { type: Array, default: [] },
    trustedBrands: { type: Array, default: [] },
    internationalClients: { type: Array, default: [] },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    footerText: {
      type: String,
      default:
        "Industrial valves, fittings and flow-control solutions for demanding applications.",
    },
    aboutTitle: { type: String, default: "Masters in Valve Technology." },
    aboutBody: {
      type: String,
      default:
        "Ocean Valves & Equipments, known by the trademark OCEAN, supplies industrial valves, fittings and instrumentation solutions for demanding services.",
    },
    seoTitle: {
      type: String,
      default: "Ocean Valves & Equipments | OCEAN Industrial Valves",
    },
    seoDescription: {
      type: String,
      default:
        "Explore OCEAN industrial valves, flow-control products and pipeline fittings from Ocean Valves & Equipments.",
    },
    founderName: { type: String, default: "" },
    founderRole: { type: String, default: "Founder" },
    founderBio: { type: String, default: "" },
    founderImage: { type: String, default: "" },
    founderLinkedIn: { type: String, default: "" },
    officeHours: { type: String, default: "" },
    googleBusinessUrl: { type: String, default: "" },
    serviceAreas: { type: String, default: "" },
    organizationDescription: { type: String, default: "" },
    defaultOgImage: { type: String, default: "/images/hero-valve-1.jpg" },
    canonicalBaseUrl: { type: String, default: "" },
    footerNote: { type: String, default: "" },
  },
  { timestamps: true },
);
export default mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", SiteSettingsSchema);
