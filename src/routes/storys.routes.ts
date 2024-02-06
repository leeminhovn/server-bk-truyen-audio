import { Router } from "express";
import { uploadStoryController } from "src/controllers/storys.controllers";

const storyRouter = Router();
storyRouter.post("/upload-story", uploadStoryController);
export default storyRouter;
