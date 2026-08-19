import {Router} from "express"
import { AuthController } from "./auth.controller.js"
const authController=new AuthController();

const authRouter=Router();

authRouter.post("/register",authController.register);
authRouter.post("/login",authController.login);
export default authRouter;