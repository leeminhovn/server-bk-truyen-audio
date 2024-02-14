import { Router } from "express";

import {
  adminLoginController,
  adminRegisterController,
  adminLogoutController,
} from "~/controllers/admin.controllers";
import {
  adminLoginValidator,
  adminLogoutValidate,
  adminRegisterValidate,
} from "~/middelwares/admin.middlewares";

const adminRouter = Router();

adminRouter.post("/login", adminLoginValidator, adminLoginController);
adminRouter.post("/register", adminRegisterValidate, adminRegisterController);
adminRouter.post("/logout", adminLogoutValidate, adminLogoutController);

export default adminRouter;
