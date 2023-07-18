"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "trataErro", {
    enumerable: true,
    get: ()=>trataErro
});
const _axios = require("../api/axios");
const _autentica = require("../api/autentica");
const _utils = require("./utils");
const _autenticaFrota = require("../api/autenticaFrota");
const _knex = require("./knex");
const trataErro = async (descricao, error)=>{
    if (error.response) {
        const { data  } = error.response;
        if (data) {
            if ((data === null || data === void 0 ? void 0 : data.mensagens[0]) === "Token de autentica\xe7\xe3o JWT inv\xe1lido." || (data === null || data === void 0 ? void 0 : data.mensagens[0]) === "Acesso Negado. Verifique sua chave de acesso e tente novamente.") {
                await (0, _knex.logDB)({
                    obs: `renovar token! - ${data === null || data === void 0 ? void 0 : data.mensagens[0]}`
                });
                await (0, _autentica.autentica)(_axios.api);
                await (0, _autenticaFrota.autenticaFrota)(_axios.apiFrota);
                await (0, _utils.sendTelegram)(`${descricao} - gerado novo token`);
                return;
            } else {
                console.log(descricao, data);
                await (0, _knex.logDB)({
                    obs: `${descricao} - ${JSON.stringify(data)}`
                });
                await (0, _utils.sendTelegram)(`${descricao} - ${JSON.stringify(data)}`);
                return;
            }
        }
    }
    console.log(`${descricao} - ${error.message}`);
    await (0, _knex.logDB)({
        obs: `${descricao} - ${error.message}`
    });
    await (0, _utils.sendTelegram)(`${descricao} - ${error.message}`);
};
