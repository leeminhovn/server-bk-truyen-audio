import { Story } from "~/models/schemas/Story.scheme";
import databaseServices from "./database.services";
import { Chapter } from "~/models/schemas/Chapter.scheme";
import { Collection, Filter } from "mongodb";
import { ObjectId } from "mongodb";

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

  async getListAllStory(skip: number, limit: number, search: string) {
    const searchQuery =
      search.length > 0
        ? { story_name: { $regex: search.trim(), $options: "i" } }
        : {};

    const result: Array<Story> = await databaseServices.storys
      .find(searchQuery as Filter<Story>)
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();

    return result;
  }

  async getStoryInfo(story_id: string) {
    const story_id_object = new ObjectId(story_id);

    try {
      const [story, chapters] = await Promise.all([
        databaseServices.storys.findOne({ _id: story_id_object }),
        databaseServices.chapters
          .find({ story_id: story_id_object })
          .project({ chapter_name: 1, _id: 1 })
          .toArray(),
      ]);
      // tìm hiểu về tính năng trỏ index mông, nodejs super, để tối ưu logic tìm chapter
      console.log(chapters);
      return [story, chapters];
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}

export default new storyServices();
