import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Story } from "~/models/schemas/story/Story.schemas";
import databaseServices from "~/services/database.services";

export const getStatisticsAdminController = async (
  req: Request,
  res: Response,
) => {
  const currentDate = new Date();
  try {
    const listStatistic: Array<any> = await Promise.all([
      databaseServices.storys.countDocuments(),
      databaseServices.storys.find().limit(10).toArray(),
      databaseServices.users.countDocuments({
        expired_date: null,
      }),
      databaseServices.users.countDocuments({
        expired_date: { $gt: currentDate },
      }),
      databaseServices.storys
        .find()
        .sort({ count_followers_story: -1 })
        .limit(10)
        .toArray(),
      databaseServices.storys
        .find()
        .sort({ linh_thach: -1 })
        .limit(10)
        .toArray(),
    ]);

    return res.status(200).json({
      total_story: listStatistic[0],
      story_top_ten_of_week: listStatistic[1],
      count_free_user: listStatistic[2],
      count_paid_user: listStatistic[3],
      story_top_ten_followers: listStatistic[4],
      story_top_ten_money: listStatistic[5],
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: "Something wrong" });
  }
};
export const getStatisticAuthorController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user_id = new ObjectId(req.query.user_id?.toString() || "");
    const listStoryOfAtuhorId: Array<ObjectId> = (
      await databaseServices.StoryOfAuthors.find({
        author_id: user_id,
      }).toArray()
    ).map((e) => new ObjectId(e.story_id.toString()));

    const data: Array<any> = await Promise.all([
      databaseServices.StoryOfAuthors.countDocuments({ author_id: user_id }),
      (
        await databaseServices.storys
          .find({
            _id: { $in: listStoryOfAtuhorId },
          })
          .toArray()
      ).reduce((accumulator: number, currentStory: Story) => {
        return accumulator + currentStory.linh_thach;
      }, 0),
      await databaseServices.storys.countDocuments({
        _id: { $in: listStoryOfAtuhorId },
        linh_thach: { $gt: 0 },
      }),
      databaseServices.storys
        .find({
          _id: { $in: listStoryOfAtuhorId },
        })
        .sort({ linh_thach: -1 })
        .limit(10)
        .toArray(),
      databaseServices.storys
        .find({
          _id: { $in: listStoryOfAtuhorId },
        })
        .sort({ count_followers_story: -1 })
        .limit(10)
        .toArray(),
    ]);
    return res.status(200).json({
      total_story: data[0],
      total_money_from_stories: data[1],
      total_storied_have_chance: data[2],
      top_ten_stories_donate: data[3],
      top_ten_stories_follow: data[4],
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ err: "erro" });
  }
};
export const getStatisticUserController = async (
  req: Request,
  res: Response,
) => {
  try {
    const listStatistic: Array<any> = await Promise.all([
      databaseServices.storys.find().limit(10).toArray(),
      databaseServices.storys
        .find()
        .sort({ count_followers_story: -1 })
        .limit(10)
        .toArray(),
      databaseServices.storys
        .find()
        .sort({ linh_thach: -1 })
        .limit(10)
        .toArray(),
    ]);

    return res.status(200).json({
      story_top_ten_of_week: listStatistic[0],
      story_top_ten_followers: listStatistic[1],
      story_top_ten_money: listStatistic[2],
    });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
