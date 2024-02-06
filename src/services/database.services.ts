import { Collection, Db, MongoClient } from "mongodb";
import { Chapter } from "~/models/schemas/Chapter.scheme";
import { RefreshTokenSchema } from "~/models/schemas/RefreshToken.schema";
import { Story } from "~/models/schemas/Story.scheme";
import User from "~/models/schemas/User.schemas";

const uri = `mongodb://${process.env.DB_USERNAME}:${encodeURIComponent(
  process.env.DB_PASSWORD || "",
)}@${process.env.DB_IP}:${process.env.DP_PORT}`;

class dataBaseServices {
  private client: MongoClient;
  private db: Db;
  constructor() {
    this.client = new MongoClient(uri);
    this.db = this.client.db(process.env.DB_NAME);
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 });
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
    return this.db.collection(process.env.DB_USERS_COLLECTION || "");
  }

  get refreshTokens(): Collection<RefreshTokenSchema> {
    return this.db.collection(process.env.DB_REFRESHTOKENS_COLLECTION || "");
  }
  get storys(): Collection<Story> {
    return this.db.collection(process.env.DB_STORYS_COLLECTION || "");
  }
  get chapters(): Collection<Chapter> {
    return this.db.collection(process.env.DB_CHAPTERS_COLLECTION || "");
  }
}

export default new dataBaseServices();
