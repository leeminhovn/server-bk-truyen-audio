import { signJwt } from "~/untils/jwt";
import databaseServices from "./database.services";
import User from "~/models/schemas/user/User.schemas";
import { TokenType, UserVerifyStatus } from "~/constants/enum";
import { hasPassword } from "~/untils/crypto";
import { RefreshTokenSchema } from "~/models/schemas/user/RefreshToken.schemas";
import { ObjectId, WithId } from "mongodb";

class userService {
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

  private signEmailVerifyToken(user_id: string) {
    return signJwt({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
      },
      privateKey: process.env.PRIVATE_KEY_EMAIL_VERIFY,
      options: {
        algorithm: "HS256",
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN,
      },
    });
  }
  constructor() {}

  async register(payload: { email: string; password: string; name: string }) {
    const user_id = new ObjectId();
    const { email, password, name } = payload;

    const [accessToken, refreshToken, email_verify_token] = await Promise.all([
      this.signAccessToken(user_id.toString()),
      this.signRefreshToken(user_id.toString()),
      this.signEmailVerifyToken(user_id.toString()),
    ]);
    const dataUser = new User({
      _id: user_id,
      email: email,
      name: name,
      password: hasPassword(password),
      accessToken: accessToken,
      refreshToken: refreshToken,
      email_verify_token: email_verify_token,
    });
    await Promise.all([
      databaseServices.users.insertOne(dataUser),
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

  async verifyEmail(user_id: string) {
    const resultUpdate = await databaseServices.users.updateOne(
      {
        _id: new ObjectId(user_id),
      },
      {
        $set: {
          email_verify_token: "",
          verify: UserVerifyStatus.Verified,
        },
        $currentDate: {
          updated_at: true,
        },
      },
    );
    return {
      message: "Email verify success",
    };
  }
  async checkNameIsDuplicate(name_user: string): Promise<boolean> {
    const resultFindName: WithId<User> | null =
      await databaseServices.users.findOne({ name: name_user });
    return resultFindName !== null;
  }
  async getUserInfoAccount(user_id: string): Promise<WithId<User> | null> {
    try {

    const resultGet: WithId<User> | null = await databaseServices.users.findOne(
      {
        _id: new ObjectId(user_id),
      },
    );
    return resultGet;
  }
 catch(err) {
  console.log(err);
  return null;
 }
  
  }
}
export default new userService();
