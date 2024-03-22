import { Router } from "express";

import {
  adminLoginController,
  adminRegisterController,
  adminLogoutController,
  adminGetRefreshTokenController,
  adminGetAllListUser,
  deleteGenreController,
  addGenreController,
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
adminRouter.post("/admin-get-refresh-token", adminGetRefreshTokenController);
adminRouter.get("/get-list-users", adminGetAllListUser);
adminRouter.post("/add-genre", authMiddeware,addGenreController);
adminRouter.post("/delete-genre",authMiddeware,deleteGenreController);

export default adminRouter;
