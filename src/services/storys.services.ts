import { Story } from "~/models/schemas/Story.scheme";
import databaseServices from "./database.services";
import { Chapter } from "~/models/schemas/Chapter.scheme";

class storyServices {
  constructor() {}
  async uploadStory(story_info: Story, chapters: Array<Chapter>) {
    const result = await databaseServices.storys.insertOne(story_info);
    const resultChapterInsert = await databaseServices.chapters.insertMany(
      chapters.map((chapter) => {
        chapter.story_id = result.insertedId;
        return new Chapter(chapter);
      }),
    );

    return result;
  }
}
export default new storyServices();
