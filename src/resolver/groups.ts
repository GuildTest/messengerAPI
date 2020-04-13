import mongoose from "mongoose";
import UserModel, { IUser } from "../database/models/user";
import MessageModel, { IMessage } from "../database/models/message";
import { FetchById } from "../toolbox/fetchById";
import { FetchConnection } from "../toolbox/fetchConnection";

export const Group = {
  participant: async (
    { participant }: { participant: [string] },
    options: undefined,
    { dbConn }: { dbConn: mongoose.Connection }
  ): Promise<IUser[]> => {
    const res = new FetchById<IUser>(participant, UserModel, dbConn);
    return res.getMultiple();
  },
  MessageConnection: async (
    { _id }: { _id: string },
    { first, since }: { first: number | undefined; since: string | undefined },
    { dbConn }: { dbConn: mongoose.Connection }
  ) => {
    const res = new FetchConnection<IMessage>(
      { id: _id, first, since },
      MessageModel,
      dbConn
    );
    return res.getData("group");
  },
};
