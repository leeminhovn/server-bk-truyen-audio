import { Request, Response, NextFunction } from "express";

import { WithId } from "mongodb";
import User from "~/models/schemas/user/User.schemas";
import { hasPassword } from "~/untils/crypto";
import databaseServices from "~/services/database.services";
import { verifyToken } from "~/untils/jwt";
import usersServices from "~/services/users.services";

export const loginValidator = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { password = "", email = "" } = _req.body;
  if (password.length === 0 || email.length === 0) {
    return res.status(400).json({ message: "Error your data send" });
  }
  const accountCheck: WithId<User> | null =
    await databaseServices.users.findOne({ email: email });
  if (accountCheck === null) {
    return res.status(400).json({
      error: "Account does not exist",
    });
  } else if (accountCheck.password !== hasPassword(password)) {
    return res.status(400).json({
      error: "Password is wrong",
    });
  } else if(accountCheck.isBlock === true) {
    return res.status(400).json({
      error: "Account is block",
    });
  }
  _req.body.dataUser = accountCheck;
  next();
};

export const registerValidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email = "", password = "" } = req.body;
  switch (true) {
    case password.length === 0 || email.length === 0:
      return res.status(400).json({ message: "Error your data send" });

    case password.length === 0:
      return res.status(400).json({ error: "type your password" });

    case password.length < 6:
      return res
        .status(400)
        .json({ error: "min length password character > 6" });

    case email.length === 0:
      return res.status(400).json({ error: "type your email" });

    case email.length < 5:
      return res.status(400).json({ error: "min length email character > 5" });

    default: {
      const accountCheck: WithId<User> | null =
        await databaseServices.users.findOne({
          email: email,
        });
      if (accountCheck === null) {
        return next();
      }
      return res.status(409).json({
        error: "This account already exists",
      });
    }
  }
};

export const logoutValidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.refreshToken) {
    return res.json({
      message: "Invalid refreshToken",
      statusCode: 401,
    });
  }

  try {
    const decode = await verifyToken(
      req.body.refreshToken,
      process.env.PRIVATE_KEY_JWT,
    );
    req.body.user_id = decode.user_id;

    next();
  } catch (err) {
    return res.json({
      message: "Error verify refreshToken",
      statusCode: 401,
    });
  }
};
export const emailVerifyMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body?.email_verify_token) {
    return res.json({
      message: "EmailVerifyToken is Reqired",
      statusCode: 401,
    });
  }

  try {
    const decode_email_verify_token = await verifyToken(
      req.body.email_verify_token,
      process.env.PRIVATE_KEY_EMAIL_VERIFY,
    );
    req.body.decode_email_verify_token = decode_email_verify_token;

    return next();
  } catch (err) {
    console.log(err);
    res.json({
      message: "Invalid email_verify_token",
      statusCode: 401,
    });
  }
};
export const nameIsDuplicateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isDuplicate: boolean = await usersServices.checkNameIsDuplicate(
    req.body.name,
  );

  if (isDuplicate) {
    return res.status(400).json({ error: "Name already exists" });
  } else {
    next();
  }
  // return;
};
