import { Request, Response } from "express";
import { InsertOneResult, ObjectId } from "mongodb";
import { GenreTypes } from "~/models/schemas/genre/GenreTypes.schemas";
import { Chapter } from "~/models/schemas/story/Chapter.schemas";
import { Story } from "~/models/schemas/story/Story.schemas";
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

  try {
    const data_storys: Array<Story> = await storysServices.getListAllStory(
      page * limit,
      limit,
      search,
    );

    return res.json(data_storys);
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
  const statusAcceptUpdate: boolean =
    await storysServices.handlePrepareStoryNeedUpdate(story_info);
  return res.status(200).json({ message: statusAcceptUpdate });
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
    const { story_id } = req.query;
    if (story_id === undefined) {
      return res.status(400).json({ err: "Not found story" });
    }
    const data = await storysServices.getAllChapters(story_id?.toString());

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ err: "erro some thing" });
  }
};
