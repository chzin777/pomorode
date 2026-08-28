import { useRef } from 'react';
import { AtSign, Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { gsap, useGSAP, prefersReduced } from '../lib/anim.js';
import Flutuantes, { useFlutuantes } from '../components/Flutuantes.jsx';
import { HORARIOS, MARCA } from '../dados.js';

/* ============================================================
   AGENDAR — endereço, horário e o botão.

   O fim da página é a única coisa que a pessoa precisa levar: onde
   fica, quando abre e como falar. Sem formulário — a loja já atende no
   WhatsApp, e um formulário aqui só criaria uma caixa de entrada que
   ninguém abre.
   ============================================================ */

const PECAS = [
  { peca: 'aditivo', x: '-4%', y: '10%', w: '15%', mov: 0.9, rot: 12, op: 0.59, bl: 0, balanca: 'a' },
  { peca: 'lampada', x: '46%', y: '76%', w: '11%', mov: 1.3, rot: -24, op: 0.52, bl: 0, balanca: 'b' },
];

export default function Agendar() {
  const raiz = useRef(null);
  useFlutuantes(raiz);

  useGSAP(
    () => {
      if (prefersReduced()) return;
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
    <section className="secao faixa-gelo" id="agendar" ref={raiz}>
      <Flutuantes pecas={PECAS} />

      <div className="dentro ag-grade">
        <div>
          <p className="rotulo surge">onde estamos</p>
          <h2 className="titulo surge" style={{ marginTop: 0.9 }}>
            centro de pomerode, com <em>vaga no pátio</em>.
          </h2>

          <div className="ag-blocos surge">
            <div className="ag-bloco">
              <p className="rotulo">
                <MapPin size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                endereço
              </p>
              <p>
                <a href={MARCA.maps} target="_blank" rel="noreferrer">
                  {MARCA.endereco}
                  <br />
                  {MARCA.cidade} · {MARCA.cep}
                </a>
              </p>
            </div>

            <div className="ag-bloco">
              <p className="rotulo">
                <Phone size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                telefones
              </p>
              <p>
                <a href="tel:+554733872391">{MARCA.fixo}</a>
                <br />
                <a href={MARCA.whatsapp} target="_blank" rel="noreferrer">
                  {MARCA.celular} · whatsapp
                </a>
              </p>
            </div>

            <div className="ag-bloco">
              <p className="rotulo">
                <Clock size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                horários
              </p>
              <div>
                {HORARIOS.map(([dia, hora]) => (
                  <p className="ag-hora" key={dia}>
                    <span>{dia}</span>
                    <span>{hora}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ag-cartao surge">
          <p className="rotulo" style={{ color: 'rgba(255,255,255,.6)' }}>
            resposta no mesmo dia útil
          </p>
          <h3 className="subtitulo">manda a placa e o que está sentindo.</h3>
          <p className="texto">
            A gente responde com o horário livre mais próximo e a faixa de preço do serviço, antes
            de você sair de casa.
          </p>
          <div className="cp-acoes">
            <a className="btn branco" href={MARCA.whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle />
              falar no whatsapp
            </a>
            <a className="btn ghost" href={MARCA.instagram} target="_blank" rel="noreferrer">
              <AtSign />
              {MARCA.arroba}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
