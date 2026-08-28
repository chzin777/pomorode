/* ============================================================
   A ponte com o Easy-NFe.

   O Easy-NFe autentica por API key da empresa, no header
   `Authorization: Bearer <token>` ou `x-api-key: <token>` — é o mesmo
   contrato do `lib/api-auth.ts` de lá. Os endpoints publicados hoje:

     GET  /v1            confere a chave e devolve o empresaId
     GET  /v1/produtos   catálogo da empresa dona da chave

   A emissão de NFS-e existe lá dentro (`emitirNotaServico`), mas por
   ação de servidor, ainda sem rota pública. Este cliente já fala o
   formato certo (`EmitirNfseInput`) e chama POST /v1/notas-servico;
   enquanto a rota não existir, o 404 vira nota em fila com a mensagem
   exata do que falta, em vez de erro solto na tela.

   Uma NFS-e do Padrão Nacional descreve UM serviço com UM valor — não
   tem itens. Por isso a OS inteira vira uma descrição só, com os
   códigos dos serviços listados no corpo.
   ============================================================ */

import { SERVICOS } from '../dados.js';
import { totalOS } from './store.js';

const limpaBase = (u) => u.trim().replace(/\/+$/, '');

function cabecalhos(cfg) {
  const t = cfg.apiKey.trim();
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${t}`, 'x-api-key': t };
}

async function chamar(cfg, caminho, init) {
  if (!cfg.apiKey.trim()) throw new Error('Cadastre a API key do Easy-NFe antes de conectar.');
  if (!cfg.baseUrl.trim()) throw new Error('Cadastre o endereço do Easy-NFe antes de conectar.');

  return fetch(`${limpaBase(cfg.baseUrl)}${caminho}`, {
    ...init,
    headers: { ...cabecalhos(cfg), ...(init?.headers ?? {}) },
    mode: 'cors',
  });
}

/** Confere a chave. É o mesmo GET /v1 que o Easy-NFe expõe hoje. */
export async function conferir(cfg) {
  try {
    const r = await chamar(cfg, '/v1');
    const corpo = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, erro: String(corpo.erro ?? `O Easy-NFe respondeu ${r.status}.`) };
    return { ok: true, empresaId: String(corpo.empresaId ?? ''), versao: String(corpo.versao ?? 'v1') };
  } catch (e) {
    return {
      ok: false,
      erro:
        e instanceof TypeError
          ? 'Não deu para alcançar o Easy-NFe. Confira o endereço e se o CORS libera este domínio.'
          : e.message ?? String(e),
    };
  }
}

/** Traz o catálogo da empresa, para casar peça vendida com produto fiscal. */
export async function baixarProdutos(cfg) {
  const r = await chamar(cfg, '/v1/produtos');
  if (!r.ok) {
    const corpo = await r.json().catch(() => ({}));
    throw new Error(String(corpo.erro ?? `O Easy-NFe respondeu ${r.status}.`));
  }
  const corpo = await r.json();
  return corpo.produtos ?? [];
}

/** A descrição do serviço, montada a partir da OS e com os códigos internos. */
export function descricaoDaOS(os, cliente) {
  const linhas = os.itens.map((i) => `${i.codigo} ${i.nome}${i.qtd > 1 ? ` (${i.qtd}x)` : ''}`);
  return `Serviços automotivos executados no veículo ${cliente.veiculo}, placa ${cliente.placa}: ${linhas.join('; ')}.`;
}

/** O corpo que o Easy-NFe espera para emitir (EmitirNfseInput). */
export function montarPedido(cfg, os, cliente, clienteRemotoId) {
  const hoje = new Date();
  const iso = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  return {
    clienteId: clienteRemotoId,
    servicoId: null,
    descricao: descricaoDaOS(os, cliente),
    cTribNac: cfg.cTribNac,
    cNBS: cfg.cNBS,
    valorServico: Number(totalOS(os).toFixed(2)),
    aliqISS: cfg.aliqISS,
    /* 1 = tributável */
    tribISSQN: '1',
    tpImunidade: '0',
    issRetido: false,
    codMunicipioPrestacao: cfg.municipio,
    competencia: iso,
    informacoesAdicionais: `OS ${os.numero} · Pomerode Auto Center · quilometragem ${os.km.toLocaleString('pt-BR')} km`,
  };
}

/** Emite. 404 aqui significa rota ainda não publicada do outro lado. */
export async function emitirNfse(cfg, pedido) {
  try {
    const r = await chamar(cfg, '/v1/notas-servico', { method: 'POST', body: JSON.stringify(pedido) });

    if (r.status === 404 || r.status === 405) {
      return {
        ok: false,
        fila: true,
        erro:
          'A rota POST /v1/notas-servico ainda não existe no Easy-NFe. A nota ficou em fila; assim que a rota subir, ela sai daqui sem retrabalho.',
      };
    }

    const corpo = await r.json().catch(() => ({}));
    if (!r.ok || corpo.ok === false) {
      return { ok: false, fila: false, erro: String(corpo.erro ?? `O Easy-NFe respondeu ${r.status}.`) };
    }

    return { ok: true, numero: Number(corpo.numero ?? 0), chave: String(corpo.chaveAcesso ?? '') };
  } catch (e) {
    return {
      ok: false,
      fila: true,
      erro:
        e instanceof TypeError
          ? 'Sem resposta do Easy-NFe. A nota ficou em fila para reenvio.'
          : e.message ?? String(e),
    };
  }
}
