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
    pesagensAPI: ()=>pesagensAPI,
    retornaMovimentoPeloIdNavio_Liberado: ()=>retornaMovimentoPeloIdNavio_Liberado,
    retornaDadosNavioPeloImo: ()=>retornaDadosNavioPeloImo,
    pesgensPortal: ()=>pesgensPortal,
    retornaMovimentosPeloIdNavio: ()=>retornaMovimentosPeloIdNavio,
    movimentosOperando: ()=>movimentosOperando,
    retornaImoPeloId: ()=>retornaImoPeloId
});
const _moment = /*#__PURE__*/ _interopRequireDefault(require("moment"));
const _utils = require("./utils");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function retornaDadosNavioPeloImo(imo) {
    const dados = {
        // nome: "",
        identificador: imo
    };
    return await (0, _utils.postEMAP)("Navio", "/tosp/Navio/buscar", dados);
}
async function retornaImoPeloId(id) {
    const dados = {
        // nome: "",
        // identificador: imo,
        id
    };
    return await (0, _utils.postEMAP)("Navio", "/tosp/Navio/buscar", dados);
}
async function pesgensPortal(movimentoId, pesagemIni) {
    const dataFim = (0, _moment.default)().add(3, "hours").format("DD/MM/YYYY HH:mm");
    const dados = {
        navioMovimentoId: movimentoId,
        // labelNavioMovimento: "ORAWA",
        veiculoId: 0,
        motoristaId: 0,
        clienteId: 0,
        operadorId: 135,
        produtoId: 0,
        clienteUsuarioId: 135,
        carrierId: 0,
        despachanteId: 0,
        agenciaId: 0,
        ticket: 0,
        balanca: "BX",
        pesagemIni,
        pesagemFim: dataFim
    };
    return await (0, _utils.postEMAP)("BilhetePesagem", "/tosp/RelatorioPesagem/filtrar", dados);
}
async function pesagensAPI(imo, pesagemIni) {
    const dataFim = (0, _moment.default)().add(3, "hours").format("DD/MM/YYYY HH:mm");
    const dados = {
        imo,
        pesagemIni,
        pesagemFim: dataFim
    };
    return await (0, _utils.postEMAP)("PesagemDTO", "/tosp/PESAGEMWS/filtrar", dados);
}
async function retornaMovimentosPeloIdNavio(id) {
    const dados = {
        // nomeTransporte: "CORSAIR",
        transporteId: id,
        modal: "1",
        page: 0
    };
    return await (0, _utils.postEMAP)("TransporteMovimento", "/tosp/Transporte/buscarMovimento", dados);
}
async function retornaMovimentoPeloIdNavio_Liberado(navioId) {
    const dados = {
        navioId,
        page: 0,
        estado: 2 // 2=Liberado
    };
    return await (0, _utils.postEMAP)("PedidoAtracacao", "/tosp/ManutenirPedidoAtracacao/filtrar", dados);
}
async function movimentosOperando() {
    const dados = {
        transporteMovimentoId: null,
        operadorModalId: 135,
        clienteId: null,
        emOperacao: true,
        transporte: 1
    };
    return await (0, _utils.postEMAP)("TransporteMovimento", "/tosp/Transporte/buscarByOperadorModal", dados);
}
