import { Router } from "express";
import { uploadStoryController } from "~/controllers/storys.controllers";
import { getAllStoryListController } from "~/controllers/storys.controllers";

const storyRouter = Router();
storyRouter.post("/upload-story", uploadStoryController);
storyRouter.get("/get-all-storys", getAllStoryListController);
export default storyRouter;
