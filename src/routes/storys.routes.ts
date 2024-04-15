import { Router } from "express";
import * as storyController from "~/controllers/storys.controllers";
import { getAllStoryListController } from "~/controllers/storys.controllers";
import { authMiddeware } from "~/middelwares/auth.middleware";
import { adminStoryInfoUpdateMiddleWare } from "~/middelwares/story.middlewares";

const storyRouter = Router();
storyRouter.post("/upload-story", storyController.uploadStoryController);
storyRouter.get("/get-all-storys", getAllStoryListController);
storyRouter.get(
  "/get-storys-of-author",
  storyController.getAllStoryOfAuthorListController,
);

storyRouter.get("/get-story-info", storyController.getStoryInfoContoller);
storyRouter.get("/get-story", storyController.getStoryContoller);
storyRouter.get(
  "/current-chapter-in-story",
  storyController.getCurrentChapterInStoryController,
);

storyRouter.post(
  "/admin-story-info-update",
  authMiddeware,
  adminStoryInfoUpdateMiddleWare,
  storyController.adminStoryUpdateInfoStoryController,
);

storyRouter.post(
  "/prepare-check-story-update",
  storyController.handlePrepareUpdateStoryControler,
);
storyRouter.get("/get-all-genres", storyController.getAllGenresController);
storyRouter.get("/get-chapter-by-id", storyController.getChapterIdController);
storyRouter.get("/get-all-chapters", storyController.getAllChaptersController);
storyRouter.get("/get-list-stories-by-genres", storyController.getListStoriesByGenreController);


storyRouter.get("/get-next-chapter", storyController.getNextChapterController);
storyRouter.get("/get-prev-chapter", storyController.getPrevChapterController);
storyRouter.post(
  "/get-list-stories-by-id",
  storyController.getListStoriesByIdController,
);
storyRouter.post(
  "/add-read-info-for-user",
  storyController.addReadHistoryForUserController,
);
storyRouter.get(
  "/get-reading-history-for-books",
  storyController.getReadingHistoryForBooksController,
);
storyRouter.get(
  "/check-user-need-synchronized",
  storyController.getCheckUserNeedSynchronizedController,
);
storyRouter.get(
  "/synchronized-for-user",
  storyController.makeSynchronizedForUserController,
);
storyRouter.get("/get-followed-stories",storyController.getFollowedStoriesController )

storyRouter.post("/update-follow-story",storyController.updateFollowStoryController )

storyRouter.get("/get-followed-story-info",storyController.getFollowedStoryInfoController )
storyRouter.get("/get-count-new-chapter-stories",storyController.getCountNewChapterStoriesController)
export default storyRouter;
