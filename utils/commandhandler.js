const { table, getBorderCharacters } = require("table")
const fs = require("fs")
const { MessageActionRow, MessageButton } = require("discord.js")
const { CustomEmbed, ErrorEmbed } = require("./classes/EmbedBuilders.js")
const { info, types, error } = require("./logger.js")

const commands = new Map()
const aliases = new Map()
const cooldown = new Set()

function loadCommands() {
    const commandFiles = fs.readdirSync("./commands/").filter((file) => file.endsWith(".js"))
    const failedTable = []

    if (commands.size > 0) {
        for (let command of commands.keys()) {
            delete require.cache[require.resolve(`../commands/${command}.js`)]
        }
        commands.clear()
        aliases.clear()
    }

    for (let file of commandFiles) {
        let command

        try {
            command = require(`../commands/${file}`)

            let enabled = true

            if (!command.name || !command.description || !command.run || !command.category) {
                enabled = false
            }

            if (enabled) {
                commands.set(command.name, command)
                if (command.aliases) {
                    for (let a of command.aliases) {
                        if (aliases.has(a)) {
                            error(
                                `duplicate alias: ${a} [original: ${aliases.get(a)} copy: ${command.name}] - not overwriting`
                            )
                        } else {
                            aliases.set(a, command.name)
                        }
                    }
                }
            } else {
                failedTable.push([file, "❌"])
                error(file + " missing name, description, category or run")
            }
        } catch (e) {
            failedTable.push([file, "❌"])
            console.log(e)
        }
    }
    exports.aliasesSize = aliases.size
    exports.commandsSize = commands.size

    if (failedTable.length != 0) {
        console.log(table(failedTable, { border: getBorderCharacters("ramac") }))
    }

    info(`${commands.size.toLocaleString()} commands loaded`)
    info(`${aliases.size.toLocaleString()} aliases loaded`)
}

/**
 *
 * @param {Array} commandsArray
 */
function reloadCommand(commandsArray) {
    const reloadTable = []

    for (let cmd of commandsArray) {
        try {
            commands.delete(cmd)
            try {
                delete require.cache[require.resolve(`../commands/${cmd}`)]
            } catch (e) {
                return error("error deleting from cache")
            }

            const commandData = require(`../commands/${cmd}`)

            let enabled = true

            if (!commandData.name || !commandData.description || !commandData.run || !commandData.category) {
                enabled = false
            }

            if (enabled) {
                commands.set(commandData.name, commandData)
                if (commandData.aliases) {
                    for (let a of commandData.aliases) {
                        if (aliases.has(a) && aliases.get(a) != commandData.name) {
                            error(
                                `duplicate alias: ${a} [original: ${aliases.get(a)} copy: ${
                                    commandData.name
                                }] - not overwriting`
                            )
                        } else {
                            aliases.set(a, commandData.name)
                        }
                    }
                }
                reloadTable.push([commandData.name, "✅"])
                exports.commandsSize = commands.size
            } else {
                reloadTable.push([cmd, "❌"])
                exports.commandsSize = commands.size
            }
        } catch (e) {
            reloadTable.push([cmd, "❌"])
            console.log(e)
        }
    }
    exports.aliasesSize = aliases.size
    exports.commandsSize = commands.size
    console.log(table(reloadTable, { border: getBorderCharacters("ramac") }))
    return table(reloadTable, { border: getBorderCharacters("ramac") })
}

/**
 *
 * @param {Message} message
 * @param {Array<String>} args
 */
