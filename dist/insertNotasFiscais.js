"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "insertNotasFiscais", {
    enumerable: true,
    get: ()=>insertNotasFiscais
});
const _axios = require("./api/axios");
async function insertNotasFiscais(req, res) {
    try {
        const { data  } = await _axios.apiFrota.post("/api/frotista/nota-fiscal/pesquisa", {});
        return res.json(data);
    } catch (error) {
        console.log(error.code);
        console.log(error.message);
        console.log(error.response.data);
        return res.json(error.response.data);
    }
}
