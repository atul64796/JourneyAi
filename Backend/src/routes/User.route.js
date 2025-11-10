import { registerUser, loginUser, logoutUser} from "../controllers/user.controllers.js"
import {Router} from "express";
import {verifyJwt} from "../middlewares/authmiddleware.js"

const router = Router();

//registered user
router.route("/registerUser").post(registerUser);

// login user
router.route("/loginUser").post(loginUser);

// logout user
router.route("/logoutUser").post(verifyJwt, logoutUser);

export default router;


//   /api/j1/v1/user/registerUser 