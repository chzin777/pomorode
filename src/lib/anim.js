import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const EASE = 'power3.out';

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Scroll suave compartilhado pelas duas páginas.
 * Sem ele o `scrub` do ScrollTrigger fica granulado no trackpad.
 */
/* A instância viva do Lenis, guardada no módulo.

   Ela precisa ser alcançável de fora do hook porque `overflow: hidden` no
   documento NÃO segura o Lenis: ele não usa a rolagem nativa, aplica a
   posição por script. Travar só no CSS deixava a página descer durante a
   abertura, que é exatamente o que a trava existia para impedir.

   Módulo e não contexto: quem precisa disso é a cortina de abertura, que
   monta antes de qualquer provedor e não deveria depender de um. */
let lenisVivo = null;

/** Para ou retoma a rolagem suave. Devolve `false` se não há Lenis. */
export function pausarRolagem(pausar) {
  if (!lenisVivo) return false;
  pausar ? lenisVivo.stop() : lenisVivo.start();
  return true;
}

export function useLenis() {
  useEffect(() => {
    if (prefersReduced()) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisVivo = lenis;
    // gsap.ticker entrega segundos; lenis.raf espera milissegundos.
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    /* Âncoras também rolam suave.

       O Lenis suaviza a roda e o trackpad, mas um clique em href="#algo"
       é navegação do navegador: ele salta de uma vez. Numa página em que
       tudo o mais desliza, esse salto é o único movimento seco — e é
       justamente o que o menu faz o tempo todo.

       Um ouvinte só, no documento, em vez de um por link: os links do
       menu, do rodapé e das seções são muitos e nascem em momentos
       diferentes. */
    const clicou = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;

      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const alvo = document.querySelector(id);
      if (!alvo) return;

      e.preventDefault();
      /* a folga tira a barra fixa de cima do título de destino */
      lenis.scrollTo(alvo, { offset: -84, duration: 1.25 });
      /* a URL continua guardando onde a pessoa está, sem provocar o salto
         que o comportamento padrão faria */
      history.pushState(null, '', id);
    };

    document.addEventListener('click', clicou);

    return () => {
      document.removeEventListener('click', clicou);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisVivo = null;
    };
  }, []);
}

/**
 * Quebra o texto em spans por palavra e por caractere, preservando a quebra
 * de linha natural. Substitui o SplitText (que é do Club GSAP).
 */
export function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  el.setAttribute('aria-label', text);

  const chars = [];
  text.split(/(\s+)/).forEach((chunk) => {
    if (/^\s+$/.test(chunk)) {
      el.appendChild(document.createTextNode(' '));
      return;
    }
    const word = document.createElement('span');
    word.style.display = 'inline-block';
    word.style.whiteSpace = 'nowrap';
    word.setAttribute('aria-hidden', 'true');
    for (const ch of chunk) {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.textContent = ch;
      word.appendChild(span);
      chars.push(span);
    }
    el.appendChild(word);
  });
  return chars;
}

/** Espera as webfonts antes de medir/animar texto (evita reflow feio). */
export function whenFontsReady(cb) {
  if (typeof document === 'undefined') return;
  if (document.fonts?.status === 'loaded') cb();
  else document.fonts?.ready.then(cb) ?? cb();
}

/* Depois de uma troca de tema as medidas do ScrollTrigger ficam velhas
   (a View Transition mexe no layout durante o retrato). Sem este refresh
   as seções presas ficam ancoradas no lugar errado e a página trava. */
if (typeof window !== 'undefined') {
  window.addEventListener('theme:changed', () => ScrollTrigger.refresh());
}

export { gsap, ScrollTrigger, useGSAP };
