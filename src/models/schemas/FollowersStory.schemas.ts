import { ObjectId } from "mongodb";
import { BaseSchema } from "./Base.schemas";

interface FollowersStoryType {
  _id?: ObjectId;
  story_id: ObjectId;
  user_id: ObjectId;
  created_at?: Date;
  updated_at?: Date;
}
export class FollowersStory extends BaseSchema {
  story_id: ObjectId;
  user_id: ObjectId;
  _id?: ObjectId;

  constructor(data: FollowersStoryType) {
    super(data.created_at, data.updated_at);
    this._id = data._id;
    this.story_id = data.story_id;
    this.user_id = data.user_id;
  }
}
