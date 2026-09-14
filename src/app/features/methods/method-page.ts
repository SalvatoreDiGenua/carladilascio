import { Component, computed, effect, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronRight, lucideInfo } from '@ng-icons/lucide';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { RouterLink } from '@angular/router';
import { SITE_CONTENT } from '../../core/data/site-content';
import { MethodItem } from '../../core/models/portfolio.model';
import { Seo } from '../../core/seo/seo';
import { CtaBannerComponent } from '../../shared/cta-banner/cta-banner';

@Component({
  selector: 'app-method-page',
  providers: [provideIcons({ lucideCheck, lucideChevronRight, lucideInfo })],
  imports: [
    TranslocoPipe,
    NgIcon,
    HlmBreadcrumbImports,
    HlmButtonImports,
    HlmCardImports,
    CtaBannerComponent,
    RouterLink,
  ],
  styleUrl: './method-page.css',
  template: `
    @if (method(); as m) {
      <article class="method-page mx-auto px-4 sm:px-6 sm:py-16">
        <div class="method-page__content">
          <nav
            hlmBreadcrumb
            [aria-label]="'method.breadcrumb.ariaLabel' | transloco"
            class="mb-8"
          >
            <ol hlmBreadcrumbList>
              <li hlmBreadcrumbItem>
                <a hlmBreadcrumbLink link="/">{{
                  'header.nav.home' | transloco
                }}</a>
              </li>
              <li hlmBreadcrumbSeparator></li>
              <li hlmBreadcrumbItem>
                <a hlmBreadcrumbLink link="/" fragment="metodologie">{{
                  'header.nav.methods' | transloco
                }}</a>
              </li>
              <li hlmBreadcrumbSeparator></li>
              <li hlmBreadcrumbItem>
                <span hlmBreadcrumbPage>{{ m.title | transloco }}</span>
              </li>
            </ol>
          </nav>

          <header>
            <p
              class="mb-3 text-xs font-semibold tracking-[0.18em] text-aqua uppercase"
            >
              {{ 'header.nav.methods' | transloco }}
            </p>
            <h1
              class="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl"
            >
              {{ m.title | transloco }}
            </h1>
            <p class="mt-4 text-lg text-ink-muted sm:text-xl">
              {{ m.shortDescription | transloco }}
            </p>
            <div class="my-6 flex flex-wrap gap-3">
              <a hlmBtn size="lg" routerLink="/contatti" class="px-5 py-2.5">{{
                'method.requestInfo' | transloco
              }}</a>
            </div>
          </header>

          <section
            hlmCard
            class="mb-10 border-stone-200/80 bg-white/60"
            aria-labelledby="heading-cosa-fa"
          >
            <div hlmCardHeader class="p-6 sm:p-8">
              <h2
                hlmCardTitle
                id="heading-cosa-fa"
                class="text-2xl font-bold tracking-tight text-ink"
              >
                {{ 'method.section1.title' | transloco }}
              </h2>
            </div>
            <div hlmCardContent class="px-6 pb-6 sm:px-8 sm:pb-8">
              <p class="text-base leading-relaxed text-ink-muted">
                {{ m.treatmentExplanation | transloco }}
              </p>
            </div>
          </section>

          <section
            hlmCard
            class="mb-10 border-aqua/30 bg-aqua-light/40"
            aria-labelledby="heading-approccio-carla"
          >
            <div hlmCardHeader class="p-6 sm:p-8">
              <h2
                hlmCardTitle
                id="heading-approccio-carla"
                class="text-2xl font-bold tracking-tight text-ink"
              >
                {{ 'method.section2.title' | transloco }}
              </h2>
            </div>
            <div hlmCardContent class="px-6 pb-6 sm:px-8 sm:pb-8">
              <p class="text-base leading-relaxed font-normal text-ink">
                {{ m.carlaApproach | transloco }}
              </p>
            </div>
          </section>

          <section class="mb-10" aria-labelledby="heading-obiettivi">
            <h2
              id="heading-obiettivi"
              class="text-2xl font-bold tracking-tight text-ink"
            >
              {{ 'method.section3.title' | transloco }}
            </h2>
            <p class="mt-2 text-sm text-ink-muted">
              {{ 'method.section3.subtitle' | transloco }}
            </p>
            <ul class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              @for (goal of m.goals; track goal) {
                <li
                  class="flex items-start gap-3 rounded-xl border border-stone-200/70 bg-white/50 p-4"
                >
                  <ng-icon
                    name="lucideCheck"
                    class="mt-0.5 size-5 shrink-0 text-aqua"
                    aria-hidden="true"
                  /><span class="text-sm font-medium text-ink">{{
                    goal | transloco
                  }}</span>
                </li>
              }
            </ul>
          </section>

          <div class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <section
              hlmCard
              class="border-stone-200/80 bg-white/60"
              aria-labelledby="heading-svolgimento"
            >
              <div hlmCardHeader class="p-6">
                <h3
                  hlmCardTitle
                  id="heading-svolgimento"
                  class="text-lg font-bold text-ink"
                >
                  {{ 'method.session.title' | transloco }}
                </h3>
              </div>
              <div hlmCardContent class="px-6 pb-6">
                <p class="text-sm leading-relaxed text-ink-muted">
                  {{ m.sessionFormat | transloco }}
                </p>
              </div>
            </section>
            <section
              hlmCard
              class="border-stone-200/80 bg-white/60"
              aria-labelledby="heading-destinatari"
            >
              <div hlmCardHeader class="p-6">
                <h3
                  hlmCardTitle
                  id="heading-destinatari"
                  class="text-lg font-bold text-ink"
                >
                  {{ 'method.audience.title' | transloco }}
                </h3>
              </div>
              <div hlmCardContent class="px-6 pb-6">
                <ul class="space-y-2 text-sm text-ink-muted">
                  @for (item of m.audience; track item) {
                    <li class="flex items-center gap-2">
                      <span
                        class="h-1.5 w-1.5 shrink-0 rounded-full bg-aqua"
                      ></span
                      ><span>{{ item | transloco }}</span>
                    </li>
                  }
                </ul>
              </div>
            </section>
          </div>

          <section
            class="mb-12 rounded-2xl border border-amber-200 bg-amber-50/70 p-6 text-sm text-amber-900"
            aria-labelledby="heading-avvertenze"
          >
            <div class="flex items-center gap-2 font-semibold">
              <ng-icon
                name="lucideInfo"
                class="size-5 shrink-0 text-amber-700"
                aria-hidden="true"
              />
              <h3 id="heading-avvertenze" class="text-sm font-semibold">
                {{ 'method.cautions.title' | transloco }}
              </h3>
            </div>
            <p class="mt-2 text-xs leading-relaxed text-amber-900/90">
              {{ m.cautions | transloco }}
            </p>
          </section>

          <app-cta-banner
            [title]="'method.cta.title' | transloco"
            [description]="'method.cta.description' | transloco"
            [buttons]="[
              { label: ('method.requestInfo' | transloco), route: '/contatti' },
              {
                label:
                  ('method.cta.callLabel'
                  | transloco: { phone: content.personalInfo.phone }),
                href: 'tel:' + content.personalInfo.phoneRaw,
                variant: 'outline',
                className:
                  'border border-stone-200 bg-white/90 px-6 py-3 text-ink shadow-sm hover:bg-stone-100 hover:text-ink',
              },
            ]"
            sectionId="heading-cta-method"
            class="mb-16 block"
          />

          <section
            class="border-t border-stone-200 pt-10"
            aria-labelledby="heading-altre"
          >
            <h2 id="heading-altre" class="text-xl font-bold text-ink">
              {{ 'method.otherMethods.title' | transloco }}
            </h2>
            <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              @for (other of otherMethods(); track other.slug) {
                <a
                  [routerLink]="['/' + other.slug]"
                  class="group flex flex-col justify-between rounded-xl border border-stone-200/80 bg-white/70 p-5 transition-all hover:border-aqua/50 hover:shadow-sm"
                >
                  <div>
                    <h3
                      class="font-bold text-ink transition-colors group-hover:text-aqua"
                    >
                      {{ other.title | transloco }}
                    </h3>
                    <p class="mt-1 line-clamp-2 text-xs text-ink-muted">
                      {{ other.shortDescription | transloco }}
                    </p>
                  </div>
                  <span
                    class="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-aqua"
                    >{{ 'method.otherMethods.discoverMore' | transloco
                    }}<ng-icon
                      name="lucideChevronRight"
                      class="size-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                  /></span>
                </a>
              }
            </div>
          </section>
        </div>
      </article>
    }
  `,
})
export class MethodPage {
  readonly content = SITE_CONTENT;
  private readonly seo = inject(Seo);
  private readonly transloco = inject(TranslocoService);
  readonly slug = input<string>();

  readonly method = computed<MethodItem | undefined>(() => {
    const s = this.slug();
    if (!s) return this.content.methods[0];
    return (
      this.content.methods.find((m) => m.slug === s) || this.content.methods[0]
    );
  });

  readonly otherMethods = computed<MethodItem[]>(() => {
    const current = this.method();
    if (!current) return this.content.methods.slice(1);
    return this.content.methods.filter((m) => m.slug !== current.slug);
  });

  constructor() {
    effect(() => {
      const m = this.method();
      if (m) {
        const title = this.transloco.translate(m.title);
        const shortDescription = this.transloco.translate(m.shortDescription);
        this.seo.update({
          title: `${title} | Carla Di Lascio`,
          description: `${title}: ${shortDescription}`,
        });
      }
    });
  }
}
