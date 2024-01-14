import { ObjectId } from "mongodb";

interface ChapterType {
  _id?: ObjectId;
  story_id: ObjectId;
  chapter_name: String;
  content_chapter: String;
  created_at?: Date;
  updated_at?: Date;
}
export class chapter {
  _id?: ObjectId;
  chapter_name: String;
  story_id: ObjectId;

  content_chapter: String;
  created_at?: Date;
  updated_at?: Date;

  constructor(chapter: ChapterType) {
    const dateNow = new Date();
    this._id = chapter._id;
    (this.created_at = dateNow),
      (this.updated_at = dateNow),
      (this.chapter_name = chapter.chapter_name),
      (this.content_chapter = chapter.content_chapter);
    this.story_id = chapter.story_id;
  }
}
