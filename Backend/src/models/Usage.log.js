// models/UsageLog.js
import mongoose from "mongoose";


const usageLogSchema = new mongoose.Schema({
  userId:{
    type: Schema.Types.ObjectId,
     ref: "User", 
     default: null 
    },
  endpoint:{ 
    type: String, 
    required: true 
},  
  model:{
     type: String,
      required: true 
    },   
  tokens:{ 
    type: Number,
     default: 0 },       
  costEstimate:{ 
    type: Number,
     default: 0 
    },      
 
},{timestamps:true});

export default mongoose.model("UsageLog", usageLogSchema);
