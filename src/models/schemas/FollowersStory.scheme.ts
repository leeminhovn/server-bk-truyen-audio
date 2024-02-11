import { ObjectId } from "mongodb";
import { BaseSchema } from "./Base.scheme";

interface FollowersStoryType {
  _id?: ObjectId;
  story_id: ObjectId;
  user_id: ObjectId;
}
export class FollowersStory extends BaseSchema {
  story_id: ObjectId;
  user_id: ObjectId;
  _id?: ObjectId;

  constructor(data: FollowersStoryType) {
    super();
    this._id = data._id;
    this.story_id = data.story_id;
    this.user_id = data.user_id;
  }
}
