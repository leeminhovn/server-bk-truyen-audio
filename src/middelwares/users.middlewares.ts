import { Request, Response, NextFunction } from "express";

import { WithId } from "mongodb";
import { ErrorResponse } from "~/constants/errorResponse";
import User from "~/models/schemas/User.schemas";
import { hasPassword } from "~/untils/crypto";
import databaseServices from "~/services/database.services";
import { verifyToken } from "~/untils/jwt";

export const loginValidator = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { password = "", email = "" } = _req.body;
  if (password.length === 0 || email.length === 0) {
    return res.json(
      new ErrorResponse({ message: "Error your data send", statusCode: 400 }),
    );
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
      return res.json(
        new ErrorResponse({ message: "Error your data send", statusCode: 400 }),
      );

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
      return res.json(
        new ErrorResponse({
          message: "This account already exists",
          statusCode: 409,
        }),
      );
    }
  }
};

export const logoutValidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.refreshToken) {
    return res.json(
      new ErrorResponse({
        message: "Invalid refreshToken",
        statusCode: 401,
      }),
    );
  }

  try {
    const decode = await verifyToken(
      req.body.refreshToken,
      process.env.PRIVATE_KEY_JWT,
    );
    req.body.user_id = decode.user_id;

    next();
  } catch (err) {
    return res.json(
      new ErrorResponse({
        message: "Error verify refreshToken",
        statusCode: 401,
      }),
    );
  }
};

export const emailVerifyMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body?.email_verify_token) {
    return res.json(
      new ErrorResponse({
        message: "EmailVerifyToken is Reqired",
        statusCode: 401,
      }),
    );
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
    res.json(
      new ErrorResponse({
        message: "Invalid email_verify_token",
        statusCode: 401,
      }),
    );
  }
};
