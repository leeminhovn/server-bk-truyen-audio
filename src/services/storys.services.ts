import { Story } from "~/models/schemas/Story.scheme";
import databaseServices from "./database.services";
import { chapter } from "~/models/schemas/Chapter.scheme";
import { type } from "os";
class storyServices {
  constructor() {}
  async uploadStory(story_info: Story, chapters: Array<chapter>) {
    const result = await databaseServices.storys.insertOne(story_info);
    console.log(chapters);
    const resultChapterInsert = await databaseServices.chapters.insertMany(
      chapters.map((chapter) => {
        chapter.story_id = result.insertedId;
        return chapter;
      }),
    );
    return result;
  }
}
export default new storyServices();
