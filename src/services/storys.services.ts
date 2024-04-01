import { Story } from "~/models/schemas/story/Story.schemas";
import databaseServices from "./database.services";
import { Chapter } from "~/models/schemas/story/Chapter.schemas";
import { Collection, DeleteResult, InsertOneResult, WithId } from "mongodb";
import { ObjectId } from "mongodb";
import { StoryCompletedStatus } from "~/constants/enum";
import { GenreTypes } from "~/models/schemas/genre/GenreTypes.schemas";
import { arraysHaveSameElements } from "~/helpers/array";
import { StoryOfAuthor } from "~/models/schemas/story/StoryOfAuthor.schemas";

class storyServices {
  constructor() {}
  private async removeAndUpdateStoryGenre(
    story_id: ObjectId,
    genersNew: Array<String>,
  ) {
    const [_, listIdGenre]: [DeleteResult, WithId<GenreTypes>[]] =
      await Promise.all([
        databaseServices.storys_genre.deleteMany({
          story_id: story_id,
        }),
        databaseServices.genres.find({ title: { $in: genersNew } }).toArray(),
      ]);
    // update thể loại
    const listGenresUpdate = listIdGenre.map((e) => {
      return { story_id, genre_type_id: e._id };
    });
    databaseServices.storys_genre.insertMany(listGenresUpdate);
  }
  private async getAllStoryOfAuthorDocument(
    authorId: ObjectId,
  ): Promise<Array<StoryOfAuthor>> {
    try {
      const data: Array<StoryOfAuthor> =
        await databaseServices.StoryOfAuthors.find({
          author_id: authorId,
        }).toArray();

      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  private async handelStoryGenreUpdate(story_id: ObjectId, newGenre: String) {
    const currentStory: WithId<Story> | null =
      await databaseServices.storys.findOne({ _id: story_id });

    const genersOld = currentStory!.story_genre.split(", ");
    const genersNew = newGenre.split(", ");

    if (!arraysHaveSameElements(genersOld, genersNew)) {
      //clear toàn bột thể loại của truyện
      await this.removeAndUpdateStoryGenre(story_id, genersNew);

      // tìm id của thể loại , và add ngược lại vào bộ truyện
    }
  }

  private async batchInsertChapters(
    collection: Collection<Chapter>,
    data: Array<Chapter>,
    batchSize: number,
  ): Promise<boolean> {
    data = data.map((d, index) => {
      return { ...d, index };
    });
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
      // Xoá các thể loại của truyện
      await this.removeAndUpdateStoryGenre(
        new ObjectId(story_info._id),
        story_info.story_genre.split(", "),
      );

      // sau đó add
      // Xoá truyện
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
      2000,
    );

    return resultStoryInsert;
  }

  async getListAllStory(
    skip: number,
    limit: number,
    search: string,
  ): Promise<Array<Story>> {
    const searchQuery = search.length > 0 ? { $text: { $search: search } } : {};
    const result: Array<Story> = await databaseServices.storys
      .find(searchQuery)
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();
    return result;
  }
  async getListAllStoryOfAuthor(
    skip: number,
    limit: number,
    search: string,
    user_id: ObjectId,
  ): Promise<Array<Story>> {
    try {
      const dataStoryId: Array<ObjectId> = (
        await this.getAllStoryOfAuthorDocument(user_id)
      ).map((e) => new ObjectId(e.story_id));

      const searchQuery =
        search.length > 0 ? { $text: { $search: search } } : {};

      const result: Array<Story> = await databaseServices.storys
        .find({ _id: { $in: dataStoryId }, ...searchQuery })
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(skip)
        .toArray();
      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async getStoryInfo(story_id: string) {
    try {
      const story_id_object = new ObjectId(story_id);

      const [story, chapters] = await Promise.all([
        databaseServices.storys.findOne({ _id: story_id_object }),
        databaseServices.chapters
          .find({ story_id: story_id_object })
          .project({ chapter_name: 1, _id: 1, index: 1 })
          .toArray(),
      ]);

      return [story, chapters];
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  async getChapterId(chapter_id: string): Promise<Chapter | null> {
    return await databaseServices.chapters.findOne({
      _id: new ObjectId(chapter_id),
    });
  }
  async adminStoryInfoUpdate(newUpdateStory: any): Promise<boolean> {
    try {
      const newStoryDeleteId = new Story(newUpdateStory);
      delete newStoryDeleteId._id;
      delete newStoryDeleteId.updated_at;

      const story_id: ObjectId = new ObjectId(newUpdateStory._id);

      this.handelStoryGenreUpdate(story_id, newStoryDeleteId.story_genre);

      await Promise.all([
        await databaseServices.storys.findOneAndUpdate(
          { _id: story_id },
          { $set: newStoryDeleteId, $currentDate: { updated_at: true } },
        ),
      ]);

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  async getAllGenres(): Promise<Array<GenreTypes>> {
    try {
      const data: Array<GenreTypes> = await databaseServices.genres
        .find({})
        .toArray();

      return data;
    } catch (err) {
      return [];
    }
  }
  async getAllChapters(story_id: string) {
    try {
      const data = databaseServices.chapters
        .find({
          _id: new ObjectId(story_id),
        })
        .project({ chapter_name: 1, _id: 1, index: 1 })
        .toArray();
      return data;
    } catch (err) {
      return [];
    }
  }
}

export default new storyServices();
