import jwt from "jsonwebtoken";
import User from "../models/User.Schema.js";

export const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // No token → continue as guest
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded._id)
      .select("-password -refreshToken");

    req.user = user || null;
    next();
  } catch (err) {
    // Invalid token → treat as guest (DON'T block)
    req.user = null;
    next();
  }
};
