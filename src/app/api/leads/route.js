import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
export const runtime="nodejs";
export async function POST(request){try{const data=await request.json();const name=String(data.name||"").trim();const phone=String(data.phone||"").trim();if(name.length<2||phone.length<7)return NextResponse.json({error:"Please enter your name and a valid phone number."},{status:400});await connectDB();const lead=await Lead.create({name:name.slice(0,100),phone:phone.slice(0,30),email:String(data.email||"").slice(0,200),message:String(data.message||"").slice(0,3000),propertyTitle:String(data.propertyTitle||data.productTitle||"").slice(0,200),source:String(data.source||"Website").slice(0,100)});return NextResponse.json({ok:true,id:lead._id},{status:201});}catch{return NextResponse.json({error:"We could not send your enquiry. Please try again."},{status:500});}}
