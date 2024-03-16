import { ObjectId } from "mongodb";

interface GenreTypesType {
  _id?: ObjectId;
  title: String;
}
export class GenreTypes {
  _id?: ObjectId;
  title: String;

  constructor(dataType: GenreTypesType) {
    this._id = dataType._id;
    this.title = dataType.title;
  }
}
