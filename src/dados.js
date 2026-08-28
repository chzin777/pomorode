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

/* A lista é a que a própria loja publica no WhatsApp, na ordem em que
   eles contam. Nada aqui foi inventado: se não está na descrição
   deles, não está na página.

   `preco` é referência interna da bancada, para a ordem de serviço
   somar. A landing NÃO publica preço: a tabela real muda por peça e
   por carro, e número errado numa página vira discussão no balcão. */
export const SERVICOS = [
  {
    codigo: 'BAT-TR',
    nome: 'bateria',
    resumo: 'teste de carga na hora e troca com a marca certa para o seu carro.',
    detalhe:
      'Antes de vender bateria a gente mede a que está no carro: muita troca é alternador ou parasita de corrente, não bateria velha. Se for troca mesmo, a nova sai instalada e a antiga fica com a gente para descarte.',
    preco: 589,
    unidade: 'unidade',
    box: 20,
    ciclo: 0,
  },
  {
    codigo: 'TRO-OL',
    nome: 'troca de óleo',
    resumo: 'óleo e filtro na especificação do fabricante, com o próximo já anotado.',
    detalhe:
      'O óleo entra pela viscosidade que o manual do seu carro pede, não pelo que sobrou na prateleira. Sai daqui com a quilometragem da próxima troca escrita na ficha, e a gente lembra você no mês certo.',
    preco: 289.9,
    unidade: 'serviço',
    box: 40,
    ciclo: 10000,
  },
  {
    codigo: 'FIL-TR',
    nome: 'filtros',
    resumo: 'óleo, combustível, ar do motor e ar-condicionado.',
    detalhe:
      'Os quatro filtros do carro, trocados juntos ou separados. O de cabine é o que ninguém lembra e é o que você respira: quando ele satura, o ar sai fraco e com cheiro.',
    preco: 149.9,
    unidade: 'por filtro',
    box: 25,
    ciclo: 10000,
  },
  {
    codigo: 'HIG-AR',
    nome: 'higienização do ar-condicionado',
    resumo: 'tira o cheiro de mofo e o que estava respirando junto.',
    detalhe:
      'Limpeza da caixa evaporadora, troca do filtro de cabine e produto que mata fungo em vez de perfumar por cima. A diferença aparece no primeiro dia de calor.',
    preco: 219.9,
    unidade: 'serviço',
    box: 50,
    ciclo: 20000,
  },
  {
    codigo: 'LAM-FA',
    nome: 'lâmpadas',
    resumo: 'troca, alinhamento do facho e farol que voltou a iluminar.',
    detalhe:
      'Farol opaco tira metade do alcance à noite. Troca da lâmpada, alinhamento do facho e polimento da lente quando o plástico já amarelou.',
    preco: 89.9,
    unidade: 'par',
    box: 30,
    ciclo: 0,
  },
  {
    codigo: 'GEO-BA',
    nome: 'cambagem, geometria e balanceamento',
    resumo: 'direção reta, volante centrado, pneu gastando por igual.',
    detalhe:
      'Se o carro puxa para um lado ou o volante treme acima dos 80, é aqui que resolve. Cambagem e geometria das quatro rodas, balanceamento roda a roda, com a leitura antes e depois na ficha.',
    preco: 189.9,
    unidade: 'serviço',
    box: 45,
    ciclo: 10000,
  },
  {
    codigo: 'PNE-MO',
    nome: 'pneus',
    resumo: 'venda, montagem e descarte do usado, na mesma passada.',
    detalhe:
      'Montagem com máquina que não maltrata a roda, calibragem conferida e o pneu velho descartado por nós. Atendemos carro elétrico, que pesa mais e come pneu de outro jeito.',
    preco: 60,
    unidade: 'por pneu',
    box: 25,
    ciclo: 0,
  },
  {
    codigo: 'CAM-AR',
    nome: 'câmaras',
    resumo: 'câmara nova para quem ainda roda com ela.',
    detalhe:
      'Utilitário, implemento agrícola, carreta e roda antiga continuam pedindo câmara. Temos em estoque e trocamos na hora, sem encomendar de fora.',
    preco: 119.9,
    unidade: 'unidade',
    box: 25,
    ciclo: 0,
  },
  {
    codigo: 'PNE-CO',
    nome: 'consertos de pneus e rodas',
    resumo: 'furo, vazamento pelo aro e o pneu que amanhece murcho.',
    detalhe:
      'Nem todo pneu murcho é prego. Muitas vezes é o talão vazando pela borda da roda, e aí trocar o pneu não resolve nada. A gente acha onde está saindo antes de vender qualquer coisa.',
    preco: 60,
    unidade: 'por roda',
    box: 30,
    ciclo: 0,
  },
  {
    codigo: 'RDA-ES',
    nome: 'rodas esportivas',
    resumo: 'aro novo, com prova no carro antes de fechar.',
    detalhe:
      'Catálogo de roda esportiva com prova no seu carro antes de fechar negócio. Montagem e balanceamento entram no pacote, e o pneu que já era seu volta calibrado.',
    preco: 1890,
    unidade: 'jogo',
    box: 60,
    ciclo: 0,
  },
  {
    codigo: 'RDA-RF',
    nome: 'reforma de rodas',
    resumo: 'roda torta, raspada ou descascada volta redonda e pintada.',
    detalhe:
      'Desempeno da roda amassada no buraco, lixamento da borda raspada no meio-fio e pintura. Sai mais barato do que jogo novo, e o balanceamento depois é por nossa conta.',
    preco: 320,
    unidade: 'por roda',
    box: 90,
    ciclo: 0,
  },
  {
    codigo: 'RDA-SO',
    nome: 'solda de rodas',
    resumo: 'trinca na roda de liga fechada, não disfarçada.',
    detalhe:
      'Roda de liga trincada perde pressão devagar e ninguém descobre até a viagem. A solda é feita com a roda desmontada e testada com pressão antes de voltar para o carro.',
    preco: 260,
    unidade: 'por roda',
    box: 90,
    ciclo: 0,
  },
  {
    codigo: 'CAL-N2',
    nome: 'calibragem com nitrogênio',
    resumo: 'pressão que segura por mais tempo e esquenta menos na estrada.',
    detalhe:
      'Nitrogênio atravessa a borracha mais devagar que o ar comum, então a pressão cai menos entre uma calibragem e outra, e varia menos com o calor do asfalto. Faz diferença em quem roda em rodovia.',
    preco: 40,
    unidade: 'jogo',
    box: 15,
    ciclo: 10000,
  },
  {
    codigo: 'ADI-TV',
    nome: 'aditivos',
    resumo: 'radiador, freio e limpeza de bico, no que o motor pede.',
    detalhe:
      'Aditivo de radiador na cor e na especificação do fabricante, fluido de freio dentro do prazo e limpeza de bico quando o motor falha em marcha lenta.',
    preco: 129.9,
    unidade: 'aplicação',
    box: 25,
    ciclo: 20000,
  },
];

