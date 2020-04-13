// src/database/models/note.ts
import mongoose from "mongoose";

export interface IGroup extends mongoose.Document {
  name: String;
  participant: [String];
  createdAt: Date;
}

const schema: mongoose.SchemaDefinition = {
  name: { type: mongoose.SchemaTypes.String, required: true },
  participant: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: Date.now,
  },
};

const collectionName: string = "group";
const groupSchema: mongoose.Schema = new mongoose.Schema(schema);

const Group = (conn: mongoose.Connection): mongoose.Model<IGroup> =>
  conn.model(collectionName, groupSchema);

export default Group;
