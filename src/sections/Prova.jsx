import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReduced } from '../lib/anim.js';
import Flutuantes, { useFlutuantes } from '../components/Flutuantes.jsx';
import { Estrelas } from '../components/Marca.jsx';
import { DEPOIMENTOS, MARCA, PROVA } from '../dados.js';

/* ============================================================
   PROVA — o mural.

   A versão anterior dizia a nota três vezes: no rótulo, no título e
   num selo ao lado. Repetir número não é ênfase, é ruído — e os cinco
   cartões idênticos embaixo faziam a leitura poder começar por
   qualquer um, que é o mesmo que não ter começo.

   Agora a prova numérica fica sozinha numa coluna presa à esquerda,
   dita uma vez só, e as vozes correm à direita com a primeira em corpo
   grande: ela é a que a pessoa vai ler de fato, as outras confirmam.

   O fundo é a parede de rodas da loja. As vozes vêm em cartão branco
   opaco por causa dela: texto direto sobre foto é o jeito mais rápido
   de tornar um depoimento ilegível.
   ============================================================ */

const PECAS = [
  { peca: 'pneu', x: '-12%', y: '14%', w: '30%', mov: 0.45, rot: -6, op: 0.48, bl: 1, balanca: 'a' , fica: true},
  { peca: 'lampada', x: '92%', y: '4%', w: '12%', mov: 1.2, rot: 28, op: 0.63, bl: 0, balanca: 'b' },
];

export default function Prova() {
  const raiz = useRef(null);
  useFlutuantes(raiz);

  useGSAP(
    () => {
      if (prefersReduced()) return;

      gsap.utils.toArray('.pr-voz', raiz.current).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          },
        );
      });

      gsap.utils.toArray('.surge', raiz.current).forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        });
      });
    },
    { scope: raiz },
  );

  return (
    <section className="secao faixa-ceu" id="prova" ref={raiz}>
      <Flutuantes pecas={PECAS} />

      <div className="dentro pr-grade">
        {/* a prova numérica, dita uma vez */}
        <aside className="pr-nota surge">
          <b>{PROVA.nota}</b>
          <Estrelas />
          <p>
            {PROVA.avaliacoes} avaliações
            <br />
            no Google
          </p>
          <a className="btn ghost" href={MARCA.maps} target="_blank" rel="noreferrer">
            ler todas
            <ArrowUpRight />
          </a>
        </aside>

        <div className="pr-vozes">
          <h2 className="titulo surge pr-titulo">
            o que dizem depois de <em>sair do box</em>.
          </h2>

          {DEPOIMENTOS.map((d, i) => (
            <article className={`pr-voz${i === 0 ? ' pr-voz-lead' : ''}`} key={d.nome}>
              <blockquote>&ldquo;{d.texto}&rdquo;</blockquote>
              <div className="pr-pe">
                <div>
                  <b>{d.nome}</b>
                  <span>
                    {d.servico} · {d.quando}
                  </span>
                </div>
                <Estrelas />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
