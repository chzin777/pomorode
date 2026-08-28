/* ============================================================
   Conteúdo do Pomerode Auto Center.

   Endereço, telefone, horário e nota vieram da ficha do Google e do
   perfil da loja em ago/2026. Os códigos de serviço (TRO-OL, PNE-MO…)
   não são numeração decorativa: são a mesma chave que a bancada usa na
   ordem de serviço e imprime no recibo do cliente.
   ============================================================ */

export const MARCA = {
  nome: 'Pomerode Auto Center',
  razao: 'Pomerode Auto Center Serviços Ltda',
  slogan: 'seu carro merece',
  endereco: 'R. XV de Novembro, 964 — Centro',
  cidade: 'Pomerode, Santa Catarina',
  cep: '89107-000',
  fixo: '(47) 3387-2391',
  celular: '(47) 99717-5677',
  whatsapp: 'https://wa.me/5547997175677',
  instagram: 'https://instagram.com/pomerodeautocenter',
  arroba: '@pomerodeautocenter',
  maps: 'https://maps.google.com/?q=Pomerode+Auto+Center+R.+XV+de+Novembro+964+Pomerode',
};

export const PROVA = {
  nota: '4,9',
  avaliacoes: '1.304',
  anos: '20',
};

/* A tarja do topo fala como a oficina fala: minúscula, seca, com ponto
   final em cada afirmação. */
export const TARJA = [
  'troca de óleo em 40 minutos.',
  'orçamento por escrito, item por item.',
  'foto de cada peça trocada no seu whatsapp.',
  '4,9 no google em 1.304 avaliações.',
  'seu carro merece.',
];

export const MENU = [
  ['servicos', 'serviços'],
  ['box', 'como funciona'],
  ['prova', 'avaliações'],
  ['agendar', 'agendar'],
];

export const HORARIOS = [
  ['segunda a sexta', '7h30 às 18h30'],
  ['sábado', '7h30 às 12h'],
  ['domingo', 'fechado'],
];

export const SERVICOS = [
  {
    codigo: 'TRO-OL',
    nome: 'troca de óleo',
    resumo: 'óleo sintético e filtro, com o intervalo anotado para o próximo.',
    detalhe:
      'O óleo entra pela viscosidade que o fabricante do seu carro pede, não pelo que sobrou na prateleira. Sai daqui com a quilometragem da próxima troca escrita na ficha.',
    preco: 289.9,
    unidade: 'serviço',
    box: 40,
    ciclo: 10000,
  },
  {
    codigo: 'PNE-MO',
    nome: 'pneus e montagem',
    resumo: 'venda, montagem e descarte do usado, na mesma passada.',
    detalhe:
      'Montagem com máquina que não maltrata a roda, calibragem conferida e o pneu velho descartado por nós. Atendemos carro elétrico, que pesa mais e come pneu de outro jeito.',
    preco: 60,
    unidade: 'por pneu',
    box: 25,
    ciclo: 0,
  },
  {
    codigo: 'RDA-LL',
    nome: 'rodas de liga leve',
    resumo: 'aro novo, com prova no carro antes de fechar.',
    detalhe:
      'Catálogo de aro de liga leve com prova no seu carro antes de fechar negócio. Em até 10 vezes sem juros no cartão, montagem inclusa.',
    preco: 1890,
    unidade: 'jogo',
    box: 60,
    ciclo: 0,
  },
  {
    codigo: 'ALI-BA',
    nome: 'alinhamento e balanceamento',
    resumo: 'direção reta, volante centrado, pneu gastando por igual.',
    detalhe:
      'Se o carro puxa para um lado ou o volante treme acima dos 80, é aqui que resolve. Geometria das quatro rodas, com a leitura antes e depois impressa na ficha.',
    preco: 149.9,
    unidade: 'serviço',
    box: 45,
    ciclo: 10000,
  },
  {
    codigo: 'HIG-AR',
    nome: 'higienização do ar',
    resumo: 'tira o cheiro de mofo e o que estava respirando junto.',
    detalhe:
      'Limpeza da caixa evaporadora, troca do filtro de cabine e produto que mata fungo em vez de perfumar por cima. Sente diferença no primeiro dia de calor.',
    preco: 219.9,
    unidade: 'serviço',
    box: 50,
    ciclo: 20000,
  },
  {
    codigo: 'LAM-FA',
    nome: 'lâmpadas e faróis',
    resumo: 'troca, alinhamento do facho e polimento do farol amarelado.',
    detalhe:
      'Farol opaco tira metade do alcance à noite. Troca da lâmpada, alinhamento do facho e polimento da lente quando o plástico já amarelou.',
    preco: 89.9,
    unidade: 'par',
    box: 30,
    ciclo: 0,
  },
  {
    codigo: 'ADI-TV',
    nome: 'aditivos e fluidos',
    resumo: 'radiador, freio e limpeza de bico, no que o motor pede.',
    detalhe:
      'Aditivo de radiador na cor e na especificação do fabricante, fluido de freio dentro do prazo e limpeza de bico quando o motor falha em marcha lenta.',
    preco: 129.9,
    unidade: 'aplicação',
    box: 25,
    ciclo: 20000,
  },
  {
    codigo: 'REF-SU',
    nome: 'reforma de suspensão',
    resumo: 'amortecedor, batente e bandeja: o barulho some.',
    detalhe:
      'Estalo em lombada e carro que balança depois do quebra-molas é suspensão pedindo socorro. Conjunto completo trocado e o carro volta para o alinhamento antes de sair.',
    preco: 1450,
    unidade: 'eixo',
    box: 180,
    ciclo: 0,
  },
];

