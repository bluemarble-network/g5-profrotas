"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "routes", {
    enumerable: true,
    get: ()=>routes
});
const _express = require("express");
const _moment = /*#__PURE__*/ _interopRequireDefault(require("moment"));
const _axios = require("./api/axios");
const _insertAbastecimentos = require("./insertAbastecimentos");
const _insertCobrancas = require("./insertCobrancas");
const _insertMotoristas = require("./insertMotoristas");
const _insertNotasFiscais = require("./insertNotasFiscais");
const _insertVeiculos = require("./insertVeiculos");
const _utils = require("./utils/utils");
const _ = require(".");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const routes = (0, _express.Router)();
routes.get("/abastecimentosRetroativosMensal/:mes", async (req, res)=>{
    const mes = Number(req.params.mes) - 1;
    const dataInicial = (0, _moment.default)([
        2023,
        mes,
        1
    ]).toDate();
    const dataFinal = (0, _moment.default)([
        2023,
        mes,
        1
    ]).add(1, "month").toDate();
    console.log("inicio mensal", (0, _moment.default)(dataInicial).format("YYYY-MM-DD"), (0, _moment.default)(dataFinal).format("YYYY-MM-DD"));
    const retornoInsert = await (0, _insertAbastecimentos.abastecimentos)(dataInicial, dataFinal);
    console.log("retornoInsert", retornoInsert);
    console.log("fim mensal");
    res.json({
        retornoInsert
    });
});
routes.get("/abastecimentosRetroativosDiarios/:mes/:diaIni/:diaFim", async (req, res)=>{
    const mes = Number(req.params.mes) - 1;
    const diaIni = Number(req.params.diaIni);
    const diaFim = Number(req.params.diaFim);
    if (!mes) return res.send("sem param mes");
    if (!diaIni) return res.send("sem param diaIni");
    if (!diaFim) return res.send("sem param diaFim");
    const datas = [];
    for(let dia = diaIni; dia <= diaFim; dia++){
        // mes 2 = mes 03.
        const dataInicial = (0, _moment.default)([
            2023,
            mes,
            dia
        ]).toDate();
        const dataFinal = (0, _moment.default)([
            2023,
            mes,
            dia
        ]).add(1, "days").toDate();
        console.log("inicio", (0, _moment.default)(dataInicial).format("YYYY-MM-DD"), (0, _moment.default)(dataFinal).format("YYYY-MM-DD"));
        await (0, _utils.delay)(_.EsperaEntreConsultas);
        const retornoInsert = await (0, _insertAbastecimentos.abastecimentos)(dataInicial, dataFinal);
        console.log("retornoInsert", retornoInsert);
        console.log("fim");
        datas.push({
            dataInicial,
            dataFinal
        });
    }
    console.log("fim - geral");
    res.json({
        datas
    });
});
routes.get("/teste", async (req, res)=>{
    const { data  } = await _axios.apiFrota.post("/api/frotista/abastecimento/pesquisa", {
        dataInicial: "2022-01-25T09:00:00",
        dataFinal: "2022-01-25T15:00:00",
        pagina: "1"
    });
    res.json(data);
});
routes.get("/cota-veiculo/:placa", async (req, res)=>{
    // não retornou nada.
    const placa = req.params.placa;
    console.log(placa);
    try {
        const { data  } = await _axios.apiFrota.get(`/api/frotista/cota-veiculo/${placa}`);
        res.json(data);
    } catch (error) {
        console.log(error.code);
        console.log(error.message);
        console.log(error.response.data);
        res.json(error.response.data);
    }
});
routes.get("/abastecimentos", _insertAbastecimentos.insertAbastecimentos);
routes.get("/cobrancas", _insertCobrancas.insertCobrancas);
routes.get("/motoristas", _insertMotoristas.insertMotoristas);
routes.get("/notas-fiscais", _insertNotasFiscais.insertNotasFiscais);
routes.get("/veiculos", _insertVeiculos.insertVeiculos);
routes.get("/rota", async (req, res)=>{
    // não consegui retornar nada
    try {
        const { data  } = await _axios.apiFrota.get("/api/frotista/rota/1");
        res.json(data);
    } catch (error) {
        console.log(error.code);
        console.log(error.message);
        console.log(error.response.data);
        res.json(error.response.data);
    }
});
