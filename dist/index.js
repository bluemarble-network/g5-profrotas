"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EsperaEntreConsultas", {
    enumerable: true,
    get: ()=>EsperaEntreConsultas
});
const _express = /*#__PURE__*/ _interopRequireDefault(require("express"));
const _cors = /*#__PURE__*/ _interopRequireDefault(require("cors"));
const _ip = /*#__PURE__*/ _interopRequireDefault(require("ip"));
const _routes = require("./routes");
const _axios = require("./api/axios");
require("dotenv/config");
const _autenticaFrota = require("./api/autenticaFrota");
const _autentica = require("./api/autentica");
const _knex = require("./utils/knex");
const _moment = /*#__PURE__*/ _interopRequireDefault(require("moment"));
const _insertAbastecimentos = require("./insertAbastecimentos");
const _insertVeiculos = require("./insertVeiculos");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const SEGUNDO = 1000;
const MINUTO = SEGUNDO * 60;
const HORA = MINUTO * 60;
const EsperaEntreConsultas = 30 * SEGUNDO;
const IntervaloAbastecimentos = 3 * HORA;
const IntervaloVeiculos = 24 * HORA;
const app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_express.default.json({
    limit: "50mb"
}));
app.use(_routes.routes);
const port = process.env.PORT || 3333;
app.listen(port, async function() {
    const msg = `Start G5 Profrotas http://${_ip.default.address()}:${port}`;
    console.log(msg);
    // sendTelegram(msg)
    // await logDB({ obs: msg })
    await (0, _autentica.autentica)(_axios.api);
    await (0, _autenticaFrota.autenticaFrota)(_axios.apiFrota);
    console.log("process.env.DEV", process.env.DEV);
    if (process.env.DEV) {
    // await consultaInsereVeiculos()
    }
// await setTokenFixo(apiFrota)
// const dataAnterior = moment().subtract(24, 'hours').toDate()
// const dataAgora = moment().toDate()
// const dataAnterior = moment().subtract(2, 'months').toDate()
// const dataAnterior = moment('2022-02-14 00:00:00').subtract(3, 'hours').toDate()
// const dataAgora = moment('2022-02-15 00:00:00').subtract(3, 'hours').toDate()
// console.log(dataAnterior)
// console.log(dataAgora)
// await abastecimentos(dataAnterior, dataAgora)
});
setInterval(async ()=>{
    await (0, _knex.logDB)({
        obs: "IntervaloAbastecimentos"
    });
    const data24horasAtras = (0, _moment.default)().subtract(24, "hours").toDate();
    const dataAgora = (0, _moment.default)().toDate();
    await (0, _insertAbastecimentos.abastecimentos)(data24horasAtras, dataAgora);
}, IntervaloAbastecimentos);
setInterval(async ()=>{
    await (0, _knex.logDB)({
        obs: "IntervaloVeiculos"
    });
    await (0, _insertVeiculos.consultaInsereVeiculos)();
}, IntervaloVeiculos);
