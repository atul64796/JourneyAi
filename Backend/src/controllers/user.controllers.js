import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/AsyncHandler.js"
import {uploadOncloudnary} from "../utils/cloudinary.js"
import {User} from "../models/User.Schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        user.save({validateBeforeSave:false})

        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating");
    }
}


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
    //check for image and check for avatar
    const avatarLocalPath = req.file?.avatar[0]?.path;

    let coverImageLocalPath;

    if(
        req.file && Array.isArray(req.files.coverImage) 
        && req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    
    if(!avatarLocalPath)
    {
        throw new Api(400,"Avatar file is required");
    }

    //upload both avatar and coverImage to cloudnary
    const avatar = await uploadOncloudnary(avatarLocalPath);
    const coverImage = await uploadOncloudnary(coverImageLocalPath);

    if(!avatar)
    {
        throw new ApiError(400,"Avatar file is required");
    }

    //created user object - create entry in mongodb
    const createduser = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    //check for user creation
    if(createduser)
    {
        throw new ApiError(400,"something went wrong while registring the user");
    }
     return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register sucessfully"));
})



//login user
const loginUser = asyncHandler(async (req, res) => {
  //req body  -> data
  //check username or email
  //find the user
  //password check
  //acess and refress token
  //send cookie
  //req body  -> data
  const { username, password, email } = req.body;
  console.log(req.body);
  //check username or email
  if (!username && !email) {
    throw new ApiError(400, "username or email in required");
  }
  //find the user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log(user);

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  //password check
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(isPasswordValid);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  //acess and refress token
  const { acessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedinUser = await User.findById(user._id).select(
    "-password,-refreshToken"
  );
  //send cookie
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", acessToken, options)
    .cookie("refreshToken", acessToken, options)
    .json(
      new ApiResponse(
        200, //success
        {
          user: loggedinUser,
          acessToken,
          refreshToken,
        },
        "User logged In Sucessfully"
      )
    );
});


//for logout user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,//this remove the field from document
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out Sucessfully"));
});

// change password



export {
    registerUser,
    loginUser,
    logoutUser,
}
