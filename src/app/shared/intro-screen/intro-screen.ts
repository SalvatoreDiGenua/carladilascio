import {
  afterNextRender,
  AnimationCallbackEvent,
  Component,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-intro-screen',
  template: `
    @if (visible()) {
      <div class="intro-screen" animate.enter="intro-enter" animate.leave="intro-leave" (animate.leave)="onLeave($event)" aria-hidden="true">
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
      overflow: hidden; background: var(--background, var(--color-cream)); isolation: isolate;
    }
    .intro-screen__veil, .intro-screen__grain { position: absolute; inset: 0; pointer-events: none; }
    .intro-screen__veil {
      background:
        radial-gradient(circle at 50% 46%, color-mix(in srgb, var(--primary, var(--color-primary)) 6%, transparent), transparent 40%),
        linear-gradient(180deg, color-mix(in srgb, var(--background, var(--color-cream)) 97%, transparent), var(--background, var(--color-cream)));
      opacity: .97;
    }
    .intro-screen__grain {
      opacity: .03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");
      mix-blend-mode: multiply;
    }
    .intro-screen__mark {
      position: relative; z-index: 1; display: grid; place-items: center;
      width: min(42vw, 22rem); aspect-ratio: 1; opacity: 1;
      transform: translate3d(0, 0, 0) scale(1); will-change: transform, opacity, filter;
    }
    .intro-screen__mark img { display: block; width: 100%; height: 100%; object-fit: contain; }
    .intro-enter { animation: intro-enter 900ms cubic-bezier(.22, 1, .36, 1) both; }
    .intro-enter .intro-screen__mark { animation: intro-mark-enter 1100ms cubic-bezier(.22, 1, .36, 1) 80ms both; }
    .intro-leave { animation: intro-fade-out 720ms cubic-bezier(.4, 0, .2, 1) both; }
    .intro-leave .intro-screen__mark { animation: intro-mark-out 620ms cubic-bezier(.4, 0, .2, 1) both; }
    @keyframes intro-enter { from { opacity: 0; } to { opacity: 1; } }
    @keyframes intro-mark-enter {
      from { opacity: 0; transform: translate3d(0, .5rem, 0) scale(.985); filter: blur(2px); }
      to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
    }
    @keyframes intro-mark-out {
      from { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
      to { opacity: 0; transform: translate3d(0, -.25rem, 0) scale(.99); filter: blur(1px); }
    }
    @keyframes intro-fade-out { from { opacity: 1; } to { opacity: 0; } }
    @media (max-width: 640px) { .intro-screen__mark { width: min(62vw, 17rem); } }
    @media (prefers-reduced-motion: reduce) {
      .intro-enter, .intro-leave, .intro-enter .intro-screen__mark, .intro-leave .intro-screen__mark {
        animation-duration: 1ms !important; animation-delay: 0ms !important;
      }
    }
  `,
})
export class IntroScreen {
  readonly visible = signal(true);
  readonly completed = output<void>();

  constructor() {
    afterNextRender(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const holdDuration = prefersReducedMotion ? 250 : 2500;
      window.setTimeout(() => this.visible.set(false), holdDuration);
    });
  }

  onLeave(event: AnimationCallbackEvent): void {
    const element = event.target;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      element.removeEventListener('animationend', onAnimationEnd);
      element.removeEventListener('animationcancel', onAnimationCancel);
      this.completed.emit();
      queueMicrotask(() => event.animationComplete());
    };
    const onAnimationEnd = (e: AnimationEvent) => { if (e.target === element) finish(); };
    const onAnimationCancel = (e: AnimationEvent) => { if (e.target === element) finish(); };
    element.addEventListener('animationend', onAnimationEnd);
    element.addEventListener('animationcancel', onAnimationCancel);
  }
}
