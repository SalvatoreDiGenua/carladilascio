import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { SiteHeader } from './layout/header/site-header';
import { SiteFooter } from './layout/footer/site-footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter, TranslocoPipe],
  template: `
    <a class="skip-link" href="#main-content">{{
      'app.skipLink' | transloco
    }}</a>
    <app-site-header />
    <main id="main-content" tabindex="-1" class="focus:outline-none">
      <router-outlet />
    </main>
    <app-site-footer />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
    }

    main {
      flex: 1 0 auto;
    }

    .skip-link {
      position: fixed;
      top: 0.75rem;
      left: 0.75rem;
      z-index: 1000;
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
      outline: 3px solid var(--color-aqua);
      outline-offset: 2px;
    }
  `,
})
export class App {}
