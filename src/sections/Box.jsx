import { useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '../lib/anim.js';
import { Arco } from '../components/Marca.jsx';
import { ETAPAS, MARCA } from '../dados.js';

/* ============================================================
   O BOX — o caminho do carro.

   Faixa grafite: aqui a página desce para dentro da oficina. O título
   fica preso à esquerda enquanto as cinco etapas correm à direita, e o
   pino só existe no desktop — em tela estreita não há coluna para
   prender, e prender assim mesmo trava a rolagem.

   É a única coisa numerada da página, porque é a única que é ordem de
   verdade. Numerar seção por decoração é o vício que faz toda landing
   parecer a mesma.
   ============================================================ */

export default function Box() {
  const raiz = useRef(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;

      const mm = gsap.matchMedia();
      mm.add('(min-width: 1081px)', () => {
        ScrollTrigger.create({
          trigger: '.bx-grade',
          start: 'top 128px',
          end: 'bottom bottom',
          pin: '.bx-preso',
          pinSpacing: false,
        });
      });

      gsap.utils.toArray('.bx-etapa', raiz.current).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 48, scale: 0.975 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
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
    <section className="secao faixa-preta" id="box" data-escuro="1" ref={raiz}>
      <div className="dentro bx-grade">
        <div className="bx-preso">
          <p className="rotulo surge">
            da chegada à entrega <b>—</b> cerca de 2 horas
          </p>
          <h2 className="titulo surge">
            o caminho que o seu carro faz <em>aqui dentro</em>.
          </h2>
          <Arco className="bx-arco" />
          <p className="texto surge">
            Não existe etapa invisível. Você acompanha cada uma por mensagem, com foto, e aprova o
            valor antes de qualquer peça sair da caixa.
          </p>
          <a className="btn surge" href={MARCA.whatsapp} target="_blank" rel="noreferrer">
            <MessageCircle />
            marcar horário
          </a>
        </div>

        <ol className="bx-lista">
          {ETAPAS.map((e) => (
            <li className="bx-etapa" key={e.n}>
              <div className="bx-n">
                <b>{e.n}</b>
                <span>{e.marca}</span>
              </div>
              <div>
                <h3>{e.titulo}</h3>
                <p>{e.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