async function helpCmd(message, args) {
    logCommand(message, args)

    const helpCategories = new Map()

    const { prefix } = require("../config.json")

    for (let cmd of commands.keys()) {
        const category = getCmdCategory(cmd)

        if (category == "none") continue

        if (helpCategories.has(category)) {
            const current = helpCategories.get(category)
            const lastPage = current.get(current.size)

            if (lastPage.length == 10) {
                const newPage = []

                newPage.push(`${prefix}**${getCmdName(cmd)}** *${getCmdDesc(cmd)}*`)
                current.set(current.size + 1, newPage)
            } else {
                const page = current.get(current.size)
                page.push(`${prefix}**${getCmdName(cmd)}** *${getCmdDesc(cmd)}*`)
                current.set(current.size, page)
            }

            helpCategories.set(category, current)
        } else {
            const pages = new Map()

            pages.set(1, [`${prefix}**${getCmdName(cmd)}** *${getCmdDesc(cmd)}*`])

            helpCategories.set(category, pages)
        }
    }

    const embed = new CustomEmbed(message.member).setFooter(prefix + "help <command> | get info about a command")

    /**
     * FINDING WHAT THE USER REQUESTED
     */

    let pageSystemNeeded = false

    if (args.length == 0) {
        const categories = Array.from(helpCategories.keys()).sort()

        let categoriesMsg = ""

        for (const category of categories) {
            categoriesMsg += `» ${prefix}help **${category}**\n`
        }

        embed.setTitle("help menu")
        embed.setDescription(
            "invite nypsi to your server: [invite.nypsi.xyz](http://invite.nypsi.xyz)\n\n" +
                "if you need support, want to report a bug or suggest a feature, you can join the nypsi server: https://discord.gg/hJTDNST\n\n" +
                `my prefix for this server is \`${prefix}\``
        )
        embed.addField("command categories", categoriesMsg, true)
        embed.setThumbnail(message.client.user.displayAvatarURL({ format: "png", dynamic: true, size: 128 }))
    } else {
        if (args[0].toLowerCase() == "mod") args[0] = "moderation"
        if (args[0].toLowerCase() == "util") args[0] = "utility"
        if (args[0].toLowerCase() == "pictures") args[0] = "animals"
        if (args[0].toLowerCase() == "eco") args[0] = "money"
        if (args[0].toLowerCase() == "economy") args[0] = "money"
        if (args[0].toLowerCase() == "gamble") args[0] = "money"
        if (args[0].toLowerCase() == "gambling") args[0] = "money"

        if (helpCategories.has(args[0].toLowerCase())) {
            const pages = helpCategories.get(args[0].toLowerCase())

            if (pages.size > 1) {
                pageSystemNeeded = true
            }

            embed.setTitle(`${args[0].toLowerCase()} commands`)
            embed.setDescription(pages.get(1).join("\n"))
            embed.setFooter(`page 1/${pages.size} | ${prefix}help <command>`)
        } else if (commands.has(args[0].toLowerCase()) || aliases.has(args[0].toLowerCase())) {
            let cmd

            if (aliases.has(args[0].toLowerCase())) {
                cmd = commands.get(aliases.get(args[0].toLowerCase()))
            } else {
                cmd = commands.get(args[0].toLowerCase())
            }

            let desc =
                "**name** " + cmd.name + "\n" + "**description** " + cmd.description + "\n" + "**category** " + cmd.category

            if (cmd.permissions) {
                desc = desc + "\n**permission(s) required** `" + cmd.permissions.join("`, `") + "`"
            }

            if (cmd.aliases) {
                desc = desc + "\n**aliases** `" + prefix + cmd.aliases.join("`, `" + prefix) + "`"
            }

            embed.setTitle(`${cmd.name} command`)
            embed.setDescription(desc)
        } else {
            return message.channel.send({ embeds: [new ErrorEmbed("unknown command")] })
        }
    }

    /**
     * @type {Message}
     */
    let msg

    let row = new MessageActionRow().addComponents(
        new MessageButton().setCustomId("⬅").setLabel("back").setStyle("PRIMARY").setDisabled(true),
        new MessageButton().setCustomId("➡").setLabel("next").setStyle("PRIMARY")
    )

    if (pageSystemNeeded) {
        msg = await message.channel.send({ embeds: [embed], components: [row] })
    } else {
        return await message.channel.send({ embeds: [embed] })
    }

    const pages = helpCategories.get(args[0].toLowerCase())

    let currentPage = 1
    const lastPage = pages.size

    const filter = (i) => i.user.id == message.author.id

    const pageManager = async () => {
        const reaction = await msg
            .awaitMessageComponent({ filter, time: 30000, errors: ["time"] })
            .then(async (collected) => {
                await collected.deferUpdate()
                return collected.customId
            })
            .catch(async () => {
                await msg.edit({ components: [] })
            })

        if (!reaction) return

        if (reaction == "⬅") {
            if (currentPage <= 1) {
                return pageManager()
            } else {
                currentPage--
                embed.setDescription(pages.get(currentPage).join("\n"))
                embed.setFooter(`page ${currentPage}/${lastPage} | ${prefix}help <command>`)
                if (currentPage == 1) {
                    row = new MessageActionRow().addComponents(
                        new MessageButton().setCustomId("⬅").setLabel("back").setStyle("PRIMARY").setDisabled(true),
                        new MessageButton().setCustomId("➡").setLabel("next").setStyle("PRIMARY").setDisabled(false)
                    )
                } else {
                    row = new MessageActionRow().addComponents(
                        new MessageButton().setCustomId("⬅").setLabel("back").setStyle("PRIMARY").setDisabled(false),
                        new MessageButton().setCustomId("➡").setLabel("next").setStyle("PRIMARY").setDisabled(false)
                    )
                }
                await msg.edit({ embeds: [embed], components: [row] })
                return pageManager()
            }
        } else if (reaction == "➡") {
            if (currentPage >= lastPage) {
                return pageManager()
            } else {
                currentPage++
                embed.setDescription(pages.get(currentPage).join("\n"))
                embed.setFooter(`page ${currentPage}/${lastPage} | ${prefix}help <command>`)
                if (currentPage == lastPage) {
                    row = new MessageActionRow().addComponents(
                        new MessageButton().setCustomId("⬅").setLabel("back").setStyle("PRIMARY").setDisabled(false),
                        new MessageButton().setCustomId("➡").setLabel("next").setStyle("PRIMARY").setDisabled(true)
                    )
                } else {
                    row = new MessageActionRow().addComponents(
                        new MessageButton().setCustomId("⬅").setLabel("back").setStyle("PRIMARY").setDisabled(false),
                        new MessageButton().setCustomId("➡").setLabel("next").setStyle("PRIMARY").setDisabled(false)
                    )
                }
                await msg.edit({ embeds: [embed], components: [row] })
                return pageManager()
            }
        }
    }

    return pageManager()
}

