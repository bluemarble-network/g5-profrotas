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
    insertAbastecimentos: ()=>insertAbastecimentos,
    abastecimentosTotais: ()=>abastecimentosTotais,
    abastecimentos: ()=>abastecimentos
});
const _moment = /*#__PURE__*/ _interopRequireDefault(require("moment"));
const _axios = require("./api/axios");
const _knex = require("./utils/knex");
const _utils = require("./utils/utils");
const _ = require(".");
const _trataErro = require("./utils/trataErro");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function insertAbastecimentos(req, res) {
    // período entre às duas não deve ser maior 2 meses
    // const dataInicial = '2022-04-01T00:00:00'
    // const dataFinal = '2022-05-01T00:00:00'
    // const pr = req.params.pr
    const dataInicial = (0, _moment.default)().subtract(24, "hours").toDate();
    const dataFinal = (0, _moment.default)().toDate();
    try {
        return res.json(await abastecimentos(dataInicial, dataFinal));
    } catch (error) {
        console.log(error.code);
        console.log(error.message);
        console.log(error.response.data);
        await (0, _knex.logDB)({
            obs: error.message
        });
        await (0, _utils.sendTelegram)("G5 profrotas: " + error.message);
        return res.json(error.response.data);
    }
}
async function abastecimentosTotais(dataInicial, dataFinal) {
    let pagina = 1;
    let totalRegistros = 0;
    let tamanhoPagina = 0;
    let registrosTotais;
    console.log(dataInicial, dataFinal);
    try {
        const { data  } = await _axios.apiFrota.post("/api/frotista/abastecimento/pesquisa", {
            dataInicial,
            dataFinal,
            pagina
        });
        totalRegistros = data.registros.length;
        tamanhoPagina = data.tamanhoPagina;
        registrosTotais = data.registros;
        while(totalRegistros === tamanhoPagina){
            pagina++;
            console.log(`atenção consulta maior que ${tamanhoPagina}x Registros, totalRegistros:${totalRegistros}, página:${pagina}`);
            await (0, _utils.delay)(_.EsperaEntreConsultas);
            try {
                const { data: data1  } = await _axios.apiFrota.post("/api/frotista/abastecimento/pesquisa", {
                    dataInicial,
                    dataFinal,
                    pagina
                });
                registrosTotais = registrosTotais.concat(data1.registros);
                totalRegistros = data1.registros.length;
            } catch (error) {
                await (0, _trataErro.trataErro)("abastecimento/pesquisa dentro while", error);
            }
        }
        return registrosTotais;
    } catch (error1) {
        await (0, _trataErro.trataErro)("abastecimento/pesquisa", error1);
    }
    return [];
}
async function abastecimentos(dataInicialDate, dataFinalDate) {
    const dataInicial = (0, _moment.default)(dataInicialDate).utc().format("YYYY-MM-DDTHH:mm:ss");
    const dataFinal = (0, _moment.default)(dataFinalDate).utc().format("YYYY-MM-DDTHH:mm:ss");
    await (0, _knex.logDB)({
        obs: `abast. inicial:${dataInicial}, final:${dataFinal}`
    });
    const registrosTotais = await abastecimentosTotais(dataInicial, dataFinal);
    if (registrosTotais.length === 0) return;
    if (!registrosTotais) return;
    // console.log(dadosTotais)
    // return res.json(dadosTotais)
    const dadosFormatados = registrosTotais.map((item)=>({
            identificador: item.identificador,
            abastecimentoEstornado: item.abastecimentoEstornado,
            data: item.data,
            dataAtualizacao: item.dataAtualizacao,
            dataTransacao: item.dataTransacao,
            statusEdicao: item.statusEdicao,
            statusAutorizacao: item.statusAutorizacao,
            motivoRecusa: item.motivoRecusa,
            motivoCancelamento: item.motivoCancelamento,
            hodometro: item.hodometro,
            motorista_cpf: item.motorista.cpf,
            veiculo_identificador: item.veiculo.identificador,
            pontoVenda_cnpj: item.pontoVenda.cnpj
        }));
    // console.log('dadosFormatados', dadosFormatados)
    const retornoInsert = [];
    if (dadosFormatados.length > 0) {
        retornoInsert.push(await (0, _knex.insertOrUpdate)(_knex.queryBuilder, "profrotas_abastecimentos", dadosFormatados));
    }
    await (0, _knex.logDB)({
        obs: "profrotas_abastecimentos",
        qtdInserida: dadosFormatados.length
    });
    const dadosFormatadosItens = [];
    for (const abastecimento of registrosTotais){
        for (const item of abastecimento.items){
            dadosFormatadosItens.push({
                identificador: abastecimento.identificador,
                identificador_itens: item.identificador,
                nome: item.nome,
                tipo_codigo: item.tipo.codigo,
                tipo_valor: item.tipo.valor,
                quantidade: item.quantidade,
                valorUnitario: item.valorUnitario,
                valorTotal: item.valorTotal
            });
        }
    }
    // console.log('dadosFormatadosItens', dadosFormatadosItens)
    if (dadosFormatadosItens.length > 0) {
        retornoInsert.push(await (0, _knex.insertOrUpdate)(_knex.queryBuilder, "profrotas_abastecimentos_itens", dadosFormatadosItens));
    }
    await (0, _knex.logDB)({
        obs: "profrotas_abastecimentos_itens",
        qtdInserida: dadosFormatadosItens.length
    });
    const pontoVendaCnpjPossiveis = [
        ...new Set(registrosTotais.map((item)=>String(item.pontoVenda.cnpj)))
    ];
    const pontoVendaCnpjCadastrados = await (0, _knex.queryBuilder)("profrotas_ponto_venda").select([
        "cnpj"
    ]).whereIn("cnpj", pontoVendaCnpjPossiveis);
    const pontoVendaCnpjCadastradosArr = pontoVendaCnpjCadastrados.map((item)=>item.cnpj);
    const pontoVendaCnpjParaIncluir = pontoVendaCnpjPossiveis.filter((item)=>!pontoVendaCnpjCadastradosArr.includes(item));
    if (pontoVendaCnpjParaIncluir.length > 0) {
        const insertItens = [];
        for (const pontoVenda of pontoVendaCnpjParaIncluir){
            if (registrosTotais.length > 0) {
                var ref;
                const pontoVendaObj = (ref = registrosTotais.find((item)=>String(item.pontoVenda.cnpj) === pontoVenda)) === null || ref === void 0 ? void 0 : ref.pontoVenda;
                if (pontoVendaObj) insertItens.push({
                    ...pontoVendaObj
                });
            // insertItens.push({ ...registrosTotais.map(item => item.pontoVenda) })
            }
        }
        const insertFormatadado = insertItens.map((item)=>({
                cnpj: item.cnpj,
                razaoSocial: item.razaoSocial,
                postoInterno: item.postoInterno,
                cep: item.endereco.cep,
                logradouro: item.endereco.logradouro,
                numero: item.endereco.numero,
                complemento: item.endereco.complemento,
                bairro: item.endereco.bairro,
                municipio: item.endereco.municipio,
                uf: item.endereco.uf,
                latitude: item.endereco.latitude,
                longitude: item.endereco.longitude
            }));
        if (insertFormatadado.length > 0) {
            retornoInsert.push(await (0, _knex.insertOrUpdate)(_knex.queryBuilder, "profrotas_ponto_venda", insertFormatadado));
        }
    }
    return retornoInsert;
}
