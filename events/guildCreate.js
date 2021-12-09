const { Guild, Client } = require("discord.js")
const { info, types } = require("../utils/logger")

/**
 * @param {Client} client
 * @param {Guild} guild
 */
module.exports = async (client, guild) => {
    info(`added to ${guild.name} (${guild.id}) new count: ${client.guilds.cache.size}`, types.GUILD)
}
