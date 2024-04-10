import { signJwt } from "~/untils/jwt";
import databaseServices from "./database.services";
import { StatusAcceptStory, TokenType } from "~/constants/enum";
import { hasPassword } from "~/untils/crypto";
import { RefreshTokenSchema } from "~/models/schemas/user/RefreshToken.schemas";
import { FindCursor, ObjectId, WithId } from "mongodb";
import Admin from "~/models/schemas/admin/Admin.schemas";
import { GenreTypes } from "~/models/schemas/genre/GenreTypes.schemas";
import { Chapter } from "~/models/schemas/story/Chapter.schemas";
import { Story } from "~/models/schemas/story/Story.schemas";
import AcceptStory from "~/models/schemas/acceptStory/AcceptStory.schemas";
import { StoryOfAuthor } from "~/models/schemas/story/StoryOfAuthor.schemas";

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
      role: "Auhtor",
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
  async getAdminInfo(payload: { user_id: string }) {
    const accountFound: WithId<Admin> | null =
      await databaseServices.adminAccounts.findOne({
        _id: new ObjectId(payload.user_id),
      });
    return accountFound;
  }
  async refreshToken(user_id: string): Promise<string | null> {
    const result: WithId<RefreshTokenSchema> | null =
      await databaseServices.refreshTokens.findOne({
        user_id: new ObjectId(user_id),
      });
    if (result !== null) {
      return await this.signAccessToken(user_id);
    } else {
      return null;
    }
  }
  async getListAllUser(skip: number, limit: number, search: string) {
    const searchQuery = search.length > 0 ? { $text: { $search: search } } : {};

    const result = await databaseServices.users
      .find(searchQuery)
      .sort({ created_at: -1 })
      .project({ level: 1, email: 1, spirit_stone: 1, area: 1, name: 1 })
      .limit(limit)
      .skip(skip)
      .toArray();

    return result;
  }
  async getListAllAuthor(skip: number, limit: number, search: string) {
    const searchQuery = {
      $and: [
        { role: { $ne: "Admin" } }, // Lọc các tài khoản có role khác "Admin"
        search.length > 0 ? { $text: { $search: search } } : {}, // Điều kiện tìm kiếm văn bản
      ],
    };
    const result = await databaseServices.adminAccounts
      .find(searchQuery)
      .sort({ created_at: -1 })

      .limit(limit)
      .skip(skip)
      .toArray();

    return result;
  }
  async updateGenre(isAdd: boolean = false, type: String, idType?: string) {
    if (isAdd) {
      try {
        await databaseServices.genres.insertOne(
          new GenreTypes({ title: type + "" }),
        );
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      try {
        await databaseServices.genres.deleteOne({
          _id: new ObjectId(idType),
        });
        await databaseServices.storys_genre.deleteMany({
          genre_type_id: new ObjectId(idType),
        });
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }
  async checkNameIsDuplicate(name_user: string): Promise<boolean> {
    const resultFindName: WithId<Admin> | null =
      await databaseServices.adminAccounts.findOne({ name: name_user });
    return resultFindName !== null;
  }

  async addStoryByAuthor(
    story: Story,
    author_id: String,
    author_message: string,
  ): Promise<boolean> {
    try {
      const acceptStory = new AcceptStory({
        story,
        author_id: new ObjectId(author_id.toString()),
        author_message,
      });
      await databaseServices.storiesNeedApproved.insertOne(acceptStory);

      return true;
    } catch (err) {
      return false;
    }
  }
  async getStoriesNeedApproved(
    page: number,
    limit: number,
    author_id: string | undefined,
  ): Promise<Array<AcceptStory>> {
    try {
      const query =
        author_id !== undefined
          ? {
              $and: [
                { author_id: new ObjectId(author_id) },
                // { status: { $ne: StatusAcceptStory.Resolve } },
              ],
            }
          : {};

      const data: Array<AcceptStory> =
        await databaseServices.storiesNeedApproved
          .find(query)
          .sort({ created_at: -1 })
          .limit(limit)
          .skip(limit * page)
          .toArray();
      return data;
    } catch (err) {
      return [];
    }
  }
  async updateModerationStatus(): Promise<boolean> {
    try {
      return true;
    } catch (err) {
      return false;
    }
  }
  async authorAddNewStoryInCollectionStoryOfAuthors(
    author_id: ObjectId,
    story_id: ObjectId,
  ): Promise<boolean> {
    try {
      const newData = new StoryOfAuthor({
        author_id: author_id,
        story_id: story_id,
      });
      await databaseServices.StoryOfAuthors.insertOne(newData);
      return true;
    } catch (err) {
      return false;
    }
  }
}
export default new adminServices();
