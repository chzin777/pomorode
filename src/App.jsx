import { useCallback, useEffect, useRef, useState } from 'react';
import { useLenis, ScrollTrigger } from './lib/anim.js';
import Abertura from './sections/Abertura.jsx';
import Tarja from './sections/Tarja.jsx';
import Nav from './sections/Nav.jsx';
import Capa from './sections/Capa.jsx';
import Servicos from './sections/Servicos.jsx';
import Box from './sections/Box.jsx';
import Prova from './sections/Prova.jsx';
import Bancada from './sections/Bancada.jsx';
import Agendar from './sections/Agendar.jsx';
import Rodape from './sections/Rodape.jsx';
import { Zap } from './components/Marca.jsx';
import { MARCA } from './dados.js';

/* A ficha do Google: mesmo endereço, telefone e horário que estão na
   página, em formato que o buscador entende. Fica aqui e não no HTML
   porque os dados vêm de dados.js — um lugar só para editar. */
const ficha = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: MARCA.nome,
  legalName: MARCA.razao,
  telephone: '+554733872391',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'R. XV de Novembro, 964',
    addressLocality: 'Pomerode',
    addressRegion: 'SC',
    postalCode: MARCA.cep,
    addressCountry: 'BR',
  },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '1304' },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:30',
      closes: '18:30',
    },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '07:30', closes: '12:00' },
  ],
};

export default function App() {
  const raiz = useRef(null);
  const [pronto, setPronto] = useState(false);

  useLenis();

  /* A classe `js` só entra depois que o script rodou: os estados
     iniciais de entrada moram atrás dela, então sem script nada some. */
  useEffect(() => {
    document.documentElement.classList.add('js');
  }, []);

  /* Quando a cortina sai, o layout final é o real. Sem este refresh as
     seções presas ficam ancoradas na medida de antes. */
  const fechar = useCallback(() => {
    setPronto(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <div ref={raiz} data-pronto={pronto ? '1' : '0'}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ficha) }} />

      <Abertura aoFechar={fechar} />

      <a className="skip" href="#main">
        pular para o conteúdo
      </a>

      <Tarja />
      <Nav />

      <main id="main">
        <Capa />
        <Servicos />
        <Box />
        <Prova />
        <Bancada />
        <Agendar />
      </main>

      <Rodape />

      <a className="zap" href={MARCA.whatsapp} target="_blank" rel="noreferrer" aria-label="falar no whatsapp">
        <Zap />
      </a>
    </div>
  );
}
