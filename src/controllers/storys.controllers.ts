import { Request, Response } from "express";
import { InsertOneResult } from "mongodb";
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
