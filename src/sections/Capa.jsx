import { useRef } from 'react';
import { ArrowDown, ArrowRight, MessageCircle } from 'lucide-react';
import { gsap, useGSAP, prefersReduced } from '../lib/anim.js';
import Flutuantes, { useFlutuantes } from '../components/Flutuantes.jsx';
import { MARCA, PROVA } from '../dados.js';

/* ============================================================
   A CAPA — o portão abrindo.

   A cena começa como uma fresta no meio da tela e vai se abrindo até
   ocupar tudo, enquanto as duas metades do título se afastam para
   deixar a foto passar. A abertura é que conta a história: é o portão
   do box rolando para cima.

   A versão anterior tinha uma roda em 3D girando aqui. Ela custava
   cinco megabytes de modelo, um contexto WebGL rodando o tempo todo e
   uma biblioteca inteira no pacote — para mostrar uma peça que a foto
   da loja já mostra às dezenas, e melhor.

   O scroll é lido contra um trilho alto com a cena presa dentro dele,
   então nada sequestra a roda do mouse: teclado, trackpad e leitor de
   tela continuam rolando a página normalmente. Os botões ficam abaixo
   da abertura desde o primeiro quadro — ninguém precisa rolar para
   achar o WhatsApp.

   O recorte vai por custom property e não por `clip-path` inline
   porque quem escreve a variável é o ScrollTrigger, e assim o valor
   interpola em vez de saltar entre dois estados.
   ============================================================ */

/* as peças cruzam a fresta enquanto ela ainda está fechada */
const PECAS = [
  { peca: 'lampada', x: '4%', y: '12%', w: '11%', mov: 1.2, rot: 26, op: 0.85, balanca: 'b' },
  { peca: 'bateria', x: '80%', y: '64%', w: '17%', mov: 0.6, rot: 10, op: 0.8, balanca: 'a' },
  { peca: 'aditivo', x: '86%', y: '10%', w: '10%', mov: 1, rot: -14, op: 0.8, balanca: 'a' },
];

export default function Capa() {
  const raiz = useRef(null);
  const entrou = useRef(false);
  useFlutuantes(raiz, 14);

  useGSAP(
    () => {
      if (prefersReduced()) {
        /* sem movimento a fresta já nasce aberta: a foto é o conteúdo,
           não o prêmio por rolar */
        gsap.set('.cp-fixo', { '--abertura': 0 });
        return;
      }

      if (!entrou.current) {
        entrou.current = true;
        gsap
          .timeline({ delay: 1.55, defaults: { ease: 'power4.out' } })
          .from('.cp-linha i', { yPercent: 112, duration: 1, stagger: 0.08 })
          .from('.cp-sub, .cp-acoes, .cp-nota', { y: 18, opacity: 0, duration: 0.75, stagger: 0.08 }, 0.45)
          .from('.cp-pecas .fl', { opacity: 0, scale: 0.86, duration: 0.9, stagger: 0.08 }, 0.3);
      }

      /* ---- o portão ---- */
      const linha = gsap.timeline({
        scrollTrigger: {
          trigger: raiz.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });

      linha
        .to('.cp-fixo', { '--abertura': 0, duration: 0.7, ease: 'none' }, 0)
        .fromTo('.cp-foto', { scale: 1.14 }, { scale: 1, duration: 0.7, ease: 'none' }, 0)
        /* as metades do título se afastam para a foto passar entre elas */
        .to('.cp-l1', { xPercent: -30, duration: 0.7, ease: 'none' }, 0)
        .to('.cp-l2', { xPercent: 30, duration: 0.7, ease: 'none' }, 0)
        .to('.cp-veu', { opacity: 0.92, duration: 0.7, ease: 'none' }, 0)
        .to('.cp-sub, .cp-nota, .cp-desce', { opacity: 0, duration: 0.24, ease: 'none' }, 0.1)
        .to('.cp-banda', { yPercent: 12, duration: 1, ease: 'none' }, 0);
    },
    { scope: raiz },
  );

  return (
    <section className="cp" id="topo" ref={raiz}>
      <div className="cp-fixo">
        {/* a banda de rodagem lá no fundo, quase apagada */}
        <div className="cp-banda" aria-hidden="true" />
        <div className="cp-brasa" aria-hidden="true" />

        {/* o portão: a foto vive aqui dentro e o recorte a mantém fechada */}
        <div className="cp-portao">
          <div className="cp-foto" />
          <div className="cp-veu" aria-hidden="true" />
        </div>

        <div className="cp-corpo">
          <h1 className="cp-h1">
            <span className="cp-linha cp-l1">
              <i>seu carro merece</i>
            </span>
            <span className="cp-linha cp-l2">
              <i>você também</i>
            </span>
          </h1>

          <div className="cp-pe">
            <p className="cp-sub">
              Troca de óleo, pneu, geometria e bateria na XV de Novembro. Manda a placa no WhatsApp
              e a gente responde com o horário livre mais próximo.
            </p>

            <div className="cp-acoes">
              <a className="btn" href={MARCA.whatsapp} target="_blank" rel="noreferrer">
                <MessageCircle />
                agendar no whatsapp
              </a>
              <a className="btn ghost" href="#servicos">
                ver os serviços
                <ArrowRight />
              </a>
            </div>
          </div>

          <p className="cp-nota">
            <b>{PROVA.nota}</b>
            <span>
              {PROVA.avaliacoes} avaliações no Google · {MARCA.endereco}
            </span>
          </p>
        </div>

        <Flutuantes pecas={PECAS} className="cp-pecas" />

        <a className="cp-desce" href="#servicos" aria-label="ir para os serviços">
          <ArrowDown size={16} />
        </a>
      </div>
    </section>
  );
}
