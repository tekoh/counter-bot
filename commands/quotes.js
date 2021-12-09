const { Command, categories } = require("../utils/classes/Command")
const { Message } = require("discord.js")
const { ErrorEmbed, CustomEmbed } = require("../utils/classes/EmbedBuilders")
const { getQuotes } = require("../utils/utils")

const cmd = new Command("quotes", "list all quotes and their uses", categories.FUN)

/**
 *
 * @param {Message} message
 * @param {Array<String>} args
 */
async function run(message, args) {
    const quotes = getQuotes()

    if (quotes.length == 0) {
        return message.channel.send({ embeds: [new ErrorEmbed("no quotes available")] })
    }

    let msg = ""

    for (const quote of quotes) {
        msg += `**${quote.quote}** \`${quote.mentions.toLocaleString()} uses\`\n`
    }

    return message.channel.send({ embeds: [new CustomEmbed(msg)] })
}

cmd.setRun(run)

module.exports = cmd
