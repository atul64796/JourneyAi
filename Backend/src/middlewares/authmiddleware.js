import {User} from "../models/User.Schema.js"
import {ApiError} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/AsyncHandler.js"
import jwt from "jsonwebtoken"

export const verifyJwt = asyncHandler(async(req,_,next) => {
    try {
        const token = req.cookies?.accessToken || req.header
        ("Authorization")?.replace("Bearer","")
        if(!token){
            throw ApiError(401,"Unauthorized request")
        }
       const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
       const user = await User.findbyid(decodeToken?._id).select("-password, refreshToken")
       if(!user){
        throw ApiError(401,"Invalid Access Token")
       }
       req.user = user
       console.log(req.user)
       next()
    } catch (error) {
        throw ApiError(401,error?.message || "Invalid Access Token")
    }
})