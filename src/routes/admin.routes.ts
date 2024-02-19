import { Router } from "express";

import {
  adminLoginController,
  adminRegisterController,
  adminLogoutController,
  adminGetAdminInfo,
} from "~/controllers/admin.controllers";
import {
  adminLoginValidator,
  adminLogoutValidate,
  adminRegisterValidate,
} from "~/middelwares/admin.middlewares";
import { authMiddeware } from "~/middelwares/auth.middleware";

const adminRouter = Router();

adminRouter.post("/login", adminLoginValidator, adminLoginController);
adminRouter.post("/register", adminRegisterValidate, adminRegisterController);
adminRouter.post("/logout", adminLogoutValidate, adminLogoutController);

export default adminRouter;
