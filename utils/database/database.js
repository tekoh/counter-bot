const Database = require("better-sqlite3")
const db = new Database("./utils/database/storage.db")

function createTables() {
    db.prepare(
        "CREATE TABLE IF NOT EXISTS quotes ('quote' TEXT PRIMARY KEY NOT NULL, 'mentions' INTEGER DEFAULT 0 NOT NULL)"
    ).run()

    db.prepare(
        "CREATE TABLE IF NOT EXISTS history ('user' STRING NOT NULL, 'quote' STRING NOT NULL, 'date' INTEGER NOT NULL, FOREIGN KEY (quote) REFERENCES quotes (id))"
    ).run()
}

createTables()

/**
 *
 * @param {String} string string from database
 * @param {String} seperator optional seperator
 */
function toArray(string, seperator) {
    const d = string.split(seperator || "#@|@#")

    for (const thing of d) {
        if (thing == "") {
            d.splice(d.indexOf(thing), 1)
        }
    }

    return d
}

exports.toArray = toArray

/**
 *
 * @param {Array<String>} array
 * @param {String} seperator
 * @returns
 */
function toStorage(array, seperator) {
    return array.join(seperator || "#@|@#")
}

exports.toStorage = toStorage

/**
 * @returns {Database}
 */
function getDatabase() {
    return db
}

exports.getDatabase = getDatabase
