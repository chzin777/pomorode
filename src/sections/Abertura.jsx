import { useRef } from 'react';
import { gsap, useGSAP, prefersReduced, pausarRolagem } from '../lib/anim.js';
import { Marca, Arco } from '../components/Marca.jsx';
import { MARCA } from '../dados.js';

/* ============================================================
   A ABERTURA — o elevador subindo.

   Duas chapas de aço que se afastam na vertical, com o arco do logo
   desenhando-se no meio antes de sair. Um fade abriria qualquer
   página; isto abre esta: a oficina levanta o carro, então a página
   levanta a chapa.

   A trava da rolagem tem que passar pelo Lenis, não só pelo CSS:
   `overflow: hidden` no documento NÃO segura o Lenis, que aplica a
   posição por script. Sem `pausarRolagem`, a página descia por baixo
   da cortina — que é exatamente o que a cortina existia para impedir.
   ============================================================ */

export default function Abertura({ aoFechar }) {
  const raiz = useRef(null);
  const rodou = useRef(false);

  useGSAP(
    () => {
      /* Sem movimento a cortina não existe: quem pediu menos animação
         não deve esperar dois segundos por uma. */
      if (prefersReduced()) {
        raiz.current?.setAttribute('data-fim', '1');
        aoFechar?.();
        return;
      }

      /* No StrictMode o React monta, limpa e monta de novo. Uma timeline
         órfã da primeira montagem terminaria escrevendo estilo inline em
         cima do estado final. */
      if (rodou.current) return;
      rodou.current = true;

      const doc = document.documentElement;
      doc.classList.add('travado');
      pausarRolagem(true);

      gsap
        .timeline({
          defaults: { ease: 'expo.inOut' },
          onComplete: () => {
            doc.classList.remove('travado');
            pausarRolagem(false);
            raiz.current?.setAttribute('data-fim', '1');
            aoFechar?.();
          },
        })
        .from('.ab-nome', { y: 26, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.15)
        .from('.ab-rot', { opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.45)
        /* o arco se desenha: é a assinatura da marca sendo escrita */
        .to('.ab-marca path', { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.2)
        .to('.ab-centro', { opacity: 0, y: -18, duration: 0.5, ease: 'power2.in' }, 1.35)
        .to('.ab-chapa.cima', { yPercent: -100, duration: 1.05 }, 1.4)
        .to('.ab-chapa.baixo', { yPercent: 100, duration: 1.05 }, 1.4);
    },
    { scope: raiz },
  );

  return (
    <div className="abertura" ref={raiz} data-fim="0" aria-hidden="true">
      <div className="ab-chapa cima" />
      <div className="ab-chapa baixo" />

      <div className="ab-centro">
        <Marca className="ab-simbolo" />
        <Arco className="ab-marca" />
        <p className="ab-nome">
          pomerode
          <br />
          auto center
        </p>
        <p className="ab-rot">{MARCA.cidade}</p>
      </div>
    </div>
  );
}
