import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { filter, map } from 'rxjs';
import { SITE_CONTENT } from '../../core/data/site-content';

@Component({
  selector: 'app-site-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslocoPipe,
    HlmMenubarImports,
    HlmDropdownMenuImports,
  ],
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
          class="group flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
          [attr.aria-label]="
            'header.logoAriaLabel'
              | transloco: { name: content.personalInfo.name }
          "
        >
          <span
            class="text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-primary sm:text-2xl"
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
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
          >
            {{ 'header.nav.home' | transloco }}
          </a>

          <!-- Menubar con Dropdown per "Chi sono" -->
          <div hlmMenubar class="h-auto border-none bg-transparent p-0">
            <button
              type="button"
              [hlmMenubarTrigger]="aboutMenu"
              [class]="
                isAboutActive()
                  ? 'flex items-center gap-1.5 rounded-lg bg-stone-200/60 px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light cursor-pointer'
                  : 'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light cursor-pointer'
              "
            >
              <span>{{ 'header.nav.about' | transloco }}</span>
              <svg
                class="size-3.5 opacity-60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          <ng-template #aboutMenu>
            <hlm-dropdown-menu class="w-64 p-1.5 shadow-lg">
              <hlm-dropdown-menu-group>
                <button
                  hlmDropdownMenuItem
                  (click)="navigateTo('/chi-sono')"
                  class="flex w-full cursor-pointer flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left"
                >
                  <span class="font-semibold text-foreground">
                    {{ 'header.aboutModal.therapistTitle' | transloco }}
                  </span>
                  <span class="text-xs text-muted-foreground">
                    {{ 'header.aboutModal.therapistDescription' | transloco }}
                  </span>
                </button>
                <hlm-dropdown-menu-separator class="my-1" />
                <button
                  hlmDropdownMenuItem
                  (click)="navigateTo('/chi-sono-artista')"
                  class="flex w-full cursor-pointer flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left"
                >
                  <span class="font-semibold text-foreground">
                    {{ 'header.aboutModal.artistTitle' | transloco }}
                  </span>
                  <span class="text-xs text-muted-foreground">
                    {{ 'header.aboutModal.artistDescription' | transloco }}
                  </span>
                </button>
              </hlm-dropdown-menu-group>
            </hlm-dropdown-menu>
          </ng-template>

          <a
            routerLink="/"
            fragment="metodologie"
            (click)="closeMobileMenu()"
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
          >
            {{ 'header.nav.methods' | transloco }}
          </a>
          <a
            routerLink="/percorsi"
            routerLinkActive="bg-stone-200/60 text-ink font-semibold"
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
          >
            {{ 'header.nav.journeys' | transloco }}
          </a>
          <a
            routerLink="/contatti"
            routerLinkActive="bg-primary-dark text-white shadow-sm"
            class="ml-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
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
          class="inline-flex items-center justify-center rounded-lg p-2 text-ink transition-colors hover:bg-stone-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light md:hidden"
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

            <!-- Sezione Chi Sono in Mobile -->
            <div class="py-1">
              <span
                class="px-3 text-xs font-semibold tracking-wider text-ink-muted uppercase"
              >
                {{ 'header.nav.about' | transloco }}
              </span>
              <div class="mt-1 flex flex-col pl-2">
                <a
                  routerLink="/chi-sono"
                  routerLinkActive="text-primary font-semibold"
                  (click)="closeMobileMenu()"
                  class="rounded-lg px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
                >
                  {{ 'header.aboutModal.therapistTitle' | transloco }}
                </a>
                <a
                  routerLink="/chi-sono-artista"
                  routerLinkActive="text-primary font-semibold"
                  (click)="closeMobileMenu()"
                  class="rounded-lg px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
                >
                  {{ 'header.aboutModal.artistTitle' | transloco }}
                </a>
              </div>
            </div>

            <!-- Sezione Metodologie in Mobile -->
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
                    routerLinkActive="text-primary font-semibold"
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
              class="mt-2 rounded-lg bg-primary px-4 py-2.5 text-center text-base font-medium text-white shadow-sm hover:bg-primary-dark"
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

  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly isAboutActive = computed(() =>
    this.currentUrl().startsWith('/chi-sono'),
  );

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  navigateTo(path: string): void {
    this.closeMobileMenu();
    void this.router.navigate([path]);
  }
}
