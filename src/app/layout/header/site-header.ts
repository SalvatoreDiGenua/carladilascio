import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { filter, map } from 'rxjs';
import { SITE_CONTENT } from '../../core/data/site-content';
import { MobileNavigationSheet } from './mobile-navigation-sheet';

@Component({
  selector: 'app-site-header',
  providers: [provideIcons({ lucideChevronDown })],
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslocoPipe,
    NgIcon,
    NgOptimizedImage,
    HlmButtonImports,
    HlmMenubarImports,
    HlmDropdownMenuImports,
    MobileNavigationSheet,
  ],
  template: `
    <header
      class="sticky top-0 z-40 border-b border-stone-200/80 bg-cream/90 backdrop-blur-md transition-shadow"
    >
      <div
        class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4"
      >
        <a
          routerLink="/"
          class="group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
          [attr.aria-label]="
            'header.logoAriaLabel'
              | transloco: { name: content.personalInfo.name }
          "
        >
          <img
            ngSrc="/carla-logo.svg"
            width="180"
            height="48"
            priority
            alt="Carla"
            class="block h-10 w-auto max-w-[180px] object-contain transition-opacity group-hover:opacity-90 sm:h-12 sm:max-w-[220px]"
          />
        </a>

        @if (isMobile()) {
          <app-mobile-navigation-sheet />
        } @else {
          <nav
            class="flex min-w-0 items-center justify-end gap-1 lg:gap-2"
            [attr.aria-label]="'header.nav.ariaLabel' | transloco"
          >
            <a
              hlmBtn
              variant="ghost"
              routerLink="/"
              routerLinkActive="bg-stone-200/60 text-ink font-semibold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="text-sm text-ink-muted hover:bg-stone-200/40 hover:text-ink"
              >{{ 'header.nav.home' | transloco }}</a
            >

            <div hlmMenubar class="h-auto border-none bg-transparent p-0">
              <button
                type="button"
                [hlmMenubarTrigger]="aboutMenu"
                (hlmDropdownMenuOpened)="isAboutMenuOpen.set(true)"
                (hlmDropdownMenuClosed)="isAboutMenuOpen.set(false)"
                [class]="
                  isAboutActive()
                    ? 'flex cursor-pointer items-center gap-1.5 rounded-md bg-stone-200/60 px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none'
                    : 'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none'
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
                    (click)="navigateTo('/terapeuta')"
                    (mouseenter)="aboutHoverPath.set('/terapeuta')"
                    (mouseleave)="aboutHoverPath.set(null)"
                    [style.background-color]="aboutOptionBackground('/terapeuta')"
                    [style.color]="aboutOptionTextColor('/terapeuta')"
                  >
                    <span class="flex flex-col items-start gap-0.5 text-left">
                      <span [class]="aboutTitleClass('/terapeuta')">{{
                        'header.aboutModal.therapistTitle' | transloco
                      }}</span>
                      <span [class]="aboutDescriptionClass('/terapeuta')">{{
                        'header.aboutModal.therapistDescription' | transloco
                      }}</span>
                    </span>
                  </button>
                  <hlm-dropdown-menu-separator class="my-1" />
                  <button
                    hlmDropdownMenuItem
                    (click)="navigateTo('/artista')"
                    (mouseenter)="aboutHoverPath.set('/artista')"
                    (mouseleave)="aboutHoverPath.set(null)"
                    [style.background-color]="aboutOptionBackground('/artista')"
                    [style.color]="aboutOptionTextColor('/artista')"
                  >
                    <span class="flex flex-col items-start gap-0.5 text-left">
                      <span [class]="aboutTitleClass('/artista')">{{
                        'header.aboutModal.artistTitle' | transloco
                      }}</span>
                      <span [class]="aboutDescriptionClass('/artista')">{{
                        'header.aboutModal.artistDescription' | transloco
                      }}</span>
                    </span>
                  </button>
                </hlm-dropdown-menu-group>
              </hlm-dropdown-menu>
            </ng-template>

            <a
              hlmBtn
              variant="ghost"
              routerLink="/"
              fragment="metodologie"
              class="text-sm text-ink-muted hover:bg-stone-200/40 hover:text-ink"
              >{{ 'header.nav.methods' | transloco }}</a
            >
            <a
              hlmBtn
              variant="ghost"
              routerLink="/percorsi"
              routerLinkActive="bg-stone-200/60 text-ink font-semibold"
              class="text-sm text-ink-muted hover:bg-stone-200/40 hover:text-ink"
              >{{ 'header.nav.journeys' | transloco }}</a
            >
            <a
              hlmBtn
              variant="default"
              routerLink="/contatti"
              routerLinkActive="bg-primary-dark text-white"
              class="ml-1 bg-primary px-4 text-sm text-white! shadow-sm hover:bg-primary-dark lg:ml-2"
              >{{ 'header.nav.contact' | transloco }}</a
            >
          </nav>
        }
      </div>
    </header>
  `,
})
export class SiteHeader {
  readonly content = SITE_CONTENT;
  readonly isAboutMenuOpen = signal(false);
  readonly aboutHoverPath = signal<string | null>(null);
  private readonly router = inject(Router);
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 767px)').pipe(
      map(({ matches }) => matches),
    ),
    { initialValue: false },
  );
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );
  readonly isAboutActive = computed(() =>
    this.currentUrl().startsWith('/terapeuta'),
  );

  aboutOptionBackground(path: string): string {
    const isHighlighted =
      this.isAboutMenuOpen() &&
      (this.currentUrl() === path || this.aboutHoverPath() === path);
    return isHighlighted
      ? path === '/artista'
        ? 'var(--color-antique-gold)'
        : 'var(--color-primary-dark)'
      : 'transparent';
  }

  aboutOptionTextColor(path: string): string {
    const isHighlighted =
      this.isAboutMenuOpen() &&
      (this.currentUrl() === path || this.aboutHoverPath() === path);
    return isHighlighted
      ? path === '/artista'
        ? 'var(--color-ink)'
        : '#ffffff'
      : 'var(--color-ink)';
  }

  aboutTitleClass(path: string): string {
    const active =
      this.isAboutMenuOpen() &&
      (this.currentUrl() === path || this.aboutHoverPath() === path);
    return active
      ? path === '/artista'
        ? 'font-semibold text-ink!'
        : 'font-semibold text-white!'
      : 'font-semibold text-foreground!';
  }

  aboutDescriptionClass(path: string): string {
    const active =
      this.isAboutMenuOpen() &&
      (this.currentUrl() === path || this.aboutHoverPath() === path);
    return active
      ? path === '/artista'
        ? 'text-xs text-ink!'
        : 'text-xs text-white!'
      : 'text-xs text-muted-foreground!';
  }

  navigateTo(path: string): void {
    void this.router.navigate([path]);
  }
}
