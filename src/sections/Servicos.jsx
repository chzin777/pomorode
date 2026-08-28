import { useRef } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { gsap, useGSAP, prefersReduced } from '../lib/anim.js';
import { SERVICOS, MARCA, brl } from '../dados.js';

/* ============================================================
   SERVIÇOS — a lista de fachada.

   Uma linha por serviço, no tamanho de placa. O detalhe abre no lugar,
   sem tirar a pessoa da lista e sem abrir janela.

   O código à esquerda (TRO-OL, PNE-MO) não é enfeite: é a mesma chave
   que a bancada usa na ordem de serviço e imprime no recibo. Quem
   recebe o papel reconhece a linha que leu aqui.
   ============================================================ */

export default function Servicos() {
  const raiz = useRef(null);

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
    <section className="secao faixa-clara" id="servicos" data-claro="1" ref={raiz}>
      <div className="dentro">
        <div className="sv-topo">
          <p className="rotulo surge">
            oito códigos <b>—</b> os mesmos que saem no seu recibo
          </p>
          <h2 className="titulo surge">
            o que entra no box, e <em>quanto custa</em> antes de você perguntar.
          </h2>
          <p className="texto surge">
            Preço de partida por serviço, publicado. O orçamento fechado sai depois do checklist,
            mas você chega sabendo a ordem de grandeza — e sem precisar ligar para descobrir.
          </p>
        </div>

        <div className="sv-lista">
          {SERVICOS.map((s) => (
            <article className="sv-item" key={s.codigo} tabIndex={0}>
              <div className="sv-linha">
                <span className="sv-cod">{s.codigo}</span>
                <h3 className="sv-nome">{s.nome}</h3>
                <p className="sv-resumo">{s.resumo}</p>
                <p className="sv-preco">
                  <b>{brl(s.preco)}</b>
                  <span>
                    {s.unidade} · {s.box} min de box
                  </span>
                </p>
              </div>

              <div className="sv-abre">
                <div>
                  <p>{s.detalhe}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="sv-pe surge">
          <p className="texto">
            Não achou o seu caso? Manda a placa e o que está sentindo — a gente responde com a
            faixa de preço antes de você sair de casa.
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
