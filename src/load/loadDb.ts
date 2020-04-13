import mongoose from "mongoose";
import UserModel, { IUser } from "../database/models/user";
import GroupModel, { IGroup } from "../database/models/group";
import MessageModel, { IMessage } from "../database/models/message";
import { getConnection, getUserId } from "../database/index";

const LoadUsers = async (
  userlists: string[],
  dbConn: mongoose.Connection
): Promise<IUser[]> => {
  const user = UserModel(dbConn);

  let res = userlists.map((e) => {
    let newUser: IUser = new user({
      name: e,
      password: e,
    });
    return newUser.save();
  });

  return Promise.all(res);
};

const LoadGroups = async (
  userlists: IUser[],
  creator: string,
  dbConn: mongoose.Connection
): Promise<IGroup[]> => {
  const group = GroupModel(dbConn);
  let res = userlists
    .filter((e) => e.name !== "kevin")
    .map((e) => {
      let newGroup: IGroup = new group({
        name: `${creator}-${e.name}`,
        participant: [creator, e.id],
      });
      return newGroup.save();
    });

  return Promise.all(res);
};

const LoadMessages = async (
  dataset: { sender: IUser; group: IGroup; content: string }[],
  dbConn: mongoose.Connection
): Promise<IMessage[]> => {
  const message = MessageModel(dbConn);

  let res = dataset.map((e) => {
    let newMessage: IMessage = new message({
      sender: e.sender.id,
      group: e.group.id,
      content: e.content,
    });
    return newMessage.save();
  });

  return Promise.all(res);
};

const LoadAll = async (userlists: string[]) => {
  const dbConn: mongoose.Connection = await getConnection();

  var users = await LoadUsers(userlists, dbConn);
  var creator = await getUserId(dbConn, "kevin");
  var groups = await LoadGroups(users, creator, dbConn);

  var messageset = [
    {
      sender: users[0],
      group: groups[0],
      content:
        "This is the first message of Kevin in the first group with Mike",
    },
    {
      sender: users[0],
      group: groups[1],
      content:
        "This is the first message of Kevin in the second group with Jack",
    },
    {
      sender: users[1],
      group: groups[0],
      content:
        "This is the first message of Mike in the first group with Kevin",
    },
    {
      sender: users[2],
      group: groups[1],
      content:
        "This is the first message of Jack in the second group with Kevin",
    },
    {
      sender: users[0],
      group: groups[0],
      content:
        "This is the second message of Kevin in the first group with Mike",
    },
    {
      sender: users[0],
      group: groups[1],
      content:
        "This is the second message of Kevin in the second group with Jack",
    },
    {
      sender: users[1],
      group: groups[0],
      content:
        "This is the second message of Mike in the first group with Kevin",
    },
    {
      sender: users[2],
      group: groups[1],
      content:
        "This is the second message of Jack in the second group with Kevin",
    },
  ];

  var messages = await LoadMessages(messageset, dbConn);
  console.log(messages);
  dbConn.close();
};

LoadAll(["kevin", "mike", "jack"]).catch((err) => console.log(err));
