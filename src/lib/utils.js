import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* O `cn` que todo componente shadcn espera: junta classes condicionais e
   resolve conflitos do Tailwind — sem ele, `px-4` de um componente e
   `px-2` de quem o usa ficam os dois no atributo e vence a ordem do CSS,
   não a intenção de quem escreveu. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
