import { useRef, useState } from 'react';
import { Menu, MessageCircle } from 'lucide-react';
import { ScrollTrigger, useGSAP } from '../lib/anim.js';
import { Marca } from '../components/Marca.jsx';
import { MARCA, MENU } from '../dados.js';

/* ============================================================
   A NAV.

   Uma pílula só, que troca de pele conforme a faixa por baixo. A
   página é clara na maior parte, então a barra nasce branca; cada
   seção escura se anuncia com data-escuro="1" e a barra inverte ao
   passar por ela — em vez de adivinhar a cor lendo o pixel, que é caro
   e erra em toda transição.
   ============================================================ */

export default function Nav() {
  const raiz = useRef(null);
  const [escuro, setEscuro] = useState(false);
  const [preso, setPreso] = useState(false);
  const [gaveta, setGaveta] = useState(false);

  useGSAP(() => {
    /* a tarja rola para fora; a partir dali a barra sobe para o topo */
    ScrollTrigger.create({
      start: 'top -40',
      onToggle: (self) => setPreso(self.isActive),
    });

    document.querySelectorAll('[data-escuro="1"]').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 76px',
        end: 'bottom 76px',
        onToggle: (self) => setEscuro(self.isActive),
      });
    });
  }, []);

  return (
    <>
      <header className="nav" ref={raiz} data-escuro={escuro ? '1' : '0'} data-preso={preso ? '1' : '0'}>
        {/* as duas versões vivem juntas e o CSS mostra a que combina com
            a faixa por baixo: alternar por estado faria a imagem recarregar
            toda vez que a barra trocasse de pele */}
        <a className="nv-marca" href="#topo" aria-label={MARCA.nome}>
          <Marca className="nv-logo nv-logo-clara" />
          <Marca className="nv-logo nv-logo-escura" escura alt="" />
        </a>

        <nav className="nv-links">
          {MENU.map(([id, rotulo]) => (
            <a key={id} href={`#${id}`}>
              {rotulo}
            </a>
          ))}
        </nav>

        <div className="nv-acoes">
          <a className="btn" href={MARCA.whatsapp} target="_blank" rel="noreferrer" aria-label="agendar no whatsapp">
            <MessageCircle />
            <span>agendar</span>
          </a>
          <button
            className="nv-burger"
            onClick={() => setGaveta((v) => !v)}
            aria-label="abrir menu"
            aria-expanded={gaveta}
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {gaveta && (
        <div className="nv-gaveta">
          {MENU.map(([id, rotulo]) => (
            <a key={id} href={`#${id}`} onClick={() => setGaveta(false)}>
              {rotulo}
            </a>
          ))}
          <a href="/sistema.html" onClick={() => setGaveta(false)}>
            abrir a bancada
          </a>
        </div>
      )}
    </>
  );
}
