/* ==================================================================
   A BANCADA

   Cinco telas: painel, agenda, clientes, ordens e fiscal. Tudo mora no
   navegador (ver store.js) — é demonstração que funciona de
   verdade, não maquete. Trocar por servidor mexe só no store.
   ================================================================== */

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BellRing,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Link2,
  Minus,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { MARCA, SERVICOS, brl } from '../dados.js';
import {
  BOXES,
  DIAS_CURTOS,
  MECANICOS,
  SLOTS,
  carregar,
  dataCurta,
  horaCurta,
  indicadores,
  kmFmt,
  limpar,
  mesmoDia,
  minutosDoDia,
  novoId,
  retornos,
  salvar,
  segundaDaSemana,
  subtotalOS,
  totalOS,
} from './store.js';
import { conferir, baixarProdutos, emitirNfse, montarPedido } from './easynfe.js';

const PRIMEIRO_SLOT = 7 * 60 + 30;
const ALTURA_SLOT = 30; // px por 30 minutos
const px = (min) => ((min - PRIMEIRO_SLOT) / 30) * ALTURA_SLOT;

/* O mesmo logotipo da landing. Na lateral escura entra a versão de
   tinta branca; no recibo, que sai em papel, a colorida. */
function Marca({ className, escura = false }) {
  return (
    <img
      className={className}
      src={escura ? '/marca/logo-branca.webp' : '/marca/logo.webp'}
      alt="Pomerode Auto Center"
      width="505"
      height="215"
      decoding="async"
    />
  );
}

