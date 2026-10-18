import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";
import connectDB from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

export default async function Footer() {
  let s = {};

  try {
    await connectDB();
    s = (await SiteSettings.findOne({ key: "global" }).lean()) || {};
  } catch {}

  const siteName =
    s.siteName && !s.siteName.toLowerCase().includes("butterfly")
      ? s.siteName
      : "Ocean Valves & Equipments";

  const footerText =
    s.footerText &&
    !s.footerText.toLowerCase().includes("real estate") &&
    !s.footerText.toLowerCase().includes("belong")
      ? s.footerText
      : "Industrial valves, fittings and flow-control solutions for demanding applications.";

  const address =
    s.address || "22A, Piru Lane, Near JJ Hospital, Mumbai – 400 009, India";

  const phone = s.phone || "+91-9820800306";
  const displayPhone = s.phone || "+91 98208 00306";
  const email = s.email || "sales@oceanvalve.com";

  return (
    <footer className="bg-[#041522] text-white">
      <div className="container-butterfly py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_.8fr_1fr]">
          {/* Company information */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <Image
                  src="/logo1.png"
                  alt="OVETA logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </span>

              <span>
                <strong className="block text-lg">{siteName}</strong>

                <span className="mt-1 block text-[10px] uppercase tracking-[.25em] text-cyan-300">
                  · Industrial Flow Control
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/60">
              {footerText}
            </p>
          </div>

          {/* Navigation links */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">
              Explore
            </h2>

            <ul className="mt-5 space-y-3 text-sm text-white/65">
              {[
                ["Product range", "/products"],
                ["About Ocean", "/about"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="transition-colors hover:text-cyan-300"
                  >
                    {label} <ArrowUpRight className="inline" size={13} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact information */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">
              Contact
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-6 text-white/65">
              <p className="flex gap-3">
                <MapPin size={17} className="mt-1 shrink-0 text-cyan-300" />
                <span>{address}</span>
              </p>

              <a
                className="flex gap-3 transition-colors hover:text-white"
                href={`tel:${phone}`}
              >
                <Phone size={16} className="mt-1 shrink-0 text-cyan-300" />
                <span>{displayPhone}</span>
              </a>

              <a
                className="flex gap-3 transition-colors hover:text-white"
                href={`mailto:${email}`}
              >
                <Mail size={16} className="mt-1 shrink-0 text-cyan-300" />
                <span className="break-all">{email}</span>
              </a>
            </div>

            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-[#041522] transition-colors hover:bg-white"
            >
              Send an enquiry <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          {/* Copyright */}
          <span>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </span>

          {/* Legal links and developer credit */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/privacy"
              className="transition-colors hover:text-cyan-300"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-cyan-300"
            >
              Terms
            </Link>

            <Link
              href="/admin/login"
              className="transition-colors hover:text-cyan-300"
            >
              Admin Login
            </Link>

            <span className="hidden h-4 w-px bg-white/15 sm:block" />

            {/* Built by WebXArtist */}
            <a
              href="https://webxartist.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website built by WebXArtist"
              className="inline-flex items-center gap-1.5 font-medium text-white/65 transition-colors hover:text-cyan-300"
            >
              <span>Built by</span>

              <span className="font-bold text-cyan-300">WebXArtist</span>

              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