/* A LANDING não lista os catorze. Catorze linhas viram um cardápio que
   ninguém lê até o fim, e o cliente já chega sabendo o que quer.

   Aqui vão as seis famílias, e cada uma diz por extenso o que engloba —
   nada da lista da loja fica de fora, só deixa de ocupar uma linha
   própria. A tabela de catorze continua inteira em SERVICOS, que é a
   que a bancada usa na ordem de serviço e no recibo. */
export const VITRINE = [
  {
    codigo: 'TRO-OL',
    nome: 'óleo e filtros',
    resumo: 'óleo na especificação do manual, com os quatro filtros: óleo, combustível, ar do motor e cabine.',
    box: 40,
  },
  {
    codigo: 'PNE-MO',
    nome: 'pneus',
    resumo: 'venda e montagem, conserto de furo, câmaras e calibragem com nitrogênio.',
    box: 25,
  },
  {
    codigo: 'RDA-ES',
    nome: 'rodas',
    resumo: 'rodas esportivas, reforma da amassada, solda da trincada e desempeno.',
    box: 60,
  },
  {
    codigo: 'GEO-BA',
    nome: 'geometria',
    resumo: 'cambagem, alinhamento e balanceamento das quatro, com a leitura antes e depois.',
    box: 45,
  },
  {
    codigo: 'BAT-TR',
    nome: 'bateria e lâmpadas',
    resumo: 'teste de carga antes de vender bateria, troca de lâmpada e alinhamento do facho.',
    box: 20,
  },
  {
    codigo: 'HIG-AR',
    nome: 'ar-condicionado e aditivos',
    resumo: 'higienização da evaporadora, filtro de cabine, aditivo de radiador e fluido de freio.',
    box: 50,
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
    servico: 'GEO-BA',
    texto: 'Fui trocar os quatro pneus achando que era desgaste e era a geometria. Corrigiram e só cobraram o serviço.',
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
    servico: 'RDA-ES',
    texto: 'Rodas esportivas montadas e balanceadas no mesmo dia. O carro ficou outro.',
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
