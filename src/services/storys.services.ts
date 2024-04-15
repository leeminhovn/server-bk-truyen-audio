import { Story } from "~/models/schemas/story/Story.schemas";
import databaseServices from "./database.services";
import { Chapter } from "~/models/schemas/story/Chapter.schemas";
import { Collection, DeleteResult, InsertOneResult, WithId } from "mongodb";
import { ObjectId } from "mongodb";
import { StoryCompletedStatus } from "~/constants/enum";
import { GenreTypes } from "~/models/schemas/genre/GenreTypes.schemas";
import { arraysHaveSameElements } from "~/helpers/array";
import { StoryOfAuthor } from "~/models/schemas/story/StoryOfAuthor.schemas";
import { ReadingHistory } from "~/models/schemas/readingHistory/ReadingHistory.schemas";
import { create } from "domain";
import { UserFollowedStory } from "~/models/schemas/userFollowedStory/UserFollowedStory.schemas";
import { StoryWithIdChapterUpdate } from "~/models/schemas/story/StoryWithIdChapterUpdate.schemas";
import { StoryGenre } from "~/models/schemas/genre/StoryGenre.schemas";

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
    if (resultFindDuplicatedStory == null) {

    await this.removeAndUpdateStoryGenre(
      resultStoryInsert.insertedId,
      story_info.story_genre.split(", "),
    );}
    const resultChapterInsert = await this.batchInsertChapters(
      databaseServices.chapters,
      dataChapters,
      2000,
    );

    return resultStoryInsert;
  }

  async getListAllStory(
    page: number,
    limit: number,
    search: string,
  ): Promise<Array<Story>> {
    const searchQuery = search.length > 0 ? { $text: { $search: search } } : {};
    const result: Array<Story> = await databaseServices.storys
      .find(searchQuery)
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(page * limit)
      .toArray();
    return result;
  }
  async getListAllStoryOfAuthor(
    page: number,
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
        .skip(page * limit)
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
  async getStory(story_id: string): Promise<Story | null> {
    try {
      const story_id_object = new ObjectId(story_id);

      const story: Story | null = await databaseServices.storys.findOne({
        _id: story_id_object,
      });

      return story;
    } catch (err) {
      console.log(err);
      return null;
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
  async getAllChapters(story_id: string, page: number, limit: number) {
    try {
      const data = await databaseServices.chapters
        .find({
          story_id: new ObjectId(story_id),
        })
        .project({ chapter_name: 1, _id: 1, index: 1 })
        .sort({ index: 1 })
        .limit(limit)
        .skip(limit * page)
        .toArray();
      return data;
    } catch (err) {
      return [];
    }
  }
  async getListStoriesByGenre(genre_id: string, page: number, limit: number) {
    try {
      console.log(genre_id);
      const dataNeedGet = await databaseServices.storys_genre
        .find({
          genre_type_id: new ObjectId(genre_id),
        })
        .sort({ create_at: -1 })
        .project({ story_id: 1 })
        .limit(limit)
        .skip(limit * page)
        .toArray();

      console.log(dataNeedGet);
      return await this.getListStoriesById(
        dataNeedGet.map((data) => {
          console.log(data.story_id.toString());
          return data.story_id.toString();
        }),
      );
    } catch (err) {
      return [];
    }
  }
  async getNextChapter(
    story_id: string,
    index: number,
  ): Promise<Chapter | null> {
    try {
      const data: Chapter | null = await databaseServices.chapters.findOne({
        story_id: new ObjectId(story_id),
        index: index + 1,
      });
      return data;
    } catch (err) {
      return null;
    }
  }
  async getPrevChapter(
    story_id: string,
    index: number,
  ): Promise<Chapter | null> {
    try {
      const data = await databaseServices.chapters.findOne({
        story_id: new ObjectId(story_id),
        index: index - 1,
      });

      return data;
    } catch (err) {
      return null;
    }
  }
  async getListStoriesById(
    listStoriesId: Array<String>,
  ): Promise<Array<Story>> {
    let listData: Array<Story> = new Array<Story>();

    try {
      listData = await Promise.all(
        listStoriesId.map(async (story_id: String) => {
          const data: Story | null = await databaseServices.storys.findOne({
            _id: new ObjectId(story_id.toString()),
          });
          return data!;
        }),
      );
    } catch (err) {
      console.log(err);
    }
    return listData;
  }
  async addReadHistoryForUser(readHistory: ReadingHistory) {
    try {
      readHistory.chapter_id = new ObjectId(readHistory.chapter_id);
      readHistory.story_id = new ObjectId(readHistory.story_id);
      const user_id = readHistory.user_id;
      if (user_id != "") {
        readHistory.user_id = new ObjectId(user_id);
      }
      const dataFindDuplicate: ReadingHistory | null =
        await databaseServices.reading_history_user.findOne({
          device_uuid: readHistory.device_uuid,
          user_id: readHistory.user_id,
          chapter_id: readHistory.chapter_id,
        });

      if (dataFindDuplicate === null) {
        readHistory.index =
          (await databaseServices.reading_history_user.countDocuments({
            device_uuid: readHistory.device_uuid,
            story_id: new ObjectId(readHistory.story_id),
          })) + 1;

        if (readHistory.index === 1) {
          // update lượt đọc của bộ truyện đó

          databaseServices.storys.findOneAndUpdate(
            {
              _id: new ObjectId(readHistory.story_id),
            },
            {
              $inc: {
                count_read: 1,
              },
            },
          );
        }
        await databaseServices.reading_history_user.insertOne(readHistory);
      } else {
        return Promise.reject(() => {
          throw "chapter is duplicate";
        });
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(() => {
        throw err;
      });
    }
  }
  async getReadingHistoryForBooks(
    page: number,
    limit: number,
    device_uuid: string,
    user_id: string,
  ): Promise<Array<Story>> {
    try {
      const pipeline = [
        {
          $match: {
            device_uuid: device_uuid,
            user_id: user_id.length > 0 ? new ObjectId(user_id) : "",
          },
        },
        { $sort: { index: -1 } },
        {
          $group: {
            _id: { $toString: "$story_id" },
            maxIndexItem: { $first: "$$ROOT" }, // Chọn tài liệu có index lớn nhất từ mỗi nhóm
          },
        },
        { $replaceRoot: { newRoot: "$maxIndexItem" } },
        { $skip: page * limit },
        { $limit: limit },
      ];

      const dataReadingHistories = await databaseServices.reading_history_user
        .aggregate(pipeline)
        .toArray();

      const sortArray = dataReadingHistories.sort((a, b) => b.index - a.index);

      return await this.getListStoriesById(sortArray.map((e) => e.story_id));
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  async getCurrentChapterInStory(
    story_id: string,
    user_id: string,
    device_uuid: string,
  ): Promise<Chapter | null> {
    try {
      const queryHistory = {
        story_id: new ObjectId(story_id),
        device_uuid: device_uuid,
        user_id: user_id.length > 0 ? new ObjectId(user_id) : "",
      };
      const history: ReadingHistory[] =
        await databaseServices.reading_history_user
          .find(queryHistory)
          .sort({ index: -1 })
          .limit(1)
          .toArray();
      if (history.length === 0) {
        return null;
      }
      return await databaseServices.chapters.findOne({
        _id: new ObjectId(history[0].chapter_id),
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async getCheckUserNeedSynchronized(
    user_id: string,
    device_uuid: string,
  ): Promise<boolean> {
    try {
      // thường là user đọc được một thời gian rồi, sau đó mới là tạo tài khoản
      const [isFoundAccountStoryReading, isFoundHistoryByOnlyDeviceUuid] =
        await Promise.all([
          databaseServices.reading_history_user.findOne({
            user_id: new ObjectId(user_id),
          }),
          databaseServices.reading_history_user.findOne({
            device_uuid: device_uuid,
            user_id: "",
          }),
        ]);
      // trường hợp tài khoản này đã có thông tin lịch sử đọc trước đó
      if (isFoundAccountStoryReading !== null) {
        if (isFoundHistoryByOnlyDeviceUuid) {
          // xoá tất cả lịch sử của device
          databaseServices.reading_history_user.deleteMany({
            device_uuid: device_uuid,
            user_id: "",
          });
        }
        return false;
      } else if (isFoundHistoryByOnlyDeviceUuid == null) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  async makeSynchronizedForUser(
    device_uuid: string,
    user_id: string,
    is_synchronized: boolean,
  ) {
    try {
      if (is_synchronized) {
        await databaseServices.reading_history_user.updateMany(
          { device_uuid: device_uuid, user_id: "" },
          { $set: { user_id: new ObjectId(user_id) } },
        );
      } else {
        await databaseServices.reading_history_user.deleteMany({
          device_uuid: device_uuid,
          user_id: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async getFollowedStories(
    user_id: string,
    page: number,
    limit: number,
  ): Promise<Array<StoryWithIdChapterUpdate>> {
    try {
      const data_id_love = await databaseServices.user_followed_stories
        .find({ user_id: new ObjectId(user_id) })
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(page * limit)
        .project({ story_id: 1, id_new_chapter: 1 })
        .toArray();

      const listStories: Array<Story> = await this.getListStoriesById(
        data_id_love.map(({ story_id }) => story_id),
      );
      return listStories.map((dataStory, index) => {
        return new StoryWithIdChapterUpdate({
          story: dataStory,
          id_new_chapter: data_id_love[index].id_new_chapter,
        });
      });
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  async updateFollowStory(
    user_idProps: string,
    story_idProps: string,
    status_followed: boolean,
  ) {
    const user_id: ObjectId = new ObjectId(user_idProps);
    const story_id: ObjectId = new ObjectId(story_idProps);

    try {
      if (status_followed === false) {
        await databaseServices.user_followed_stories.deleteOne({
          story_id: story_id,
          user_id: user_id,
        });
      } else {
        const isFoundFollowedBeforeInStory: UserFollowedStory | null =
          await databaseServices.user_followed_stories.findOne({
            story_id: story_id,
            user_id: user_id,
          });
        if (isFoundFollowedBeforeInStory === null) {
          const newFollowedStory: UserFollowedStory = new UserFollowedStory({
            user_id: user_id,
            story_id: story_id,
          });
          await Promise.all([
            databaseServices.user_followed_stories.insertOne(newFollowedStory),
            databaseServices.storys.findOneAndUpdate(
              { _id: story_id },
              {
                $inc: { count_followers_story: 1 },
              },
            ),
          ]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  async getFollowedStoryInfo(
    user_id: string,
    story_id: string,
  ): Promise<UserFollowedStory | null> {
    try {
      return await databaseServices.user_followed_stories.findOne({
        user_id: new ObjectId(user_id),
        story_id: new ObjectId(story_id),
      });
    } catch (err) {
      return null;
    }
  }
}

export default new storyServices();
