import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { requireAdmin } from "@/lib/admin-auth";
export const runtime = "nodejs";
export async function GET() { try { await requireAdmin(); await connectDB(); const settings = await SiteSettings.findOne({ key: "global" }).lean(); return NextResponse.json({ settings: settings || {} }); } catch (e) { return NextResponse.json({ error: e.status === 401 ? "Unauthorized" : "Could not load settings." }, { status: e.status || 500 }); } }
export async function PUT(request) { try { await requireAdmin(); await connectDB(); const data = await request.json(); delete data._id; delete data.key; delete data.createdAt; delete data.updatedAt; const settings = await SiteSettings.findOneAndUpdate({ key: "global" }, { $set: data, $setOnInsert: { key: "global" } }, { new: true, upsert: true, runValidators: true }); return NextResponse.json({ settings }); } catch (e) { return NextResponse.json({ error: e.status === 401 ? "Unauthorized" : "Could not save settings." }, { status: e.status || 500 }); } }
