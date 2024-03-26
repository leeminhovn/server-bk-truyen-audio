import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";
config();

export function signJwt({
  payload,
  privateKey = process.env.PRIVATE_KEY_JWT || "",
  options = { algorithm: "HS256" },
}: {
  payload: Record<string, any>;
  privateKey?: string;
  options?: Record<string, any>;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        console.log(err);
        reject("");
      } else {
        resolve(token || "");
      }
    });
  });
}
// create function  versify token
export function verifyToken(
  token: string,
  privateKey: string = process.env.PRIVATE_KEY_JWT || "",
): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, privateKey, (err, decoded) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
}
