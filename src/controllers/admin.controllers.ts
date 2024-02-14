import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { ErrorResponse } from "~/constants/errorResponse";
import User from "~/models/schemas/User.schemas";

import adminServices from "~/services/admin.services";

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
    const dataUser: User = await adminServices.register({
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
  const { user_id, refreshToken } = req.body;
  try {
    const result = await adminServices.logout({ user_id: user_id });

    return res.json({
      message: "Success logout",
      statusCode: 200,
    });
  } catch (err) {
    console.log(err);
    return res.json(
      new ErrorResponse({
        message: err as string,
        statusCode: 503,
      }),
    );
  }
};
