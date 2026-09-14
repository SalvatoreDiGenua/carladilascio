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
      <div
        class="intro-screen"
        [class.variant-fade]="variant() === 'fade'"
        [class.variant-lift]="variant() === 'lift'"
        [class.variant-curtain]="variant() === 'curtain'"
        animate.enter="intro-enter"
        animate.leave="intro-leave"
        (animate.leave)="onLeave($event)"
        aria-hidden="true"
      >
        <div class="intro-screen__veil"></div>
        <div class="intro-screen__grain"></div>
        <div class="intro-screen__mark">
          <img
            src="/carla_logo_intro.gif"
            alt=""
            width="420"
            height="420"
            fetchpriority="high"
            decoding="async"
          />
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      position: relative;
      z-index: 9999;
    }

    .intro-screen {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: grid;
      place-items: center;
      overflow: hidden;
      background: var(--background, var(--color-cream));
      isolation: isolate;
    }

    .intro-screen__veil,
    .intro-screen__grain {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .intro-screen__veil {
      background:
        radial-gradient(
          circle at 50% 46%,
          color-mix(
            in srgb,
            var(--primary, var(--color-primary)) 8%,
            transparent
          ),
          transparent 38%
        ),
        linear-gradient(
          180deg,
          color-mix(
            in srgb,
            var(--background, var(--color-cream)) 96%,
            transparent
          ),
          var(--background, var(--color-cream))
        );
      opacity: 0.96;
    }

    .intro-screen__grain {
      opacity: 0.045;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");
      mix-blend-mode: multiply;
    }

    .intro-screen__mark {
      position: relative;
      z-index: 1;
      display: grid;
      place-items: center;
      width: min(42vw, 22rem);
      aspect-ratio: 1;
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
      will-change: transform, opacity;
    }

    .intro-screen__mark img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .intro-enter {
      animation: intro-enter 760ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .intro-enter .intro-screen__mark {
      animation: intro-mark-enter 900ms cubic-bezier(0.16, 1, 0.3, 1) 80ms both;
    }

    .intro-leave .intro-screen__mark {
      animation: intro-mark-out 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .intro-leave.variant-fade {
      animation: intro-fade-out 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .intro-leave.variant-lift {
      animation: intro-lift-out 560ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .intro-leave.variant-curtain {
      transform-origin: center top;
      animation: intro-curtain-out 560ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes intro-enter {
      from {
        opacity: 0;
        transform: translate3d(0, 0.5rem, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }

    @keyframes intro-mark-enter {
      from {
        opacity: 0;
        transform: translate3d(0, 0.75rem, 0) scale(0.965);
        filter: blur(5px);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
        filter: blur(0);
      }
    }

    @keyframes intro-mark-out {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.965);
      }
    }

    @keyframes intro-fade-out {
      from {
        opacity: 1;
        filter: blur(0);
      }
      to {
        opacity: 0;
        filter: blur(2px);
      }
    }

    @keyframes intro-lift-out {
      from {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      to {
        opacity: 0;
        transform: translate3d(0, -100%, 0);
      }
    }

    @keyframes intro-curtain-out {
      from {
        opacity: 1;
        clip-path: inset(0 0 0 0);
      }
      to {
        opacity: 0;
        clip-path: inset(0 0 100% 0);
      }
    }

    @media (max-width: 640px) {
      .intro-screen__mark {
        width: min(62vw, 17rem);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .intro-enter,
      .intro-leave,
      .intro-enter .intro-screen__mark,
      .intro-leave .intro-screen__mark {
        animation-duration: 1ms !important;
        animation-delay: 0ms !important;
      }
    }
  `,
})
export class IntroScreen {
  readonly visible = signal(true);
  readonly variant = signal<'fade' | 'lift' | 'curtain'>('fade');
  readonly completed = output<void>();

  constructor() {
    afterNextRender(() => {
      const variants: Array<'fade' | 'lift' | 'curtain'> = [
        'fade',
        'lift',
        'curtain',
      ];
      this.variant.set(variants[Math.floor(Math.random() * variants.length)]);

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      const holdDuration = prefersReducedMotion ? 250 : 2000;

      window.setTimeout(() => this.visible.set(false), holdDuration);
    });
  }

  onLeave(event: AnimationCallbackEvent): void {
    const element = event.target;

    const complete = (animationEvent: AnimationEvent) => {
      if (animationEvent.target !== element) {
        return;
      }

      element.removeEventListener('animationend', complete);
      event.animationComplete();
      this.completed.emit();
    };

    element.addEventListener('animationend', complete);
  }
}
