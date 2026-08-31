// auth.router.ts
import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js"; // قم بإنشاء أو استدعاء الـ Middleware

const authController = new AuthController();
const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

authRouter.patch("/change-password", authenticateToken, authController.changePassword);
authRouter.patch("/change-username", authenticateToken, authController.changeUsername);
export default authRouter;