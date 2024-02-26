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
  nameIsDuplicateMiddleware,
  registerValidate,
} from "../middelwares/users.middlewares";
const usersRouter = Router();

usersRouter.post("/login", loginValidator, loginController);
usersRouter.post(
  "/register",
  registerValidate,
  nameIsDuplicateMiddleware,
  registerController,
);
usersRouter.post("/logout", authMiddeware, logoutValidate, logoutController);
usersRouter.post(
  "/email-verify",
  emailVerifyMiddleWare,

  emailVerifyValidator,
);
export default usersRouter;
