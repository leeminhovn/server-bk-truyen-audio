import { ObjectId } from "mongodb";

interface StoryOfAuthorType {
  author_id: ObjectId;
  story_id: ObjectId;
}
export class StoryOfAuthor {
  author_id: ObjectId;
  story_id: ObjectId;
  constructor(data: StoryOfAuthorType) {
    this.author_id = data.author_id;
    this.story_id = data.story_id;
  }
}
