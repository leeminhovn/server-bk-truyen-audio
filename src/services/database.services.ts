import { Collection, Db, MongoClient } from "mongodb";
import Admin from "~/models/schemas/admin/Admin.schemas";
import { Chapter } from "~/models/schemas/story/Chapter.schemas";
import { FollowersStory } from "~/models/schemas/story/FollowersStory.schemas";
import { RefreshTokenSchema } from "~/models/schemas/user/RefreshToken.schemas";
import { Story } from "~/models/schemas/story/Story.schemas";
import User from "~/models/schemas/user/User.schemas";
import { StoryGenre } from "~/models/schemas/genre/StoryGenre.schemas";
import { GenreTypes } from "~/models/schemas/genre/GenreTypes.schemas";

const uri = `mongodb://${process.env.DB_USERNAME}:${encodeURIComponent(
  process.env.DB_PASSWORD || "",
)}@${process.env.DB_IP}:${process.env.DB_PORT}`;

class dataBaseServices {
  private client: MongoClient;
  private db_storys: Db;
  private db_users: Db;
  private db_admin: Db;

  constructor() {
    this.client = new MongoClient(uri);
    this.db_storys = this.client.db(process.env.DB_STORYS_NAME);
    this.db_users = this.client.db(process.env.DB_USERS_NAME);
    this.db_admin = this.client.db(process.env.DB_ADMIN_NAME);
  }

  async connect() {
    try {
      await Promise.all([
        this.db_storys.command({ ping: 1 }),
        this.db_users.command({ ping: 1 }),
        this.db_admin.command({ ping: 1 }),
      ]);
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB kaka!",
      );
    } catch (err) {
      console.log(err);
    } finally {
      // await this.client.close();
    }
  }
  get users(): Collection<User> {
    return this.db_users.collection(
      process.env.DB_USERS_ACCOUNTS_COLLECTION || "",
    );
  }
  get adminAccounts(): Collection<Admin> {
    return this.db_admin.collection(
      process.env.DB_ADMIN_ACCOUNTS_COLLECTION || "",
    );
  }
  get followersStory(): Collection<FollowersStory> {
    return this.db_users.collection(process.env.DB_FOLLOWERS_STORYS || "");
  }

  get refreshTokens(): Collection<RefreshTokenSchema> {
    return this.db_users.collection(
      process.env.DB_REFRESHTOKENS_COLLECTION || "",
    );
  }

  get storys(): Collection<Story> {
    return this.db_storys.collection(process.env.DB_STORYS_COLLECTION || "");
  }
  get storys_genre(): Collection<StoryGenre> {
    return this.db_storys.collection(
      process.env.DB_STORYS_COLLECTION_STORYS_GENRE || "",
    );
  }
  get genres(): Collection<GenreTypes> {
    return this.db_storys.collection(
      process.env.DB_STORYS_COLLECTION_GENRES || "",
    );
  }
  get chapters(): Collection<Chapter> {
    return this.db_storys.collection(process.env.DB_CHAPTERS_COLLECTION || "");
  }
}

export default new dataBaseServices();
