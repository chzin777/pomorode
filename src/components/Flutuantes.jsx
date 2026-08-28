import { useEffect } from 'react';
import { gsap, prefersReduced } from '../lib/anim.js';

/* ============================================================
   AS PEÇAS FLUTUANTES

   O que passa pela oficina — bateria, lâmpada, pneu, aditivo, óleo —
   flutua pelo fundo da página em planos diferentes. Não é enfeite
   solto: cada seção carrega as peças de que ela fala, então a bateria
   aparece onde se fala de bateria.

   Duas regras que fazem isto funcionar em vez de virar sujeira:

   1. INVÓLUCRO POSICIONA, IMAGEM ANIMA. O wrapper recebe left/top,
      largura, rotação e balanço; o GSAP escreve transform só no <img>.
      Com posição e animação no mesmo elemento, o `translate` do CSS e o
      `transform` do GSAP disputam e a peça sai do lugar.

   2. PEÇA NUNCA DISPUTA COM TEXTO. Quem passa atrás de parágrafo vai
      apagada e desfocada; quem está na borda pode aparecer inteira.
      Isso é declarado peça a peça, não adivinhado.

   O paralaxe é um só por seção — um ScrollTrigger com scrub, lendo
   `data-mov` de cada peça. Seis animações independentes brigando pelo
   mesmo scroll é como esse tipo de página costuma quebrar.
   ============================================================ */

/** os arquivos, recortados com alpha */
export const PECA = {
  bateria: '/pecas/bateria.webp',
  lampada: '/pecas/lampada.webp',
  pneu: '/pecas/pneu.webp',
  aditivo: '/pecas/aditivo.webp',
  oleo: '/pecas/oleo.webp',
};

/**
 * Liga o paralaxe das peças que existem dentro de `raiz`.
 * Devolve nada: a limpeza é do próprio ScrollTrigger via contexto.
 *
 * @param {import('react').RefObject<HTMLElement>} raiz
 * @param {number} forca quanto a peça mais rápida percorre, em % da própria altura
 */
export function useFlutuantes(raiz, forca = 26) {
  useEffect(() => {
    const el = raiz.current;
    if (!el || prefersReduced()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.fl img', el).forEach((img) => {
        const mov = Number(img.dataset.mov) || 0.5;
        gsap.fromTo(
          img,
          { yPercent: -forca * mov },
          {
            yPercent: forca * mov,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6 + mov * 0.5,
            },
          },
        );
      });
    }, el);

    /* Nada de ScrollTrigger.refresh() aqui: com seis seções chamando o
       hook, era um recálculo de todos os gatilhos por seção montada. O
       refresh que importa é o único do App, quando a cortina sai. */
    return () => ctx.revert();
  }, [raiz, forca]);
}

/**
 * Desenha as peças de uma seção.
 *
 * Cada peça: { peca, x, y, w, mov, rot, op, bl, balanca }
 *   x, y  posição da borda superior esquerda, em % da seção
 *   w     largura em % da seção
 *   mov   fator de paralaxe, 0 a 1.4
 *   rot   inclinação em graus
 *   op    opacidade final
 *   bl    desfoque em px, para empurrar a peça para o fundo
 *   balanca  'a' | 'b' | undefined — qual gingado, se algum
 *   fica  a única que sobrevive no celular, onde não há fundo sobrando
 */
export default function Flutuantes({ pecas, className = '' }) {
  return (
    <div className={`flutuantes ${className}`} aria-hidden="true">
      {pecas.map((p, i) => (
        <span
          className={`fl${p.balanca ? ` fl-${p.balanca}` : ''}${p.fica ? ' fl-fica' : ''}`}
          key={`${p.peca}-${i}`}
          style={{
            left: p.x,
            top: p.y,
            '--w': p.w,
            '--rot': `${p.rot ?? 0}deg`,
            '--op': p.op ?? 0.3,
            '--bl': `${p.bl ?? 0}px`,
          }}
        >
          <img src={PECA[p.peca]} alt="" data-mov={p.mov ?? 0.5} loading="lazy" decoding="async" draggable={false} />
        </span>
      ))}
    </div>
  );
}
