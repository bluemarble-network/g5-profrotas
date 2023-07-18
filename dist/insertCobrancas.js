"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "insertCobrancas", {
    enumerable: true,
    get: ()=>insertCobrancas
});
const _axios = require("./api/axios");
const _knex = require("./utils/knex");
const _utils = require("./utils/utils");
async function insertCobrancas(req, res) {
    try {
        const { data  } = await _axios.apiFrota.post("/api/frotista/cobranca/pesquisa", {
            mesInicial: "2022-01",
            mesFinal: "2022-08"
        });
        // 0 . Em Aberto | 1 . Pago | 2 . Vencido
        if (data.registros.length === 100) console.log("aten\xe7\xe3o, consulta com mais de 100 registros");
        const dadosFormatados = data.registros.map((item)=>({
                identificador: item.identificador,
                valorTotal: item.valorTotal,
                statusPagamento: item.statusPagamento,
                dataVencimento: (0, _utils.formataData2)(item.dataVencimento),
                dataPagamento: (0, _utils.formataData2)(item.dataPagamento),
                dataPeriodoInicial: (0, _utils.formataData2)(item.periodo.dataInicial),
                dataPeriodoFinal: (0, _utils.formataData2)(item.periodo.dataFinal)
            }));
        const retornoInsert = await (0, _knex.insertOrUpdate)(_knex.queryBuilder, "profrotas_cobrancas", dadosFormatados);
        return res.json(retornoInsert);
    } catch (err) {
        console.log(err);
        return res.json({
            erro: err.message
        });
    }
}
