import { registerUser, loginUser, logoutUser} from "../controllers/user.controllers.js"
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





export default router;


//   /api/j1/v1/user/registerUser 