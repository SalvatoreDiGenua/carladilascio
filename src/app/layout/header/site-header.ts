import {
  Component,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideMenu, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { filter, map } from 'rxjs';
import { SITE_CONTENT } from '../../core/data/site-content';
import { AboutMenu } from '../../core/services/about-menu';

@Component({
  selector: 'app-site-header',
  providers: [provideIcons({ lucideChevronDown, lucideMenu, lucideX })],
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslocoPipe,
    NgIcon,
    HlmMenubarImports,
    HlmDropdownMenuImports,
    HlmButtonImports,
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
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none"
          >
            {{ 'header.nav.home' | transloco }}
          </a>

          <!-- Menubar con Dropdown per "Chi sono" -->
          <div hlmMenubar class="h-auto border-none bg-transparent p-0">
            <button
              type="button"
              [hlmMenubarTrigger]="aboutMenu"
              (hlmDropdownMenuOpened)="isAboutMenuOpen.set(true)"
              (hlmDropdownMenuClosed)="isAboutMenuOpen.set(false)"
              [class]="
                isAboutActive()
                  ? 'flex cursor-pointer items-center gap-1.5 rounded-lg bg-stone-200/60 px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none'
                  : 'flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none'
              "
            >
              <span>{{ 'header.nav.about' | transloco }}</span>
              <ng-icon
                name="lucideChevronDown"
                class="size-3.5 opacity-60"
                aria-hidden="true"
              />
            </button>
          </div>

          <ng-template #aboutMenu>
            <hlm-dropdown-menu class="w-64 p-1.5 shadow-lg">
              <hlm-dropdown-menu-group>
                <button
                  hlmDropdownMenuItem
                  (click)="navigateTo('/chi-sono')"
                  (mouseenter)="aboutHoverPath.set('/chi-sono')"
                  (mouseleave)="aboutHoverPath.set(null)"
                  [style.background-color]="aboutOptionBackground('/chi-sono')"
                  [style.color]="aboutOptionTextColor('/chi-sono')"
                >
                  <span class="flex flex-col items-start gap-0.5 text-left">
                    <span [class]="aboutTitleClass('/chi-sono')">
                      {{ 'header.aboutModal.therapistTitle' | transloco }}
                    </span>
                    <span [class]="aboutDescriptionClass('/chi-sono')">
                      {{ 'header.aboutModal.therapistDescription' | transloco }}
                    </span>
                  </span>
                </button>
                <hlm-dropdown-menu-separator class="my-1" />
                <button
                  hlmDropdownMenuItem
                  (click)="navigateTo('/chi-sono-artista')"
                  (mouseenter)="aboutHoverPath.set('/chi-sono-artista')"
                  (mouseleave)="aboutHoverPath.set(null)"
                  [style.background-color]="
                    aboutOptionBackground('/chi-sono-artista')
                  "
                  [style.color]="aboutOptionTextColor('/chi-sono-artista')"
                >
                  <span class="flex flex-col items-start gap-0.5 text-left">
                    <span [class]="aboutTitleClass('/chi-sono-artista')">
                      {{ 'header.aboutModal.artistTitle' | transloco }}
                    </span>
                    <span [class]="aboutDescriptionClass('/chi-sono-artista')">
                      {{ 'header.aboutModal.artistDescription' | transloco }}
                    </span>
                  </span>
                </button>
              </hlm-dropdown-menu-group>
            </hlm-dropdown-menu>
          </ng-template>

          <a
            routerLink="/"
            fragment="metodologie"
            (click)="closeMobileMenu()"
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none"
          >
            {{ 'header.nav.methods' | transloco }}
          </a>
          <a
            routerLink="/percorsi"
            routerLinkActive="bg-stone-200/60 text-ink font-semibold"
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none"
          >
            {{ 'header.nav.journeys' | transloco }}
          </a>
          <a
            routerLink="/contatti"
            routerLinkActive="bg-primary-dark text-white shadow-sm"
            class="ml-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white! shadow-sm transition-colors hover:bg-primary-dark focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {{ 'header.nav.contact' | transloco }}
          </a>
        </nav>

        <!-- Mobile Menu Toggle Button -->
        <button
          hlmBtn
          variant="ghost"
          size="icon"
          type="button"
          (click)="toggleMobileMenu()"
          [attr.aria-expanded]="isMobileMenuOpen()"
          aria-controls="mobile-navigation"
          class="text-ink hover:bg-stone-200/50 md:hidden"
          [attr.aria-label]="'header.mobileMenuToggleAriaLabel' | transloco"
        >
          @if (isMobileMenuOpen()) {
            <ng-icon name="lucideX" class="size-6" aria-hidden="true" />
          } @else {
            <ng-icon name="lucideMenu" class="size-6" aria-hidden="true" />
          }
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
  readonly isAboutMenuOpen = signal(false);
  readonly aboutHoverPath = signal<string | null>(null);

  private readonly router = inject(Router);
  private readonly aboutMenu = inject(AboutMenu);
  private readonly aboutMenuTrigger = viewChild(CdkMenuTrigger);
  private lastOpenRequest = 0;
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

  constructor() {
    effect(() => {
      const request = this.aboutMenu.openRequested();
      const trigger = this.aboutMenuTrigger();

      if (trigger && request > this.lastOpenRequest) {
        this.lastOpenRequest = request;
        trigger.open();
      }
    });
  }

  aboutOptionBackground(path: string): string {
    const isHighlighted =
      this.isAboutMenuOpen() &&
      (this.currentUrl() === path || this.aboutHoverPath() === path);
    const isArtist = path === '/chi-sono-artista';

    if (!isHighlighted) {
      return 'transparent';
    }

    return isArtist ? 'var(--color-antique-gold)' : 'var(--color-primary-dark)';
  }

  aboutOptionTextColor(path: string): string {
    const isHighlighted =
      this.isAboutMenuOpen() &&
      (this.currentUrl() === path || this.aboutHoverPath() === path);

    if (!isHighlighted) {
      return 'var(--color-ink)';
    }

    return path === '/chi-sono-artista' ? 'var(--color-ink)' : '#ffffff';
  }

  aboutTitleClass(path: string): string {
    const isCurrent = this.isAboutMenuOpen() && this.currentUrl() === path;
    const isArtist = path === '/chi-sono-artista';

    return isCurrent || this.aboutHoverPath() === path
      ? isArtist
        ? 'font-semibold text-ink!'
        : 'font-semibold text-white!'
      : 'font-semibold text-foreground!';
  }

  aboutDescriptionClass(path: string): string {
    const isCurrent = this.isAboutMenuOpen() && this.currentUrl() === path;
    const isArtist = path === '/chi-sono-artista';

    return isCurrent || this.aboutHoverPath() === path
      ? isArtist
        ? 'text-xs text-ink!'
        : 'text-xs text-white!'
      : 'text-xs text-muted-foreground!';
  }

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
