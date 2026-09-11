import type { Config } from 'tailwindcss';

/**
 * Design tokens — Palette "Quadro" (v2)
 * Fonte: analisi cromatica del dipinto di Carla + metodologia
 * design-system della skill ui-ux-pro-max (regola 60-30-10,
 * token semantici, scale accessibili WCAG AA).
 *
 * NOTA (Tailwind CSS v4): il progetto usa il motore CSS-first di
 * Tailwind v4 (`@import 'tailwindcss';` in src/styles.css). Questo
 * file resta la SORGENTE DI VERITA' dei token per tooling/IDE e per
 * import espliciti da TypeScript (es. grafica generata via canvas,
 * export del logo, storybook, ecc.). Per attivarlo anche nella
 * pipeline CSS occorre aggiungere in cima a src/styles.css, subito
 * dopo `@import 'tailwindcss';`, la riga:
 *
 *   @config "../tailwind.config.ts";
 *
 * (operazione volutamente lasciata a un commit separato: modifica
 * un file esistente che non è stato possibile leggere byte-per-byte
 * in questa sessione — vedi MIGRAZIONE_PALETTE.md).
 */
export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Blu di brand — CTA, link, elementi interattivi, futuro logo
        primary: {
          light: '#6C9CAF', // hover / highlight
          DEFAULT: '#5B8FA3', // stato di riposo
          dark: '#3F6B7A', // active / pressed / elementi profondi
        },

        // Neutri caldi derivati dal quadro (scala scura, dal più
        // profondo al più chiaro)
        ink: '#070201', // background principale
        'deep-brown': '#1C1306', // surface / sezioni
        'olive-charcoal': '#403824', // struttura / bordi
        'olive-taupe': '#645D4C', // secondary surface
        'muted-beige': '#A49A83', // testo secondario
        'warm-ivory': '#C4B7A1', // testo principale

        // Accenti pittorici
        'antique-gold': '#A99473', // accent / luce / dettagli
        bronze: {
          DEFAULT: '#795021', // accent strong / dettagli, icone, bordi
          soft: '#A88D6F', // variante generata (AA-safe come testo/badge su fondo scuro)
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        serif: ['Lora', 'Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
} satisfies Config;
