import { ObjectId } from "mongodb";

interface AdminType {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  money?: number;
  role: string;
  accessToken: string;
  refreshToken: string;
  isBlock?: boolean;
}

class Admin {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  accessToken: string;
  refreshToken: string;
  role: string;
  money: number;
  isBlock: boolean;

  constructor(user: AdminType) {
    const dateNow = new Date();
    this._id = user._id;
    this.name = user.name || "";
    this.email = user.email;
    this.password = user.password;
    this.created_at = user.created_at || dateNow;
    this.updated_at = user.updated_at || dateNow;
    this.accessToken = user.accessToken;
    this.refreshToken = user.refreshToken;
    this.role = user.role;
    this.money = user.money || 0;
    this.isBlock = user.isBlock || false;
  }
}
export default Admin;
