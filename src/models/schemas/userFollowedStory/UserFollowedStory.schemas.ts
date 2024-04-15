import { ObjectId } from "mongodb";
import { BaseSchema } from "../Base.schemas";

interface UserFollowedStoryTypes {
  _id?: ObjectId;
  story_id: ObjectId;
  user_id: ObjectId;
  id_new_chapter?: ObjectId;
  created_at?: Date;
  updated_at?: Date;
}
export class UserFollowedStory extends BaseSchema {
  _id?: ObjectId;
  id_new_chapter?: ObjectId;
  story_id: ObjectId;
  user_id: ObjectId;

  constructor(data: UserFollowedStoryTypes) {
    super(data.created_at, data.updated_at);
    this._id = data._id;
    this.story_id = data.story_id;
    this.id_new_chapter = data.id_new_chapter;
    this.user_id = data.user_id;
  }
}
