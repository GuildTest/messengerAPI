// src/database/models/note.ts
import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  password: string;
  createdAt: Date;
}

const schema: mongoose.SchemaDefinition = {
  name: { type: mongoose.SchemaTypes.String, required: true },
  password: { type: mongoose.SchemaTypes.String, required: true },
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: Date.now,
  },
};

const collectionName: string = "user";
const userSchema: mongoose.Schema = new mongoose.Schema(schema);

const User = (conn: mongoose.Connection): mongoose.Model<IUser> =>
  conn.model(collectionName, userSchema);

export default User;
