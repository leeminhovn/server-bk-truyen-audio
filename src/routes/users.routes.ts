import { Router } from "express";
import {
  emailVerifyValidator,
  loginController,
  logoutController,
  registerController,
} from "../controllers/users.controllers";
import { authMiddeware } from "../middelwares/auth.middleware";
import {
  emailVerifyMiddleWare,
  loginValidator,
  logoutValidate,
  registerValidate,
} from "../middelwares/users.middlewares";
const usersRouter = Router();

usersRouter.post("/login", loginValidator, loginController);
usersRouter.post("/register", registerValidate, registerController);
usersRouter.post("/logout", authMiddeware, logoutValidate, logoutController);
usersRouter.post("/email-verify", emailVerifyMiddleWare, emailVerifyValidator);
export default usersRouter;
