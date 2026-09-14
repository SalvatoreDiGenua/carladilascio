import { afterNextRender, Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-intro-screen',
  template: `
    @if (visible()) {
      <div
        class="intro-screen"
        [class.is-exiting]="isExiting()"
        [class.variant-fade]="variant() === 'fade'"
        [class.variant-lift]="variant() === 'lift'"
        [class.variant-curtain]="variant() === 'curtain'"
        aria-hidden="true"
      >
        <div class="intro-screen__veil"></div>
        <div class="intro-screen__grain"></div>
        <div class="intro-screen__mark">
          <img src="/carla_logo_intro.gif" alt="" width="420" height="420" fetchpriority="high" decoding="async" />
        </div>
      </div>
    }
  `,
  styles: `
    :host { position: relative; z-index: 9999; }
    .intro-screen {
      position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center;
      overflow: hidden; background: var(--background, var(--color-cream));
      isolation: isolate; opacity: 1; transform: translate3d(0, 0, 0);
    }
    .intro-screen__veil, .intro-screen__grain { position: absolute; inset: 0; pointer-events: none; }
    .intro-screen__veil {
      background:
        radial-gradient(circle at 50% 46%, color-mix(in srgb, var(--primary, var(--color-primary)) 8%, transparent), transparent 38%),
        linear-gradient(180deg, color-mix(in srgb, var(--background, var(--color-cream)) 96%, transparent), var(--background, var(--color-cream)));
      opacity: .96;
    }
    .intro-screen__grain {
      opacity: .045;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");
      mix-blend-mode: multiply;
    }
    .intro-screen__mark {
      position: relative; z-index: 1; display: grid; place-items: center;
      width: min(42vw, 22rem); aspect-ratio: 1; opacity: 0;
      transform: translate3d(0, .5rem, 0) scale(.97);
      animation: intro-mark-in 1200ms cubic-bezier(.22, 1, .36, 1) 120ms both;
      will-change: transform, opacity;
    }
    .intro-screen__mark img { display: block; width: 100%; height: 100%; object-fit: contain; }
    .intro-screen.is-exiting .intro-screen__mark { animation: intro-mark-out 620ms cubic-bezier(.22, 1, .36, 1) both; }
    .intro-screen.variant-fade.is-exiting { animation: intro-fade-out 820ms cubic-bezier(.22, 1, .36, 1) both; }
    .intro-screen.variant-lift.is-exiting { animation: intro-lift-out 900ms cubic-bezier(.76, 0, .24, 1) both; }
    .intro-screen.variant-curtain.is-exiting { transform-origin: center top; animation: intro-curtain-out 900ms cubic-bezier(.76, 0, .24, 1) both; }
    @keyframes intro-mark-in { from { opacity: 0; transform: translate3d(0, .5rem, 0) scale(.97); } to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } }
    @keyframes intro-mark-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(.965); } }
    @keyframes intro-fade-out { from { opacity: 1; filter: blur(0); } to { opacity: 0; filter: blur(3px); } }
    @keyframes intro-lift-out { from { opacity: 1; transform: translate3d(0, 0, 0); } to { opacity: 0; transform: translate3d(0, -100%, 0); } }
    @keyframes intro-curtain-out { from { opacity: 1; clip-path: inset(0 0 0 0); } to { opacity: 0; clip-path: inset(0 0 100% 0); } }
    @media (max-width: 640px) { .intro-screen__mark { width: min(62vw, 17rem); } }
    @media (prefers-reduced-motion: reduce) {
      .intro-screen__mark, .intro-screen.is-exiting, .intro-screen.is-exiting .intro-screen__mark {
        animation-duration: 1ms !important; animation-delay: 0ms !important;
      }
    }
  `,
})
export class IntroScreen {
  readonly visible = signal(true);
  readonly isExiting = signal(false);
  readonly variant = signal<'fade' | 'lift' | 'curtain'>('fade');
  readonly completed = output<void>();

  constructor() {
    afterNextRender(() => {
      const variants: Array<'fade' | 'lift' | 'curtain'> = ['fade', 'lift', 'curtain'];
      this.variant.set(variants[Math.floor(Math.random() * variants.length)]);
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const holdDuration = prefersReducedMotion ? 250 : 2000;
      const exitDuration = prefersReducedMotion ? 1 : 900;
      window.setTimeout(() => this.isExiting.set(true), holdDuration);
      window.setTimeout(() => {
        this.visible.set(false);
        this.completed.emit();
      }, holdDuration + exitDuration);
    });
  }
}
