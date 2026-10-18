import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export default async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error("Please define MONGODB_URI in your .env.local file.");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((instance) => instance);
  }
  try { cached.conn = await cached.promise; }
  catch (error) { cached.promise = null; throw error; }
  return cached.conn;
}
