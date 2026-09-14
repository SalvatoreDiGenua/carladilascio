import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { SiteFooter } from './layout/footer/site-footer';
import { SiteHeader } from './layout/header/site-header';
import { IntroScreen } from './shared/intro-screen/intro-screen';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SiteFooter,
    SiteHeader,
    TranslocoPipe,
    HlmToasterImports,
    IntroScreen,
  ],
  template: `
    <a class="skip-link" href="#main-content">{{
      'app.skipLink' | transloco
    }}</a>

    <app-intro-screen (completed)="onIntroCompleted()" />

    @defer (hydrate never; when introCompleted()) {
      <div class="site-layer" animate.enter="site-layer-enter">
        <app-site-header />

        <main
          id="main-content"
          tabindex="-1"
          class="focus:outline-none"
        >
          <router-outlet />
        </main>

        <app-site-footer />
      </div>
    } @placeholder {
      <div class="site-layer-placeholder" aria-hidden="true"></div>
    }

    <hlm-toaster />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
    }

    .site-layer {
      display: flex;
      flex: 1 0 auto;
      min-height: 100dvh;
      flex-direction: column;
    }

    main {
      flex: 1 0 auto;
    }

    .site-layer-placeholder {
      flex: 1 0 auto;
      min-height: 100dvh;
    }

    .site-layer-enter {
      animation: site-layer-enter 950ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .skip-link {
      position: fixed;
      top: 0.75rem;
      left: 0.75rem;
      z-index: 10000;
      transform: translateY(-200%);
      border-radius: 0.5rem;
      background: var(--color-ink);
      color: white;
      padding: 0.75rem 1rem;
      font-weight: 600;
      transition: transform 0.2s ease-in-out;
    }

    .skip-link:focus-visible {
      transform: translateY(0);
      outline: 3px solid var(--color-primary-light);
      outline-offset: 2px;
    }

    @keyframes site-layer-enter {
      from {
        opacity: 0;
        transform: translate3d(0, 1.5rem, 0) scale(0.985);
        filter: blur(5px);
      }
      55% {
        opacity: 1;
        transform: translate3d(0, -0.1rem, 0) scale(1.001);
        filter: blur(0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
        filter: blur(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .site-layer-enter {
        animation: none;
      }
    }
  `,
})
export class App {
  readonly introCompleted = signal(false);

  onIntroCompleted(): void {
    this.introCompleted.set(true);
  }
}
