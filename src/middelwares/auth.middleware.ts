import { Request, Response, NextFunction } from "express";
import { verifyToken } from "~/untils/jwt";
export const authMiddeware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.header("Authorization");
  if (!authorizationHeader || !authorizationHeader.split(" ")[1]) {
    return res.status(400).json({
      message: "Authorization header is missing",
    });
  }
  try {
    const token = authorizationHeader.split(" ")[1];
    const decode = await verifyToken(token, process.env.PRIVATE_KEY_JWT);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "invalid accessToken" });
  }
};
