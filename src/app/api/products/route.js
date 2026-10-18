import {NextResponse} from "next/server";import connectDB from "@/lib/mongodb";import Product from "@/models/Product";
export const runtime="nodejs";
export async function GET(){try{await connectDB();const items=await Product.find({published:true}).sort({sortOrder:1,updatedAt:-1}).lean();return NextResponse.json({items},{headers:{"Cache-Control":"public, s-maxage=60, stale-while-revalidate=300"}})}catch{return NextResponse.json({items:[],error:"Product catalogue is temporarily unavailable."},{status:503})}}
