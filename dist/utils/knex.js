"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    queryBuilder: ()=>queryBuilder,
    insertOrUpdate: ()=>insertOrUpdate,
    insertOrUpdatetoQuery: ()=>insertOrUpdatetoQuery,
    logDB: ()=>logDB
});
const _knex = /*#__PURE__*/ _interopRequireDefault(require("knex"));
require("dotenv/config");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const queryBuilder = (0, _knex.default)({
    client: "mysql",
    connection: process.env.DATABASE_URL,
    pool: {
        min: 0,
        max: 4,
        idleTimeoutMillis: 60 * 1000
    }
});
async function insertOrUpdate(knex, tableName, data) {
    const firstData = data[0] ? data[0] : data;
    return await knex.raw(knex(tableName).insert(data).toQuery() + " ON DUPLICATE KEY UPDATE " + Object.getOwnPropertyNames(firstData).map((field)=>`${field}=VALUES(${field})`).join(", "));
}
async function insertOrUpdatetoQuery(knex, tableName, data) {
    const firstData = data[0] ? data[0] : data;
    return await knex.raw(knex(tableName).insert(data).toQuery() + " ON DUPLICATE KEY UPDATE " + Object.getOwnPropertyNames(firstData).map((field)=>`${field}=VALUES(${field})`).join(", ")).toQuery();
}
async function logDB(dadosLog) {
    return await queryBuilder("profrotas_log").insert(dadosLog);
}
