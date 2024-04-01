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
  deleteChapterController,
  addChapterController,
  editChapterController,
  addStoryByAuthorController,
  getStoryNeedApprovedController,
  updateModerationStatusController,
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
adminRouter.get(
  "/delete-chapter-by-id",
  authMiddeware,
  deleteChapterController,
);
adminRouter.post("/add-chapter", authMiddeware, addChapterController);
adminRouter.post("/edit-chapter", authMiddeware, editChapterController);

/* 
thêm truyện với author
get các lượt duyệt truyện
xác nhận truyện

*/
adminRouter.post(
  "/author/add-story-need-approved",
  authMiddeware,
  addStoryByAuthorController,
);
adminRouter.get(
  "/get-stories-need-approved",
  authMiddeware,
  getStoryNeedApprovedController,
);
adminRouter.post(
  "/update-moderation-status",
  authMiddeware,
  updateModerationStatusController,
);

export default adminRouter;