/* O caminho do carro dentro do box. É sequência de verdade, por isso
   ganha número; nada mais na página ganha. */
export const ETAPAS = [
  {
    n: '01',
    marca: '00:00',
    titulo: 'chegada',
    texto: 'Placa e quilometragem vão para a ficha. Você conta o que está sentindo, não o que acha que é.',
  },
  {
    n: '02',
    marca: '00:15',
    titulo: 'diagnóstico',
    texto: 'Checklist de 22 pontos antes de qualquer orçamento. Se não precisa trocar, a gente escreve que não precisa.',
  },
  {
    n: '03',
    marca: '00:30',
    titulo: 'orçamento',
    texto: 'Valor por item, com o código do serviço. Nada entra na conta sem o seu sim por escrito.',
  },
  {
    n: '04',
    marca: '01:00',
    titulo: 'box',
    texto: 'Peça na bancada, torque no padrão do fabricante e a foto do que foi trocado no seu WhatsApp.',
  },
  {
    n: '05',
    marca: '02:00',
    titulo: 'entrega',
    texto: 'Recibo com garantia e a data da próxima manutenção. No mês certo, a gente lembra você.',
  },
];

export const DEPOIMENTOS = [
  {
    nome: 'Douglas R. S.',
    quando: '26/08/2026',
    servico: 'PNE-MO',
    texto: 'Segunda vez que negociamos, super recomendo. Atendimento honesto e prazo cumprido à risca.',
  },
  {
    nome: 'Marina H.',
    quando: '11/07/2026',
    servico: 'REF-SU',
    texto: 'Levei achando que era a suspensão inteira e era só um batente. Poderiam ter vendido o pacote todo e não venderam.',
  },
  {
    nome: 'Cláudio B.',
    quando: '02/06/2026',
    servico: 'HIG-AR',
    texto: 'Higienizaram o ar do carro e o cheiro de mofo que eu convivia há dois anos simplesmente sumiu.',
  },
  {
    nome: 'Fernanda K.',
    quando: '19/05/2026',
    servico: 'TRO-OL',
    texto: 'Mandaram foto de cada peça trocada no WhatsApp. Nunca tinha visto oficina fazer isso.',
  },
  {
    nome: 'Rodrigo M.',
    quando: '28/03/2026',
    servico: 'RDA-LL',
    texto: 'Rodas de liga leve em 10x sem juros e montaram no mesmo dia. O carro ficou outro.',
  },
];

export const SISTEMA_PONTOS = [
  ['agenda dos três boxes', 'a semana numa tela, um elevador por coluna. buraco na grade é box livre de verdade.'],
  ['ficha do cliente', 'nome, veículo, placa e a quilometragem da última visita. a busca acha pela placa.'],
  ['ordem de serviço', 'escolhe pelo código, o valor soma sozinho e a OS nasce aberta até você fechar.'],
  ['recibo para imprimir', 'sai com a marca, os itens, o total e a garantia. uma tecla manda para a impressora.'],
  ['retorno de manutenção', 'pelo ciclo de cada serviço, mostra quem passou da hora de voltar, com a mensagem pronta.'],
  ['nota pelo easy-nfe', 'a OS fechada vira NFS-e sem redigitar nada, pela chave da empresa.'],
];

export const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
