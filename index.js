const startUp = Date.now()

const Discord = require("discord.js")
const { info, error, types } = require("./utils/logger")

const client = new Discord.Client({
    allowedMentions: {
        parse: ["users", "roles"],
    },
    makeCache: Discord.Options.cacheWithLimits({
        MessageManager: 100,
        ThreadManager: {
            sweepInterval: 1800,
        },
    }),
    presence: {
        status: "dnd",
        activity: {
            name: "nypsi.xyz",
        },
    },
    restTimeOffset: 169,
    shards: "auto",
    intents: [
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
})

const { token } = require("./config.json")

const ready = require("./events/ready")
const guildCreate = require("./events/guildCreate")
const guildDelete = require("./events/guildDelete")
const message = require("./events/message")

client.once("ready", ready.bind(null, client, startUp))
client.on("guildCreate", guildCreate.bind(null, client))
client.on("guildDelete", guildDelete.bind(null, client))
client.on("rateLimit", (rate) => {
    const a = rate.route.split("/")
    const reason = a[a.length - 1]
    error("rate limit: " + reason)
})
client.on("messageCreate", message.bind(null))

client.on("shardReady", (shardID) => info(`shard#${shardID} ready`, types.INFO))
client.on("shardDisconnect", (s, shardID) => info(`shard#${shardID} disconnected`))
client.on("shardError", (error1, shardID) => error(`shard#${shardID} error: ${error1}`))
client.on("shardReconnecting", (shardID) => info(`shard#${shardID} connecting`))

process.on("unhandledRejection", (e) => {
    let stack = e.stack.split("\n").join("\n\x1b[31m")

    error(stack)
})

client.login(token)
