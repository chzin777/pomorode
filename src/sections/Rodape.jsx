import { Marca } from '../components/Marca.jsx';
import { MARCA } from '../dados.js';

export default function Rodape() {
  return (
    <footer className="rp">
      <div className="rp-dentro">
        <div className="rp-marca">
          <Marca className="rp-logo" escura />
          <p className="rotulo">
            {MARCA.razao} <b>·</b> {MARCA.cidade}
          </p>
        </div>
        <nav className="rp-links">
          <a href={MARCA.whatsapp} target="_blank" rel="noreferrer">
            whatsapp
          </a>
          <a href={MARCA.instagram} target="_blank" rel="noreferrer">
            instagram
          </a>
          <a href={MARCA.maps} target="_blank" rel="noreferrer">
            como chegar
          </a>
          <a href="/sistema.html">bancada</a>
        </nav>
      </div>
    </footer>
  );
}
