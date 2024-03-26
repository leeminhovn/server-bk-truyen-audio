import { Router } from "express";

import {
  adminLoginController,
  adminRegisterController,
  adminLogoutController,
  adminGetRefreshTokenController,
  adminGetAllListUser,
  deleteGenreController,
  addGenreController,
  adminGetAdminInfoController,
  userUpdateBlockStatusController,
  adminGetAllListAuthorsController,
  getAdminAccountByIdController,
} from "~/controllers/admin.controllers";

import {
  adminLoginValidator,
  adminLogoutValidate,
  adminRegisterValidate,
  nameIsDuplicateMiddleware,
} from "~/middelwares/admin.middlewares";
import { authMiddeware } from "~/middelwares/auth.middleware";

const adminRouter = Router();

adminRouter.post("/login", adminLoginValidator, adminLoginController);
adminRouter.post(
  "/register",
  adminRegisterValidate,
  nameIsDuplicateMiddleware,
  adminRegisterController,
);
adminRouter.get("/get-admin-info", authMiddeware, adminGetAdminInfoController);
adminRouter.post("/logout", adminLogoutValidate, adminLogoutController);
adminRouter.post("/admin-get-refresh-token", adminGetRefreshTokenController);
adminRouter.get("/get-list-users", adminGetAllListUser);
adminRouter.get("/get-list-authors", adminGetAllListAuthorsController);

adminRouter.post("/add-genre", authMiddeware, addGenreController);
adminRouter.post("/delete-genre", authMiddeware, deleteGenreController);
adminRouter.post(
  "/user-update-block-status",
  authMiddeware,
  userUpdateBlockStatusController,
);
adminRouter.get(
  "/get-admin-account-by-id",
  authMiddeware,
  getAdminAccountByIdController,
);

export default adminRouter;
