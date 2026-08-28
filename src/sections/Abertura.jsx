import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, prefersReduced, pausarRolagem } from '../lib/anim.js';
import { Marca, Arco } from '../components/Marca.jsx';
import { MARCA } from '../dados.js';

/* ============================================================
   A ABERTURA — o elevador subindo.

   Duas chapas de aço que se afastam na vertical, com o arco do logo
   desenhando-se no meio antes de sair. Um fade abriria qualquer
   página; isto abre esta: a oficina levanta o carro, então a página
   levanta a chapa.

   O FECHAMENTO É UM RELÓGIO PRÓPRIO, não o onComplete da timeline.

   No StrictMode o React monta, a timeline nasce, a limpeza do useGSAP
   a mata, a segunda montagem sai no guarda e nenhuma timeline chega ao
   fim — a cortina nunca fechava, e a página inteira ficava travada
   atrás dela. Um setTimeout não depende de nada disso, e é a garantia
   certa para uma cortina: ela tem que sair mesmo que a animação falhe.
   ============================================================ */

/** quanto tempo o cartão fica na tela antes de a chapa começar a subir */
const ESPERA = 1.5;
/** quanto dura o afastamento das duas chapas */
const SAIDA = 1.05;

export default function Abertura({ aoFechar }) {
  const raiz = useRef(null);
  const tocou = useRef(false);
  const [saindo, setSaindo] = useState(false);
  const [fim, setFim] = useState(false);

  /* --- relógio 1: quando a chapa começa a sair --- */
  useEffect(() => {
    if (prefersReduced()) {
      setSaindo(true);
      setFim(true);
      aoFechar?.();
      return;
    }
    const t = setTimeout(() => setSaindo(true), ESPERA * 1000);
    return () => clearTimeout(t);
  }, [aoFechar]);

  /* --- relógio 2: quando ela deixa de existir --- */
  useEffect(() => {
    if (!saindo || fim) return;
    const t = setTimeout(() => {
      setFim(true);
      aoFechar?.();
    }, SAIDA * 1000);
    return () => clearTimeout(t);
  }, [saindo, fim, aoFechar]);

  /* --- a trava da rolagem, enquanto a cortina está na tela ---

     São duas travas e as duas são necessárias. `pausarRolagem` para o
     Lenis: `overflow: hidden` não o segura, porque ele não usa a
     rolagem nativa — aplica a posição por script, e a página descia por
     baixo da cortina. A classe no <html> segura o resto: gesto de
     toque, teclado, barra arrastada.

     O Lenis nasce no App, que monta junto com esta cortina, então a
     tentativa se repete por alguns quadros até a instância existir.

     `saindo` está nas dependências de propósito: quando a chapa começa
     a subir, a limpeza inteira roda. Liberar no começo da saída, e não
     no fim, é deliberado — ficar preso olhando a página já visível é
     pior do que rolar um pouco cedo. */
  useEffect(() => {
    if (prefersReduced() || saindo) return;
    const doc = document.documentElement;
    doc.classList.add('travado');

    let tentar = 0;
    const insistir = setInterval(() => {
      if (pausarRolagem(true) || ++tentar > 40) clearInterval(insistir);
    }, 50);

    const comer = (e) => e.preventDefault();
    window.addEventListener('wheel', comer, { passive: false });
    window.addEventListener('touchmove', comer, { passive: false });

    const barrar = (e) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', barrar, { passive: false });

    return () => {
      clearInterval(insistir);
      doc.classList.remove('travado');
      pausarRolagem(false);
      window.removeEventListener('wheel', comer);
      window.removeEventListener('touchmove', comer);
      window.removeEventListener('keydown', barrar);
    };
  }, [saindo]);

  /* --- a entrada do cartão. Só ela precisa do guarda: é a única que
         escreveria estilo inline em cima do estado final se uma
         timeline órfã da primeira montagem sobrevivesse. --- */
  useGSAP(() => {
    if (prefersReduced() || tocou.current) return;
    tocou.current = true;

    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .from('.ab-simbolo', { scale: 0.7, opacity: 0, duration: 0.7 }, 0)
      .from('.ab-nome', { y: 26, opacity: 0, duration: 0.8 }, 0.12)
      /* o arco se desenha: a assinatura da marca sendo escrita */
      .to('.ab-marca path', { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.2)
      .from('.ab-rot', { opacity: 0, duration: 0.6 }, 0.5);
  }, []);

  /* --- a saída. Depende de `saindo`, que muda depois do duplo
         monte do StrictMode: aqui roda uma vez só, sempre. --- */
  useGSAP(
    () => {
      if (!saindo || prefersReduced()) return;
      gsap
        .timeline({ defaults: { ease: 'expo.inOut', duration: SAIDA } })
        .to('.ab-centro', { opacity: 0, y: -18, duration: 0.45, ease: 'power2.in' }, 0)
        .to('.ab-chapa.cima', { yPercent: -100 }, 0.05)
        .to('.ab-chapa.baixo', { yPercent: 100 }, 0.05);
    },
    { dependencies: [saindo], scope: raiz },
  );

  return (
    <div className="abertura" ref={raiz} data-fim={fim ? '1' : '0'} aria-hidden="true">
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
