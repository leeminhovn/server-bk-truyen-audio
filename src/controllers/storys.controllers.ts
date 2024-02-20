import { Request, Response } from "express";
import { InsertOneResult } from "mongodb";
import { skip } from "node:test";
import { Story } from "~/models/schemas/Story.scheme";
import storysServices from "~/services/storys.services";

export const uploadStoryController = async (req: Request, res: Response) => {
  try {
    const {
      story_name,
      auhtor_name,
      story_quick_review,
      completed_status,
      chapters,
      story_genre,
    } = req.body;
    const data_story: InsertOneResult<Story> = await storysServices.uploadStory(
      new Story({
        story_name,
        auhtor_name,
        story_quick_review,
        completed_status,
        story_genre,
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
      page,
      limit,
      search,
    );

    return res.json(data_storys);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
export const getInfoStory = async (req: Request, res: Response) => {
  const { story_id } = req.query;
  if (story_id) {
  } else {
    res.status(404).json({ message: "Not found story" });
  }
};
