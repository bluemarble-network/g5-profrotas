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
    api: ()=>api,
    apiFrota: ()=>apiFrota
});
const _axios = /*#__PURE__*/ _interopRequireDefault(require("axios"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const api = _axios.default.create({
    baseURL: "https://api-portal.profrotas.com.br"
});
const apiFrota = _axios.default.create({
    baseURL: "https://api-portal.profrotas.com.br"
});
