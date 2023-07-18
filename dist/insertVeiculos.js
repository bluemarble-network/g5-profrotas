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
    insertVeiculos: ()=>insertVeiculos,
    consultaInsereVeiculos: ()=>consultaInsereVeiculos
});
const _axios = require("./api/axios");
const _knex = require("./utils/knex");
const _trataErro = require("./utils/trataErro");
const TiposCombustivel = {
    1: "Diesel S-500",
    2: "Diesel S-10",
    3: "Gasolina",
    4: "Etanol",
    5: "Flex"
};
async function insertVeiculos(req, res) {
    try {
        return res.json(consultaInsereVeiculos());
    } catch (error) {
        await (0, _trataErro.trataErro)("insertVeiculos", error);
        return res.json(error.response.data);
    }
}
async function consultaInsereVeiculos() {
    try {
        const { data  } = await _axios.apiFrota.post("/api/frotista/veiculo/pesquisa", {});
        // console.log(data)
        const dadosFormatados = data.registros.map((item)=>({
                identificador: item.identificador,
                placa: item.placa,
                chassi: item.chassi,
                status: item.status,
                numeroDeEixos: item.numeroDeEixos,
                hodometro: item.hodometro,
                marca: item.marca,
                modelo: item.modelo,
                anoModelo: item.anoModelo,
                anoFabricacao: item.anoFabricacao,
                tipoCombustivel: TiposCombustivel[item.tipoCombustivel],
                classificacao: item.classificacao,
                capacidadeTanque: item.capacidadeTanque,
                tipoVeiculo: item.tipo.valor,
                subtipoVeiculo: item.subtipo.valor
            }));
        return await (0, _knex.insertOrUpdate)(_knex.queryBuilder, "profrotas_veiculos", dadosFormatados);
    } catch (error) {
        await (0, _trataErro.trataErro)("consultaInsereVeiculos", error);
    }
    return null;
}
