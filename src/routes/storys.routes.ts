import { Router } from "express";
import {
  addReadHistoryForUserController,
  adminStoryUpdateInfoStoryController,
  getAllChaptersController,
  getAllGenresController,
  getAllStoryOfAuthorListController,
  getChapterIdController,
  getCheckUserNeedSynchronizedController,
  getCurrentChapterInStoryController,
  getListStoriesByIdController,
  getNextChapterController,
  getPrevChapterController,
  getReadingHistoryForBooksController,
  getStoryContoller,
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
storyRouter.get("/get-story", getStoryContoller);
storyRouter.get("/current-chapter-in-story", getCurrentChapterInStoryController);

storyRouter.get("/check-user-need-synchronized",getCheckUserNeedSynchronizedController)
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
storyRouter.get("/get-chapter-by-id", getChapterIdController);
storyRouter.get("/get-all-chapters", getAllChaptersController);

storyRouter.get("/get-next-chapter", getNextChapterController);
storyRouter.get("/get-prev-chapter", getPrevChapterController);
storyRouter.post("/get-list-stories-by-id", getListStoriesByIdController);
storyRouter.post("/add-read-info-for-user",addReadHistoryForUserController)
storyRouter.get("/get-reading-history-for-books",getReadingHistoryForBooksController)



export default storyRouter;
