import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/AsyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import User from "../models/User.Schema.js";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import mongoose from "mongoose";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating");
    }
}


const registerUser = asyncHandler(async (req,res) => {
    const {username, fullName, email, password} = req.body;
    console.log("Request body:", req.body);
    console.log("Files:", req.files);

    // Validation
    if([fullName, email, username, password].some(f => !f?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({ $or: [{username}, {email}] });
    if(existedUser) throw new ApiError(400, "User with email or username already exists");

    // Avatar must be present
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if(!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

    // Cover image is optional
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    // Upload to Cloudinary
    const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
    if(!avatarUpload?.secure_url) throw new ApiError(400, "Avatar upload failed");

    const coverUpload = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    // Create user
    const createdUser = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatarUpload.secure_url,
        coverImage: coverUpload?.secure_url || ""
    });

    if(!createdUser) throw new ApiError(500, "Something went wrong while registering the user");

    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});




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
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
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
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200, //success
        {
          user: loggedinUser,
          accessToken,
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





export {
    registerUser,
    loginUser,
    logoutUser,
}
