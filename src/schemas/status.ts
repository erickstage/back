import { Document, Schema, Model, model} from "mongoose";
import { IUser } from "../entities/user";
import { IProject, IProjectStatus } from "../entities/project";

export interface IProjectStatusModel extends IProjectStatus, Document {
}

export var ProjectStatusSchema: Schema = new Schema({
  createdAt: Date,
  status: Number,
  commentaire: String,
  date: String,
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
});
ProjectStatusSchema.pre("save", function(next) {
  let now = new Date();
  // @ts-ignore
  if (!this.createdAt) {
    // @ts-ignore
    this.createdAt = now;
  }
  next();
});


export const ProjectStatus: Model<IProjectStatusModel> = model<IProjectStatusModel>("ProjectStatus", ProjectStatusSchema);
