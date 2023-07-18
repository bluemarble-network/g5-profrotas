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
    autenticaFrota: ()=>autenticaFrota,
    setAutenticacaoErrada: ()=>setAutenticacaoErrada,
    setTokenFixo: ()=>setTokenFixo
});
const _axios = require("./axios");
const _utils = require("../utils/utils");
async function autenticaFrota(apiFrota) {
    // para gerar o token da apiFrota (https://portal.profrotas.com.br/#!/visualizar-chave-integracao), precisa do token da api padrão.
    //
    try {
        apiFrota.defaults.headers.common.Authorization = "";
        const { data  } = await _axios.api.post("/api/apiToken/frota/2359");
        if (!data.token) {
            (0, _utils.sendTelegram)("Erro autenticaFrota, sem token!");
        }
        console.log("Bearer " + data.token);
        apiFrota.defaults.headers.common.Authorization = "Bearer " + data.token;
    } catch (error) {
        console.log("Catch ao autenticar apiFrota:" + error.message);
        console.log("error.response.data:", error.response.data);
        (0, _utils.sendTelegram)("Catch ao autenticar apiFrota:" + error.message);
        return {};
    }
}
async function setAutenticacaoErrada(api) {
    const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrZW5qaUB0aGVibHVlbWFyYmxlbmV0d29yay5jb20uYnIiLCJST0xFUyI6WyJPUEVSQURPUiJdLCJDTElFTlRFSUQiOjEzNSwiSlNFU1NJT05JRCI6Im1fbVZFVlNsSWlSY1k2bzJkZVZpQUU0a3VVTWdjanNlWHYxQVdPX1gudG9zIiwiVE9TQVVUSElEIjoid1BTSzk4NmdjWnAwN3I1SDVSTXlyQTJGWVJidVJlK2oveTRYNmNyNStVZWE5Q1RzazlRaTFwMm1xK3l0dFlOc0tGSFJSMWc2eWRtd2dOV2JIamVSdlE9PSIsImV4cCI6MTY1NTg4ODY1MH0.J0_BvvCjo4Xd0hbFqx147RaNQOFRDdAPqPGKsFdXOh2D2EJb2yI2QwmFE7sjx4_5w9cfLxkFRKAsvEZCZAx6kw";
    api.defaults.headers.common.Authorization = "Bearer " + token;
}
async function setTokenFixo(api) {
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c3VhcmlvLmZyb3RhIjoyMzU5LCJ0b2tlbi50aXBvIjoiQVBJX0ZST1RJU1RBIiwidG9rZW4udmVyc2FvIjoiUC0wMDAyIiwiaXNzIjoiQm9sZWlhIiwidG9rZW4uZGF0YUdlcmFjYW8iOjE2NTk1NTk4MzQsInVzdWFyaW8ucGVybWlzc29lcyI6WyJBUElfRlJPVElTVEEiXSwiZXhwIjoxNjYyMTUxODM0LCJ1c3VhcmlvLmlkIjotNDU2NTg1NzM1OTE4NDk1NTg1LCJ1c3VhcmlvLm5vbWUiOiJHNSBTb2x1Y29lcyBMb2dpc3RpY2FzIiwidXN1YXJpby50aXBvIjoiRlJPVEEiLCJ0b2tlbi5jb250YWRvclJlbm92YWNvZXMiOjB9.ok-KdaIn25ftj7FTJ9Jg5uudLeqxo8apZ651JFI9Ykc";
    api.defaults.headers.common.Authorization = "Bearer " + token;
}
