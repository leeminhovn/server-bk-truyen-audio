import { NextFunction, Request, Response } from "express";
import { WithId } from "mongodb";
import Admin from "~/models/schemas/admin/Admin.schemas";
import adminServices from "~/services/admin.services";
import databaseServices from "~/services/database.services";
import { hasPassword } from "~/untils/crypto";
import { verifyToken } from "~/untils/jwt";

export const adminLoginValidator = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { password = "", email = "" } = _req.body;
  if (!password.length || !email.length) {
    return res.status(400).json({ error: "Error your data send" });
  }
  const accountCheck: WithId<Admin> | null =
    await databaseServices.adminAccounts.findOne({ email: email });
  if (accountCheck === null) {
    return res.status(400).json({
      error: "Account does not exist",
    });
  } else if (accountCheck.password !== hasPassword(password)) {
    return res.status(400).json({ error: "Password is wrong" });
  } else if(accountCheck.isBlock === true) {
    return res.status(400).json({
      error: "Account is block",
    });
  }
  _req.body.dataUser = accountCheck;
  next();
};

export const adminRegisterValidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email = "", password = "", name } = req.body;
  switch (true) {
    case name.length < 3:
      return res.status(400).json({ error: "Min length name character > 3" });
    case email.length === 0:
      return res.status(400).json({ error: "Type your email" });

    case password.length < 6:
      return res
        .status(400)
        .json({ error: "Min length password character > 6" });

    default: {
      const accountCheck: WithId<Admin> | null =
        await databaseServices.adminAccounts.findOne({
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

export const adminLogoutValidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.refreshToken) {
    return res.status(401).json({
      error: "Invalid refreshToken",
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
    return res.status(401).json({
      error: "Error verify refreshToken",
    });
  }
};
export const nameIsDuplicateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isDuplicate: boolean = await adminServices.checkNameIsDuplicate(
    req.body.name,
  );

  if (isDuplicate) {
    return res.status(400).json({ error: "Name already exists" });
  } else {
    next();
  }
  // return;
};
