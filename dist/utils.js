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
    delay: ()=>delay,
    sendTelegram: ()=>sendTelegram,
    formataDataFromEMAP_API: ()=>formataDataFromEMAP_API,
    formataDataFromEMAP_API_WS: ()=>formataDataFromEMAP_API_WS,
    formataData: ()=>formataData
});
const _axios = /*#__PURE__*/ _interopRequireDefault(require("axios"));
const _moment = /*#__PURE__*/ _interopRequireDefault(require("moment"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function delay(tempo) {
    await new Promise((resolve)=>setTimeout(resolve, tempo));
}
async function sendTelegram(text) {
    try {
        const botToken = "bot1221548327:AAHe6kWjxuly7W_uARM6giFIXsIxyk6CXI4";
        const body = {
            chat_id: "-575400278",
            text,
            parse_mode: "html"
        };
        await _axios.default.post(`https://api.telegram.org/${botToken}/sendMessage`, body);
    } catch (error) {
        console.log("erro telegram!", error);
        console.log("texto telegram:", text);
    }
}
function formataData(date) {
    const dateString = new Date(`${date.split(" ")[0].split("/").reverse().join("/")} ${date.split(" ")[1]}`);
    return (0, _moment.default)(dateString).add(-3, "hours").toDate();
}
function formataDataFromEMAP_API(date) {
    return (0, _moment.default)(date, "DD-MM-YYYY HH:mm:ss").add(-3, "hours").toDate();
}
function formataDataFromEMAP_API_WS(date) {
    return (0, _moment.default)(date, "YYYY-MM-DD HH:mm:ss").add(-3, "hours").toDate();
}
