import { Story } from "~/models/schemas/Story.scheme";
import databaseServices from "./database.services";
import { Chapter } from "~/models/schemas/Chapter.scheme";
import { Collection } from "mongodb";

class storyServices {
  constructor() {}

  private async batchInsertChapters(
    collection: Collection<Chapter>,
    data: Array<Chapter>,
    batchSize: number,
  ): Promise<boolean> {
    for (let i = 0; i < data.length; i += batchSize) {
      // Chia nhỏ mảng dữ liệu thành các lô nhỏ
      const batch = data.slice(i, i + batchSize);
      // Chèn từng lô vào cơ sở dữ liệu
      try {
        await collection.insertMany(batch);
      } catch (err) {
        console.log(err);
        return false;
      }
    }
    return true;
  }
  async uploadStory(story_info: Story, chapters: Array<Chapter>) {
    const result = await databaseServices.storys.insertOne(story_info);
    const dataChapters = chapters.map((chapter) => {
      chapter.story_id = result.insertedId;
      return new Chapter(chapter);
    });
    const resultChapterInsert = await this.batchInsertChapters(
      databaseServices.chapters,
      dataChapters,
      1000,
    );

    return result;
  }
}
export default new storyServices();
