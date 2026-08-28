import { TARJA } from '../dados.js';

/* A esteira do topo. Duas cópias da mesma lista para o laço fechar sem
   emenda: a animação anda -50% e recomeça exatamente onde estava. */
export default function Tarja() {
  return (
    <div className="tarja" aria-hidden="true">
      <div className="tarja-trilho">
        {[0, 1].map((n) => (
          <span key={n}>
            {TARJA.map((t) => (
              <b key={t}>
                {t}
                <i>//</i>
              </b>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
