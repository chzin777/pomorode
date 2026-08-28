import { useRef } from 'react';
import { ArrowUpRight, BellRing, CalendarDays, FileText, Link2, Receipt, Users } from 'lucide-react';
import { gsap, useGSAP, prefersReduced } from '../lib/anim.js';
import { SISTEMA_PONTOS } from '../dados.js';

/* ============================================================
   A BANCADA — o sistema por dentro.

   A landing vende para quem tem carro; esta seção vende para quem
   toca a oficina. Fica aqui, e não numa página à parte, porque o
   argumento é o mesmo: nada acontece sem registro.

   A tela desenhada é o próprio /sistema em miniatura, com dados
   plausíveis — e o botão leva para ele de verdade.
   ============================================================ */

const ICONE = [CalendarDays, Users, FileText, Receipt, BellRing, Link2];

export default function Bancada() {
  const raiz = useRef(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;

      gsap.fromTo(
        '.bc-tela',
        { rotateX: 15, y: 64, opacity: 0 },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 1.15,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.bc-tela', start: 'top 88%', once: true },
        },
      );

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
    <section className="secao faixa-clara" id="bancada" ref={raiz}>
      <div className="dentro bc-grade">
        <div>
          <p className="rotulo surge">a oficina por dentro</p>
          <h2 className="titulo surge" style={{ marginTop: 16 }}>
            a agenda dos boxes não vive num <em>caderno</em>.
          </h2>

          <div className="bc-pontos surge">
            {SISTEMA_PONTOS.map(([titulo, texto], i) => {
              const Icone = ICONE[i] ?? Users;
              return (
                <div className="bc-ponto" key={titulo}>
                  <Icone />
                  <div>
                    <b>{titulo}</b>
                    <p>{texto}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <a className="btn surge" href="/sistema.html">
            abrir a bancada
            <ArrowUpRight />
          </a>
        </div>

        <div className="bc-tela">
          <div className="bc-barra">
            <i />
            <i />
            <i />
            <span>pomerodeautocenter.com.br/sistema</span>
          </div>

          <div className="bc-corpo">
            <div className="bc-kpis">
              <div className="bc-kpi">
                <span>faturado no mês</span>
                <b>R$ 48.310</b>
              </div>
              <div className="bc-kpi">
                <span>horários hoje</span>
                <b>09</b>
              </div>
              <div className="bc-kpi">
                <span>retornos a vencer</span>
                <b>23</b>
              </div>
            </div>

            <div className="bc-linha">
              <code>08:00 · B1</code>
              <span>Marina H. · Onix 2021 · MHK4A21</span>
              <b>TRO-OL</b>
            </div>
            <div className="bc-linha">
              <code>09:30 · B2</code>
              <span>Rodrigo M. · Compass · QJD7B08</span>
              <b>RDA-ES</b>
            </div>
            <div className="bc-linha">
              <code>NFS-e</code>
              <span>OS 1118 enviada ao Easy-NFe</span>
              <b>autorizada</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
