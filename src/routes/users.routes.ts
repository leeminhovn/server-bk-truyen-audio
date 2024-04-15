import { Router } from "express";
import {
  donateMoneyFromUserController,
  emailVerifyValidator,
  loginController,
  logoutController,
  registerController,
  userInfoAccountController,
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

usersRouter.get("/user-info-account", userInfoAccountController);
usersRouter.post("/author-update-block-status", authMiddeware);

usersRouter.post("/donate-money-from-user",donateMoneyFromUserController);
export default usersRouter;
