import { Request, Response, NextFunction } from "express";
import { verifyToken } from "~/untils/jwt";
export const authMiddeware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader) {
    return res.status(400).json({
      message: "Authorization header is missing",
    });
  }
  try {
    const decode = await verifyToken(
      authorizationHeader.split(" ")[1],
      process.env.PRIVATE_KEY_JWT,
    );
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "invalid accessToken" });
  }
};
