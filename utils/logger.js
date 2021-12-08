function info(string, type) {
    let color

    if (!type) type = types.INFO

    switch (type) {
        case types.INFO:
            color = "\x1b[37m"
            break
        case types.GUILD:
            color = "\x1b[36m"
            break
        case types.ECONOMY:
            color = "\x1b[32m"
            break
        case types.DATA:
            color = "\x1b[32m"
            break
        case types.AUTOMATION:
            color = "\x1b[34m"
            break
        case types.COMMAND:
            color = "\x1b[33m"
            break
        case types.IMAGE:
            color = "\x1b[32m"
            break
    }

    const day = new Date().getDate()
    const month = new Date().getMonth() + 1

    const out = `${color}${day}/${month} ${getTimestamp()} [${type}] ${string} \x1b[0m`
    console.log(out)
}

exports.info = info

function error(string) {
    const day = new Date().getDate()
    const month = new Date().getMonth() + 1

    console.error(`\x1B[31m${day}/${month} ${getTimestamp()} [error] ${string}\x1B[0m`)
}

exports.error = error

const types = {
    INFO: "info",
    DATA: "data",
    GUILD: "guild",
    ECONOMY: "eco",
    AUTOMATION: "auto",
    COMMAND: "command",
    IMAGE: "image",
}

exports.types = types