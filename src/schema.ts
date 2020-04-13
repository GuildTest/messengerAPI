import fs from "fs";

require.extensions[".graphql"] = (module, filename) => {
  module.exports = fs.readFileSync(filename, "utf8");
};

export const schema = require(`./schema/messaging.graphql`);
