import { Router } from "express";

import {
  adminLoginController,
  adminRegisterController,
  adminLogoutController,
  adminGetRefreshTokenController,
  adminGetAllListUser,
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
adminRouter.post("/admin-get-refresh-token", adminGetRefreshTokenController);
adminRouter.get("/get-list-users", adminGetAllListUser);

export default adminRouter;
