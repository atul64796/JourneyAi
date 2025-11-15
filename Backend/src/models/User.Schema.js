import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    username : {
        type:String,
        required: true,
        lowercase: true,
        trim:true,
        index:true,
        unique:true
    },
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
    role: {         //role for admin
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  isBanned: {           //check account ban or unban
    type: Boolean,
    default: false,
  },

  accountStatus: {     //cuurnt status of account ban or unban
    type: String,
    enum: ["active", "deactivated"],
    default: "active",
  },

  lastLogin: {      //track last login
    type: Date,
  },

  bio: {          // bio for user profile just like instagram 
    type: String,
    trim: true,
    default: "",
  },

    refreshToken:{
        type:String
    },

},{timestamps:true});


userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign
(
    {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
);
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign
(
    {
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
);
}

export default mongoose.model("User",userSchema);

