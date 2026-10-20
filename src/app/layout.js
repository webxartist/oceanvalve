import "./globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import SmoothScroll from "@/Components/SmoothScroll";
import SiteStructuredData from "@/Components/SiteStructuredData";
import FloatingContactButtons from "@/Components/FloatingContactButtons";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Ocean Valves & Equipments | Industrial Valves",
    template: "%s | Ocean Valves & Equipments",
  },
  description:
    "Explore industrial valves, flow-control products and pipeline fittings from Ocean Valves & Equipments.",
  verification: {
    google: "gHzwModJeZUzTgQb3XutPeXrPXJMVsdcmbK1MoIMaeA",
  },
  openGraph: {
    type: "website",
    siteName: "Ocean Valves & Equipments",
    title: "Ocean Valves & Equipments | Industrial Valve Solutions",
    description:
      "Explore OCEAN valves, flow-control products and industrial pipeline accessories.",
  },
  twitter: { card: "summary_large_image" },
  applicationName: "Ocean Valves & Equipments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SiteStructuredData />
        <SmoothScroll />
        <Navbar />
        <div className="flex-1">{children}</div>
        <FloatingContactButtons />
        <Footer />
      </body>
    </html>
  );
}
