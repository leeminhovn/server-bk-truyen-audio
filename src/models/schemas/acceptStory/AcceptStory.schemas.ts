import { ObjectId } from "mongodb";
import { BaseSchema } from "../Base.schemas";
import { Story } from "../story/Story.schemas";
import { StatusAcceptStory } from "~/constants/enum";

interface AcceptStoryType {
  _id?: ObjectId;
  status?: StatusAcceptStory;
  author_id: ObjectId;
  story: Story;
  created_at?: Date;
  moderator_feedback?: string;
  author_message: string;
  updated_at?: Date;
}
class AcceptStory extends BaseSchema {
  _id?: ObjectId;
  author_id: ObjectId;
  story: Story;
  status: StatusAcceptStory;
  moderator_feedback: string;
  author_message: string;

  constructor(data: AcceptStoryType) {
    super(data.created_at, data.updated_at);
    this.author_id = data.author_id;
    this.story = data.story;
    this.status = data.status || StatusAcceptStory.Pending;
    this.moderator_feedback = data.moderator_feedback || "";
    this.author_message = data.author_message ;
  }
}
export default AcceptStory;
