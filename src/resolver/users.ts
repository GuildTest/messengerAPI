import mongoose from "mongoose";
import GroupModel, { IGroup } from "../database/models/group";
import MessageModel, { IMessage } from "../database/models/message";

export const User = {
  MessageConnection: async (
    { _id }: { _id: string },
    { first, since }: { first: number | undefined; since: string | undefined },
    { dbConn }: { dbConn: mongoose.Connection }
  ) => {
    let pageInfo = {
      hasNextPage: false,
      hasPreviousPage: false,
    };

    const Message: mongoose.Model<IMessage> = MessageModel(dbConn);

    let nodes: IMessage[];

    var condition: any = { group: _id };

    try {
      nodes = await Message.find(condition)
        .limit(first || 10000)
        .exec();
    } catch (error) {
      console.error("> recentMessage error: ", error);

      throw new Error("Error retrieving recent Messages");
    }

    return { pageInfo, nodes };
  },
  GroupConnection: async (
    { _id }: { _id: string },
    { first, since }: { first: number | undefined; since: string | undefined },
    { dbConn }: { dbConn: mongoose.Connection }
  ) => {
    let pageInfo = {
      hasNextPage: false,
      hasPreviousPage: false,
    };

    const Group: mongoose.Model<IGroup> = GroupModel(dbConn);

    let nodes: IGroup[];

    var condition: any = { participant: _id };

    try {
      nodes = await Group.find(condition)
        .limit(first || 10000)
        .exec();
    } catch (error) {
      console.error("> recentMessage error: ", error);

      throw new Error("Error retrieving recent Groups");
    }

    return { pageInfo, nodes };
  },
};
