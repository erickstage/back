import { Document, Schema, Model, model} from "mongoose";
import { IUser } from "../entities/user";
import { IProject } from "../entities/project";

export interface IProjectModel extends IProject, Document {
}

export var ProjectSchema: Schema = new Schema({
  createdAt: Date,
  nom: String,
  description: String,
  equipe: String,
  date: String,
  status: [{ type: Schema.Types.ObjectId, ref: 'ProjectStatus' }]
});
ProjectSchema.pre("save", function(next) {
  let now = new Date();
  // @ts-ignore
  if (!this.createdAt) {
    // @ts-ignore
    this.createdAt = now;
  }
  next();
});
ProjectSchema.post("init", function(doc) {
  // @ts-ignore
  doc.idx = doc._id;
})
ProjectSchema.post("save", function(doc) {
  // @ts-ignore
  doc.idx = doc._id;
})

export const Project: Model<IProjectModel> = model<IProjectModel>("Project", ProjectSchema);