/**
 *
 * @param {String} cmd
 * @param {Message} message
 * @param {Array<String>} args
 */
async function runCommand(cmd, message, args) {
    if (!message.channel.permissionsFor(message.client.user).has("SEND_MESSAGES")) {
        return message.member
            .send(
                "❌ i don't have permission to send messages in that channel - please contact server staff if this is an error"
            )
            .catch(() => {})
    }

    if (!message.channel.permissionsFor(message.client.user).has("EMBED_LINKS")) {
        return message.channel.send({
            content:
                "❌ i don't have the `embed links` permission\n\nto fix this go to: server settings -> roles -> find my role and enable `embed links`\n" +
                "if this error still shows, check channel specific permissions",
        })
    }

    if (!message.channel.permissionsFor(message.client.user).has("MANAGE_MESSAGES")) {
        return message.channel.send(
            "❌ i don't have the `manage messages` permission, this is a required permission for nypsi to work\n\n" +
                "to fix this go to: server settings -> roles -> find my role and enable `manage messages`\n" +
                "if this error still shows, check channel specific permissions"
        )
    }

    if (!message.channel.permissionsFor(message.client.user).has("ADD_REACTIONS")) {
        return message.channel.send({
            content:
                "❌ i don't have the `add reactions` permission, this is a required permission for nypsi to work\n\n" +
                "to fix this go to: server settings -> roles -> find my role and enable `add reactions`\n" +
                "if this error still shows, check channel specific permissions",
        })
    }

    if (cmd == "help") {
        return helpCmd(message, args)
    }

    let alias = false
    if (!commandExists(cmd)) {
        if (aliases.has(cmd)) {
            alias = true
        } else {
            return
        }
    }

    if (cooldown.has(message.author.id)) return

    cooldown.add(message.author.id)

    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, 500)

    logCommand(message, args)
    if (alias) {
        commands.get(aliases.get(cmd)).run(message, args)
    } else {
        commands.get(cmd).run(message, args)
    }
}

/**
 *
 * @param {String} cmd
 */
function commandExists(cmd) {
    if (commands.has(cmd)) {
        return true
    } else {
        return false
    }
}

exports.helpCmd = helpCmd
exports.loadCommands = loadCommands
exports.reloadCommand = reloadCommand
exports.runCommand = runCommand
exports.commandExists = commandExists

function getCmdName(cmd) {
    return commands.get(cmd).name
}

function getCmdDesc(cmd) {
    return commands.get(cmd).description
}

function getCmdCategory(cmd) {
    return commands.get(cmd).category
}

/**
 *
 * @param {Message} message
 * @param {Array<String>} args
 * @param {String} commandName
 */
function logCommand(message, args) {
    args.shift()

    let content = message.content

    if (content.length > 100) {
        content = content.substr(0, 75) + "..."
    }

    const msg = `${message.guild.id} - ${message.author.tag}: ${content}`

    info(msg, types.COMMAND)
}
