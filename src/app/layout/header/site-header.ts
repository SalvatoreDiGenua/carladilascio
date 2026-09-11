import {
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { filter, map } from 'rxjs';
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
            'header.logoAriaLabel'
              | transloco: { name: content.personalInfo.name }
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
          <button
            type="button"
            (click)="openAboutModal()"
            aria-haspopup="dialog"
            [attr.aria-expanded]="isAboutModalOpen()"
            [class]="
              isAboutActive()
                ? 'rounded-lg bg-stone-200/60 px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-stone-200/40 focus-visible:ring-2 focus-visible:ring-aqua focus-visible:outline-none'
                : 'rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-aqua focus-visible:outline-none'
            "
          >
            {{ 'header.nav.about' | transloco }}
          </button>
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
            <button
              type="button"
              (click)="openAboutModalFromMobile()"
              aria-haspopup="dialog"
              [attr.aria-expanded]="isAboutModalOpen()"
              [class]="
                isAboutActive()
                  ? 'rounded-lg bg-stone-200 px-3 py-2.5 text-left text-base font-semibold text-ink hover:bg-stone-200/50'
                  : 'rounded-lg px-3 py-2.5 text-left text-base font-medium text-ink-muted hover:bg-stone-200/50 hover:text-ink'
              "
            >
              {{ 'header.nav.about' | transloco }}
            </button>
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

    <!-- Modal di scelta: Artista o Terapeuta -->
    @if (isAboutModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          (click)="closeAboutModal()"
          aria-hidden="true"
        ></div>

        <div
          #aboutModalPanel
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-modal-title"
          aria-describedby="about-modal-subtitle"
          tabindex="-1"
          (keydown.escape)="closeAboutModal()"
          (keydown.tab)="onModalTabKey($any($event))"
          class="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl focus:outline-none sm:p-8"
        >
          <button
            type="button"
            (click)="closeAboutModal()"
            [attr.aria-label]="'header.aboutModal.closeAriaLabel' | transloco"
            class="absolute top-4 right-4 rounded-full p-1.5 text-ink-muted transition-colors hover:bg-stone-100 hover:text-ink focus-visible:ring-2 focus-visible:ring-aqua focus-visible:outline-none"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h2
            id="about-modal-title"
            class="pr-8 text-xl font-bold text-ink sm:text-2xl"
          >
            {{ 'header.aboutModal.title' | transloco }}
          </h2>
          <p id="about-modal-subtitle" class="mt-2 text-sm text-ink-muted">
            {{ 'header.aboutModal.subtitle' | transloco }}
          </p>

          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              (click)="selectAboutOption('terapeuta')"
              class="group rounded-xl border border-aqua/30 bg-aqua-light/40 p-4 text-left transition-colors hover:bg-aqua-light focus-visible:ring-2 focus-visible:ring-aqua focus-visible:outline-none"
            >
              <span class="block text-base font-bold text-aqua-dark">
                {{ 'header.aboutModal.therapistTitle' | transloco }}
              </span>
              <span class="mt-1 block text-xs text-ink-muted">
                {{ 'header.aboutModal.therapistDescription' | transloco }}
              </span>
            </button>

            <button
              type="button"
              (click)="selectAboutOption('artista')"
              class="group rounded-xl border border-coral/30 bg-coral-light/40 p-4 text-left transition-colors hover:bg-coral-light focus-visible:ring-2 focus-visible:ring-coral focus-visible:outline-none"
            >
              <span class="block text-base font-bold text-coral-dark">
                {{ 'header.aboutModal.artistTitle' | transloco }}
              </span>
              <span class="mt-1 block text-xs text-ink-muted">
                {{ 'header.aboutModal.artistDescription' | transloco }}
              </span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class SiteHeader {
  readonly content = SITE_CONTENT;
  readonly isMobileMenuOpen = signal(false);
  readonly isAboutModalOpen = signal(false);

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

  private readonly aboutModalPanel =
    viewChild<ElementRef<HTMLElement>>('aboutModalPanel');
  private lastFocusedElement: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this.isAboutModalOpen()) {
        this.aboutModalPanel()?.nativeElement.focus();
      }
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  openAboutModal(): void {
    this.lastFocusedElement = document.activeElement as HTMLElement | null;
    this.isAboutModalOpen.set(true);
  }

  openAboutModalFromMobile(): void {
    this.closeMobileMenu();
    this.openAboutModal();
  }

  closeAboutModal(): void {
    this.isAboutModalOpen.set(false);
    this.lastFocusedElement?.focus();
    this.lastFocusedElement = null;
  }

  selectAboutOption(option: 'terapeuta' | 'artista'): void {
    this.isAboutModalOpen.set(false);
    this.lastFocusedElement = null;
    const target = option === 'terapeuta' ? '/chi-sono' : '/chi-sono-artista';
    void this.router.navigate([target]);
  }

  onModalTabKey(event: KeyboardEvent): void {
    const panel = this.aboutModalPanel()?.nativeElement;
    if (!panel) return;

    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || active === panel) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
