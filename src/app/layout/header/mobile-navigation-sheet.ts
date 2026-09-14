import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { SITE_CONTENT } from '../../core/data/site-content';

@Component({
  selector: 'app-mobile-navigation-sheet',
  providers: [provideIcons({ lucideMenu })],
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslocoPipe,
    NgIcon,
    NgOptimizedImage,
    HlmButtonImports,
    HlmItemImports,
    HlmSheetImports,
  ],
  template: `
    <hlm-sheet #mobileSheet side="right">
      <button
        hlmBtn
        hlmSheetTrigger
        variant="ghost"
        size="lg"
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
        <hlm-sheet-header class="border-b border-stone-200">
          <img
            ngSrc="/carla-logo.svg"
            width="100"
            height="40"
            alt="Carla"
            class="h-8 max-w-[150px] object-contain"
          />
        </hlm-sheet-header>

        <nav
          class="flex max-h-[calc(100dvh-9rem)] flex-col gap-3 overflow-y-auto px-4 py-5"
          [attr.aria-label]="'header.mobileNavAriaLabel' | transloco"
        >
          <a
            hlmBtn
            variant="ghost"
            routerLink="/"
            routerLinkActive="bg-stone-200 text-ink font-semibold"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="mobileSheet.close()"
            class="min-h-12 w-full justify-start rounded-xl px-4 py-3 text-base font-medium text-ink-muted hover:bg-stone-200/60 hover:text-ink"
            >{{ 'header.nav.home' | transloco }}</a
          >

          <hlm-item variant="outline" size="sm" class="flex-col items-stretch gap-2 rounded-2xl border-stone-200/90 bg-white/40 p-2">
            <hlm-item-header class="px-2 pt-1 pb-0">
              <hlm-item-title class="text-[0.68rem] font-semibold tracking-[0.16em] text-ink-muted uppercase">
                {{ 'header.nav.about' | transloco }}
              </hlm-item-title>
            </hlm-item-header>
            <hlm-item-content class="grid gap-1">
              <a
                hlmBtn
                variant="ghost"
                routerLink="/terapeuta"
                routerLinkActive="bg-primary/10 text-primary font-semibold"
                (click)="mobileSheet.close()"
                class="min-h-11 w-full justify-start rounded-xl px-3 py-2.5 text-sm text-ink-muted hover:bg-stone-200/60 hover:text-ink"
                >{{ 'header.aboutModal.therapistTitle' | transloco }}</a
              >
              <a
                hlmBtn
                variant="ghost"
                routerLink="/artista"
                routerLinkActive="bg-[var(--color-antique-gold)]/20 text-ink font-semibold"
                (click)="mobileSheet.close()"
                class="min-h-11 w-full justify-start rounded-xl px-3 py-2.5 text-sm text-ink-muted hover:bg-stone-200/60 hover:text-ink"
                >{{ 'header.aboutModal.artistTitle' | transloco }}</a
              >
            </hlm-item-content>
          </hlm-item>

          <hlm-item variant="outline" size="sm" class="flex-col items-stretch gap-2 rounded-2xl border-stone-200/90 bg-white/40 p-2">
            <hlm-item-header class="px-2 pt-1 pb-0">
              <hlm-item-title class="text-[0.68rem] font-semibold tracking-[0.16em] text-ink-muted uppercase">
                {{ 'header.nav.methods' | transloco }}
              </hlm-item-title>
            </hlm-item-header>
            <hlm-item-content class="grid gap-1">
              @for (method of content.methods; track method.slug) {
                <a
                  hlmBtn
                  variant="ghost"
                  [routerLink]="['/' + method.slug]"
                  routerLinkActive="bg-primary/10 text-primary font-semibold"
                  (click)="mobileSheet.close()"
                  class="min-h-11 w-full justify-start rounded-xl px-3 py-2.5 text-sm text-ink-muted hover:bg-stone-200/60 hover:text-ink"
                  >{{ method.title | transloco }}</a
                >
              }
            </hlm-item-content>
          </hlm-item>

          <hlm-item variant="outline" size="sm" class="rounded-2xl border-stone-200/90 bg-white/40">
            <hlm-item-content>
              <a
                hlmBtn
                variant="ghost"
                routerLink="/percorsi"
                routerLinkActive="bg-stone-200 text-ink font-semibold"
                (click)="mobileSheet.close()"
                class="min-h-11 w-full justify-start rounded-xl px-3 py-2.5 text-base font-medium text-ink-muted hover:bg-stone-200/60 hover:text-ink"
                >{{ 'header.nav.journeys' | transloco }}</a
              >
            </hlm-item-content>
          </hlm-item>

          <a
            hlmBtn
            variant="default"
            routerLink="/contatti"
            (click)="mobileSheet.close()"
            class="min-h-12 w-full rounded-xl bg-primary px-4 py-3 text-base font-medium text-white! shadow-sm hover:bg-primary-dark"
            >{{ 'header.nav.contact' | transloco }}</a
          >
        </nav>
      </hlm-sheet-content>
    </hlm-sheet>
  `,
})
export class MobileNavigationSheet {
  readonly content = SITE_CONTENT;
}
