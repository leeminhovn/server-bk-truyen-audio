import { ObjectId } from "mongodb";
import { StoryCompletedStatus } from "~/constants/enum";
import { BaseSchema } from "./Base.scheme";

interface StoryType {
  _id?: ObjectId;
  story_name: String;
  auhtor_name: String;
  story_genre: String;
  story_quick_review: String;
  created_at?: Date;
  updated_at?: Date;
  completed_status: StoryCompletedStatus;
  count_followers_story: Number;
}
export class Story extends BaseSchema {
  _id?: ObjectId;
  story_name: String;
  auhtor_name: String;
  story_quick_review: String;
  story_genre: String;
  count_followers_story: Number;

  completed_status: StoryCompletedStatus;
  constructor(story: StoryType) {
    super();

    this._id = story._id;
    this.story_name = story.story_name;
    this.auhtor_name = story.auhtor_name;
    this.story_quick_review = story.story_quick_review;
    this.story_genre = story.story_genre;
    this.completed_status = story.completed_status;
    this.count_followers_story = story.count_followers_story;
  }
}
