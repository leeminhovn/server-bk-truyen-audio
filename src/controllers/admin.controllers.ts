import { Request, Response } from "express";
import { ObjectId, WithId } from "mongodb";
import Admin from "~/models/schemas/admin/Admin.schemas";
import adminServices from "~/services/admin.services";
import databaseServices from "~/services/database.services";
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
    console.log(search);
    const data_storys = await adminServices.getListAllAuthor(
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
