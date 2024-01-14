import { ObjectId } from 'mongodb'

interface RefreshTokenType {
  create_at?: Date
  token: string
  user_id: ObjectId
  _id?: ObjectId
}

export class RefreshTokenSchema {
  user_id: ObjectId
  _id?: ObjectId
  create_at?: Date
  token: string
  constructor(data: RefreshTokenType) {
    ;(this.user_id = data.user_id),
      (this._id = data._id),
      (this.create_at = data.create_at || new Date()),
      (this.token = data.token)
  }
}
