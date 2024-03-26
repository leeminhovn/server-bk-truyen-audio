import { Router } from "express";
import {
  adminStoryUpdateInfoStoryController,
  getAllGenresController,
  getAllStoryOfAuthorListController,
  getStoryInfoContoller,
  handlePrepareUpdateStoryControler,
  uploadStoryController,
} from "~/controllers/storys.controllers";
import { getAllStoryListController } from "~/controllers/storys.controllers";
import { authMiddeware } from "~/middelwares/auth.middleware";
import { adminStoryInfoUpdateMiddleWare } from "~/middelwares/story.middlewares";

const storyRouter = Router();
storyRouter.post("/upload-story", uploadStoryController);
storyRouter.get("/get-all-storys", getAllStoryListController);
storyRouter.get("/get-storys-of-author", getAllStoryOfAuthorListController);

storyRouter.get("/get-story-info", getStoryInfoContoller);
storyRouter.post(
  "/admin-story-info-update",
  authMiddeware,
  adminStoryInfoUpdateMiddleWare,
  adminStoryUpdateInfoStoryController,
);

storyRouter.post(
  "/prepare-check-story-update",
  handlePrepareUpdateStoryControler,
);
storyRouter.get("/get-all-genres", getAllGenresController);

export default storyRouter;