export default function Sistema() {
  const [base, setBase] = useState(null);
  const [tela, setTela] = useState('painel');
  const [janela, setJanela] = useState(null);
  const [busca, setBusca] = useState('');
  const [semana, setSemana] = useState(() => segundaDaSemana(new Date()));

  useEffect(() => setBase(carregar()), []);

  const gravar = (proxima) => {
    setBase(proxima);
    salvar(proxima);
  };

  if (!base) {
    return (
      <div className="app">
        <div />
        <div className="palco">
          <p className="fraco">Abrindo a bancada…</p>
        </div>
      </div>
    );
  }

  const ind = indicadores(base);
  const listaRetornos = retornos(base);
  const hoje = new Date();
  const agendaHoje = base.agendamentos
    .filter((a) => mesmoDia(a.inicio, hoje))
    .sort((a, b) => a.inicio.localeCompare(b.inicio));

  const cliente = (id) => base.clientes.find((c) => c.id === id) ?? null;

  const menu = [
    { chave: 'painel', rotulo: 'Painel', icone: Gauge },
    { chave: 'agenda', rotulo: 'Agenda', icone: CalendarDays, pino: agendaHoje.filter((a) => a.status === 'marcado').length },
    { chave: 'clientes', rotulo: 'Clientes', icone: Users },
    { chave: 'ordens', rotulo: 'Ordens de serviço', icone: FileText, pino: ind.abertas },
    { chave: 'fiscal', rotulo: 'Notas e Easy-NFe', icone: Link2 },
  ];

  const titulos = {
    painel: 'Como está a oficina agora',
    agenda: 'A semana nos três boxes',
    clientes: 'Quem já passou por aqui',
    ordens: 'Ordens de serviço',
    fiscal: 'Notas de serviço e a ponte com o Easy-NFe',
  };

  return (
    <div className="app">
      {/* ============================ LATERAL ============================ */}
      <aside className="lado">
        <div>
          <div className="lado-marca">
            <Marca className="lado-logo" escura />
            <span className="placa">bancada · v1</span>
          </div>

          <nav className="lado-menu" style={{ marginTop: 16 }}>
            {menu.map((m) => {
              const Icone = m.icone;
              return (
                <button
                  key={m.chave}
                  className={tela === m.chave ? 'ativo' : ''}
                  onClick={() => {
                    setTela(m.chave);
                    setBusca('');
                  }}
                >
                  <Icone />
                  {m.rotulo}
                  {m.pino ? <span className="pino">{m.pino}</span> : null}
                </button>
              );
            })}
          </nav>
        </div>

        <div />

        <div className="lado-pe">
          <a href="/index.html">
            <ArrowLeft />
            Voltar ao site
          </a>
          <button
            onClick={() => {
              if (!confirm('Isso apaga tudo que foi cadastrado nesta demonstração e recria a base de exemplo. Seguir?')) return;
              limpar();
              setBase(carregar());
            }}
          >
            <RotateCcw />
            Recomeçar a demonstração
          </button>
        </div>
      </aside>

      {/* ============================= PALCO ============================= */}
      <main className="palco">
        <header className="palco-topo">
          <div>
            <p className="placa">
              {MARCA.endereco} <span>·</span> {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
            </p>
            <h1>{titulos[tela]}</h1>
          </div>

          <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
            {tela === 'clientes' && (
              <button className="btn btn-primary" onClick={() => setJanela({ tipo: 'cliente' })}>
                <Plus />
                Novo cliente
              </button>
            )}
            {(tela === 'ordens' || tela === 'painel') && (
              <button className="btn btn-primary" onClick={() => setJanela({ tipo: 'os' })}>
                <Plus />
                Abrir OS
              </button>
            )}
            {tela === 'agenda' && (
              <button className="btn btn-primary" onClick={() => setJanela({ tipo: 'agendamento' })}>
                <Plus />
                Marcar horário
              </button>
            )}
          </div>
        </header>

        {tela === 'painel' && (
          <Painel
            base={base}
            ind={ind}
            agendaHoje={agendaHoje}
            listaRetornos={listaRetornos}
            cliente={cliente}
            abrirRecibo={(id) => setJanela({ tipo: 'recibo', id })}
            irParaAgenda={() => setTela('agenda')}
          />
        )}

        {tela === 'agenda' && (
          <Agenda
            base={base}
            semana={semana}
            setSemana={setSemana}
            abrirVaga={(inicio, box) => setJanela({ tipo: 'agendamento', inicio, box })}
            abrirCartao={(id) => setJanela({ tipo: 'verAgendamento', id })}
          />
        )}

        {tela === 'clientes' && (
          <Clientes base={base} busca={busca} setBusca={setBusca} cliente={cliente} />
        )}

        {tela === 'ordens' && (
          <Ordens
            base={base}
            busca={busca}
            setBusca={setBusca}
            cliente={cliente}
            gravar={gravar}
            abrirRecibo={(id) => setJanela({ tipo: 'recibo', id })}
          />
        )}

        {tela === 'fiscal' && <Fiscal base={base} gravar={gravar} cliente={cliente} />}
      </main>

      {/* ============================ JANELAS ============================ */}
      {janela?.tipo === 'cliente' && (
        <JanelaCliente base={base} gravar={gravar} fechar={() => setJanela(null)} />
      )}

      {janela?.tipo === 'os' && (
        <JanelaOS
          base={base}
          gravar={gravar}
          agendamento={janela.agendamento}
          fechar={() => setJanela(null)}
          aoCriar={(id) => setJanela({ tipo: 'recibo', id })}
        />
      )}

      {janela?.tipo === 'agendamento' && (
        <JanelaAgendamento
          base={base}
          gravar={gravar}
          inicio={janela.inicio}
          box={janela.box}
          fechar={() => setJanela(null)}
        />
      )}

      {janela?.tipo === 'verAgendamento' && (
        <JanelaVerAgendamento
          base={base}
          gravar={gravar}
          id={janela.id}
          fechar={() => setJanela(null)}
          gerarOS={(ag) => setJanela({ tipo: 'os', agendamento: ag })}
        />
      )}

      {janela?.tipo === 'recibo' && (
        <JanelaRecibo base={base} id={janela.id} fechar={() => setJanela(null)} />
      )}
    </div>
  );
}

/* ==================================================================
   PAINEL
   ================================================================== */

function Painel({
  base,
  ind,
  agendaHoje,
  listaRetornos,
  cliente,
  abrirRecibo,
  irParaAgenda,
}) {
  const abertas = base.ordens.filter((o) => o.status === 'aberta');
  const vencidos = listaRetornos.filter((r) => r.vencido);

  return (
    <>
      <div className="kpis">
        <div className="kpi">
          <p className="placa">Faturado neste mês</p>
          <b>{brl(ind.faturado)}</b>
          <small>{ind.atendimentos} atendimentos fechados no total</small>
        </div>
        <div className="kpi">
          <p className="placa">Ticket médio</p>
          <b>{brl(ind.ticket)}</b>
          <small>por ordem de serviço fechada</small>
        </div>
        <div className="kpi">
          <p className="placa">OS abertas</p>
          <b>{String(ind.abertas).padStart(2, '0')}</b>
          <small>carro no box ou aguardando peça</small>
        </div>
        <div className="kpi">
          <p className="placa">Retornos a vencer</p>
          <b>{String(ind.retornos).padStart(2, '0')}</b>
          <small>{vencidos.length} já passaram do prazo</small>
        </div>
      </div>

      <div className="painel-grade">
        <div style={{ display: 'grid', gap: 16 }}>
          <section className="bloco">
            <div className="bloco-topo">
              <h2>Hoje na agenda</h2>
              <button className="cod" onClick={irParaAgenda} style={{ cursor: 'pointer' }}>
                ver a semana
              </button>
            </div>
            <div className="bloco-corpo">
              {agendaHoje.length === 0 ? (
                <div className="vazio">
                  <b>Nenhum horário marcado para hoje.</b>
                  Marque um na agenda e o box já aparece ocupado aqui.
                </div>
              ) : (
                agendaHoje.map((a) => (
                  <div className="linha linha-os" key={a.id}>
                    <span className="num">{horaCurta(a.inicio)}</span>
                    <span>
                      <span className="nome">{a.nome}</span>
                      <span className="fraco" style={{ display: 'block' }}>
                        {a.veiculo} · {a.placa}
                      </span>
                    </span>
                    <span className="cod">{a.servicos.join(' ')}</span>
                    <span className={`selo selo-${a.status === 'concluido' ? 'fechada' : a.status === 'faltou' ? 'vencido' : 'aberta'}`}>
                      {a.status === 'marcado' ? 'marcado' : a.status === 'chegou' ? 'no box' : a.status === 'concluido' ? 'pronto' : 'faltou'}
                    </span>
                    <span className="fraco">box {a.box}</span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="bloco">
            <div className="bloco-topo">
              <h2>Ordens abertas</h2>
              <span className="placa">{abertas.length} em andamento</span>
            </div>
            <div className="bloco-corpo">
              {abertas.length === 0 ? (
                <div className="vazio">
                  <b>Nenhuma OS aberta.</b>
                  Todo carro que entrou já saiu.
                </div>
              ) : (
                abertas.map((o) => {
                  const c = cliente(o.clienteId);
                  return (
                    <button className="linha linha-os" key={o.id} onClick={() => abrirRecibo(o.id)}>
                      <span className="num">OS {o.numero}</span>
                      <span>
                        <span className="nome">{c?.nome ?? 'cliente removido'}</span>
                        <span className="fraco" style={{ display: 'block' }}>
                          {c?.veiculo} · {c?.placa}
                        </span>
                      </span>
                      <span className="cod">{o.itens.map((i) => i.codigo).join(' ')}</span>
                      <span className="num">{brl(totalOS(o))}</span>
                      <ExternalLink size={14} style={{ color: 'rgba(255,255,255,.46)' }} />
                    </button>
                  );
                })
              )}
            </div>
          </section>
        </div>

        <section className="bloco">
          <div className="bloco-topo">
            <h2>Quem já devia ter voltado</h2>
            <BellRing size={15} style={{ color: 'rgba(255,255,255,.46)' }} />
          </div>
          <div className="bloco-corpo">
            {listaRetornos.length === 0 ? (
              <div className="vazio">
                <b>Ninguém em atraso.</b>
                Assim que uma OS fechar com serviço recorrente, o retorno aparece aqui.
              </div>
            ) : (
              listaRetornos.slice(0, 9).map((r) => (
                <a
                  className="linha linha-ret"
                  key={`${r.cliente.id}-${r.codigo}`}
                  href={`https://wa.me/55${r.cliente.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Olá, ${r.cliente.nome.split(' ')[0]}! Aqui é do Pomerode Auto Center. Pela última passagem do seu ${r.cliente.veiculo}, a ${r.servico.toLowerCase()} já está na hora. Quer que eu reserve um horário?`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    <span className="nome">{r.cliente.nome}</span>
                    <span className="fraco" style={{ display: 'block' }}>
                      {r.servico} · {kmFmt(r.kmPrevisto)}
                    </span>
                  </span>
                  <span className="cod">{r.codigo}</span>
                  <span className={`selo ${r.vencido ? 'selo-vencido' : 'selo-emdia'}`}>
                    {r.vencido ? 'vencido' : dataCurta(r.venceEm)}
                  </span>
                </a>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}

/* ==================================================================
   AGENDA — semana × três boxes
   ================================================================== */

function Agenda({
  base,
  semana,
  setSemana,
  abrirVaga,
  abrirCartao,
}) {
  const dias = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const d = new Date(semana);
        d.setDate(semana.getDate() + i);
        return d;
      }),
    [semana],
  );

  const hoje = new Date();
  const mover = (n) => {
    const d = new Date(semana);
    d.setDate(semana.getDate() + n * 7);
    setSemana(d);
  };

  const rotuloSemana = `${dias[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} a ${dias[5].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;

  const naSemana = base.agendamentos.filter((a) =>
    dias.some((d) => mesmoDia(a.inicio, d)),
  );

  return (
    <>
      <div className="agenda-topo">
        <div className="agenda-nav">
          <button onClick={() => mover(-1)} aria-label="Semana anterior">
            <ChevronLeft size={16} />
          </button>
          <b>{rotuloSemana}</b>
          <button onClick={() => mover(1)} aria-label="Próxima semana">
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setSemana(segundaDaSemana(new Date()))}
            style={{ width: 'auto', padding: '0 12px', fontSize: '.82rem' }}
          >
            hoje
          </button>
        </div>
        <p className="placa">
          {naSemana.length} horários na semana <span>·</span> três boxes, 7h30 às 18h30
        </p>
      </div>

      <div className="agenda-rolagem">
        <div className="agenda">
          <div className="agenda-cab">
            <span>hora</span>
            <b style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.46)' }}>box 1·2·3</b>
          </div>
          {dias.map((d, i) => (
            <div className={`agenda-cab${mesmoDia(d.toISOString(), hoje) ? ' hoje' : ''}`} key={i}>
              <span>{DIAS_CURTOS[i]}</span>
              <b>{d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</b>
            </div>
          ))}

          <div className="agenda-horas">
            {SLOTS.map((s) => (
              <div className="agenda-hora" key={s}>
                {s.endsWith(':00') ? s : ''}
              </div>
            ))}
          </div>

          {dias.map((d, i) => {
            const doDia = naSemana.filter((a) => mesmoDia(a.inicio, d));
            return (
              <div className="agenda-col" key={i} style={{ height: SLOTS.length * ALTURA_SLOT }}>
                <div className="agenda-col-boxes">
                  {BOXES.map((b) => (
                    <div className="agenda-box" key={b}>
                      {SLOTS.map((s, j) => {
                        const [h, m] = s.split(':').map(Number);
                        const quando = new Date(d);
                        quando.setHours(h, m, 0, 0);
                        return (
                          <div
                            className="agenda-faixa"
                            key={s}
                            style={{ top: j * ALTURA_SLOT }}
                            onClick={() => abrirVaga(quando.toISOString(), b)}
                            title={`Marcar ${s} no box ${b}`}
                          />
                        );
                      })}

                      {doDia
                        .filter((a) => a.box === b)
                        .map((a) => {
                          const topo = px(minutosDoDia(a.inicio));
                          const alto = Math.max(26, (a.minutos / 30) * ALTURA_SLOT - 3);
                          return (
                            <button
                              className={`card-ag ${a.status}`}
                              key={a.id}
                              style={{ top: topo + 1, height: alto }}
                              onClick={() => abrirCartao(a.id)}
                            >
                              <b>{a.nome || 'sem nome'}</b>
                              <span>
                                {horaCurta(a.inicio)} · {a.servicos.join(' ')}
                              </span>
                              {alto > 52 && <span>{a.placa}</span>}
                            </button>
                          );
                        })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="legenda">
        <span>
          <i style={{ background: '#4d90f0' }} /> marcado
        </span>
        <span>
          <i style={{ background: '#ffc46b' }} /> chegou, está no box
        </span>
        <span>
          <i style={{ background: '#74d69a' }} /> concluído
        </span>
        <span>
          <i style={{ background: '#ff8f90' }} /> não apareceu
        </span>
        <span>Clique numa faixa vazia para marcar naquele box e horário.</span>
      </div>
    </>
  );
}

/* ==================================================================
   CLIENTES
   ================================================================== */

function Clientes({
  base,
  busca,
  setBusca,
  cliente,
}) {
  void cliente;
  const termo = busca.trim().toLowerCase();
  const lista = base.clientes.filter(
    (c) =>
      !termo ||
      c.nome.toLowerCase().includes(termo) ||
      c.placa.toLowerCase().includes(termo) ||
      c.veiculo.toLowerCase().includes(termo) ||
      c.telefone.includes(termo),
  );

  return (
    <section className="bloco">
      <div className="bloco-topo">
        <h2>{lista.length} de {base.clientes.length} clientes</h2>
        <label className="busca">
          <Search />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Nome, placa ou telefone"
          />
        </label>
      </div>
      <div className="bloco-corpo">
        {lista.length === 0 ? (
          <div className="vazio">
            <b>Nada com esse termo.</b>
            Tente só as três primeiras letras da placa.
          </div>
        ) : (
          lista.map((c) => {
            const visitas = base.ordens.filter((o) => o.clienteId === c.id);
            const gasto = visitas.filter((o) => o.status === 'fechada').reduce((s, o) => s + totalOS(o), 0);
            return (
              <div className="linha linha-cli" key={c.id}>
                <span>
                  <span className="nome">{c.nome}</span>
                  <span className="fraco" style={{ display: 'block' }}>
                    {c.veiculo}
                  </span>
                </span>
                <span className="num">{c.placa}</span>
                <span className="fraco">{c.telefone}</span>
                <span>
                  <span className="num">{brl(gasto)}</span>
                  <span className="fraco" style={{ display: 'block' }}>
                    {visitas.length} visita{visitas.length === 1 ? '' : 's'} · {kmFmt(c.km)}
                  </span>
                </span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

/* ==================================================================
   ORDENS DE SERVIÇO
   ================================================================== */

function Ordens({
  base,
  busca,
  setBusca,
  cliente,
  gravar,
  abrirRecibo,
}) {
  const [filtro, setFiltro] = useState('todas');
  const termo = busca.trim().toLowerCase();

  const lista = base.ordens
    .filter((o) => filtro === 'todas' || o.status === filtro)
    .filter((o) => {
      if (!termo) return true;
      const c = cliente(o.clienteId);
      return (
        String(o.numero).includes(termo) ||
        (c?.nome.toLowerCase().includes(termo) ?? false) ||
        (c?.placa.toLowerCase().includes(termo) ?? false) ||
        o.itens.some((i) => i.codigo.toLowerCase().includes(termo))
      );
    })
    .sort((a, b) => b.numero - a.numero);

  const fechar = (o) => {
    gravar({
      ...base,
      ordens: base.ordens.map((x) =>
        x.id === o.id ? { ...x, status: 'fechada', fechadoEm: new Date().toISOString() } : x,
      ),
    });
  };

  return (
    <section className="bloco">
      <div className="bloco-topo">
        <div style={{ display: 'flex', gap: 6 }}>
          {(['todas', 'aberta', 'fechada']).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`selo ${filtro === f ? 'selo-fechada' : 'selo-emdia'}`}
              style={{ cursor: 'pointer' }}
            >
              {f}
            </button>
          ))}
        </div>
        <label className="busca">
          <Search />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Número, cliente, placa ou código"
          />
        </label>
      </div>

      <div className="bloco-corpo">
        {lista.length === 0 ? (
          <div className="vazio">
            <b>Nenhuma OS nesse filtro.</b>
            Abra uma pelo botão no topo.
          </div>
        ) : (
          lista.map((o) => {
            const c = cliente(o.clienteId);
            return (
              <div className="linha linha-os" key={o.id}>
                <span>
                  <span className="num">OS {o.numero}</span>
                  <span className="fraco" style={{ display: 'block' }}>
                    {dataCurta(o.criadoEm)}
                  </span>
                </span>
                <span>
                  <span className="nome">{c?.nome ?? 'cliente removido'}</span>
                  <span className="fraco" style={{ display: 'block' }}>
                    {o.itens.map((i) => `${i.codigo}${i.qtd > 1 ? `×${i.qtd}` : ''}`).join(' · ')}
                  </span>
                </span>
                <span className={`selo selo-${o.status}`}>{o.status}</span>
                <span className="num">{brl(totalOS(o))}</span>
                <span style={{ display: 'flex', gap: 4 }}>
                  <button
                    className="fechar"
                    onClick={() => abrirRecibo(o.id)}
                    title="Ver e imprimir o recibo"
                  >
                    <Printer size={15} />
                  </button>
                  {o.status === 'aberta' && (
                    <button className="fechar" onClick={() => fechar(o)} title="Fechar a OS">
                      <Check size={15} />
                    </button>
                  )}
                </span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

/* ==================================================================
   FISCAL — a ponte com o Easy-NFe
   ================================================================== */

function Fiscal({
  base,
  gravar,
  cliente,
}) {
  const [cfg, setCfg] = useState(base.fiscal);
  const [estado, setEstado] = useState({
    tipo: 'nada',
    texto: 'Ainda não testado nesta sessão.',
  });
  const [ocupado, setOcupado] = useState(false);
  const [produtos, setProdutos] = useState([]);

  const salvarCfg = (proximo) => {
    setCfg(proximo);
    gravar({ ...base, fiscal: proximo });
  };

  const testar = async () => {
    setOcupado(true);
    const r = await conferir(cfg);
    setEstado(
      r.ok
        ? { tipo: 'ok', texto: `Conectado. Empresa ${r.empresaId.slice(0, 8)}… respondendo na ${r.versao}.` }
        : { tipo: 'ruim', texto: r.erro },
    );
    setOcupado(false);
  };

  const importar = async () => {
    setOcupado(true);
    try {
      const p = await baixarProdutos(cfg);
      setProdutos(p);
      setEstado({ tipo: 'ok', texto: `${p.length} produtos vieram do catálogo da empresa.` });
    } catch (e) {
      setEstado({ tipo: 'ruim', texto: e instanceof Error ? e.message : String(e) });
    }
    setOcupado(false);
  };

  const fechadasSemNota = base.ordens.filter(
    (o) => o.status === 'fechada' && !base.notas.some((n) => n.osNumero === o.numero && n.status === 'autorizada'),
  );

  const emitir = async (o) => {
    const c = cliente(o.clienteId);
    if (!c) return;
    setOcupado(true);

    /* O Easy-NFe identifica o tomador pelo id dele lá dentro. Enquanto
       não houver cadastro casado, mandamos a placa como referência —
       o erro de volta diz exatamente o que falta. */
    const pedido = montarPedido(cfg, o, c, c.id);
    const r = await emitirNfse(cfg, pedido);

    const nota = r.ok
      ? {
          id: novoId(),
          osNumero: o.numero,
          cliente: c.nome,
          valor: totalOS(o),
          numero: r.numero,
          chave: r.chave,
          status: 'autorizada',
          mensagem: 'Autorizada pela SEFAZ.',
          em: new Date().toISOString(),
        }
      : {
          id: novoId(),
          osNumero: o.numero,
          cliente: c.nome,
          valor: totalOS(o),
          numero: null,
          chave: null,
          status: r.fila ? 'fila' : 'erro',
          mensagem: r.erro,
          em: new Date().toISOString(),
        };

    gravar({ ...base, notas: [nota, ...base.notas] });
    setEstado(r.ok ? { tipo: 'ok', texto: `NFS-e ${r.numero} autorizada.` } : { tipo: 'ruim', texto: r.erro });
    setOcupado(false);
  };

  return (
    <div className="painel-grade">
      <div style={{ display: 'grid', gap: 16 }}>
        <section className="bloco">
          <div className="bloco-topo">
            <h2>Conexão com o Easy-NFe</h2>
            <span className="placa">API key da empresa</span>
          </div>
          <div className="bloco-corpo" style={{ padding: 18, display: 'grid', gap: 14 }}>
            <div className={`fiscal-estado ${estado.tipo === 'ok' ? 'ok' : estado.tipo === 'ruim' ? 'ruim' : ''}`}>
              {estado.tipo === 'ok' ? <Check /> : estado.tipo === 'ruim' ? <AlertTriangle /> : <Link2 />}
              {estado.texto}
            </div>

            <label className="campo">
              <span>Endereço do Easy-NFe</span>
              <input
                value={cfg.baseUrl}
                onChange={(e) => salvarCfg({ ...cfg, baseUrl: e.target.value })}
                placeholder="https://easy-nfe.vercel.app"
              />
            </label>

            <label className="campo">
              <span>API key</span>
              <input
                value={cfg.apiKey}
                onChange={(e) => salvarCfg({ ...cfg, apiKey: e.target.value })}
                placeholder="enfe_live_..."
                type="password"
              />
            </label>

            <div className="grade2">
              <label className="campo">
                <span>Código de tributação (cTribNac)</span>
                <input value={cfg.cTribNac} onChange={(e) => salvarCfg({ ...cfg, cTribNac: e.target.value })} inputMode="numeric" />
              </label>
              <label className="campo">
                <span>cNBS</span>
                <input value={cfg.cNBS} onChange={(e) => salvarCfg({ ...cfg, cNBS: e.target.value })} inputMode="numeric" />
              </label>
              <label className="campo">
                <span>Alíquota de ISS (%)</span>
                <input
                  value={cfg.aliqISS}
                  onChange={(e) => salvarCfg({ ...cfg, aliqISS: Number(e.target.value) || 0 })}
                  inputMode="numeric"
                />
              </label>
              <label className="campo">
                <span>Município (IBGE)</span>
                <input value={cfg.municipio} onChange={(e) => salvarCfg({ ...cfg, municipio: e.target.value })} inputMode="numeric" />
              </label>
            </div>

            <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={testar} disabled={ocupado}>
                <Link2 />
                Testar conexão
              </button>
              <button className="btn btn-ghost-dark" onClick={importar} disabled={ocupado}>
                <Download />
                Trazer catálogo
              </button>
            </div>

            <div className="aviso">
              <AlertTriangle />
              <div>
                Hoje o Easy-NFe publica <code>GET /v1</code> e <code>GET /v1/produtos</code>. A emissão
                existe lá dentro, mas ainda sem rota pública: enquanto{' '}
                <code>POST /v1/notas-servico</code> não subir, a nota fica em fila aqui, com o motivo
                escrito, e sai sem retrabalho depois.
              </div>
            </div>

            {produtos.length > 0 && (
              <div style={{ display: 'grid', gap: 4 }}>
                <p className="placa">Catálogo trazido</p>
                {produtos.slice(0, 6).map((p) => (
                  <div className="linha linha-cli" key={p.id}>
                    <span className="nome">{p.nome}</span>
                    <span className="cod">{p.codigo}</span>
                    <span className="fraco">{p.unidade}</span>
                    <span className="num">{brl(p.preco)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bloco">
          <div className="bloco-topo">
            <h2>Notas emitidas</h2>
            <span className="placa">{base.notas.length} no histórico</span>
          </div>
          <div className="bloco-corpo">
            {base.notas.length === 0 ? (
              <div className="vazio">
                <b>Nenhuma nota ainda.</b>
                Feche uma OS e emita ao lado; o retorno da SEFAZ aparece aqui.
              </div>
            ) : (
              base.notas.map((n) => (
                <div className="linha linha-nota" key={n.id}>
                  <span className="num">OS {n.osNumero}</span>
                  <span>
                    <span className="nome">{n.cliente}</span>
                    <span className="fraco" style={{ display: 'block' }}>
                      {n.mensagem}
                    </span>
                  </span>
                  <span
                    className={`selo selo-${n.status === 'autorizada' ? 'fechada' : n.status === 'fila' ? 'aberta' : 'vencido'}`}
                  >
                    {n.status}
                  </span>
                  <span className="num">{brl(n.valor)}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="bloco">
        <div className="bloco-topo">
          <h2>Fechadas sem nota</h2>
          <span className="placa">{fechadasSemNota.length} pendentes</span>
        </div>
        <div className="bloco-corpo">
          {fechadasSemNota.length === 0 ? (
            <div className="vazio">
              <b>Tudo com nota.</b>
              Nenhuma OS fechada sem NFS-e emitida.
            </div>
          ) : (
            fechadasSemNota.map((o) => {
              const c = cliente(o.clienteId);
              return (
                <div className="linha linha-ret" key={o.id}>
                  <span>
                    <span className="nome">{c?.nome ?? '—'}</span>
                    <span className="fraco" style={{ display: 'block' }}>
                      OS {o.numero} · {brl(totalOS(o))}
                    </span>
                  </span>
                  <span className="cod">{o.itens.map((i) => i.codigo).join(' ')}</span>
                  <button
                    className="selo selo-emdia"
                    style={{ cursor: 'pointer' }}
                    disabled={ocupado}
                    onClick={() => emitir(o)}
                  >
                    emitir
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

/* ==================================================================
   JANELAS
   ================================================================== */

function Moldura({
  titulo,
  legenda,
  fechar,
  children,
  pe,
  largura,
}) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && fechar();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [fechar]);

  return (
    <div className="veu" onClick={(e) => e.target === e.currentTarget && fechar()}>
      <div className="janela" style={largura ? { width: `min(${largura}px, 100%)` } : undefined}>
        <div className="janela-topo">
          <div>
            {legenda && <p className="placa">{legenda}</p>}
            <h2>{titulo}</h2>
          </div>
          <button className="fechar" onClick={fechar} aria-label="Fechar">
            <X size={17} />
          </button>
        </div>
        <div className="janela-corpo">{children}</div>
        {pe && <div className="janela-pe">{pe}</div>}
      </div>
    </div>
  );
}

function JanelaCliente({
  base,
  gravar,
  fechar,
}) {
  const [f, setF] = useState({ nome: '', telefone: '', veiculo: '', placa: '', km: '' });
  const valido = f.nome.trim() && f.placa.trim();

  const salvarCliente = () => {
    if (!valido) return;
    const novo = {
      id: novoId(),
      nome: f.nome.trim(),
      telefone: f.telefone.trim(),
      veiculo: f.veiculo.trim(),
      placa: f.placa.trim().toUpperCase(),
      km: Number(f.km.replace(/\D/g, '')) || 0,
      criadoEm: new Date().toISOString(),
    };
    gravar({ ...base, clientes: [novo, ...base.clientes] });
    fechar();
  };

  return (
    <Moldura
      titulo="Novo cliente"
      legenda="Ficha"
      fechar={fechar}
      pe={
        <>
          <span className="placa">Nome e placa são o mínimo para achar depois.</span>
          <button className="btn btn-primary" onClick={salvarCliente} disabled={!valido}>
            <Check />
            Salvar ficha
          </button>
        </>
      }
    >
      <label className="campo">
        <span>Nome</span>
        <input value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} placeholder="Marina Hoffmann" />
      </label>
      <div className="grade2">
        <label className="campo">
          <span>Telefone</span>
          <input value={f.telefone} onChange={(e) => setF({ ...f, telefone: e.target.value })} placeholder="(47) 99999-0000" />
        </label>
        <label className="campo">
          <span>Placa</span>
          <input
            value={f.placa}
            onChange={(e) => setF({ ...f, placa: e.target.value.toUpperCase() })}
            placeholder="MHK4A21"
            style={{ fontFamily: 'var(--mono)' }}
          />
        </label>
      </div>
      <div className="grade2">
        <label className="campo">
          <span>Veículo</span>
          <input value={f.veiculo} onChange={(e) => setF({ ...f, veiculo: e.target.value })} placeholder="Chevrolet Onix 1.0 2021" />
        </label>
        <label className="campo">
          <span>Quilometragem</span>
          <input value={f.km} onChange={(e) => setF({ ...f, km: e.target.value })} inputMode="numeric" placeholder="62400" />
        </label>
      </div>
    </Moldura>
  );
}

function JanelaOS({
  base,
  gravar,
  agendamento,
  fechar,
  aoCriar,
}) {
  const [clienteId, setClienteId] = useState(agendamento?.clienteId ?? base.clientes[0]?.id ?? '');
  const [itens, setItens] = useState(() =>
    (agendamento?.servicos ?? []).flatMap((c) => {
      const s = SERVICOS.find((x) => x.codigo === c);
      return s ? [{ codigo: s.codigo, nome: s.nome, preco: s.preco, qtd: 1 }] : [];
    }),
  );
  const c = base.clientes.find((x) => x.id === clienteId) ?? null;
  const [km, setKm] = useState(String(c?.km ?? ''));
  const [mecanico, setMecanico] = useState(MECANICOS[0]);
  const [desconto, setDesconto] = useState('0');
  const [obs, setObs] = useState('');

  const alternar = (codigo) => {
    const s = SERVICOS.find((x) => x.codigo === codigo);
    setItens((atual) =>
      atual.some((i) => i.codigo === codigo)
        ? atual.filter((i) => i.codigo !== codigo)
        : [...atual, { codigo: s.codigo, nome: s.nome, preco: s.preco, qtd: 1 }],
    );
  };

  const mudarQtd = (codigo, delta) =>
    setItens((atual) =>
      atual.map((i) => (i.codigo === codigo ? { ...i, qtd: Math.max(1, i.qtd + delta) } : i)),
    );

  const sub = itens.reduce((s, i) => s + i.preco * i.qtd, 0);
  const desc = Number(desconto.replace(',', '.')) || 0;
  const total = Math.max(0, sub - desc);
  const valido = clienteId && itens.length > 0;

  const abrir = () => {
    if (!valido) return;
    const nova = {
      id: novoId(),
      numero: base.proximoNumero,
      clienteId,
      itens,
      km: Number(km.replace(/\D/g, '')) || 0,
      mecanico,
      obs,
      desconto: desc,
      status: 'aberta',
      criadoEm: new Date().toISOString(),
      fechadoEm: null,
    };

    gravar({
      ...base,
      ordens: [nova, ...base.ordens],
      proximoNumero: base.proximoNumero + 1,
      clientes: base.clientes.map((x) =>
        x.id === clienteId && nova.km > x.km ? { ...x, km: nova.km } : x,
      ),
      agendamentos: agendamento
        ? base.agendamentos.map((a) =>
            a.id === agendamento.id ? { ...a, status: 'chegou', osId: nova.id } : a,
          )
        : base.agendamentos,
    });
    aoCriar(nova.id);
  };

  return (
    <Moldura
      titulo={`Abrir OS ${base.proximoNumero}`}
      legenda={agendamento ? `A partir do horário de ${horaCurta(agendamento.inicio)}` : 'Ordem de serviço'}
      fechar={fechar}
      pe={
        <>
          <span className="num" style={{ fontSize: '1.1rem' }}>{brl(total)}</span>
          <button className="btn btn-primary" onClick={abrir} disabled={!valido}>
            <Check />
            Abrir e ver o recibo
          </button>
        </>
      }
    >
      <div className="grade2">
        <label className="campo">
          <span>Cliente</span>
          <select
            value={clienteId}
            onChange={(e) => {
              setClienteId(e.target.value);
              const alvo = base.clientes.find((x) => x.id === e.target.value);
              if (alvo) setKm(String(alvo.km));
            }}
          >
            {base.clientes.map((x) => (
              <option key={x.id} value={x.id}>
                {x.nome} — {x.placa}
              </option>
            ))}
          </select>
        </label>
        <label className="campo">
          <span>Quilometragem de entrada</span>
          <input value={km} onChange={(e) => setKm(e.target.value)} inputMode="numeric" />
        </label>
        <label className="campo">
          <span>Mecânico</span>
          <select value={mecanico} onChange={(e) => setMecanico(e.target.value)}>
            {MECANICOS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label className="campo">
          <span>Desconto em R$</span>
          <input value={desconto} onChange={(e) => setDesconto(e.target.value)} inputMode="numeric" />
        </label>
      </div>

      <div>
        <p className="placa" style={{ marginBottom: 9 }}>
          Serviços <span>—</span> clique para incluir
        </p>
        <div className="escolha">
          {SERVICOS.map((s) => {
            const marcado = itens.some((i) => i.codigo === s.codigo);
            return (
              <button
                key={s.codigo}
                className={`opcao${marcado ? ' marcada' : ''}`}
                onClick={() => alternar(s.codigo)}
              >
                <div className="opcao-topo">
                  <span className="cod">{s.codigo}</span>
                  <span className="num" style={{ fontSize: '.8rem' }}>{brl(s.preco)}</span>
                </div>
                <strong>{s.nome}</strong>
                <span className="fraco">{s.box} min · {s.unidade}</span>
              </button>
            );
          })}
        </div>
      </div>

      {itens.length > 0 && (
        <div className="carrinho">
          {itens.map((i) => (
            <div className="carrinho-linha" key={i.codigo}>
              <span className="cod">{i.codigo}</span>
              <span className="nome">{i.nome}</span>
              <span className="qtd">
                <button onClick={() => mudarQtd(i.codigo, -1)} aria-label="Menos um">
                  <Minus size={13} />
                </button>
                <span>{i.qtd}</span>
                <button onClick={() => mudarQtd(i.codigo, 1)} aria-label="Mais um">
                  <Plus size={13} />
                </button>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="num">{brl(i.preco * i.qtd)}</span>
                <button className="fechar" onClick={() => alternar(i.codigo)} aria-label="Tirar da OS">
                  <Trash2 size={14} />
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      <label className="campo">
        <span>Observações da entrada</span>
        <textarea
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          placeholder="O que o cliente relatou, no jeito dele. Ex.: barulho na lombada, só do lado direito."
        />
      </label>

      <div className="somatorio">
        <div>
          <span>Subtotal</span>
          <span className="num">{brl(sub)}</span>
        </div>
        <div>
          <span>Desconto</span>
          <span className="num">− {brl(desc)}</span>
        </div>
        <div className="total">
          <span>Total</span>
          <b>{brl(total)}</b>
        </div>
      </div>
    </Moldura>
  );
}

function JanelaAgendamento({
  base,
  gravar,
  inicio,
  box,
  fechar,
}) {
  const padrao = inicio ? new Date(inicio) : new Date();
  const [clienteId, setClienteId] = useState('');
  const [f, setF] = useState({
    nome: '',
    telefone: '',
    veiculo: '',
    placa: '',
    data: `${padrao.getFullYear()}-${String(padrao.getMonth() + 1).padStart(2, '0')}-${String(padrao.getDate()).padStart(2, '0')}`,
    hora: inicio ? horaCurta(inicio) : '08:00',
    box: String(box ?? 1),
    obs: '',
  });
  const [servicos, setServicos] = useState([]);

  const c = base.clientes.find((x) => x.id === clienteId) ?? null;
  const minutos = servicos.reduce((s, cod) => s + (SERVICOS.find((x) => x.codigo === cod)?.box ?? 30), 0);
  const valido = (clienteId || f.nome.trim()) && servicos.length > 0;

  const marcar = () => {
    if (!valido) return;
    const [ano, mes, dia] = f.data.split('-').map(Number);
    const [h, m] = f.hora.split(':').map(Number);
    const quando = new Date(ano, mes - 1, dia, h, m, 0, 0);

    const novo = {
      id: novoId(),
      clienteId: clienteId || null,
      nome: c?.nome ?? f.nome.trim(),
      telefone: c?.telefone ?? f.telefone.trim(),
      veiculo: c?.veiculo ?? f.veiculo.trim(),
      placa: (c?.placa ?? f.placa).toUpperCase(),
      servicos,
      inicio: quando.toISOString(),
      minutos: minutos || 30,
      box: Number(f.box),
      status: 'marcado',
      obs: f.obs,
      osId: null,
    };

    gravar({ ...base, agendamentos: [...base.agendamentos, novo] });
    fechar();
  };

  const fim = (() => {
    const [h, m] = f.hora.split(':').map(Number);
    const t = h * 60 + m + (minutos || 30);
    return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
  })();

  return (
    <Moldura
      titulo="Marcar horário"
      legenda={`Box ${f.box} · ${f.hora} às ${fim}`}
      fechar={fechar}
      pe={
        <>
          <span className="placa">
            {minutos ? `${minutos} minutos de box` : 'escolha ao menos um serviço'}
          </span>
          <button className="btn btn-primary" onClick={marcar} disabled={!valido}>
            <CalendarDays />
            Marcar
          </button>
        </>
      }
    >
      <label className="campo">
        <span>Cliente já cadastrado</span>
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
          <option value="">— cliente novo, digitar abaixo —</option>
          {base.clientes.map((x) => (
            <option key={x.id} value={x.id}>
              {x.nome} — {x.placa}
            </option>
          ))}
        </select>
      </label>

      {!clienteId && (
        <div className="grade2">
          <label className="campo">
            <span>Nome</span>
            <input value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} />
          </label>
          <label className="campo">
            <span>Telefone</span>
            <input value={f.telefone} onChange={(e) => setF({ ...f, telefone: e.target.value })} />
          </label>
          <label className="campo">
            <span>Veículo</span>
            <input value={f.veiculo} onChange={(e) => setF({ ...f, veiculo: e.target.value })} />
          </label>
          <label className="campo">
            <span>Placa</span>
            <input
              value={f.placa}
              onChange={(e) => setF({ ...f, placa: e.target.value.toUpperCase() })}
              style={{ fontFamily: 'var(--mono)' }}
            />
          </label>
        </div>
      )}

      <div className="grade2">
        <label className="campo">
          <span>Dia</span>
          <input type="date" value={f.data} onChange={(e) => setF({ ...f, data: e.target.value })} />
        </label>
        <label className="campo">
          <span>Hora</span>
          <select value={f.hora} onChange={(e) => setF({ ...f, hora: e.target.value })}>
            {SLOTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="campo">
          <span>Box</span>
          <select value={f.box} onChange={(e) => setF({ ...f, box: e.target.value })}>
            {BOXES.map((b) => (
              <option key={b} value={b}>
                Box {b}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <p className="placa" style={{ marginBottom: 9 }}>
          O que vai ser feito
        </p>
        <div className="escolha">
          {SERVICOS.map((s) => {
            const marcado = servicos.includes(s.codigo);
            return (
              <button
                key={s.codigo}
                className={`opcao${marcado ? ' marcada' : ''}`}
                onClick={() =>
                  setServicos((a) =>
                    a.includes(s.codigo) ? a.filter((x) => x !== s.codigo) : [...a, s.codigo],
                  )
                }
              >
                <div className="opcao-topo">
                  <span className="cod">{s.codigo}</span>
                  <span className="fraco">{s.box} min</span>
                </div>
                <strong>{s.nome}</strong>
              </button>
            );
          })}
        </div>
      </div>

      <label className="campo">
        <span>Recado para o box</span>
        <textarea value={f.obs} onChange={(e) => setF({ ...f, obs: e.target.value })} placeholder="Ex.: cliente espera na loja." />
      </label>
    </Moldura>
  );
}

function JanelaVerAgendamento({
  base,
  gravar,
  id,
  fechar,
  gerarOS,
}) {
  const a = base.agendamentos.find((x) => x.id === id);
  if (!a) return null;

  const mudarStatus = (status) =>
    gravar({
      ...base,
      agendamentos: base.agendamentos.map((x) => (x.id === id ? { ...x, status } : x)),
    });

  const apagar = () => {
    gravar({ ...base, agendamentos: base.agendamentos.filter((x) => x.id !== id) });
    fechar();
  };

  const zap = `https://wa.me/55${a.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Olá, ${a.nome.split(' ')[0]}! Confirmando o horário no Pomerode Auto Center: ${dataCurta(a.inicio)} às ${horaCurta(a.inicio)}, box ${a.box}. Até lá!`,
  )}`;

  return (
    <Moldura
      titulo={a.nome || 'Horário marcado'}
      legenda={`${dataCurta(a.inicio)} · ${horaCurta(a.inicio)} · box ${a.box}`}
      fechar={fechar}
      largura={560}
      pe={
        <>
          <button className="btn btn-ghost-dark" onClick={apagar}>
            <Trash2 />
            Desmarcar
          </button>
          <button className="btn btn-primary" onClick={() => gerarOS(a)}>
            <FileText />
            Abrir OS deste horário
          </button>
        </>
      }
    >
      <div className="somatorio">
        <div>
          <span>Veículo</span>
          <span className="num">{a.veiculo || '—'}</span>
        </div>
        <div>
          <span>Placa</span>
          <span className="num">{a.placa || '—'}</span>
        </div>
        <div>
          <span>Telefone</span>
          <span className="num">{a.telefone || '—'}</span>
        </div>
        <div>
          <span>Tempo reservado</span>
          <span className="num">{a.minutos} min</span>
        </div>
        <div className="total">
          <span>Serviços</span>
          <b>{a.servicos.join(' · ')}</b>
        </div>
      </div>

      {a.obs && (
        <div className="aviso">
          <AlertTriangle />
          <div>{a.obs}</div>
        </div>
      )}

      <div>
        <p className="placa" style={{ marginBottom: 9 }}>
          Situação
        </p>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {(['marcado', 'chegou', 'concluido', 'faltou']).map((s) => (
            <button
              key={s}
              onClick={() => mudarStatus(s)}
              className={`selo ${a.status === s ? 'selo-fechada' : 'selo-emdia'}`}
              style={{ cursor: 'pointer' }}
            >
              {s === 'chegou' ? 'no box' : s === 'concluido' ? 'concluído' : s}
            </button>
          ))}
        </div>
      </div>

      <a className="btn btn-ghost-dark" href={zap} target="_blank" rel="noreferrer" style={{ justifySelf: 'start' }}>
        Confirmar no WhatsApp
      </a>
    </Moldura>
  );
}

function JanelaRecibo({ base, id, fechar }) {
  const o = base.ordens.find((x) => x.id === id);
  const c = o ? base.clientes.find((x) => x.id === o.clienteId) : null;
  if (!o || !c) return null;

  const sub = subtotalOS(o);
  const total = totalOS(o);

  return (
    <Moldura
      titulo={`Recibo da OS ${o.numero}`}
      legenda="Documento do cliente"
      fechar={fechar}
      largura={860}
      pe={
        <>
          <span className="placa">Sai em A4, com a garantia impressa no rodapé.</span>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer />
            Imprimir
          </button>
        </>
      }
    >
      <div className="recibo">
        <div className="recibo-topo">
          <div className="recibo-marca">
            <Marca className="recibo-logo" />
            <span>{MARCA.razao}</span>
          </div>
          <div className="recibo-numero">
            <span>ordem de serviço</span>
            <b>{o.numero}</b>
            <span>{dataCurta(o.criadoEm)}</span>
          </div>
        </div>

        <div className="recibo-partes">
          <div className="recibo-parte">
            <span>Prestador</span>
            <p>
              <b>{MARCA.razao}</b>
            </p>
            <p>{MARCA.endereco}</p>
            <p>
              {MARCA.cidade} · {MARCA.cep}
            </p>
            <p>{MARCA.fixo}</p>
          </div>

          <div className="recibo-parte">
            <span>Cliente</span>
            <p>
              <b>{c.nome}</b>
            </p>
            <p>{c.telefone}</p>
            <p>{c.veiculo}</p>
          </div>

          <div className="recibo-parte">
            <span>Veículo</span>
            <p>
              Placa <b>{c.placa}</b>
            </p>
            <p>Entrada com {kmFmt(o.km)}</p>
            <p>Mecânico: {o.mecanico}</p>
            <p>Situação: {o.status === 'aberta' ? 'em execução' : 'concluída'}</p>
          </div>
        </div>

        <table className="recibo-tabela">
          <thead>
            <tr>
              <th className="mono">cód.</th>
              <th>Serviço</th>
              <th className="mono">qtd.</th>
              <th className="mono">unitário</th>
              <th className="mono">total</th>
            </tr>
          </thead>
          <tbody>
            {o.itens.map((i) => (
              <tr key={i.codigo}>
                <td className="mono">{i.codigo}</td>
                <td>{i.nome}</td>
                <td className="mono">{i.qtd}</td>
                <td className="mono">{brl(i.preco)}</td>
                <td className="mono">{brl(i.preco * i.qtd)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="recibo-total">
          <div>
            <span>Subtotal</span>
            <span>{brl(sub)}</span>
          </div>
          {o.desconto > 0 && (
            <div>
              <span>Desconto</span>
              <span>− {brl(o.desconto)}</span>
            </div>
          )}
          <div className="grande">
            <span>Total</span>
            <span>{brl(total)}</span>
          </div>
        </div>

        <div className="recibo-pe">
          {o.obs && (
            <p style={{ margin: 0 }}>
              <b>Relato da entrada:</b> {o.obs}
            </p>
          )}
          <p style={{ margin: 0 }}>
            <b>Garantia:</b> 90 dias sobre a mão de obra e o prazo do fabricante sobre a peça,
            contados da data de entrega. Guarde este recibo.
          </p>
          <p style={{ margin: 0 }}>
            Próxima manutenção recomendada:{' '}
            {o.itens
              .map((i) => SERVICOS.find((s) => s.codigo === i.codigo))
              .filter((s) => s && s.ciclo > 0)
              .map((s) => `${s.nome.toLowerCase()} em ${kmFmt(o.km + s.ciclo)}`)
              .join('; ') || 'sem serviço recorrente nesta ordem'}
            .
          </p>
        </div>

        <div className="recibo-assinaturas">
          <div className="recibo-assinatura">assinatura do cliente</div>
          <div className="recibo-assinatura">{MARCA.nome}</div>
        </div>
      </div>
    </Moldura>
  );
}
