import { 
  registerUser,
  loginUser,
  logoutUser,
  updatePassword,
  getCurrentUser,
  updateAccountDetails,
  avatarUpdate,
  UpdateCoverImage
  } from "../controllers/user.controller.js"
import {Router} from "express";
import {verifyJwt} from "../middlewares/authmiddleware.js"
import { upload } from "../middlewares/multer.middlewares.js";


const router = Router();

//registered user



router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

// login user
router.route("/loginUser").post(loginUser);

// logout user
router.route("/logoutUser").post(verifyJwt, logoutUser);

//updatePassword
router.route("/update-password").patch(verifyJwt,updatePassword);

//get cuurent user
router.route("/get-currentUser").get(verifyJwt,getCurrentUser);

//update account details
router.route("/updateAccount-Details").post(verifyJwt,updateAccountDetails);

//update Avatar 
router.route("/updateAvatar").patch(verifyJwt,upload.single("avatar"),avatarUpdate)
//update coverImage
router.route("/updateCoverImage").patch(verifyJwt,upload.single("coverImage"),UpdateCoverImage);
export default router;


//   /api/j1/v1/user/registerUser 