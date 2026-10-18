"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight, ShieldCheck, FileCheck2 } from "lucide-react";

const links = [
  ["Home", "/"],
  ["Products", "/products"],
  ["About Us", "/about"],
  ["Contact", "/contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Replace with your actual verified business details.
  const isoCertification = "ISO 9001:2015 Certified";
  const gstNumber = "27CMUPK6036Q1Z1";

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#061a2b] px-3 pt-2 pb-3 shadow-lg md:px-6">
      {/* ISO and GST information bar */}
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl bg-[#061a2b] px-2 py-2 text-[10px] text-white sm:px-4 sm:text-xs">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={15} className="shrink-0 text-cyan-300" />
            <span className="font-semibold text-white">{isoCertification}</span>
          </span>

          <span className="hidden h-4 w-px bg-white/20 sm:block" />

          <span className="inline-flex items-center gap-1.5">
            <FileCheck2 size={14} className="shrink-0 text-cyan-300" />
            <span className="text-white/75">GSTIN:</span>
            <span className="font-medium text-white">{gstNumber}</span>
          </span>
        </div>

        <span className="hidden text-white/70 lg:block">
          Industrial Valves &amp; Flow Control Solutions
        </span>
      </div>

      {/* Main navigation */}
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between rounded-2xl border border-white/15 bg-[#061a2b] px-4 py-3 text-white shadow-xl md:rounded-full md:px-6">
        {/* Logo and company name */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white">
            <Image
              src="/logo1.png"
              alt="Ocean Valves logo"
              width={42}
              height={42}
              priority
              className="object-contain"
            />
          </span>

          <span>
            <strong className="block text-sm md:text-base">
              OCEAN <span className="text-cyan-300">VALVES</span>
            </strong>

            <span className="mt-1 block text-[9px] uppercase tracking-[.22em] text-white/70">
              &amp; Equipments
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-2 md:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-cyan-300"
            >
              {label}
            </Link>
          ))}

          <Link
            href="/contact"
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-[#061a2b] transition-colors hover:bg-white"
          >
            Send Enquiry
            <ArrowUpRight size={16} />
          </Link>

          <Link
            href="/admin/login"
            className="ml-1 text-xs text-white/60 transition-colors hover:text-white"
          >
            Admin
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {open && (
        <div className="mx-auto mt-2 max-w-[1440px] rounded-2xl border border-white/10 bg-[#061a2b] p-3 text-white shadow-xl md:hidden">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-white/85 transition hover:bg-white/10 hover:text-cyan-300"
            >
              {label}
            </Link>
          ))}

          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-xl px-4 py-3 text-sm font-bold text-cyan-300 transition hover:bg-white/10"
          >
            Send Enquiry
          </Link>

          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-4 py-3 text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Admin Login
          </Link>
        </div>
      )}
    </header>
  );
}
