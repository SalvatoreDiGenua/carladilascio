import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { SITE_CONTENT } from '../../core/data/site-content';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, TranslocoPipe],
  template: `
    <header
      class="sticky top-0 z-40 border-b border-stone-200/80 bg-cream/90 backdrop-blur-md transition-shadow"
    >
      <div
        class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4"
      >
        <!-- Logo -->
        <a
          routerLink="/"
          (click)="closeMobileMenu()"
          class="group flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
          [attr.aria-label]="
            'header.logoAriaLabel' | transloco: { name: content.personalInfo.name }
          "
        >
          <span
            class="text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-aqua sm:text-2xl"
          >
            {{ content.personalInfo.name }}
          </span>
          <span class="text-xs font-medium text-ink-muted">
            {{ 'header.tagline' | transloco }}
          </span>
        </a>

        <!-- Desktop Navigation -->
        <nav
          class="hidden items-center gap-1 md:flex lg:gap-2"
          [attr.aria-label]="'header.nav.ariaLabel' | transloco"
        >
          <a
            routerLink="/"
            routerLinkActive="bg-stone-200/60 text-ink font-semibold"
            [routerLinkActiveOptions]="{ exact: true }"
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-aqua focus-visible:outline-none"
          >
            {{ 'header.nav.home' | transloco }}
          </a>
          <a
            routerLink="/chi-sono"
            routerLinkActive="bg-stone-200/60 text-ink font-semibold"
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-aqua focus-visible:outline-none"
          >
            {{ 'header.nav.about' | transloco }}
          </a>
          <a
            routerLink="/"
            fragment="metodologie"
            (click)="closeMobileMenu()"
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-aqua focus-visible:outline-none"
          >
            {{ 'header.nav.methods' | transloco }}
          </a>
          <a
            routerLink="/percorsi"
            routerLinkActive="bg-stone-200/60 text-ink font-semibold"
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-aqua focus-visible:outline-none"
          >
            {{ 'header.nav.journeys' | transloco }}
          </a>
          <a
            routerLink="/contatti"
            routerLinkActive="bg-aqua-dark text-white shadow-sm"
            class="ml-2 rounded-lg bg-aqua px-4 py-2 text-sm font-medium text-white! shadow-sm transition-colors hover:bg-aqua-dark focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {{ 'header.nav.contact' | transloco }}
          </a>
        </nav>

        <!-- Mobile Menu Toggle Button -->
        <button
          type="button"
          (click)="toggleMobileMenu()"
          [attr.aria-expanded]="isMobileMenuOpen()"
          aria-controls="mobile-navigation"
          class="inline-flex items-center justify-center rounded-lg p-2 text-ink transition-colors hover:bg-stone-200/50 focus-visible:ring-2 focus-visible:ring-aqua focus-visible:outline-none md:hidden"
          [attr.aria-label]="'header.mobileMenuToggleAriaLabel' | transloco"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            @if (isMobileMenuOpen()) {
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            } @else {
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            }
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation Drawer -->
      @if (isMobileMenuOpen()) {
        <div
          id="mobile-navigation"
          class="border-b border-stone-200 bg-cream px-4 pt-2 pb-6 shadow-lg md:hidden"
        >
          <nav
            class="flex flex-col gap-1.5"
            [attr.aria-label]="'header.mobileNavAriaLabel' | transloco"
          >
            <a
              routerLink="/"
              routerLinkActive="bg-stone-200 text-ink font-semibold"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeMobileMenu()"
              class="rounded-lg px-3 py-2.5 text-base font-medium text-ink-muted hover:bg-stone-200/50 hover:text-ink"
            >
              {{ 'header.nav.home' | transloco }}
            </a>
            <a
              routerLink="/chi-sono"
              routerLinkActive="bg-stone-200 text-ink font-semibold"
              (click)="closeMobileMenu()"
              class="rounded-lg px-3 py-2.5 text-base font-medium text-ink-muted hover:bg-stone-200/50 hover:text-ink"
            >
              {{ 'header.nav.about' | transloco }}
            </a>
            <div class="py-1">
              <span
                class="px-3 text-xs font-semibold tracking-wider text-ink-muted uppercase"
              >
                {{ 'header.nav.methods' | transloco }}
              </span>
              <div class="mt-1 flex flex-col pl-2">
                @for (method of content.methods; track method.slug) {
                  <a
                    [routerLink]="['/' + method.slug]"
                    routerLinkActive="text-aqua font-semibold"
                    (click)="closeMobileMenu()"
                    class="rounded-lg px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
                  >
                    {{ method.title | transloco }}
                  </a>
                }
              </div>
            </div>
            <a
              routerLink="/percorsi"
              routerLinkActive="bg-stone-200 text-ink font-semibold"
              (click)="closeMobileMenu()"
              class="rounded-lg px-3 py-2.5 text-base font-medium text-ink-muted hover:bg-stone-200/50 hover:text-ink"
            >
              {{ 'header.nav.journeys' | transloco }}
            </a>
            <a
              routerLink="/contatti"
              (click)="closeMobileMenu()"
              class="mt-2 rounded-lg bg-aqua px-4 py-2.5 text-center text-base font-medium text-white shadow-sm hover:bg-aqua-dark"
            >
              {{ 'header.nav.contact' | transloco }}
            </a>
          </nav>
        </div>
      }
    </header>
  `,
})
export class SiteHeader {
  readonly content = SITE_CONTENT;
  readonly isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
