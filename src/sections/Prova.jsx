import { useRef } from 'react';
import { gsap, useGSAP, prefersReduced } from '../lib/anim.js';
import CurvedLoop from '../lib/rb/CurvedLoop.jsx';
import { Estrelas } from '../components/Marca.jsx';
import { DEPOIMENTOS, PROVA } from '../dados.js';

/* ============================================================
   PROVA — 1.304 avaliações, cinco delas em voz alta.

   Nota grande em cima porque 4,9 é o argumento; as cinco vozes embaixo
   porque nota sem frase é número solto. Cada uma leva o código do
   serviço, que amarra o depoimento à lista que a pessoa acabou de ler.
   ============================================================ */

export default function Prova() {
  const raiz = useRef(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;

      gsap.utils.toArray('.pr-voz', raiz.current).forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'expo.out',
            delay: (i % 3) * 0.06,
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
    <section className="secao faixa-azul" id="prova" ref={raiz}>
      <div className="dentro">
        <div className="pr-topo">
          <div>
            <p className="rotulo surge">
              google <b>—</b> {PROVA.nota} de 5
            </p>
            <h2 className="titulo surge" style={{ marginTop: 16 }}>
              cinco das <em>{PROVA.avaliacoes}</em>, na íntegra.
            </h2>
          </div>

          <div className="pr-selo surge">
            <b>{PROVA.nota}</b>
            <div>
              <Estrelas />
              <p className="rotulo" style={{ marginTop: 6 }}>
                {PROVA.avaliacoes} avaliações
              </p>
            </div>
          </div>
        </div>

        <div className="pr-vozes">
          {DEPOIMENTOS.map((d) => (
            <article className="pr-voz" key={d.nome}>
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

      {/* A curva passa por baixo das vozes com o slogan da loja. É
          decoração assumida, então fica em tinta quase transparente:
          quem lê, lê o depoimento; quem olha, vê a marca. */}
      <div className="pr-curva" aria-hidden="true">
        <CurvedLoop marqueeText="seu carro merece ◆ você merece ◆ " speed={1.4} curveAmount={260} interactive={false} />
      </div>
    </section>
  );
}
