import { ObjectId } from "mongodb";

interface StoryGenreType {
  story_id: ObjectId;
  genre_type_id: ObjectId;
}
export class StoryGenre {
  story_id: ObjectId;
  genre_type_id: ObjectId;

  constructor(dataType: StoryGenreType) {
    this.story_id = dataType.story_id;
    this.genre_type_id = dataType.genre_type_id;
  }
}
