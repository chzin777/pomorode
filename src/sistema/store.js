/* ============================================================
   A guarda local da bancada.

   Tudo mora no navegador. É demonstração que funciona de verdade —
   abre, aceita cadastro, marca horário e imprime recibo — sem depender
   de servidor. Trocar por API depois mexe só neste arquivo.
   ============================================================ */

import { SERVICOS } from '../dados.js';

const CHAVE = 'pac.v1';

export const MECANICOS = ['Éder', 'Jonas', 'Willian', 'Tiago'];

/** Três boxes de elevador. A agenda inteira é dimensionada por isso. */
export const BOXES = [1, 2, 3];

/** Grade de meia em meia hora, dentro do horário de funcionamento. */
export const SLOTS = (() => {
  const out = [];
  for (let m = 7 * 60 + 30; m <= 18 * 60; m += 30) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  }
  return out;
})();

export const DIAS_CURTOS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

export const FISCAL_PADRAO = {
  baseUrl: 'https://easy-nfe.vercel.app',
  apiKey: '',
  cTribNac: '140101',
  cNBS: '124011000',
  aliqISS: 3,
  /* Pomerode no IBGE */
  municipio: '4213500',
};

export const novoId = () => Math.random().toString(36).slice(2, 10);
const diasAtras = (d) => new Date(Date.now() - d * 86400000).toISOString();

/** Segunda-feira da semana de uma data qualquer, à meia-noite. */
export function segundaDaSemana(d) {
  const x = new Date(d);
  const dia = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - dia);
  x.setHours(0, 0, 0, 0);
  return x;
}

/* Base de demonstração: cinco clientes com histórico plausível e a
   semana corrente já com horário marcado, para a tela nunca abrir vazia
   numa apresentação. */
function semente() {
  const c = (nome, telefone, veiculo, placa, km, dias) => ({
    id: novoId(),
    nome,
    telefone,
    veiculo,
    placa,
    km,
    criadoEm: diasAtras(dias),
  });

  const clientes = [
    c('Marina Hoffmann', '(47) 99812-4410', 'Chevrolet Onix 1.0 2021', 'MHK4A21', 62400, 240),
    c('Rodrigo Meurer', '(47) 99204-7781', 'Jeep Compass Longitude 2022', 'QJD7B08', 38900, 190),
    c('Cláudio Bertoldi', '(47) 98811-3092', 'Hyundai HB20 1.6 2019', 'LZR9C77', 104200, 420),
    c('Fernanda Krieger', '(47) 99655-2214', 'Volkswagen T-Cross 2023', 'RTA2E45', 21750, 120),
    c('Douglas R. Schmitt', '(47) 99117-8830', 'Fiat Toro Freedom 2020', 'PMC5F19', 88300, 310),
  ];

  const item = (codigo, qtd = 1) => {
    const s = SERVICOS.find((x) => x.codigo === codigo);
    return { codigo: s.codigo, nome: s.nome, preco: s.preco, qtd };
  };

  const os = (numero, cliente, itens, km, dias, status, mecanico) => ({
    id: novoId(),
    numero,
    clienteId: cliente.id,
    itens,
    km,
    mecanico,
    obs: '',
    desconto: 0,
    status,
    criadoEm: diasAtras(dias),
    fechadoEm: status === 'fechada' ? diasAtras(dias) : null,
  });

  const ordens = [
    os(1041, clientes[0], [item('TRO-OL'), item('GEO-BA')], 52100, 214, 'fechada', 'Éder'),
    os(1058, clientes[2], [item('HIG-AR'), item('LAM-FA')], 96400, 178, 'fechada', 'Jonas'),
    os(1072, clientes[4], [item('RDA-RF'), item('GEO-BA')], 81200, 140, 'fechada', 'Willian'),
    os(1089, clientes[1], [item('RDA-ES'), item('PNE-MO', 4)], 34600, 96, 'fechada', 'Tiago'),
    os(1104, clientes[3], [item('TRO-OL'), item('ADI-TV')], 18400, 58, 'fechada', 'Éder'),
    os(1118, clientes[0], [item('PNE-MO', 2), item('GEO-BA')], 60800, 22, 'fechada', 'Jonas'),
    os(1126, clientes[2], [item('TRO-OL')], 104200, 3, 'aberta', 'Willian'),
    os(1127, clientes[4], [item('LAM-FA'), item('ADI-TV')], 88300, 1, 'aberta', 'Tiago'),
  ];

  const seg = segundaDaSemana(new Date());
  const marcar = (diaDaSemana, hora, cliente, servicos, box, status, avulso) => {
    const [h, m] = hora.split(':').map(Number);
    const d = new Date(seg);
    d.setDate(seg.getDate() + diaDaSemana);
    d.setHours(h, m, 0, 0);
    const minutos = servicos.reduce((s, cod) => s + (SERVICOS.find((x) => x.codigo === cod)?.box ?? 30), 0);
    return {
      id: novoId(),
      clienteId: cliente?.id ?? null,
      nome: cliente?.nome ?? avulso?.nome ?? '',
      telefone: cliente?.telefone ?? avulso?.telefone ?? '',
      veiculo: cliente?.veiculo ?? avulso?.veiculo ?? '',
      placa: cliente?.placa ?? avulso?.placa ?? '',
      servicos,
      inicio: d.toISOString(),
      minutos,
      box,
      status,
      obs: '',
      osId: null,
    };
  };

  const agendamentos = [
    marcar(0, '08:00', clientes[0], ['TRO-OL'], 1, 'concluido'),
    marcar(0, '09:30', clientes[3], ['GEO-BA'], 2, 'concluido'),
    marcar(1, '07:30', clientes[2], ['TRO-OL', 'ADI-TV'], 1, 'chegou'),
    marcar(1, '10:00', null, ['PNE-MO'], 3, 'marcado', {
      nome: 'Ivo Reitz',
      telefone: '(47) 99432-0087',
      veiculo: 'Renault Kwid 2022',
      placa: 'SGT4H62',
    }),
    marcar(2, '08:30', clientes[4], ['LAM-FA'], 2, 'marcado'),
    marcar(2, '14:00', clientes[1], ['HIG-AR'], 1, 'marcado'),
    marcar(3, '09:00', null, ['RDA-RF'], 3, 'marcado', {
      nome: 'Sandra Wippel',
      telefone: '(47) 98120-6644',
      veiculo: 'Ford Ka 2018',
      placa: 'NBQ8J14',
    }),
    marcar(4, '07:30', clientes[0], ['GEO-BA', 'PNE-MO'], 2, 'marcado'),
    marcar(4, '15:30', clientes[3], ['TRO-OL'], 1, 'marcado'),
    marcar(5, '08:00', clientes[2], ['HIG-AR'], 1, 'marcado'),
  ];

  return { clientes, ordens, agendamentos, notas: [], fiscal: { ...FISCAL_PADRAO }, proximoNumero: 1128 };
}

