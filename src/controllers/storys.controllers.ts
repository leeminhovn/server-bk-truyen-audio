import { Request, Response } from "express";
import { InsertOneResult, ObjectId } from "mongodb";
import { GenreTypes } from "~/models/schemas/genre/GenreTypes.schemas";
import { ReadingHistory } from "~/models/schemas/readingHistory/ReadingHistory.schemas";
import { Chapter } from "~/models/schemas/story/Chapter.schemas";
import { Story } from "~/models/schemas/story/Story.schemas";
import { StoryWithIdChapterUpdate } from "~/models/schemas/story/StoryWithIdChapterUpdate.schemas";
import { UserFollowedStory } from "~/models/schemas/userFollowedStory/UserFollowedStory.schemas";
import databaseServices from "~/services/database.services";
import storysServices from "~/services/storys.services";

export const uploadStoryController = async (req: Request, res: Response) => {
  try {
    const {
      story_name,
      auhtor_name,
      story_quick_review,
      completed_status,
      chapters,
      story_picture,
      story_genre,
    } = req.body;
    const data_story: InsertOneResult<Story> | null =
      await storysServices.uploadStory(
        new Story({
          story_name,
          auhtor_name,
          story_quick_review,
          completed_status,
          story_picture,
          story_genre,
          count_chapters: chapters.length,
        }),
        chapters,
      );
    res.status(200).json({ message: "success insert story" });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

export const getAllStoryListController = async (
  req: Request,
  res: Response,
) => {
  const page: number = Number(req.query.page) || 0;

  const limit: number = Number(req.query.limit) || 20;
  const search: string =
    req.query?.search !== undefined ? req.query?.search.toString() : "";
  console.log(page, limit, search + "123");

  try {
    const data_storys: Array<Story> = await storysServices.getListAllStory(
      page ,
      limit,
      search,
    );
    console.log(data_storys.length, "check");
    return res.status(200).json(data_storys);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

export const getAllStoryOfAuthorListController = async (
  req: Request,
  res: Response,
) => {
  const page: number = Number(req.query.page) || 0;
  const limit: number = Number(req.query.limit) || 20;
  const search: string =
    req.query?.search !== undefined ? req.query?.search.toString() : "";
  const user_id: ObjectId = new ObjectId(req.query.user_id?.toString() || 0);

  try {
    const data_storys: Array<Story> =
      await storysServices.getListAllStoryOfAuthor(
        page,
        limit,
        search,
        user_id,
      );

    return res.json(data_storys);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

export const getStoryInfoContoller = async (req: Request, res: Response) => {
  const { story_id } = req.query;
  if (story_id) {
    const infoStory = await storysServices.getStoryInfo(story_id.toString());

    res.status(200).json({ story: infoStory[0], chapters: infoStory[1] });
  } else {
    res.status(404).json({ message: "Not found story" });
  }
};
export const getStoryContoller = async (req: Request, res: Response) => {
  const { story_id } = req.query;
  if (story_id) {
    const infoStory: Story | null = await storysServices.getStory(
      story_id.toString(),
    );
    if (infoStory === null) {
      return res.status(404).json({ message: "Not found story" });
    }

    return res.status(200).json(infoStory);
  } else {
    res.status(404).json({ message: "Not found story" });
  }
};
export const adminStoryUpdateInfoStoryController = async (
  req: Request,
  res: Response,
) => {
  const storyInfoUpdate = req.body.storyInfoUpdate;

  const statusUpdate =
    await storysServices.adminStoryInfoUpdate(storyInfoUpdate);
  if (statusUpdate) {
    return res.status(200).json({ message: "success" });
  }
  return res.status(404).json({ message: "Not found story id to update" });
};
export const handlePrepareUpdateStoryControler = async (
  req: Request,
  res: Response,
) => {
  const story_info: Story = req.body;
  try {
    const statusAcceptUpdate: boolean =
      await storysServices.handlePrepareStoryNeedUpdate(story_info);
    return res.status(200).json({ message: statusAcceptUpdate });
  } catch (err) {
    console.log(err, "checkk3");
    return res.status(400).json({ error: err });
  }
};
export const getAllGenresController = async (req: Request, res: Response) => {
  const data: Array<GenreTypes> = await storysServices.getAllGenres();
  return res.status(200).json(data);
};
export const getChapterIdController = async (req: Request, res: Response) => {
  const { chapter_id } = req.query;
  try {
    const dataChapter: Chapter | null = await storysServices.getChapterId(
      chapter_id?.toString() || "",
    );

    return dataChapter === null
      ? res.status(404).json({ err: "Not foudn chapter" })
      : res.status(200).json(dataChapter);
  } catch (err) {
    return res.status(400).json({ err: "erro some thing" });
  }
};
export const getAllChaptersController = async (req: Request, res: Response) => {
  try {
    const { story_id, page = 0, limit = 20 } = req.query;
    if (story_id === undefined) {
      return res.status(400).json({ err: "Not found story" });
    }
    const data = await storysServices.getAllChapters(
      story_id?.toString(),
      Number(page),
      Number(limit),
    );

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ err: "erro some thing" });
  }
};
export const getNextChapterController = async (req: Request, res: Response) => {
  try {
    const { story_id, index } = req.query;
    const data: Chapter | null = await storysServices.getNextChapter(
      story_id?.toString() || "",
      Number(index),
    );
    if (data === null) {
      return res.status(404).json({ message: "Out range index chapter" });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ err: "erro some thing" });
  }
};
export const getPrevChapterController = async (req: Request, res: Response) => {
  try {
    const { story_id, index } = req.query;
    const data: Chapter | null = await storysServices.getPrevChapter(
      story_id?.toString() || "",
      Number(index),
    );
    if (data === null) {
      return res.status(404).json({ message: "Out range index chapter" });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ err: "erro some thing" });
  }
};
export const getListStoriesByIdController = async (
  req: Request,
  res: Response,
) => {
  const { listIdStories } = req.body;
  try {
    const listData: Array<Story> =
      await storysServices.getListStoriesById(listIdStories);
    return res.status(200).json(listData);
  } catch (err) {
    return res.status(400).json({ err: "error some thing" });
  }
};
export const addReadHistoryForUserController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { history_read } = req.body;
    console.log(req.body, "check");
    const readHistory: ReadingHistory = new ReadingHistory(history_read);
    await storysServices.addReadHistoryForUser(readHistory);
    res.status(200).json({ message: "Success add history" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
};
export const getReadingHistoryForBooksController = async (
  req: Request,
  res: Response,
) => {
  try {
    let { page, limit, device_uuid, user_id } = req.query;
    const data: Array<Story> = await storysServices.getReadingHistoryForBooks(
      Number(page?.toString() || 0),
      Number(limit?.toString() || 0),
      device_uuid?.toString() || "",
      user_id?.toString() || "",
    );
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Get Faile" });
  }
};

export const getCurrentChapterInStoryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { story_id, user_id, device_uuid } = req.query;
    const data: Chapter | null = await storysServices.getCurrentChapterInStory(
      story_id?.toString() || "",
      user_id?.toString() || "",
      device_uuid?.toString() || "",
    );
    console.log(data);
    if (data === null) {
      return res.status(404).json({ error: "Not found chapter" });
    }
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Get Faile" });
  }
};
export const getCheckUserNeedSynchronizedController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { user_id, device_uuid } = req.query;
    const isNeedSynchronized =
      await storysServices.getCheckUserNeedSynchronized(
        user_id?.toString() || "",
        device_uuid?.toString() || "",
      );
    return res.status(200).json(isNeedSynchronized);
  } catch (err) {
    return res.status(400).json({ error: "Get Faile" });
  }
};
export const makeSynchronizedForUserController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { device_uuid, user_id, is_synchronized } = req.query;
    await storysServices.makeSynchronizedForUser(
      device_uuid?.toString() || "",
      user_id?.toString() || "",
      is_synchronized === "true",
    );
    return res.status(200).json({ message: "Success Synchronized" });
  } catch (err) {
    return res.status(400).json(err);
  }
};
export const getFollowedStoriesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { user_id, page, limit } = req.query;
    if (!user_id) {
      return res.status(404).json({ error: "Not found user id" });
    }
    const listDataStories: Array<StoryWithIdChapterUpdate> =
      await storysServices.getFollowedStories(
        user_id?.toString() || "",
        Number(page || 0),
        Number(limit || 10),
      );

    return res.status(200).json(listDataStories);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
};
export const updateFollowStoryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { user_id, story_id, status_follow } = req.body;
    console.log(status_follow);
    await storysServices.updateFollowStory(
      user_id?.toString() || "",
      story_id?.toString() || "",
      status_follow,
    );
    return res.status(200).json("Success");
  } catch (err) {
    return res.status(400).json(err);
  }
};
export const getFollowedStoryInfoController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { user_id, story_id } = req.query;
    const data: UserFollowedStory | null =
      await storysServices.getFollowedStoryInfo(
        user_id?.toString() || "",
        story_id?.toString() || "",
      );
    if (data === null) {
      return res.status(404).json({ error: "This story not followed" });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
export const getCountNewChapterStoriesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { user_id } = req.query;
    console.log(user_id);
    if (!user_id) {
      return res.status(404).json({ error: "Not found user_id" });
    }
    const count: number =
      await databaseServices.user_followed_stories.countDocuments({
        user_id: new ObjectId(user_id + ""),
        // id_new_chapter: { $ne: null }
      });
    console.log(count);
    return res.status(200).json(count);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

export const getListStoriesByGenreController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { genre_id, page = 0, limit = 10 } = req.query;
    if (genre_id === undefined) {
      return res.status(404).json({ err: "Not found story" });
    }
    const data: Array<Story> = await storysServices.getListStoriesByGenre(
      genre_id?.toString(),
      Number(page),
      Number(limit),
    );
    console.log(data.length);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ err: "erro some thing" });
  }
};
