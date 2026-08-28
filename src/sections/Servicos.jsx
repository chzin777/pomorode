import { useRef } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { gsap, useGSAP, prefersReduced } from '../lib/anim.js';
import Flutuantes, { useFlutuantes } from '../components/Flutuantes.jsx';
import { VITRINE, MARCA } from '../dados.js';

/* ============================================================
   SERVIÇOS — a lista de fachada.

   Seis linhas, no tamanho de placa. Eram catorze, uma para cada item
   que a loja publica no WhatsApp, e catorze viram um cardápio que
   ninguém lê até o fim. Agrupadas em famílias, nada saiu: cada resumo
   diz por extenso o que a família engloba.

   O que aparece à direita é TEMPO DE BOX, não preço: a tabela real
   muda por peça e por carro, e preço errado numa página vira discussão
   no balcão. Quem quer o número pede no WhatsApp e recebe na hora.

   O código à esquerda (TRO-OL, GEO-BA) não é enfeite: é a mesma chave
   que a bancada usa na ordem de serviço e imprime no recibo.
   ============================================================ */

/* As peças desta seção são as que ela vende: a bateria abre a lista, o
   óleo é o carro-chefe da casa. Ficam nas margens, onde o texto não
   passa, e apagadas onde passa. */
const PECAS = [
  { peca: 'bateria', x: '-6%', y: '4%', w: '20%', mov: 0.5, rot: -12, op: 0.52, bl: 0, balanca: 'a' },
  { peca: 'oleo', x: '86%', y: '30%', w: '15%', mov: 1.1, rot: 14, op: 0.66, bl: 0, balanca: 'b' },
];

export default function Servicos() {
  const raiz = useRef(null);
  useFlutuantes(raiz);

  useGSAP(
    () => {
      if (prefersReduced()) return;

      gsap.utils.toArray('.sv-item', raiz.current).forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'expo.out',
            delay: (i % 4) * 0.04,
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
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });
    },
    { scope: raiz },
  );

  return (
    <section className="secao faixa-clara" id="servicos" ref={raiz}>
      <Flutuantes pecas={PECAS} />

      <div className="dentro">
        <div className="sv-topo">
          <p className="rotulo surge">
            seis famílias <b>—</b> o código é o mesmo que sai no seu recibo
          </p>
          <h2 className="titulo surge">
            tudo que entra no box, e <em>quanto tempo</em> leva.
          </h2>
          <p className="texto surge">
            O tempo é o de box mesmo, medido aqui. O preço sai no orçamento, item por item.
          </p>
        </div>

        <div className="sv-lista">
          {VITRINE.map((s) => (
            <article className="sv-item" key={s.codigo} tabIndex={0}>
              <div className="sv-linha">
                <span className="sv-cod">{s.codigo}</span>
                <h3 className="sv-nome">{s.nome}</h3>
                <p className="sv-resumo">{s.resumo}</p>
                <p className="sv-preco">
                  <b>{s.box} min</b>
                  <span>de box</span>
                </p>
              </div>

            </article>
          ))}
        </div>

        <div className="sv-pe surge">
          <p className="texto">
            Não achou o seu caso? Manda a placa e o que está sentindo — a gente responde com o
            preço e o horário livre antes de você sair de casa.
          </p>
          <a className="btn" href={MARCA.whatsapp} target="_blank" rel="noreferrer">
            <MessageCircle />
            perguntar no whatsapp
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
