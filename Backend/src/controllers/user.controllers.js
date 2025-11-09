import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/AsyncHandler.js"
import User from "../models/User.Schema.js";

const registerUser = asyncHandler(async (req,res) => {
    //get user details from frontend
    //validation -not empty
    //check  if user exist already error and res
    //check avatar  coverImage
    //upload avatar and coverImage
    //create user object mongodb upload
    //remove token field and password field 
    //check user create
    //return response

    //get data from frontend
    const {username,fullName,email,password} = req.body;

      //validation -not empty
    if([fullName,email,username,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All field are required");
    }

    //check  if user exist already error and res
    const existedUser = User.findOne({
        $or:[{username},{email}],
    });

     //check  if user exist already error and res
    if(existedUser)
    {
        throw new ApiError(400,"user with email or username already exists");
    }

    

})