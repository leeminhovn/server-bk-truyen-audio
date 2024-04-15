import { ObjectId } from "mongodb";
import { Story } from "./Story.schemas";

interface StoryWithIdChapterUpdateTypes {
  story: Story;
  id_new_chapter?: ObjectId;
}
export class StoryWithIdChapterUpdate extends Story {
  id_new_chapter?: ObjectId;
  constructor(data: StoryWithIdChapterUpdateTypes) {
    super(data.story);
    this.id_new_chapter = data.id_new_chapter;
  }
}
