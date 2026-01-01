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


const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;

  if (!fullName || !username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(400, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  let avatarUrl = "";
  let coverImageUrl = "";

  if (avatarLocalPath) {
    const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
    avatarUrl = avatarUpload?.secure_url || "";
  }

  if (coverImageLocalPath) {
    const coverUpload = await uploadOnCloudinary(coverImageLocalPath);
    coverImageUrl = coverUpload?.secure_url || "";
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatarUrl,
    coverImage: coverImageUrl,
  });

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      { user: createdUser, accessToken, refreshToken },
      "User registered successfully"
    )
  );
});




const loginUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  console.log("Login Body:", req.body);
  const user = await User.findOne({ email }).select("+password");
  
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  if (user.isBanned) {
    throw new ApiError(403, "Your account has been banned. Please contact support.");
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
const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(200, {}, "Password changed successfully")
  );
});


//get current user

const getCurrentUser = asyncHandler(async (req,res)=>{
  return res
  .status(200)
  .json(new ApiResponse(200,req.user,"current user fetched sucessfully"));
})

//update account detils
const updateAccountDetails = asyncHandler(async (req,res) => {
  const { fullName , email} = req.body;
  
  //check full name and email give or not
  if(!fullName || !email)
  {
    throw new ApiError(400,"All fields are required");
  }
 
  const user = await User.findOneAndUpdate(
    req.user?._id,
    {
      $set:{
        fullName,
        email
      },
    },
    {new: true}
  ).select("-password");
return res
    .status(200)
    .json(new ApiResponse(200,user,"Account details updated sucessfully"))
});

//update avatar
const avatarUpdate = asyncHandler(async (req,res) => {
  const avatarLocalpath = req.file?.path;
  if(!avatarLocalpath)
  {
    throw new ApiError(400, "Avatar file missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalpath);
  if(!avatar.url) throw new ApiError(400,"Error While Uploading avatar");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar:avatar.url
      },
    },{new: true}
  ).select("-password");

  return res
  .status(200)
  .json(new ApiResponse(200,user,"avatar image update successfully"))

})

//update coverImage
const UpdateCoverImage = asyncHandler(async (req,res) => {
  const coverImageLocalPath = req.file?.path;
  if(!coverImageLocalPath){
    throw new ApiError(400,"CoverImage file missing")
  }
  const coverImage =  await uploadOnCloudinary(coverImageLocalPath);
  if(!coverImage.url) throw new ApiError(400,"Error while uploading coverImage");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage:coverImage.url
      },
    },{new: true}
  ).select("-password");

  return res
  .status(200)
  .json(new ApiResponse(200,user,"coverImage update successfully"))
})


const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(200, users, "All users fetched successfully")
  );
});


const toggleUserBan = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isBanned = !user.isBanned;
  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      user,
      `User ${user.isBanned ? "banned" : "unbanned"} successfully`
    )
  );
});

const toggleAccountStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.accountStatus =
    user.accountStatus === "active" ? "deactivated" : "active";

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      user,
      `Account ${user.accountStatus} successfully`
    )
  );
});





export {
  registerUser,
  loginUser,
  logoutUser,
  updatePassword,
  getCurrentUser,
  updateAccountDetails,
  avatarUpdate,
  UpdateCoverImage,

  // 🔥 admin functions
  getAllUsers,
  toggleUserBan,
  toggleAccountStatus,
};
