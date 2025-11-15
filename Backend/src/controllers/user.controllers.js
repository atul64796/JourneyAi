import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/User.Schema.js";
import jwt from "jsonwebtoken";



const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

  
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};


// Register User Controller
const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;
  console.log("Request body:", req.body);
  console.log("Files:", req.files);

  
  // Fixed validation
  if ([fullName, username, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser)
    throw new ApiError(400, "User with email or username already exists");

  
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");


  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  //  Upload avatar
  const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarUpload?.secure_url)
    throw new ApiError(400, "Avatar upload failed");

  
  const coverUpload = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  // Create user
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatarUpload.secure_url,
    coverImage: coverUpload?.secure_url || "",
  });

  
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: createdUser,
        accessToken,
        refreshToken,
      },
      "User registered successfully"
    )
  );
});



const loginUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  console.log("Login Body:", req.body);

  
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  // check username anor email
  const finduser = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log("Found user:", finduser);

  if (!finduser) {
    throw new ApiError(404, "User does not exist");
  }

//validation
  const isPasswordValid = await finduser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate new tokens and save refreshToken in DB
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    finduser._id
  );

  const loggedinUser = await User.findById(finduser._id).select(
    "-password -refreshToken"
  );

  
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
        200,
        {
          user: loggedinUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});



const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, 
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
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});


//update password
const updatePassword = asyncHandler(async (req,res) => {
  const { oldPasword, newPassword} = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPasword);
  console.log(user);

  if(!isPasswordCorrect)
  {
    throw new ApiError(400,"Invalid old password");
  }

  user.password = newPassword;
  await user.save({validateBeforeSave:false})
  return res
  .status(200)
  .json(new ApiResponse(200,{},"Password changed Successfully"))
});


export { registerUser, loginUser, logoutUser,updatePassword};
