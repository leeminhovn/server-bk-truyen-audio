import { ObjectId } from "mongodb";
import { BaseSchema } from "../Base.schemas";

interface AcceptStoryType {
  _id?: ObjectId;
  isAccept: boolean;
  author_id: ObjectId;
  story_id: ObjectId;
  created_at?: Date;
  updated_at?: Date;
}
class AcceptStory extends BaseSchema {
    _id?: ObjectId;
    author_id: ObjectId;
    story_id: ObjectId;
    isAccept: boolean;
    
    constructor (data:AcceptStoryType) {
        super(data.created_at, data.updated_at);
        this.author_id = data.author_id;
        this.story_id = data.story_id;
        this.isAccept = data.isAccept;
    }
}
