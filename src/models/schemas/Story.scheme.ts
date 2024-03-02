import { ObjectId } from "mongodb";
import { StoryCompletedStatus } from "~/constants/enum";
import { BaseSchema } from "./Base.scheme";

interface StoryType {
  _id?: ObjectId;
  story_name: String;
  story_picture?: String;
  auhtor_name: String;
  story_genre: String;
  story_quick_review: String;
  created_at?: Date;
  updated_at?: Date;
  completed_status: StoryCompletedStatus;
  count_followers_story?: number;
  count_chapters: number;
  linh_thach?: number;
}
export class Story extends BaseSchema {
  _id?: ObjectId;
  story_name: String;
  auhtor_name: String;
  story_quick_review: String;
  story_genre: String;
  count_followers_story: number;
  story_picture: String;
  completed_status: StoryCompletedStatus;
  linh_thach: number;
  count_chapters: number;
  constructor(story: StoryType) {
    super(story.created_at, story.updated_at);
    this.count_chapters = story.count_chapters;
    this._id = story._id;
    this.story_name = story.story_name;
    this.story_picture = story.story_picture || "";
    this.auhtor_name = story.auhtor_name;
    this.story_quick_review = story.story_quick_review;
    this.story_genre = story.story_genre;
    this.completed_status = story.completed_status;
    this.linh_thach = story.linh_thach || 0;
    this.count_followers_story = story.count_followers_story || 0;
  }
}
