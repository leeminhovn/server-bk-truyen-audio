import { Request, Response } from "express";
import { ObjectId, WithId } from "mongodb";
import User from "~/models/schemas/user/User.schemas";
import databaseServices from "~/services/database.services";
import usersServices from "~/services/users.services";

export const loginController = async (req: Request, res: Response) => {
  const user_id: ObjectId = req.body.dataUser._id;
  console.log("login");
  try {
    const [accessToken, refreshToken] = await usersServices.login({
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
export const registerController = async (req: Request, res: Response) => {
  const { email, password, name, device_uuid } = req.body;
  try {
    const dataUser: User = await usersServices.register({
      email,
      password,
      name,
      device_uuid,
    });
    res.status(200).json(dataUser);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "fail register" });
  }
};
export const authorUpdateBlockStatusController = async (
  req: Request,
  res: Response,
) => {
  const { block, user_id } = req.body;
  try {
    databaseServices.adminAccounts.findOneAndUpdate(
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
export const logoutController = async (req: Request, res: Response) => {
  const { user_id, refreshToken } = req.body;
  try {
    const result = await usersServices.logout({ user_id: user_id });

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

export const emailVerifyValidator = async (req: Request, res: Response) => {
  const { email_verify_token, decode_email_verify_token } = req.body;
  const { user_id } = decode_email_verify_token;
  const user = await databaseServices.users.findOne({
    _id: new ObjectId(user_id),
  });
  if (user === null) {
    return res.status(404).json({ message: "User not found" });
  }
  // đã verify trước đó rồi
  if (user!.email_verify_token === "") {
    return res.status(200).json({ message: "Email already verify before" });
  }
  const resultVerify = await usersServices.verifyEmail(user_id);
  return res.status(200).json({ message: "Success verify email" });
};

export const userInfoAccountController = async (
  req: Request,
  res: Response,
) => {
  const resultGet: WithId<User> | null = await usersServices.getUserInfoAccount(
    req.query.user_id?.toString() || "",
  );
  if (resultGet !== null) {
    return res.status(200).json(resultGet);
  } else {
    return res.status(404).json({ err: "Not found account" });
  }
};
export const donateMoneyFromUserController = async (
  req: Request,
  res: Response,
) => {
  try {
    const {user_id, money, story_id, author_id} = req.body;

    await usersServices.donateMoneyFromUser(user_id, Number(money), story_id, author_id);
    return res.status(200).json("success");
  } catch (err) {
    return res.status(400).json({ err: err });
  }
};
