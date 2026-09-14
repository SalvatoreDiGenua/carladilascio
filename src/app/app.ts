import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { SiteFooter } from './layout/footer/site-footer';
import { SiteHeader } from './layout/header/site-header';
import { IntroScreen } from './shared/intro-screen/intro-screen';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter, TranslocoPipe, HlmToasterImports, IntroScreen],
  template: `
    <a class="skip-link" href="#main-content">{{ 'app.skipLink' | transloco }}</a>
    <app-intro-screen (completed)="onIntroCompleted()" />
    <app-site-header />
    <main id="main-content" tabindex="-1" [class.home-entry-ready]="homeEntryReady()" class="focus:outline-none">
      <router-outlet />
    </main>
    <app-site-footer />
    <hlm-toaster />
  `,
  styles: `
    :host { display: flex; flex-direction: column; min-height: 100dvh; }
    main {
      flex: 1 0 auto;
      opacity: 0;
      transform: translate3d(0, 1.5rem, 0) scale(.985);
      filter: blur(4px);
      will-change: transform, opacity, filter;
    }
    main.home-entry-ready {
      animation: home-entry 1100ms cubic-bezier(.22, 1, .36, 1) both;
    }
    .skip-link {
      position: fixed; top: .75rem; left: .75rem; z-index: 10000;
      transform: translateY(-200%); border-radius: .5rem;
      background: var(--color-ink); color: white; padding: .75rem 1rem; font-weight: 600;
      transition: transform .2s ease-in-out;
    }
    .skip-link:focus-visible { transform: translateY(0); outline: 3px solid var(--color-primary-light); outline-offset: 2px; }
    @keyframes home-entry {
      from { opacity: 0; transform: translate3d(0, 1.5rem, 0) scale(.985); filter: blur(4px); }
      55% { opacity: 1; transform: translate3d(0, -.2rem, 0) scale(1.002); filter: blur(0); }
      to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      main { opacity: 1; transform: none; filter: none; }
      main.home-entry-ready { animation: none; }
    }
  `,
})
export class App {
  readonly homeEntryReady = signal(false);

  onIntroCompleted(): void {
    this.homeEntryReady.set(true);
  }
}
