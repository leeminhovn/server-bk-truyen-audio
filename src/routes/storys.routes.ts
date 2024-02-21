import { Router } from "express";
import {
  getStoryInfoContoller,
  uploadStoryController,
} from "~/controllers/storys.controllers";
import { getAllStoryListController } from "~/controllers/storys.controllers";

const storyRouter = Router();
storyRouter.post("/upload-story", uploadStoryController);
storyRouter.get("/get-all-storys", getAllStoryListController);
storyRouter.get("/get-story-info", getStoryInfoContoller);

export default storyRouter;
