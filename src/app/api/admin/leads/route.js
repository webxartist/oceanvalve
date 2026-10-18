import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { requireAdmin } from "@/lib/admin-auth";
export const runtime = "nodejs";
export async function GET() { try { await requireAdmin(); await connectDB(); const items = await Lead.find({}).sort({ createdAt: -1 }).limit(500).lean(); return NextResponse.json({ items }); } catch (e) { return NextResponse.json({ error: e.status === 401 ? "Unauthorized" : "Could not load leads." }, { status: e.status || 500 }); } }
export async function PATCH(request) { try { await requireAdmin(); await connectDB(); const { id, status } = await request.json(); if (!id || !["New", "Contacted", "Qualified", "Closed", "Spam"].includes(status)) return NextResponse.json({ error: "Invalid lead update." }, { status: 400 }); const item = await Lead.findByIdAndUpdate(id, { status }, { new: true }); if (!item) return NextResponse.json({ error: "Lead not found." }, { status: 404 }); return NextResponse.json({ item }); } catch (e) { return NextResponse.json({ error: e.status === 401 ? "Unauthorized" : "Could not update lead." }, { status: e.status || 500 }); } }
