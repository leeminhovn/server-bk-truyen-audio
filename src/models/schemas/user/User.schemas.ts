import { ObjectId } from "mongodb";
import { UserVerifyStatus } from "~/constants/enum";
import { UserAreaIndex, UserLevelIndex } from "~/constants/user";

interface UserType {
  _id?: ObjectId;
  name: string;
  email: string;
  date_of_birth?: Date;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  verify?: UserVerifyStatus;
  email_verify_token?: string;
  accessToken: string;
  refreshToken: string;
  spirit_stone?: Number;
  expired_date?: string;
  level?: String;
  area?: String;
  isBlock?: boolean;
}

class User {
  _id?: ObjectId;
  name: string;
  email: string;
  date_of_birth: Date;
  password: string;
  created_at: Date;
  email_verify_token: string;
  updated_at: Date;
  verify: UserVerifyStatus;
  accessToken: string;
  refreshToken: string;
  spirit_stone: Number;
  level: String;
  area: String;
  expired_date?: string;
  isBlock: boolean;

  constructor(user: UserType) {
    const dateNow = new Date();
    this._id = user._id;
    this.name = user.name || "";
    this.email = user.email;
    this.date_of_birth = user.date_of_birth || dateNow;
    this.password = user.password;
    this.created_at = user.created_at || dateNow;
    this.updated_at = user.updated_at || dateNow;
    this.verify = user.verify || UserVerifyStatus.UnVerified;
    this.accessToken = user.accessToken;
    this.email_verify_token = user.email_verify_token || "";
    this.refreshToken = user.refreshToken;
    this.spirit_stone = user.spirit_stone || 0;
    this.level = user.level || UserLevelIndex[0];
    this.isBlock = user.isBlock || false;
    this.expired_date = user.expired_date;
    this.area = user.area || UserAreaIndex[0];
  }
}
export default User;
