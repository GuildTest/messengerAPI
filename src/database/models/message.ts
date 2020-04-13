// src/database/models/note.ts
import mongoose from "mongoose";

export interface IMessage extends mongoose.Document {
  content: string;
  sender: string;
  group: string;
  createdAt: Date;
}

const schema: mongoose.SchemaDefinition = {
  content: { type: mongoose.SchemaTypes.String, required: true },
  sender: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "user" },
  group: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "group" },
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: Date.now,
  },
};

const collectionName: string = "message";
const messageSchema: mongoose.Schema = new mongoose.Schema(schema);

const Message = (conn: mongoose.Connection): mongoose.Model<IMessage> =>
  conn.model(collectionName, messageSchema);

export default Message;
