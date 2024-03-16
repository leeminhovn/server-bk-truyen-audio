import { ObjectId } from "mongodb";
import { BaseSchema } from "./Base.schemas";

interface MessageUserMailType {
  _id?: ObjectId;
  title: String;
  content: String;
  user_id: ObjectId;
  created_at?: Date;
  updated_at?: Date;
}

export class MessageUserMail extends BaseSchema {
  _id?: ObjectId;
  title: String;
  content: String;
  user_id: ObjectId;

  constructor(data: MessageUserMailType) {
    super(data.created_at, data.updated_at);
    this._id = data._id;
    this.title = data.title;
    this.content = data.content;
    this.user_id = data.user_id;
  }
}
