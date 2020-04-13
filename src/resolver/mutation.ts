import mongoose from "mongoose";
import GroupModel, { IGroup } from "../database/models/group";
import UserModel, { IUser } from "../database/models/user";
import MessageModel, { IMessage } from "../database/models/message";

export const Mutation = {
  createUser: async (
    root: undefined,
    { object }: { object: { name: string; password: string } },
    { dbConn }: { dbConn: mongoose.Connection }
  ) => {
    const user = UserModel(dbConn);

    let newUser: IUser = new user({
      name: object.name,
      password: object.password,
    });

    let res = await newUser.save();

    return {
      success: !!res,
      user: res,
    };
  },
  createGroup: async (
    root: undefined,
    { object }: { object: { name: string; participant: [string] } },
    { userId, dbConn }: { userId: string; dbConn: mongoose.Connection }
  ) => {
    const group = GroupModel(dbConn);
    var participant = [userId, ...object.participant];

    var newGroup: IGroup = new group({
      name: object.name || participant.join("-"),
      participant,
    });

    let res = await newGroup.save();

    return {
      success: !!res,
      group: res,
    };
  },
  createMessage: async (
    root: undefined,
    { object }: { object: { content: string; group: string } },
    { userId, dbConn }: { userId: string; dbConn: mongoose.Connection }
  ) => {
    const message = MessageModel(dbConn);

    let newMessage: IMessage = new message({
      content: object.content,
      sender: userId,
      group: object.group,
    });
    let res = await newMessage.save();

    return {
      success: !!res,
      message: res,
    };
  },
};
