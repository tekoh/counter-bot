const { Command, categories } = require("../utils/classes/Command")
const { Message } = require("discord.js")
const { ErrorEmbed, CustomEmbed } = require("../utils/classes/EmbedBuilders")
const { quoteExists, deleteQuote } = require("../utils/utils")

const cmd = new Command("deletequote", "delete a quote", categories.FUN).setAliases(["delquote"])

/**
 *
 * @param {Message} message
 * @param {Array<String>} args
 */
async function run(message, args) {
    if (args.length == 0) {
        return message.channel.send({ embeds: [new ErrorEmbed("whats the quote dumbass")] })
    }

    const quote = args.join(" ").toLowerCase()

    if (!quoteExists(quote)) return message.channel.send({ embeds: [new ErrorEmbed("that quote doesnt exist")] })

    deleteQuote(quote)

    return message.channel.send({ embeds: [new CustomEmbed("quote deleted xoxo")] })
}

cmd.setRun(run)

module.exports = cmd
