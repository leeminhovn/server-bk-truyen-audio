import { ObjectId } from "mongodb";

interface ReadingHistoryTypes {
  _id?: ObjectId;
  user_id: ObjectId | string;
  device_uuid: string;
  story_id: ObjectId;
  chapter_id: ObjectId;
  create_at?: Date;
  index:number;
}
export class ReadingHistory {
  _id?: ObjectId;

  user_id: ObjectId | string;
  create_at: Date;
  story_id: ObjectId;
  chapter_id: ObjectId;
  device_uuid: string;
  index:number;

  constructor(data: ReadingHistoryTypes) {
    const dateNow = new Date();
    this.story_id = data.story_id;
    this._id = data._id;
    this.user_id = data.user_id;
    this.create_at = data.create_at || dateNow;
    this.chapter_id = data.chapter_id;
    this.device_uuid = data.device_uuid;
    this.index =data.index;
  }
}
