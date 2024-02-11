import { ObjectId } from "mongodb";
import { UserVerifyStatus } from "~/constants/enum";

export const UserLevelIndex: Array<String> = [
  "Luyện khí",
  "Trúc cơ",
  "Kim đan",
  "Nguyên anh",
  "Hóa thần",
  "Độ kiếp",
  "Luyện hư",
  "Hợp thể",
  "Đại thừa",
  "Phi thăng",
  "Ngụy tiên",
  "Tán tiên",
  "Huyền tiên",
  "Địa tiên",
  "Chân tiên",
  "Kim tiên",
  "Thái ất kim tiên",
  "Đại la kim tiên",
  "Chuẩn thánh",
  "Thánh nhân",
  "Bán bộ đại thánh",
  "Đại thánh",
  "Chuẩn đế",
  "Đại đế",
];

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
  spirit_stone: Number;
  accessToken: string;
  refreshToken: string;
  level: String;
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

  constructor(user: UserType) {
    const dateNow = new Date();
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.date_of_birth = user.date_of_birth || dateNow;
    this.password = user.password;
    this.created_at = user.created_at || dateNow;
    this.updated_at = user.updated_at || dateNow;
    this.verify = user.verify || UserVerifyStatus.UnVerified;
    this.accessToken = user.accessToken;
    this.email_verify_token = user.email_verify_token || "";
    this.spirit_stone = user.spirit_stone || 0;
    this.refreshToken = user.refreshToken;
    this.level = user.level || UserLevelIndex[0];
  }
}
export default User;
