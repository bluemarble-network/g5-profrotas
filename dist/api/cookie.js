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
    getCookie: ()=>getCookie,
    setCookieErrado: ()=>setCookieErrado
});
const _utils = require("./utils/utils");
async function getCookie(api) {
    const usuarioSenha = process.env.USUARIO_TOSP + ":" + process.env.SENHA_TOSP;
    const usuarioSenhaBase64 = Buffer.from(usuarioSenha).toString("base64");
    try {
        const retorno = await api.get("/tosp?portal=ORG", {
            headers: {
                Authorization: `Basic ${usuarioSenhaBase64}`
            }
        });
        const cookie = retorno.headers["set-cookie"];
        if (!cookie) throw new Error("Cookie n\xe3o encontrado");
        const cookieRetorno = cookie[0].split(";")[0];
        api.defaults.headers.common.Cookie = cookieRetorno;
        return cookieRetorno;
    } catch (error) {
        console.log("Catch ao obter cookie:" + error.message);
        (0, _utils.sendTelegram)("Catch ao obter cookie:" + error.message);
        return {};
    }
}
async function setCookieErrado(api) {
    api.defaults.headers.common.Cookie = "asdf";
}
