import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "~/constants/errorResponse";
import { verifyToken } from "~/untils/jwt";
export const authMiddeware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader) {
    return res.json(
      new ErrorResponse({
        message: "Authorization header is missing",
        statusCode: 400,
      }),
    );
  }
  try {
    const decode = await verifyToken(
      authorizationHeader.split(" ")[1],
      process.env.PRIVATE_KEY_JWT,
    );
    next();
  } catch (err) {
    console.log(err);
    res.json(
      new ErrorResponse({ message: "invalid accessToken", statusCode: 401 }),
    );
  }
};
