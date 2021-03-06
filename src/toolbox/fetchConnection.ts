import mongoose from "mongoose";

// default class use for all Connection across GraphQL Schema
export class FetchConnection<T extends mongoose.Document> {
  Model: mongoose.Model<T>;
  id: string;
  first: number;
  since: string | null;
  constructor(
    {
      id,
      since,
      first,
    }: { id: string; first: number | undefined; since: string | undefined },
    conn: (dbConn: mongoose.Connection) => mongoose.Model<T, {}>,
    dbConn: mongoose.Connection
  ) {
    this.Model = conn(dbConn);
    this.id = id;
    this.first = first || 10000;
    this.since = since || null;
  }

  async getData(
    idName: string
  ): Promise<{ pageInfo: { hasNextPage: boolean }; nodes: T[] }> {
    let nodes: T[];

    var condition: any = { [idName]: this.id };

    // add filter on date if field
    if (!!this.since) {
      condition = { ...condition, createdAt: { $gte: this.since } };
    }

    try {
      nodes = await this.Model.find(condition)
        .limit(this.first + 1) //Fetch one more to see if there is more data to be loaded (used for hasNextPage)
        .sort({ createdAt: -1 }) // you want the last messages, not the first ones.
        .exec();
    } catch (error) {
      console.error("> error: ", error);

      throw new Error("Error retrieving Documents");
    }

    const hasNextPage: boolean = !(nodes.length <= this.first);

    if (hasNextPage) nodes.pop();

    return { pageInfo: { hasNextPage }, nodes };
  }
}
