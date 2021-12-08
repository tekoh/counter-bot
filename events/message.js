const { Message, MessageEmbed, Collection, Permissions } = require("discord.js")
const { mentions } = require("../nypsi")
const { getChatFilter, getPrefix, inCooldown, addCooldown, hasGuild } = require("../utils/guilds/utils")
const { runCommand } = require("../utils/commandhandler")
const { info } = require("../utils/logger")

/**
 * @type {Array<{ type: String, members: Collection, message: Message, guild: String }>}
 */
const mentionQueue = []
let mentionInterval

/**
 * @param {Message} message
 */
module.exports = async (message) => {
    if (message.author.bot) return

    if (!message.guild) {
        info("message in DM from " + message.author.tag + ": " + message.content)

        const embed = new MessageEmbed()
            .setTitle("invite nypsi to your server now.")
            .setColor("#36393f")
            .setDescription("http://invite.nypsi.xyz")
        return await message.channel.send({ embeds: [embed] })
    }

    const { prefix } = require("../config.json")

    if (message.content == `<@!${message.client.user.id}>`) {
        return message.channel.send({ content: `my prefix for this server is \`${prefix}\`` })
    }

    if (!message.content.startsWith(prefix)) return

    const args = message.content.substring(prefix.length).split(" ")

    const cmd = args[0].toLowerCase()

    return runCommand(cmd, message, args)
}