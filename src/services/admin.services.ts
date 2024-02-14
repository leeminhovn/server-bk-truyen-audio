import { signJwt } from "~/untils/jwt";
import databaseServices from "./database.services";
import { TokenType, UserVerifyStatus } from "~/constants/enum";
import { hasPassword } from "~/untils/crypto";
import { RefreshTokenSchema } from "~/models/schemas/RefreshToken.schema";
import { ObjectId } from "mongodb";
import Admin from "~/models/schemas/Admin.schemas";

class adminServices {
  private signAccessToken(user_id: string): Promise<string> {
    return signJwt({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
      },
      options: {
        algorithm: "HS256",
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      },
    });
  }

  private signRefreshToken(user_id: string) {
    return signJwt({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
      },
      options: {
        algorithm: "HS256",
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      },
    });
  }

  constructor() {}

  async register(payload: { email: string; password: string; name: string }) {
    const user_id = new ObjectId();
    const { email, password, name } = payload;

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id.toString()),
      this.signRefreshToken(user_id.toString()),
    ]);
    const dataUser = new Admin({
      _id: user_id,
      email: email,
      name: name,
      password: hasPassword(password),
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    await Promise.all([
      databaseServices.adminAccounts.insertOne(dataUser),
      databaseServices.refreshTokens.insertOne(
        new RefreshTokenSchema({
          user_id: new ObjectId(user_id.toString()),
          token: refreshToken as string,
        }),
      ),
    ]);

    return dataUser;
  }
  async login(payload: { user_id: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload.user_id),
      this.signRefreshToken(payload.user_id),
    ]);
    await databaseServices.refreshTokens.deleteOne({
      user_id: new ObjectId(payload.user_id),
    });
    await databaseServices.refreshTokens.insertOne(
      new RefreshTokenSchema({
        user_id: new ObjectId(payload.user_id),
        token: refreshToken as string,
      }),
    );
    return [accessToken, refreshToken];
  }
  logout(payload: { user_id: string }) {
    // deletedCount
    return new Promise((resolve, reject) => {
      databaseServices.refreshTokens
        .deleteOne({
          user_id: new ObjectId(payload.user_id),
        })
        .then((resultDelete) => {
          resultDelete.deletedCount === 0
            ? reject("Token is removed")
            : resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
export default new adminServices();
