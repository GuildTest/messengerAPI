import { GraphQLResolveInfo } from "graphql/type/definition";
import mongoose from "mongoose";
import MessageModel, { IMessage } from "../database/models/message";
import UserModel, { IUser } from "../database/models/user";
import GroupModel, { IGroup } from "../database/models/group";
import { FetchConnection } from "../toolbox/fetchConnection";

export const Query = {
  getAllUsers: async (
    obj: undefined,
    options: undefined,
    { dbConn }: { dbConn: mongoose.Connection },
    info: GraphQLResolveInfo
  ): Promise<IUser[]> => {
    const User: mongoose.Model<IUser> = UserModel(dbConn);

    let list: IUser[];

    try {
      list = await User.find().exec();
    } catch (error) {
      console.error("> getAllNotes error: ", error);

      throw new Error("Error retrieving all users");
    }

    return list;
  },
  recentMessage: async (
    obj: undefined,
    { first, since }: { first: number | undefined; since: string | undefined },
    { userId, dbConn }: { userId: string; dbConn: mongoose.Connection },
    info: GraphQLResolveInfo
  ) => {
    const res = new FetchConnection<IMessage>(
      { id: userId, first, since },
      MessageModel,
      dbConn
    );
    return res.getData("sender");
  },
  recentGroup: async (
    obj: undefined,
    { first, since }: { first: number | undefined; since: string | undefined },
    { userId, dbConn }: { userId: string; dbConn: mongoose.Connection },
    info: GraphQLResolveInfo
  ) => {
    const res = new FetchConnection<IGroup>(
      { id: userId, first, since },
      GroupModel,
      dbConn
    );
    return res.getData("participant");
  },
};
