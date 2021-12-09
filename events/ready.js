const { Client } = require("discord.js");
const { info, types } = require("../utils/logger");

/**
 * @param {Client} client
 * @param {Number} startUp
 */
module.exports = async (client, startUp) => {
  setTimeout(async () => {
    client.user.setPresence({
      status: "dnd",
      activities: [
        {
          name: "you",
          type: "WATCHING",
        },
      ],
    });
  }, 5000);

  //const { commandsSize } = require("../utils/commandhandler")

  let memberCount = 0;

  await client.guilds.cache.forEach((g) => {
    memberCount = memberCount + g.memberCount;
  });

  info(
    "server count: " + client.guilds.cache.size.toLocaleString(),
    types.INFO
  );
  info("user count: " + memberCount.toLocaleString(), types.INFO);
  //info("commands count: " + commandsSize, types.INFO)

  info("logged in as " + client.user.tag, types.INFO);

  const now = Date.now();
  const timeTaken = (now - startUp) / 1000;

  info(`time taken: ${timeTaken}s\n`, types.INFO);
};
