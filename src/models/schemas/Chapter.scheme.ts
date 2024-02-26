import { ObjectId } from "mongodb";
import { BaseSchema } from "./Base.scheme";

interface ChapterType {
  _id?: ObjectId;
  story_id: ObjectId;
  chapter_name: String;
  content_chapter: String;
  created_at?: Date;
  updated_at?: Date;
}
export class Chapter extends BaseSchema {
  _id?: ObjectId;
  chapter_name: String;
  story_id: ObjectId;
  content_chapter: String;

  constructor(chapter: ChapterType) {
    super(chapter.created_at, chapter.updated_at);
    this._id = chapter._id;
    (this.chapter_name = chapter.chapter_name),
      (this.content_chapter = chapter.content_chapter);
    this.story_id = chapter.story_id;
  }
}
