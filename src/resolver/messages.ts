import mongoose from "mongoose";
import UserModel, { IUser } from "../database/models/user";
import GroupModel, { IGroup } from "../database/models/group";
import { FetchById } from "../toolbox/fetchById";

export const Message = {
  sender: async (
    { sender }: { sender: string },
    options: any,
    { dbConn }: { dbConn: mongoose.Connection }
  ): Promise<IUser> => {
    const res = new FetchById<IUser>(sender, UserModel, dbConn);
    return res.getUnique();
  },
  group: async (
    { group }: { group: string },
    options: any,
    { dbConn }: { dbConn: mongoose.Connection }
  ): Promise<IGroup> => {
    const res = new FetchById<IGroup>(group, GroupModel, dbConn);
    return res.getUnique();
  },
};
