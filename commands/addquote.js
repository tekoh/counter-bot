const { Command, categories } = require("../utils/classes/Command")
const { Message, Permissions } = require("discord.js")
const { ErrorEmbed, CustomEmbed } = require("../utils/classes/EmbedBuilders")
const { quoteExists, addQuote } = require("../utils/utils")

const cmd = new Command("addquote", "add a quote to be counted", categories.FUN)

/**
 *
 * @param {Message} message
 * @param {Array<String>} args
 */
async function run(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return
    if (args.length == 0) {
        return message.channel.send({ embeds: [new ErrorEmbed("whats the quote dumbass")] })
    }

    const quote = args.join(" ").toLowerCase()

    if (quoteExists(quote)) return message.channel.send({ embeds: [new ErrorEmbed("that quote already exists")] })

    addQuote(quote)

    return message.channel.send({ embeds: [new CustomEmbed(message.member).setDescription("quote added xoxo")] })
}

cmd.setRun(run)

module.exports = cmd
