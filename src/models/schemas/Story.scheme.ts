import { ObjectId } from "mongodb";
import { StoryCompletedStatus } from "~/constants/enum";

interface StoryType {
  _id?: ObjectId;
  story_name: String;
  auhtor_name: String;
  story_genre: String;
  story_quick_review: String;
  created_at?: Date;
  updated_at?: Date;
  completed_status: StoryCompletedStatus;
}
export class Story {
  _id?: ObjectId;
  story_name: String;
  auhtor_name: String;
  story_quick_review: String;
  story_genre: String;

  created_at?: Date;
  updated_at?: Date;
  completed_status: StoryCompletedStatus;
  constructor(story: StoryType) {
    const dateNow = new Date();
    this._id = story._id;
    this.story_name = story.story_name;
    this.auhtor_name = story.auhtor_name;
    this.story_quick_review = story.story_quick_review;
    this.story_genre = story.story_genre;
    this.completed_status = story.completed_status;
    this.created_at = story.created_at || dateNow;
    this.updated_at = story.updated_at || dateNow;
  }
}
