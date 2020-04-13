import mongoose from "mongoose";

import env from "dotenv";
import UserModel, { IUser } from "./models/user";

env.config();

const uri: string = process.env.DB_PATH || "err";
let conn: mongoose.Connection | null = null;

console.log(uri);

export const getConnection = async (): Promise<mongoose.Connection> => {
  if (conn == null) {
    conn = await mongoose.createConnection(uri, {
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // and MongoDB driver buffering
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  }

  return conn;
};

export const getUserId = async (
  dbConn: mongoose.Connection,
  name: string
): Promise<string> => {
  const User: mongoose.Model<IUser> = UserModel(dbConn);

  let user: IUser;

  try {
    user = (await User.findOne({ name })) || new User();
  } catch (error) {
    console.error("> error: ", error);
    throw new Error("Error retrieving recent User");
  }

  return user.id;
};
