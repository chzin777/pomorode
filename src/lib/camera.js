/* ============================================================
   A câmera.

   Uma variável só — a posição em Z — dirigida pelo ScrollTrigger, lida
   por todo o resto da página. É o que evita seis animações independentes
   brigando pelo mesmo scroll, que é como esse tipo de página costuma
   quebrar.

   O CSS lê --cam (0 a 1, o progresso da travessia) e --cam-z (a posição
   em pixels). As partículas leem o mesmo valor pelo getCam().
   ============================================================ */

import { gsap, ScrollTrigger, prefersReduced } from './anim.js';

/* Profundidade total percorrida na página inteira, em pixels de
   perspectiva. Aumentar isto aprofunda a cena sem mexer em seção nenhuma. */
export const DEPTH = 2600;

const estado = { p: 0, z: 0, vel: 0 };

/** Leitura da câmera para quem desenha fora do CSS (canvas, por exemplo). */
export const getCam = () => estado;

/**
 * Liga a câmera à rolagem da página inteira.
 * Devolve a função de limpeza.
 */
export function montarCamera(alvo) {
  const doc = document.documentElement;

  if (prefersReduced()) {
    /* Sem movimento a cena não deixa de existir: ela fica no plano focal,
       nítida e legível, e a página vira um documento normal. */
    doc.style.setProperty('--cam', '0');
    doc.style.setProperty('--cam-z', '0px');
    return () => {};
  }

  let anterior = 0;

  const st = ScrollTrigger.create({
    trigger: alvo,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const p = self.progress;
      estado.p = p;
      estado.z = p * DEPTH;
      /* a velocidade alimenta o rastro das partículas: elas se alongam
         quando a câmera acelera, como num obturador lento */
      estado.vel = p - anterior;
      anterior = p;

      doc.style.setProperty('--cam', p.toFixed(4));
      doc.style.setProperty('--cam-z', `${estado.z.toFixed(1)}px`);
    },
  });

  return () => st.kill();
}

/**
 * Prende um elemento a uma profundidade e devolve o desfoque que ele deve
 * ter naquela distância do plano focal — a profundidade de campo.
 *
 * Chamado no CSS pelas custom properties, não aqui: esta função existe
 * para o canvas, que não tem cascata.
 */
export const desfoquePor = (z, foco = 0, forca = 0.012) =>
  Math.min(Math.abs(z - foco) * forca, 8);

/** Escala em perspectiva de um plano a uma distância z. */
export const escalaPor = (z, perspectiva = 1400) =>
  perspectiva / Math.max(perspectiva - z, 1);

export { gsap, ScrollTrigger };
