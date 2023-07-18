"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "insertMotoristas", {
    enumerable: true,
    get: ()=>insertMotoristas
});
const _axios = require("./api/axios");
const _knex = require("./utils/knex");
async function insertMotoristas(req, res) {
    try {
        const { data  } = await _axios.apiFrota.post("/api/frotista/motorista/pesquisa", {});
        const dadosFormatados = data.registros.map((item)=>({
                identificador: item.identificador,
                cpf: item.cpf,
                nome: item.nome,
                matricula: item.matricula,
                dataNascimento: item.dataNascimento,
                email: item.email,
                celular: `${item.celular.ddd}${item.celular.numeroCelular}`,
                cnh: item.cnh.numero,
                cnhVencimento: item.cnh.dataVencimento,
                classificacao: item.classificacao.valor
            }));
        const retornoInsert = await (0, _knex.insertOrUpdate)(_knex.queryBuilder, "profrotas_motoristas", dadosFormatados);
        return res.json(retornoInsert);
    } catch (error) {
        console.log(error.code);
        console.log(error.message);
        console.log(error.response.data);
        return res.json(error.response.data);
    }
}
