import mongoose from "mongoose";
const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  email: { type: String, trim: true, lowercase: true, default: "" },
  message: { type: String, trim: true, maxlength: 3000, default: "" },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
  propertyTitle: { type: String, default: "" },
  source: { type: String, default: "Website" },
  status: { type: String, enum: ["New", "Contacted", "Qualified", "Closed", "Spam"], default: "New" },
}, { timestamps: true });
export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
