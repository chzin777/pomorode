/* Os desenhos que voltam em várias seções. Ficam num arquivo só porque
   são a identidade — mudar o arco aqui muda a página inteira. */

/** O logotipo da loja, recortado do arquivo deles.

    Duas versões do mesmo desenho: a colorida para fundo claro e a de
    tinta branca para fundo escuro. Trocar por CSS (filter: invert)
    estragaria o vermelho e o amarelo junto com o preto, então são dois
    arquivos — o peso somado é menor que o de um ícone de fonte. */
export function Marca({ className, escura = false, alt = 'Pomerode Auto Center' }) {
  return (
    <img
      className={className}
      src={escura ? '/marca/logo-branca.webp' : '/marca/logo.webp'}
      alt={alt}
      width="505"
      height="215"
      decoding="async"
    />
  );
}

/** O arco sozinho, esticado na largura de quem o carrega. */
export function Arco({ className }) {
  return (
    <svg className={`arco ${className ?? ''}`} viewBox="0 0 200 30" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 27C14 10 52 3 100 3s86 7 96 24" />
    </svg>
  );
}

export function Estrelas({ n = 5 }) {
  return (
    <span className="pr-estrelas" aria-hidden="true">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24">
          <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z" />
        </svg>
      ))}
    </span>
  );
}

export function Zap() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2.1 22l5.35-1.37a9.83 9.83 0 004.59 1.15h.01c5.43 0 9.85-4.42 9.85-9.86 0-2.63-1.02-5.1-2.88-6.96A9.78 9.78 0 0012.04 2zm5.72 14.02c-.24.68-1.43 1.33-1.96 1.38-.5.05-.98.23-3.3-.7-2.79-1.11-4.55-3.98-4.69-4.16-.13-.18-1.11-1.49-1.11-2.84 0-1.35.7-2.02.95-2.29.25-.27.55-.34.73-.34.18 0 .37 0 .53.01.17.01.4-.06.62.48.24.55.8 1.9.87 2.04.07.14.12.3.02.48-.09.18-.14.29-.28.45-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.07.95 1.97 1.25 2.25 1.39.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.27.37-.23.62-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.32.07.12.07.66-.17 1.34z" />
    </svg>
  );
}
