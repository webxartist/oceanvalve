"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save,
  LogOut,
  RefreshCw,
  Upload,
  ExternalLink,
  Settings,
  Users,
  LayoutDashboard,
} from "lucide-react";
const defaults = {
  siteName: "Ocean Valves & Equipments",
  tagline: "Innovation. Integrity. Performance.",
  heroTitle: "Engineered for critical flow.",
  heroDescription:
    "OCEAN industrial valves and flow-control solutions engineered for demanding applications.",
  heroImage: "/images/hero-valve-1.jpg",
  heroSlides: [],
  trustedBrands: [],
  internationalClients: [],
  phone: "+91-9820800306",
  whatsapp: "",
  email: "sales@oceanvalve.com",
  address: "22A, Piru Lane, Near JJ Hospital, Mumbai-400 009, India",
  footerText:
    "Industrial valves, fittings and flow-control solutions for demanding applications.",
  aboutTitle: "Masters in Valve Technology.",
  aboutBody:
    "Ocean Valves & Equipments, known by the trademark OCEAN, supplies industrial valves, fittings and instrumentation solutions for demanding services.",
  seoTitle: "OCEAN Valves & Equipments | OCEAN Industrial Valves",
  seoDescription:
    "Explore OVETA industrial valves, flow-control products and pipeline fittings from Ocean Valves & Equipments.",
  canonicalBaseUrl: "",
  defaultOgImage: "/images/hero-valve-1.jpg",
};
const input =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-cyan-600";
function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {children}
    </label>
  );
}
function linesToText(items, fields) {
  return (items || [])
    .map((x) => fields.map((f) => x[f] || "").join(" | "))
    .join("\n");
}
function parseLines(value, fields) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((v) => v.trim());
      return Object.fromEntries(fields.map((f, i) => [f, parts[i] || ""]));
    });
}
export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState("content");
  const [settings, setSettings] = useState(defaults);
  const [leads, setLeads] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState([]);
  async function request(url, options = {}) {
    const r = await fetch(url, {
      ...options,
      headers: {
        ...(options.body && typeof options.body === "string"
          ? { "Content-Type": "application/json" }
          : {}),
        ...(options.headers || {}),
      },
    });
    const d = await r.json();
    if (r.status === 401) {
      router.replace("/admin/login");
      throw new Error("Please sign in again.");
    }
    if (!r.ok) throw new Error(d.error || "Request failed");
    return d;
  }
  async function load() {
    setError("");
    try {
      const [s, l] = await Promise.all([
        request("/api/admin/settings"),
        request("/api/admin/leads"),
      ]);
      const loaded = { ...defaults, ...s.settings };
      if (
        String(loaded.siteName || "")
          .toLowerCase()
          .includes("butterfly")
      )
        loaded.siteName = defaults.siteName;
      if (
        String(loaded.aboutBody || "")
          .toLowerCase()
          .includes("butterfly") ||
        String(loaded.aboutBody || "")
          .toLowerCase()
          .includes("homes")
      )
        loaded.aboutBody = defaults.aboutBody;
      if (
        String(loaded.footerText || "")
          .toLowerCase()
          .includes("real estate") ||
        String(loaded.footerText || "")
          .toLowerCase()
          .includes("belong")
      )
        loaded.footerText = defaults.footerText;
      setSettings(loaded);
      setLeads(l.items || []);
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const d = await request("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      setSettings({ ...defaults, ...d.settings });
      setNotice("Website content saved successfully.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function uploadFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      files.forEach((f) => body.append("files", f));
      const d = await request("/api/admin/media", { method: "POST", body });
      setUploaded((old) => [...d.items, ...old]);
      setNotice(
        "Upload complete. Copy the returned URL into the relevant image field above.",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }
  async function logout() {
    try {
      await request("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
    }
  }
  const heroText = linesToText(settings.heroSlides, [
    "title",
    "description",
    "image",
    "eyebrow",
  ]);
  const brandText = linesToText(settings.trustedBrands, ["name", "image"]);
  const clientText = linesToText(settings.internationalClients, [
    "name",
    "image",
  ]);
  return (
    <div className="min-h-screen bg-[#f4f7f9] pt-30 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#061a2b] p-5 text-white lg:flex">
        <Link href="/" className="mb-10 block">
          <strong className="text-xl">
            Ocean <span className="text-cyan-300">Valves</span>
          </strong>
          <span className="mt-1 block text-xs text-white/50">
            OCEAN website administration
          </span>
        </Link>
        <nav className="space-y-2">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "content", label: "Website content", icon: Settings },
            { id: "leads", label: "Enquiries", icon: Users },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${tab === t.id ? "bg-white font-semibold text-[#061a2b]" : "text-white/70 hover:bg-white/10"}`}
            >
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </nav>
        <Link
          href="/admin/products"
          className="mt-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/10"
        >
          <Settings size={18} /> Product management
        </Link>
        <div className="mt-auto space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/10"
          >
            <ExternalLink size={16} /> View website
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/10"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-700">
              OCEAN control centre
            </p>
            <h1 className="mt-1 text-xl font-semibold">
              {tab === "content"
                ? "Website content"
                : tab === "leads"
                  ? "Website enquiries"
                  : "Overview"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/products"
              className="rounded-xl bg-[#061a2b] px-3 py-2 text-sm font-semibold text-white"
            >
              Manage products
            </Link>
            <button
              onClick={load}
              title="Refresh"
              className="rounded-xl border border-slate-200 p-2.5"
            >
              <RefreshCw size={17} />
            </button>
            <button
              onClick={logout}
              className="rounded-xl border border-slate-200 p-2.5 lg:hidden"
            >
              <LogOut size={17} />
            </button>
          </div>
          <div className="flex w-full gap-2 overflow-x-auto lg:hidden">
            {[
              { id: "overview", label: "Overview" },
              { id: "content", label: "Website content" },
              { id: "leads", label: "Enquiries" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-xs ${tab === t.id ? "bg-[#061a2b] text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </header>
        <div className="space-y-6 p-4 md:p-8">
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          {notice && (
            <p
              role="status"
              className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700"
            >
              {notice}
            </p>
          )}
          {tab === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Website enquiries", value: leads.length },
                  {
                    label: "Hero slides",
                    value: settings.heroSlides?.length || 3,
                  },
                  {
                    label: "Managed logos",
                    value:
                      (settings.trustedBrands?.length || 0) +
                      (settings.internationalClients?.length || 0),
                  },
                ].map((x) => (
                  <div
                    key={x.label}
                    className="rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <p className="text-sm text-slate-500">{x.label}</p>
                    <p className="mt-3 text-3xl font-semibold">{x.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold">
                  Manage the Ocean Valves website
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Edit the three-slide hero, add trusted brand logos, maintain
                  international client logos, update company content and review
                  incoming enquiries.
                </p>
                <button
                  onClick={() => setTab("content")}
                  className="mt-5 rounded-full bg-[#061a2b] px-5 py-3 text-sm font-semibold text-white"
                >
                  Edit website content
                </button>
              </div>
            </>
          )}
          {tab === "content" && (
            <form
              onSubmit={save}
              className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7"
            >
              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Homepage & company information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Save your changes to publish them to the website. For image
                  fields, use a path such as /uploads/media/example.jpg or an
                  absolute URL.
                </p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Company name">
                  <input
                    className={input}
                    value={settings.siteName || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                  />
                </Field>
                <Field label="Tagline">
                  <input
                    className={input}
                    value={settings.tagline || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, tagline: e.target.value })
                    }
                  />
                </Field>
                <Field label="Main hero heading">
                  <input
                    className={input}
                    value={settings.heroTitle || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, heroTitle: e.target.value })
                    }
                  />
                </Field>
                <Field label="Hero description">
                  <textarea
                    rows={3}
                    className={input}
                    value={settings.heroDescription || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        heroDescription: e.target.value,
                      })
                    }
                  />
                </Field>
                <div className="md:col-span-2 border-t border-slate-100 pt-5">
                  <h3 className="font-semibold">
                    Hero slider — 3 slides recommended
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    One slide per line: Heading | Description | Image URL |
                    Small eyebrow. A zoom-in effect and fade transition run
                    automatically; use the arrows or dots to navigate.
                  </p>
                  <textarea
                    rows={6}
                    className={input}
                    value={heroText}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        heroSlides: parseLines(e.target.value, [
                          "title",
                          "description",
                          "image",
                          "eyebrow",
                        ]),
                      })
                    }
                    placeholder="Engineered for critical flow. | Industrial valve solutions... | /images/hero-valve-1.jpg | OVETA · INDUSTRIAL VALVES"
                  />
                </div>
                <div className="md:col-span-2 border-t border-slate-100 pt-5">
                  <h3 className="font-semibold">Trusted brand logos</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    One per line: Brand name | image URL. Logos scroll
                    continuously from left to right.
                  </p>
                  <textarea
                    rows={4}
                    className={input}
                    value={brandText}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        trustedBrands: parseLines(e.target.value, [
                          "name",
                          "image",
                        ]),
                      })
                    }
                    placeholder="Brand name | /uploads/media/brand-logo.png"
                  />
                </div>
                <div className="md:col-span-2 border-t border-slate-100 pt-5">
                  <h3 className="font-semibold">International client logos</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    One per line: Client name | image URL. The section is shown
                    on the homepage when at least one client is listed.
                  </p>
                  <textarea
                    rows={4}
                    className={input}
                    value={clientText}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        internationalClients: parseLines(e.target.value, [
                          "name",
                          "image",
                        ]),
                      })
                    }
                    placeholder="International client | /uploads/media/client-logo.png"
                  />
                </div>
                <div className="md:col-span-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <label className="flex cursor-pointer items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-700">
                      <Upload size={19} />
                    </span>
                    <span>
                      <strong className="block text-sm">
                        Upload hero or logo images
                      </strong>
                      <span className="mt-1 block text-xs text-slate-500">
                        PNG, JPG, WebP or AVIF. Upload, then copy its URL below.
                      </span>
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      className="hidden"
                      onChange={uploadFiles}
                    />
                  </label>
                  {uploading && (
                    <p className="mt-3 text-sm text-cyan-800">
                      Uploading images…
                    </p>
                  )}
                  {uploaded.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploaded.map((f, i) => (
                        <div
                          key={`${f.url}-${i}`}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-3 text-xs"
                        >
                          <span className="font-medium">{f.title}</span>
                          <code className="break-all text-cyan-800">
                            {f.url}
                          </code>
                          <button
                            type="button"
                            onClick={() =>
                              navigator.clipboard?.writeText(f.url)
                            }
                            className="rounded-md border px-2 py-1"
                          >
                            Copy URL
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 border-t border-slate-100 pt-5">
                  <h3 className="font-semibold">About Ocean Valves</h3>
                </div>
                <Field label="About page heading">
                  <input
                    className={input}
                    value={settings.aboutTitle || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, aboutTitle: e.target.value })
                    }
                  />
                </Field>
                <Field label="Contact phone">
                  <input
                    className={input}
                    value={settings.phone || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                  />
                </Field>
                <Field label="Contact email">
                  <input
                    className={input}
                    value={settings.email || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                  />
                </Field>
                <Field label="WhatsApp number (optional)">
                  <input
                    className={input}
                    value={settings.whatsapp || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsapp: e.target.value })
                    }
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Office address">
                    <input
                      className={input}
                      value={settings.address || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, address: e.target.value })
                      }
                    />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field label="About text">
                    <textarea
                      rows={6}
                      className={input}
                      value={settings.aboutBody || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, aboutBody: e.target.value })
                      }
                    />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field label="Footer text">
                    <textarea
                      rows={2}
                      className={input}
                      value={settings.footerText || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, footerText: e.target.value })
                      }
                    />
                  </Field>
                </div>
                <Field label="SEO title">
                  <input
                    className={input}
                    value={settings.seoTitle || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, seoTitle: e.target.value })
                    }
                  />
                </Field>
                <Field label="Canonical website URL">
                  <input
                    className={input}
                    placeholder="https://www.oceanvalve.com"
                    value={settings.canonicalBaseUrl || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        canonicalBaseUrl: e.target.value,
                      })
                    }
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="SEO description">
                    <textarea
                      rows={3}
                      className={input}
                      value={settings.seoDescription || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          seoDescription: e.target.value,
                        })
                      }
                    />
                  </Field>
                </div>
              </div>
              <button
                disabled={busy}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#061a2b] px-5 py-3 font-semibold text-white disabled:opacity-60"
              >
                <Save size={17} />
                {busy ? "Saving…" : "Save website content"}
              </button>
            </form>
          )}
          {tab === "leads" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold">Website enquiries</h2>
              <p className="mt-1 text-sm text-slate-500">
                Enquiries submitted through the contact form.
              </p>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="border-b text-xs uppercase tracking-wide text-slate-400">
                      <th className="py-3 pr-4">Contact</th>
                      <th className="py-3 pr-4">Requirement / message</th>
                      <th className="py-3">Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l) => (
                      <tr
                        key={l._id}
                        className="border-b border-slate-100 align-top"
                      >
                        <td className="py-4 pr-4">
                          <p className="font-semibold">{l.name}</p>
                          <a className="text-cyan-800" href={`tel:${l.phone}`}>
                            {l.phone}
                          </a>
                          {l.email && (
                            <p className="text-xs text-slate-500">{l.email}</p>
                          )}
                        </td>
                        <td className="max-w-lg py-4 pr-4">
                          <p className="whitespace-pre-wrap text-slate-600">
                            {l.message || "General enquiry"}
                          </p>
                        </td>
                        <td className="py-4 text-slate-500">
                          {l.createdAt
                            ? new Date(l.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!leads.length && (
                  <p className="py-10 text-center text-sm text-slate-500">
                    No enquiries received yet.
                  </p>
                )}
              </div>
            </section>
          )}
          <p className="pb-5 text-xs text-slate-400">
            Ocean Valves CMS · Keep admin credentials private ·{" "}
            <Link className="underline" href="/" target="_blank">
              Open public website
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
