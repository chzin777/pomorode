/* Aleatório determinístico.

   Partícula posicionada com Math.random() no corpo do componente muda de
   lugar a cada render — e num React com StrictMode isso acontece logo na
   montagem. Com semente, a mesma partícula cai sempre no mesmo lugar, o
   que também deixa a cena reproduzível quando for preciso ajustar. */
export const rnd = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/** Faixa [min, max) a partir de uma semente. */
export const range = (seed, min, max) => min + rnd(seed) * (max - min);

/** Item de uma lista, a partir de uma semente. */
export const pick = (seed, list) => list[Math.floor(rnd(seed) * list.length)];
