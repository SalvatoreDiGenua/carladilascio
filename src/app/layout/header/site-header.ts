import { Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideMenu } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { filter, map } from 'rxjs';
import { SITE_CONTENT } from '../../core/data/site-content';

@Component({
  selector: 'app-site-header',
  providers: [provideIcons({ lucideChevronDown, lucideMenu })],
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslocoPipe,
    NgIcon,
    NgOptimizedImage,
    HlmMenubarImports,
    HlmDropdownMenuImports,
    HlmButtonImports,
    HlmSheetImports,
  ],
  template: `
    <header
      class="sticky top-0 z-40 border-b border-stone-200/80 bg-cream/90 backdrop-blur-md transition-shadow"
    >
      <div
        class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4"
      >
        <a
          routerLink="/"
          class="group flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
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

        <nav
          class="hidden items-center gap-1 md:flex lg:gap-2"
          [attr.aria-label]="'header.nav.ariaLabel' | transloco"
        >
          <a
            routerLink="/"
            routerLinkActive="bg-stone-200/60 text-ink font-semibold"
            [routerLinkActiveOptions]="{ exact: true }"
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none"
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
            <hlm-dropdown-menu class="w-64 p-1.5 shadow-lg"
              ><hlm-dropdown-menu-group>
                <button
                  hlmDropdownMenuItem
                  (click)="navigateTo('/terapeuta')"
                  (mouseenter)="aboutHoverPath.set('/terapeuta')"
                  (mouseleave)="aboutHoverPath.set(null)"
                  [style.background-color]="aboutOptionBackground('/terapeuta')"
                  [style.color]="aboutOptionTextColor('/terapeuta')"
                >
                  <span class="flex flex-col items-start gap-0.5 text-left"
                    ><span [class]="aboutTitleClass('/terapeuta')">{{
                      'header.aboutModal.therapistTitle' | transloco
                    }}</span
                    ><span [class]="aboutDescriptionClass('/terapeuta')">{{
                      'header.aboutModal.therapistDescription' | transloco
                    }}</span></span
                  >
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
                  <span class="flex flex-col items-start gap-0.5 text-left"
                    ><span [class]="aboutTitleClass('/artista')">{{
                      'header.aboutModal.artistTitle' | transloco
                    }}</span
                    ><span [class]="aboutDescriptionClass('/artista')">{{
                      'header.aboutModal.artistDescription' | transloco
                    }}</span></span
                  >
                </button>
              </hlm-dropdown-menu-group></hlm-dropdown-menu
            >
          </ng-template>
          <a
            routerLink="/"
            fragment="metodologie"
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none"
            >{{ 'header.nav.methods' | transloco }}</a
          >
          <a
            routerLink="/percorsi"
            routerLinkActive="bg-stone-200/60 text-ink font-semibold"
            class="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-stone-200/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none"
            >{{ 'header.nav.journeys' | transloco }}</a
          >
          <a
            routerLink="/contatti"
            routerLinkActive="bg-primary-dark text-white"
            class="ml-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white! shadow-sm transition-colors hover:bg-primary-dark focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:outline-none"
            >{{ 'header.nav.contact' | transloco }}</a
          >
        </nav>

        <hlm-sheet #mobileSheet side="right">
          <button
            hlmBtn
            hlmSheetTrigger
            variant="ghost"
            size="icon"
            type="button"
            class="text-ink hover:bg-stone-200/50 md:hidden"
            [attr.aria-label]="'header.mobileMenuToggleAriaLabel' | transloco"
          >
            <ng-icon name="lucideMenu" class="size-6" aria-hidden="true" />
          </button>

          <hlm-sheet-content
            *hlmSheetPortal="let ctx"
            class="w-[min(88vw,24rem)] border-stone-200 bg-cream p-0 text-ink shadow-2xl sm:w-[24rem]"
          >
            <hlm-sheet-header
              class="border-b border-stone-200 px-5 pt-6 pr-14 pb-5"
            >
              <div class="flex items-center gap-3">
                <img
                  ngSrc="/carla-logo.svg"
                  width="150"
                  height="40"
                  alt="Carla"
                  class="h-8 w-auto max-w-[150px] object-contain"
                />
              </div>
              <p
                hlmSheetDescription
                class="max-w-xs text-sm leading-relaxed text-ink-muted"
              >
                {{ 'header.mobileNavAriaLabel' | transloco }}
              </p>
            </hlm-sheet-header>

            <nav
              class="flex max-h-[calc(100dvh-9rem)] flex-col gap-1 overflow-y-auto px-4 py-5"
              [attr.aria-label]="'header.mobileNavAriaLabel' | transloco"
            >
              <a
                routerLink="/"
                routerLinkActive="bg-stone-200 text-ink font-semibold"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="mobileSheet.close()"
                class="flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-medium text-ink-muted transition-colors hover:bg-stone-200/60 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none"
                >{{ 'header.nav.home' | transloco }}</a
              >

              <div class="mt-4 px-4 pt-2 pb-1">
                <span
                  class="text-[0.68rem] font-semibold tracking-[0.16em] text-ink-muted uppercase"
                >
                  {{ 'header.nav.about' | transloco }}
                </span>
              </div>
              <div class="grid gap-1">
                <a
                  routerLink="/terapeuta"
                  routerLinkActive="bg-primary/10 text-primary font-semibold"
                  (click)="mobileSheet.close()"
                  class="flex min-h-11 items-center rounded-xl px-4 py-2.5 text-sm text-ink-muted transition-colors hover:bg-stone-200/60 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none"
                  >{{ 'header.aboutModal.therapistTitle' | transloco }}</a
                >
                <a
                  routerLink="/artista"
                  routerLinkActive="bg-[var(--color-antique-gold)]/20 text-ink font-semibold"
                  (click)="mobileSheet.close()"
                  class="flex min-h-11 items-center rounded-xl px-4 py-2.5 text-sm text-ink-muted transition-colors hover:bg-stone-200/60 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none"
                  >{{ 'header.aboutModal.artistTitle' | transloco }}</a
                >
              </div>

              <div class="mt-4 px-4 pt-2 pb-1">
                <span
                  class="text-[0.68rem] font-semibold tracking-[0.16em] text-ink-muted uppercase"
                >
                  {{ 'header.nav.methods' | transloco }}
                </span>
              </div>
              <div class="grid gap-1">
                @for (method of content.methods; track method.slug) {
                  <a
                    [routerLink]="['/' + method.slug]"
                    routerLinkActive="bg-primary/10 text-primary font-semibold"
                    (click)="mobileSheet.close()"
                    class="flex min-h-11 items-center rounded-xl px-4 py-2.5 text-sm text-ink-muted transition-colors hover:bg-stone-200/60 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none"
                    >{{ method.title | transloco }}</a
                  >
                }
              </div>

              <div class="my-4 h-px bg-stone-200"></div>

              <a
                routerLink="/percorsi"
                routerLinkActive="bg-stone-200 text-ink font-semibold"
                (click)="mobileSheet.close()"
                class="flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-medium text-ink-muted transition-colors hover:bg-stone-200/60 hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-none"
                >{{ 'header.nav.journeys' | transloco }}</a
              >
              <a
                routerLink="/contatti"
                (click)="mobileSheet.close()"
                class="mt-2 flex min-h-12 items-center justify-center rounded-xl bg-primary px-4 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-primary-dark focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:outline-none"
                >{{ 'header.nav.contact' | transloco }}</a
              >
            </nav>
          </hlm-sheet-content>
        </hlm-sheet>
      </div>
    </header>
  `,
})
export class SiteHeader {
  readonly content = SITE_CONTENT;
  readonly isAboutMenuOpen = signal(false);
  readonly aboutHoverPath = signal<string | null>(null);
  private readonly router = inject(Router);
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
