import mongoose from "mongoose";

// default class use for direct link across GraphQL Schema
export class FetchById<T extends mongoose.Document> {
  Model: mongoose.Model<T>;
  id: string | string[];
  constructor(
    id: string | string[],
    conn: (dbConn: mongoose.Connection) => mongoose.Model<T, {}>,
    dbConn: mongoose.Connection
  ) {
    this.Model = conn(dbConn);
    this.id = id;
  }

  async getUnique(): Promise<T> {
    let Document: T;

    try {
      Document = (await this.Model.findById(this.id)) || new this.Model();
    } catch (error) {
      console.error("> error: ", error);

      throw new Error("Error retrieving Document");
    }

    return Document;
  }

  async getMultiple(): Promise<T[]> {
    let Documents: T[];

    var condition: any = { _id: this.id };
    try {
      Documents = (await this.Model.find(condition).exec()) || [
        new this.Model(),
      ];
    } catch (error) {
      console.error("> error: ", error);

      throw new Error("Error retrieving Documents");
    }

    return Documents;
  }
}
