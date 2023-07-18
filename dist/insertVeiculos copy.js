"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "insertVeiculos", {
    enumerable: true,
    get: ()=>insertVeiculos
});
const _axios = require("./api/axios");
const _knex = require("./utils/knex");
const TiposCombustivel = {
    1: "Diesel S-500",
    2: "Diesel S-10",
    3: "Gasolina",
    4: "Etanol",
    5: "Flex"
};
async function insertVeiculos(req, res) {
    // const pr = req.params.pr
    try {
        const { data  } = await _axios.apiFrota.post("/api/frotista/veiculo/pesquisa", {});
        // return res.json(data.registros)
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
        const retornoInsert = await (0, _knex.insertOrUpdate)(_knex.queryBuilder, "profrotas_veiculos", dadosFormatados);
        return res.json(retornoInsert);
    } catch (error) {
        console.log(error.code);
        console.log(error.message);
        console.log(error.response.data);
        return res.json(error.response.data);
    }
// return res.json(data)
}