const vazia = () => ({
  clientes: [],
  ordens: [],
  agendamentos: [],
  notas: [],
  fiscal: { ...FISCAL_PADRAO },
  proximoNumero: 1,
});

export function carregar() {
  if (typeof window === 'undefined') return vazia();
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) {
      const nova = semente();
      localStorage.setItem(CHAVE, JSON.stringify(nova));
      return nova;
    }
    /* base gravada por versão anterior pode não ter todas as chaves */
    const lida = JSON.parse(bruto);
    return { ...vazia(), ...lida, fiscal: { ...FISCAL_PADRAO, ...(lida.fiscal ?? {}) } };
  } catch {
    return semente();
  }
}

export function salvar(base) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(base));
  } catch {
    /* modo privado sem espaço: a tela segue funcionando na memória */
  }
}

export function limpar() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    /* nada a fazer */
  }
}

/* ---------- contas ---------- */

export const subtotalOS = (o) => o.itens.reduce((s, i) => s + i.preco * i.qtd, 0);
export const totalOS = (o) => Math.max(0, subtotalOS(o) - (o.desconto || 0));

const mesmoMes = (iso) => {
  const d = new Date(iso);
  const h = new Date();
  return d.getMonth() === h.getMonth() && d.getFullYear() === h.getFullYear();
};

export function indicadores(base) {
  const fechadas = base.ordens.filter((o) => o.status === 'fechada');
  const doMes = fechadas.filter((o) => mesmoMes(o.fechadoEm ?? o.criadoEm));
  const total = fechadas.reduce((s, o) => s + totalOS(o), 0);
  return {
    faturado: doMes.reduce((s, o) => s + totalOS(o), 0),
    abertas: base.ordens.filter((o) => o.status === 'aberta').length,
    ticket: fechadas.length ? total / fechadas.length : 0,
    atendimentos: fechadas.length,
    retornos: retornos(base).length,
  };
}

/* Retorno de manutenção: para cada serviço com ciclo, a última vez que
   o cliente fez soma o ciclo em km e uma data prevista. É o que enche a
   agenda sem ligar para a lista inteira. */
export function retornos(base) {
  const vistos = new Map();

  for (const o of base.ordens.filter((x) => x.status === 'fechada')) {
    const cliente = base.clientes.find((c) => c.id === o.clienteId);
    if (!cliente) continue;

    for (const i of o.itens) {
      const s = SERVICOS.find((x) => x.codigo === i.codigo);
      if (!s || s.ciclo === 0) continue;

      const chave = `${cliente.id}:${s.codigo}`;
      const quando = new Date(o.fechadoEm ?? o.criadoEm);
      /* seis meses ou o ciclo em km, o que chegar primeiro */
      const vence = new Date(quando.getTime() + 182 * 86400000);
      const anterior = vistos.get(chave);

      const candidato = {
        cliente,
        servico: s.nome,
        codigo: s.codigo,
        kmPrevisto: o.km + s.ciclo,
        venceEm: vence.toISOString(),
        vencido: vence.getTime() < Date.now() || cliente.km >= o.km + s.ciclo,
      };

      if (!anterior || new Date(anterior.venceEm) < vence) vistos.set(chave, candidato);
    }
  }

  return [...vistos.values()].sort((a, b) => new Date(a.venceEm) - new Date(b.venceEm));
}

/* ---------- formato ---------- */

export const dataCurta = (iso) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const horaCurta = (iso) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export const kmFmt = (n) => `${n.toLocaleString('pt-BR')} km`;

/** Minutos desde a meia-noite, para posicionar o cartão na grade. */
export const minutosDoDia = (iso) => {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
};

export const mesmoDia = (iso, d) => {
  const a = new Date(iso);
  return a.getDate() === d.getDate() && a.getMonth() === d.getMonth() && a.getFullYear() === d.getFullYear();
};
