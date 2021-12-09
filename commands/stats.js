const { Command, categories } = require("../utils/classes/Command")
const { Message } = require("discord.js")
const { ErrorEmbed, CustomEmbed } = require("../utils/classes/EmbedBuilders")
const { getMember, getMemberHistory } = require("../utils/utils")

const cmd = new Command("stats", "view stats for a member", categories.FUN)

/**
 *
 * @param {Message} message
 * @param {Array<String>} args
 */
async function run(message, args) {
    let member

    if (args.length == 0) {
        member = message.member
    } else {
        if (!message.mentions.members.first()) {
            member = await getMember(message, args.join(" "))
        } else {
            member = message.mentions.members.first()
        }
    }

    if (!member) {
        return message.channel.send({ embeds: [new ErrorEmbed("invalid user")] })
    }

    const history = getMemberHistory(member.user.id)

    const embed = new CustomEmbed(message.member, false)

    embed.setTitle(member.user.tag)

    const stats = new Map()

    for (const item of history) {
        if (stats.has(item.quote)) {
            stats.set(item.quote, stats.get(item.quote) + 1)
        } else {
            stats.set(item.quote, 1)
        }
    }

    let msg = ""

    for (const key of stats.keys()) {
        const amount = stats.get(key)
        msg += `**${key}** \`${amount.toLocaleString()} uses\``
    }

    embed.setDescription(msg)

    return message.channel.send({ embeds: [embed] })
}

cmd.setRun(run)

module.exports = cmd
