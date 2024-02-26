import { NextFunction, Request, Response } from "express";
import { Story } from "~/models/schemas/Story.scheme";

export const adminStoryInfoUpdateMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    new Story(req.body.storyInfoUpdate);

    next();
  } catch (err) {
    res.status(422).json({ messgae: "Invalid data" });
  }
};
