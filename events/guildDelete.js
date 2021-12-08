const { Guild, Client } = require("discord.js")
const { info, types } = require("../utils/logger")

/**
 * @param {Client} client
 * @param {Guild} guild
 */
module.exports = async (client, guild) => {
    if (!guild.name) {
        return
    }
    info(`removed from ${guild.name} (${guild.id}) new count: ${client.guilds.cache.size}`, types.GUILD)
}
