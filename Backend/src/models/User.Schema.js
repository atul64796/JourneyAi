import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName : {
        type:String,
        required: true,
        lowercase: true,
        trim:true
    },
    email : {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        index:true,
        trim: true
    },
    password: {
        type: String,
        required: [true,"Password is required."]
    },
    avatar:{
        type: String,
        required: true
    },
    coverImage:{
        type: String,
        required: true
    },
    role:{
        type:String,
        enum:['user','admin','editor','premium'],
        default:'user',
        index:true
    },
    metaData:{
        type:mongoose.Schema.Types.Mixed
    },
    refreshToken:{
        type:String
    },

},{timestamps:true});

export const User = mongoose.model("User",userSchema);