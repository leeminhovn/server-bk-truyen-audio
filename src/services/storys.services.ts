import { Story } from "~/models/schemas/Story.schemas";
import databaseServices from "./database.services";
import { Chapter } from "~/models/schemas/Chapter.schemas";
import { Collection, Filter, InsertOneResult, WithId } from "mongodb";
import { ObjectId } from "mongodb";
import { StoryCompletedStatus } from "~/constants/enum";

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

  async deleteStory(story_id: string) {
    const objectIdStory = new ObjectId(story_id);
    await Promise.all([
      databaseServices.storys.deleteOne({ _id: objectIdStory }),
      databaseServices.storys.deleteMany({ story_id }),
    ]);
    return true;
  }
  async handlePrepareStoryNeedUpdate(story_info: Story): Promise<boolean> {
    const resultFindDuplicatedStory: WithId<Story> | null =
      await databaseServices.storys.findOne({
        story_name: story_info.story_name,
        auhtor_name: story_info.auhtor_name,
      });

    if (
      resultFindDuplicatedStory !== null &&
      resultFindDuplicatedStory.completed_status ===
        StoryCompletedStatus.Completed
    ) {
      return false;
    } else {
      return true;
    }
  }
  async uploadStory(story_info: Story, chapters: Array<Chapter>) {
    const resultFindDuplicatedStory: WithId<Story> | null =
      await databaseServices.storys.findOne({
        story_name: story_info.story_name,
        auhtor_name: story_info.auhtor_name,
      });

    if (
      resultFindDuplicatedStory !== null &&
      resultFindDuplicatedStory.count_chapters === story_info.count_chapters
    ) {
      return null;
    }

    if (resultFindDuplicatedStory !== null) {
      await this.deleteStory(resultFindDuplicatedStory._id.toString());
    }
    const resultStoryInsert: InsertOneResult<Story> =
      await databaseServices.storys.insertOne(story_info);

    const dataChapters = chapters.map((chapter) => {
      chapter.story_id = resultStoryInsert.insertedId;
      return new Chapter(chapter);
    });

    const resultChapterInsert = await this.batchInsertChapters(
      databaseServices.chapters,
      dataChapters,
      1500,
    );

    return resultStoryInsert;
  }

  async getListAllStory(skip: number, limit: number, search: string) {
    const searchQuery = search.length > 0 ? { $text: { $search: search } } : {};

    const result: Array<Story> = await databaseServices.storys
      .find(searchQuery)
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

      return [story, chapters];
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async adminStoryInfoUpdate(newUpdateStory: any): Promise<boolean> {
    try {
      const newStoryDeleteId = new Story(newUpdateStory);
      delete newStoryDeleteId._id;
      delete newStoryDeleteId.updated_at;

      const result = await databaseServices.storys.findOneAndUpdate(
        { _id: new ObjectId(newUpdateStory._id) },
        { $set: newStoryDeleteId, $currentDate: { updated_at: true } },
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

export default new storyServices();
