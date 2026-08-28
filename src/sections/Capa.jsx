import { useRef } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { gsap, useGSAP, prefersReduced } from '../lib/anim.js';
import Roda from '../lib/Roda.jsx';
import { Arco, Estrelas } from '../components/Marca.jsx';
import { MARCA, PROVA } from '../dados.js';

/* ============================================================
   A CAPA — divisão.

   Metade chapada em azul, metade fosso de box. Texto sobre cor plana
   lê em qualquer tela; o objeto ganha cena própria em vez de ser
   recortado e jogado no vazio, que é como esse tipo de herói costuma
   sair errado.

   A roda é geometria, não foto: gira com a rolagem, inclina com o
   ponteiro e não custa um único quilobyte de imagem. Ela está dentro
   do arco — o gesto do logo virando moldura da cena.

   A entrada só pode rodar uma vez. O paralaxe e os ScrollTriggers
   ficam FORA do guarda: com tudo atrás do mesmo `if`, a segunda
   montagem do StrictMode sairia na primeira linha e os ouvintes,
   removidos pela limpeza da primeira, nunca voltariam.
   ============================================================ */

export default function Capa() {
  const raiz = useRef(null);
  const entrou = useRef(false);

  useGSAP(
    () => {
      if (prefersReduced()) return;

      if (!entrou.current) {
        entrou.current = true;
        gsap
          .timeline({ delay: 2.15, defaults: { ease: 'power4.out' } })
          .from('.cp-rot', { y: 14, opacity: 0, duration: 0.7 })
          /* cada linha do título sobe de dentro da própria janela */
          .from('.cp-linha i', { yPercent: 112, duration: 1, stagger: 0.07 }, 0.08)
          /* o arco cresce do centro. Desenhar traço exigiria o DrawSVG,
             que é do Club GSAP; escala a partir do meio dá o mesmo
             gesto sem plugin pago. */
          .from('.cp-arco', { scaleX: 0, opacity: 0, transformOrigin: '50% 100%', duration: 0.8 }, 0.7)
          .from('.cp-sub, .cp-acoes, .cp-prova', { y: 18, opacity: 0, duration: 0.75, stagger: 0.08 }, 0.5)
          .from('.cp-tag', { opacity: 0, y: 14, duration: 0.6, stagger: 0.1 }, 0.9);
      }

      /* --- ponteiro: a cena responde, o texto responde menos --- */
      const alvos = gsap.utils.toArray('[data-plano]', raiz.current).map((el) => ({
        el,
        f: Number(el.dataset.plano),
        x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 1.3, ease: 'power3.out' }),
      }));

      const mover = (e) => {
        const r = raiz.current.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        /* paralaxe convence por diferença entre planos, não por
           distância percorrida: 34px com fatores distintos lê mais
           fundo do que 130px com tudo voando */
        alvos.forEach((a) => {
          a.x(-dx * 34 * a.f);
          a.y(-dy * 18 * a.f);
        });
      };
      const sair = () => alvos.forEach((a) => (a.x(0), a.y(0)));

      const el = raiz.current;
      el.addEventListener('pointermove', mover);
      el.addEventListener('pointerleave', sair);

      /* --- rolagem: a mesma profundidade, no eixo vertical --- */
      gsap.to('.cp-piso', {
        yPercent: 24,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.cp-moldura', {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      gsap.fromTo(
        '.cp-texto',
        { y: 0, opacity: 1 },
        {
          y: 74,
          opacity: 0.08,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 },
        },
      );

      return () => {
        el?.removeEventListener('pointermove', mover);
        el?.removeEventListener('pointerleave', sair);
      };
    },
    { scope: raiz },
  );

  return (
    <section className="cp" id="topo" ref={raiz}>
      {/* ---------- metade chapada ---------- */}
      <div className="cp-texto" data-plano="0.35">
        <p className="cp-rot">
          <i aria-hidden="true" />
          {MARCA.cidade} · desde a primeira troca de óleo
        </p>

        <h1 className="cp-h1">
          <span className="cp-linha">
            <i>seu carro</i>
          </span>
          <span className="cp-linha">
            <i>
              <em>
                merece
                <Arco className="cp-arco" />
              </em>
              .
            </i>
          </span>
          <span className="cp-linha">
            <i>você também.</i>
          </span>
        </h1>

        <p className="cp-sub">
          Troca de óleo, pneu, alinhamento e suspensão na XV de Novembro. Cada peça trocada vai
          por foto no seu WhatsApp, e a próxima manutenção já sai agendada na saída do box.
        </p>

        <div className="cp-acoes">
          <a className="btn" href={MARCA.whatsapp} target="_blank" rel="noreferrer">
            <MessageCircle />
            pedir orçamento
          </a>
          <a className="btn ghost" href="#servicos">
            ver os serviços
            <ArrowRight />
          </a>
        </div>

        <div className="cp-prova">
          <span className="cp-nota">{PROVA.nota}</span>
          <div>
            <Estrelas />
            <p>{PROVA.avaliacoes} avaliações no google</p>
          </div>
        </div>
      </div>

      {/* ---------- metade fosso ---------- */}
      <div className="cp-cena">
        <div className="cp-piso" aria-hidden="true" />
        <Arco className="cp-moldura" />
        <Roda className="cp-roda" />

        <div className="cp-tag cp-tag-a" data-plano="1.1">
          <span>aro de liga leve</span>
          <b>até 10x sem juros</b>
        </div>
        <div className="cp-tag cp-tag-b" data-plano="0.8">
          <span>torque de fábrica</span>
          <b>110 N·m</b>
        </div>

        <p className="cp-role" aria-hidden="true">
          role
          <i />
        </p>
      </div>
    </section>
  );
}
