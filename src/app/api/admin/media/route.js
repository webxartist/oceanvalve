import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
const allowed = new Map([["image/jpeg","jpg"],["image/png","png"],["image/webp","webp"],["image/avif","avif"],["video/mp4","mp4"],["video/webm","webm"],["application/pdf","pdf"]]);
export async function POST(request) {
  try {
    await requireAdmin();
    const form = await request.formData();
    const files = form.getAll("files").filter(x => x && typeof x.arrayBuffer === "function");
    if (!files.length) return NextResponse.json({ error: "No files selected." }, { status: 400 });
    const dir = path.join(process.cwd(), "public", "uploads", "media");
    await mkdir(dir, { recursive: true });
    const uploaded = [];
    for (const file of files) {
      const ext = allowed.get(file.type);
      if (!ext) continue;
      if (file.size > 50 * 1024 * 1024) continue;
      const name = `${Date.now()}-${crypto.randomBytes(5).toString("hex")}.${ext}`;
      await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
      uploaded.push({ url: `/uploads/media/${name}`, type: file.type.startsWith("video/") ? "video" : file.type === "application/pdf" ? "brochure" : "image", title: file.name });
    }
    if (!uploaded.length) return NextResponse.json({ error: "No supported files were uploaded. Images/videos up to 50MB each are supported." }, { status: 400 });
    return NextResponse.json({ items: uploaded });
  } catch (e) { return NextResponse.json({ error: e.status === 401 ? "Unauthorized" : e.message || "Upload failed." }, { status: e.status || 500 }); }
}
