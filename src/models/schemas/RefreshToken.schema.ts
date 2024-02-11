import { ObjectId } from "mongodb";

interface RefreshTokenType {
  created_at?: Date;
  token: string;
  user_id: ObjectId;
  _id?: ObjectId;
}

export class RefreshTokenSchema {
  user_id: ObjectId;
  _id?: ObjectId;
  created_at?: Date;
  token: string;
  constructor(data: RefreshTokenType) {
    (this.user_id = data.user_id),
      (this._id = data._id),
      (this.created_at = data.created_at || new Date()),
      (this.token = data.token);
  }
}
