const { MessageEmbed, GuildMember } = require("discord.js")
const { getColor } = require("../utils")

class CustomEmbed extends MessageEmbed {
    /**
     * @returns {CustomEmbed}
     * @param {GuildMember} member
     * @param {Boolean} footer
     * @param {String} text
     */
    constructor(member, footer, text) {
        super()

        super.setColor(getColor(member))

        if (text) {
            if (text.length > 2000) {
                text = text.substr(0, 2000)
            }

            super.setDescription(text)
        }

        if (footer) {
            super.setFooter("nypsi.xyz")
        }

        return this
    }

    /**
     * @returns {CustomEmbed}
     * @param {String} text
     */
    setDescription(text) {
        if (text.length > 2000) {
            text = text.substr(0, 2000)
        }
        super.setDescription(text)

        return this
    }

    /**
     * @returns {CustomEmbed}
     * @param {String} title
     * @param {String} text
     * @param {Boolean} inline
     */
    addField(title, text, inline) {
        if (text.length > 1000) {
            text = text.substr(0, 1000)
        }

        super.addField(title, text, inline)

        return this
    }

    /**
     * @returns {CustomEmbed}
     * @param {Sting} text
     */
    setTitle(text) {
        super.setTitle(text)

        return this
    }

    /**
     * @returns {CustomEmbed}
     * @param {String} url
     */
    setImage(url) {
        super.setImage(url)

        return this
    }

    /**
     * @returns {CustomEmbed}
     * @param {String} url
     */
    setThumbnail(url) {
        super.setThumbnail(url)

        return this
    }

    /**
     * @returns {CustomEmbed}
     * @param {String} url
     */
    setURL(url) {
        super.setURL(url)

        return this
    }

    /**
     * @returns {CustomEmbed}
     * @param {String} text
     */
    setHeader(text) {
        super.setAuthor(text)

        return this
    }

    /**
     * @returns {CustomEmbed}
     * @param {String} text
     */
    setFooter(text) {
        super.setFooter(text)

        return this
    }

    /**
     * @returns {CustomEmbed}
     * @param {String} color
     */
    setColor(color) {
        super.setColor(color)

        return this
    }

    /**
     * @returns {CustomEmbed}
     * @param {Date} date
     */
    setTimestamp(date) {
        if (date) {
            super.setTimestamp(date)
        } else {
            super.setTimestamp()
        }

        return this
    }
}

exports.CustomEmbed = CustomEmbed

class ErrorEmbed extends MessageEmbed {
    /**
     * @returns {ErrorEmbed}
     * @param {String} text
     */
    constructor(text) {
        super()
        super.setColor("#e31937")
        super.setTitle("`❌`")
        super.setDescription(text)

        return this
    }

    /**
     * @returns {ErrorEmbed}
     * @param {String} text
     */
    setDescription(text) {
        if (text.length > 2000) {
            text = text.substr(0, 2000)
        }
        super.setDescription(text)

        return this
    }

    /**
     * @returns {CustomEmbed}
     * @param {String} title
     * @param {String} text
     * @param {Boolean} inline
     */
    addField(title, text, inline) {
        if (text.length > 1000) {
            text = text.substr(0, 1000)
        }

        super.addField(title, text, inline)

        return this
    }

    /**
     * @returns {ErrorEmbed}
     * @param {Sting} text
     */
    setTitle(text) {
        super.setTitle(text)

        return this
    }

    /**
     * @returns {ErrorEmbed}
     * @param {String} url
     */
    setImage(url) {
        super.setImage(url)

        return this
    }

    /**
     * @returns {ErrorEmbed}
     * @param {String} url
     */
    setThumbnail(url) {
        super.setThumbnail(url)

        return this
    }

    /**
     * @returns {ErrorEmbed}
     * @param {String} url
     */
    setURL(url) {
        super.setURL(url)

        return this
    }

    /**
     * @returns {ErrorEmbed}
     * @param {String} text
     */
    setHeader(text) {
        super.setAuthor(text)

        return this
    }

    /**
     * @returns {ErrorEmbed}
     * @param {String} text
     */
    setFooter(text) {
        super.setFooter(text)

        return this
    }

    /**
     * @returns {ErrorEmbed}
     * @param {String} color
     */
    setColor(color) {
        super.setColor(color)

        return this
    }

    /**
     * @returns {CustomEmbed}
     * @param {Date} date
     */
    setTimestamp(date) {
        if (date) {
            super.setTimestamp(date)
        } else {
            super.setTimestamp()
        }

        return this
    }
}

exports.ErrorEmbed = ErrorEmbed
