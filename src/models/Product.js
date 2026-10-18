import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
  title:{type:String,required:true,trim:true,maxlength:180}, slug:{type:String,required:true,trim:true,lowercase:true,unique:true,index:true},
  category:{type:String,default:"Industrial Valves",trim:true}, summary:{type:String,default:"",maxlength:600}, description:{type:String,default:""},
  image:{type:String,default:""}, images:{type:[String],default:[]}, standards:{type:String,default:""}, materials:{type:String,default:""}, rating:{type:String,default:""}, sizes:{type:String,default:""},
  seoTitle:{type:String,default:""}, seoDescription:{type:String,default:"",maxlength:320}, published:{type:Boolean,default:true}, sortOrder:{type:Number,default:0}
},{timestamps:true});
export default mongoose.models.Product || mongoose.model("Product",ProductSchema);
