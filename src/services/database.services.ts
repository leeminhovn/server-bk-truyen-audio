import { Collection, Db, MongoClient } from "mongodb";
import { chapter } from "~/models/schemas/Chapter.scheme";
import Post from "~/models/schemas/Post.schemas";
import { RefreshTokenSchema } from "~/models/schemas/RefreshToken.schema";
import { Story } from "~/models/schemas/Story.scheme";
import User from "~/models/schemas/User.schemas";

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fpngdpn.mongodb.net/`;

class datanaseServices {
  private client: MongoClient;
  private db: Db;
  constructor() {
    this.client = new MongoClient(uri);
    this.db = this.client.db(process.env.DB_NAME);
  }
  async connect() {
    try {
      this.db.command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!",
      );
    } catch (err) {
      console.log(err);
    } finally {
      await this.client.close();
    }
  }
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION || "");
  }
  get posts(): Collection<Post> {
    return this.db.collection(process.env.DB_POSTS_COLLECTION || "");
  }
  get refreshTokens(): Collection<RefreshTokenSchema> {
    return this.db.collection(process.env.DB_REFRESHTOKENS_COLLECTION || "");
  }
  get storys(): Collection<Story> {
    return this.db.collection(process.env.DB_STORYS_COLLECTION || "");
  }
  get chapters(): Collection<chapter> {
    return this.db.collection(process.env.DB_CHAPTERS_COLLECTION || "");
  }
}

export default new datanaseServices();
