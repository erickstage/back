import { Document, Schema, Model, model} from "mongoose";
import { IUser } from "../entities/user";

export interface IUserModel extends IUser, Document {
  fullName(): string;
}

export var UserSchema: Schema = new Schema({
  createdAt: Date,
  name: String,
  email: String,
});
UserSchema.pre("save", function(next) {
  let now = new Date();
  // @ts-ignore
  if (!this.createdAt) {
    // @ts-ignore
    this.createdAt = now;
  }
  next();
});

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);
