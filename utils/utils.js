const { GuildMember, Message } = require("discord.js")
const { getDatabase } = require("./database/database")
const db = getDatabase()


/**
 * @returns {String}
 * @param {GuildMember} member member to get color of
 */
function getColor(member) {
    if (member.displayHexColor == "#ffffff") {
        return "#111111"
    } else {
        return member.displayHexColor
    }
}

exports.getColor = getColor


/**
 * @returns {GuildMember} member object
 * @param {Message} message
 * @param {String} memberName name of member
 */
async function getMember(message, memberName) {
    if (!message.guild) return null

    let members

    if (message.guild.memberCount == message.guild.members.cache.size && message.guild.memberCount <= 25) {
        members = message.guild.members.cache
    } else {
        members = await message.guild.members.fetch()
    }

    let target
    let possible = new Map()

    for (let member of members.keys()) {
        member = members.get(member)

        if (member.user.id == memberName) {
            target = member
            break
        } else if (member.user.tag.toLowerCase() == memberName.toLowerCase()) {
            target = member
            break
        } else if (member.user.username.toLowerCase() == memberName.toLowerCase()) {
            if (member.user.bot) {
                possible.set(3, member)
            } else {
                possible.set(0, member)
            }
        } else if (member.displayName.toLowerCase() == memberName.toLowerCase()) {
            if (member.user.bot) {
                possible.set(4, member)
            } else {
                possible.set(1, member)
            }
        } else if (member.user.tag.toLowerCase().includes(memberName.toLowerCase())) {
            if (member.user.bot) {
                possible.set(5, member)
            } else {
                possible.set(2, member)
            }
        } else if (member.displayName.toLowerCase().includes(memberName.toLowerCase())) {
            if (member.user.bot) {
                possible.set(6, member)
            } else {
                possible.set(3, member)
            }
        }
    }

    if (!target) {
        if (possible.get(0)) {
            target = possible.get(0)
        } else if (possible.get(1)) {
            target = possible.get(1)
        } else if (possible.get(2)) {
            target = possible.get(2)
        } else if (possible.get(3)) {
            target = possible.get(3)
        } else if (possible.get(4)) {
            target = possible.get(4)
        } else if (possible.get(5)) {
            target = possible.get(5)
        } else if (possible.get(6)) {
            target = possible.get(6)
        } else {
            target = null
        }
    }

    return target
}

exports.getMember = getMember

/**
 *
 * @param {Message} message
 * @param {String} memberName
 */
async function getExactMember(message, memberName) {
    if (!message.guild) return null

    let members

    if (message.guild.memberCount == message.guild.members.cache.size && message.guild.memberCount <= 25) {
        members = message.guild.members.cache
    } else {
        members = await message.guild.members.fetch()
    }

    let target = members.find((member) => {
        if (member.user.username.toLowerCase() == memberName.toLowerCase()) {
            return member
        } else if (member.user.tag.toLowerCase() == memberName.toLowerCase()) {
            return member
        } else if (member.user.id == memberName) {
            return member
        }
    })

    return target
}

exports.getExactMember = getExactMember