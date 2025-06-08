const mongoose = require("mongoose")
let dayjs = require("dayjs")
let utc = require("dayjs/plugin/utc")
dayjs.extend(utc)

const refTable = (tableName) => {
    return {
        type: mongoose.Schema.Types.ObjectId,
        ref: tableName,
    }
}

const db = mongoose.connection.useDb(process.env.USE_DB)


module.exports = { db, mongoose, dayjs, refTable }
