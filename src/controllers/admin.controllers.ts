import { Request, Response } from "express";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { StatusAcceptStory } from "~/constants/enum";
import AcceptStory from "~/models/schemas/acceptStory/AcceptStory.schemas";
import Admin from "~/models/schemas/admin/Admin.schemas";
import { Chapter } from "~/models/schemas/story/Chapter.schemas";
import { Story } from "~/models/schemas/story/Story.schemas";
import adminServices from "~/services/admin.services";
import databaseServices from "~/services/database.services";
import storysServices from "~/services/storys.services";
import { verifyToken } from "~/untils/jwt";

export const adminLoginController = async (req: Request, res: Response) => {
  const user_id: ObjectId = req.body.dataUser._id;

  try {
    const [accessToken, refreshToken] = await adminServices.login({
      user_id: user_id.toString(),
    });
    return res.status(200).json({
      ...req.body.dataUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log(err);
  }

  return res.status(400).json({ message: "fail login" });
};

export const adminRegisterController = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  try {
    const dataUser: Admin = await adminServices.register({
      email,
      password,
      name,
    });
    res.status(200).json(dataUser);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "fail register" });
  }
};

export const adminLogoutController = async (req: Request, res: Response) => {
  const { user_id } = req.body;
  try {
    const result = await adminServices.logout({ user_id: user_id });

    return res.status(200).json({
      message: "Success logout",
    });
  } catch (err) {
    console.log(err);
    return res.status(503).json({
      message: err as string,
    });
  }
};
export const adminGetAdminInfoController = async (
  req: Request,
  res: Response,
) => {
  const authorizationHeader = req.header("Authorization") || "";
  const token = authorizationHeader.split(" ")[1];
  const decode = await verifyToken(token, process.env.PRIVATE_KEY_JWT);
  const accountFound: WithId<Admin> | null = await adminServices.getAdminInfo({
    user_id: decode.user_id,
  });
  if (accountFound !== null) {
    accountFound.accessToken = token;
    return res.status(200).json(accountFound);
  }
  return res.status(400).json({
    error: "Account does not exist",
  });
};
export const adminGetRefreshTokenController = async (
  req: Request,
  res: Response,
) => {
  try {
    const decode = await verifyToken(
      req.body.refreshToken,
      process.env.PRIVATE_KEY_JWT,
    );
    const resultFindRefreshToken = await adminServices.refreshToken(
      decode.user_id,
    );
    if (resultFindRefreshToken !== null) {
      return res.status(200).json({ accessToken: resultFindRefreshToken });
    } else {
      return res.status(404).json({ message: "Not found token" });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Token invalid" });
  }
};
export const adminGetAllListUser = async (req: Request, res: Response) => {
  const page: number = Number(req.query.page) || 0;
  const limit: number = Number(req.query.limit) || 20;
  const search: string =
    req.query?.search !== undefined ? req.query?.search.toString() : "";

  try {
    const data_storys = await adminServices.getListAllUser(page, limit, search);

    return res.json(data_storys);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
export const adminGetAllListAuthorsController = async (
  req: Request,
  res: Response,
) => {
  const page: number = Number(req.query.page) || 0;
  const limit: number = Number(req.query.limit) || 20;
  const search: string =
    req.query?.search !== undefined ? req.query?.search.toString() : "";

  try {
    const data_storys = await adminServices.getListAllAuthor(
      page ,
      limit,
      search,
    );

    return res.json(data_storys);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
export const addGenreController = async (req: Request, res: Response) => {
  try {
    await adminServices.updateGenre(true, req.body.genreName);
    return res.status(200).json({ messgae: "success" });
  } catch (err) {
    return res.status(400).json(err);
  }
};
export const deleteGenreController = async (req: Request, res: Response) => {
  try {
    await adminServices.updateGenre(false, "", req.body.genreId);
    return res.status(200).json({ messgae: "success" });
  } catch (err) {
    return res.status(400).json(err);
  }
};
export const userUpdateBlockStatusController = async (
  req: Request,
  res: Response,
) => {
  const { block, user_id } = req.body;
  try {
    databaseServices.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: { isBlock: block },
        $currentDate: { updated_at: true },
      },
    );
    console.log();
    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const getAdminAccountByIdController = async (
  req: Request,
  res: Response,
) => {
  const { user_id } = req.query;

  try {
    const result: WithId<Admin> | null =
      await databaseServices.adminAccounts.findOne({
        _id: new ObjectId(user_id?.toString()),
      });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json(err);
  }
};
export const deleteChapterController = async (req: Request, res: Response) => {
  try {
    const { chapter_id } = req.query;
    const chapterCurrent: Chapter | null =
      await databaseServices.chapters.findOne({
        _id: new ObjectId(chapter_id?.toString()),
      });
    if (chapterCurrent === null) {
      return res.status(404).json({ error: "Not Found Chapter" });
    }
    databaseServices.chapters.deleteOne({
      _id: new ObjectId(chapter_id?.toString()),
    });

    await databaseServices.chapters.updateMany(
      {
        story_id: new ObjectId(chapterCurrent.story_id),
        index: { $gte: Number(chapterCurrent.index) },
      }, // Match documents where index is less than 2
      { $inc: { index: -1 } },
    );
    return res.status(200).json({ message: "Success delete chapter" });
  } catch (err) {
    return res.status(400).json(err);
  }
};
export const addChapterController = async (req: Request, res: Response) => {
  try {
    const { newChapter } = req.body;
    newChapter.story_id = new ObjectId(newChapter.story_id);
    const countChapter: number = await databaseServices.chapters.countDocuments(
      {
        story_id: newChapter.story_id,
      },
    );
    const data: Chapter = new Chapter(newChapter);
    data.index = countChapter + 1;
    await databaseServices.chapters.insertOne(data);
    // databaseServices.chapters.
    // thêm tính năng add truyện
    return res.status(200).json({ message: "Insert success" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
};
export const editChapterController = async (req: Request, res: Response) => {
  try {
    const { editChapter } = req.body;

    await databaseServices.chapters.findOneAndReplace(
      {
        _id: new ObjectId(editChapter._id),
      },
      editChapter,
    );
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
export const addStoryByAuthorController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { story, author_id, author_message } = req.body;
    await adminServices.addStoryByAuthor(story, author_id, author_message);
    return res.status(200).json({ message: "success" });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
export const getStoryNeedApprovedController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { page = 0, limit = 20, author_id } = req.query;
    const queryCountRequest = author_id
      ? { author_id: new Object(author_id) }
      : {};
    const [dataStories, totalData] = await Promise.all([
      adminServices.getStoriesNeedApproved(
        Number(page),
        Number(limit),
        author_id?.toString() || undefined,
      ),
      databaseServices.storiesNeedApproved.countDocuments(queryCountRequest),
    ]);

    return res.status(200).json({ data: dataStories, totalData: totalData });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
export const updateModerationStatusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { status, moderator_feedback, story, author_id, _id } = req.body;
    if (status === 1) {
      const newStory = new Story(story);
      const resultStoryInsert: InsertOneResult<Story> | null =
        await storysServices.uploadStory(newStory, []);

      if (resultStoryInsert === null) {
        return res.status(400).json({ error: "Error" });
      }
      const idStory = resultStoryInsert.insertedId;
      // id truyện
      await adminServices.authorAddNewStoryInCollectionStoryOfAuthors(
        new ObjectId(author_id),
        idStory,
      );
    }
    await databaseServices.storiesNeedApproved.findOneAndUpdate(
      {
        _id: new ObjectId(_id),
      },
      {
        $set: {
          status: Number(status),
          moderator_feedback,
        },
      },
    );
    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
};
