import { Component, computed, effect, inject, input } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { SITE_CONTENT } from '../../core/data/site-content';
import { MethodItem } from '../../core/models/portfolio.model';
import { Seo } from '../../core/seo/seo';
import { CtaBannerComponent } from '../../shared/cta-banner/cta-banner';
import { MethodAvatar3dComponent } from './method-avatar-3d/method-avatar-3d';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-method-page',
  imports: [
    MethodAvatar3dComponent,
    TranslocoPipe,
    HlmBreadcrumbImports,
    HlmButtonImports,
    HlmCardImports,
    CtaBannerComponent,
    RouterLink,
  ],
  template: `
    @if (method(); as m) {
      <article class="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <!-- Breadcrumb / Navigazione a ritroso -->
        <nav
          hlmBreadcrumb
          [aria-label]="'method.breadcrumb.ariaLabel' | transloco"
          class="mb-6"
        >
          <ol hlmBreadcrumbList>
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbLink link="/">
                {{ 'header.nav.home' | transloco }}
              </a>
            </li>
            <li hlmBreadcrumbSeparator></li>
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbLink link="/" fragment="metodologie">
                {{ 'header.nav.methods' | transloco }}
              </a>
            </li>
            <li hlmBreadcrumbSeparator></li>
            <li hlmBreadcrumbItem>
              <span hlmBreadcrumbPage>{{ m.title | transloco }}</span>
            </li>
          </ol>
        </nav>

        <!-- Testata Metodologia — Hero a 2 colonne -->
        <header class="mb-12">
          <div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <!-- Colonna sinistra: testo -->
            <div class="lg:col-span-7">
              <h1
                class="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl"
              >
                {{ m.title | transloco }}
              </h1>
              <p class="mt-4 text-lg text-ink-muted sm:text-xl">
                {{ m.shortDescription | transloco }}
              </p>
              <div class="mt-6 flex flex-wrap gap-3">
                <a hlmBtn size="lg" link="/contatti" class="px-5 py-2.5">
                  {{ 'method.requestInfo' | transloco }}
                </a>
              </div>
            </div>

            <!-- Colonna destra: Avatar 3D di Carla -->
            <div class="lg:col-span-5">
              <div
                class="relative h-[380px] w-full overflow-hidden rounded-2xl border shadow-sm backdrop-blur-sm lg:h-[460px]"
                [class]="m.theme.border"
                [style.background]="
                  'linear-gradient(135deg, #fafaf9 0%, ' +
                  m.theme.primary +
                  '18 100%)'
                "
              >
                <app-method-avatar-3d
                  [slug]="m.slug"
                  [title]="m.title | transloco"
                  [themeColor]="m.theme.primary"
                  class="block h-full w-full"
                />
              </div>
            </div>
          </div>
        </header>

        <!-- Sezione 1: Cosa fa il trattamento -->
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

        <!-- Sezione 2: Come si approccia Carla -->
        <section
          hlmCard
          class="border-aqua/30 bg-aqua-light/40 mb-10"
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

        <!-- Sezione 3: Obiettivi del percorso -->
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
                <svg
                  class="text-aqua mt-0.5 h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-sm font-medium text-ink">{{
                  goal | transloco
                }}</span>
              </li>
            }
          </ul>
        </section>

        <!-- Sezione 4: Come si svolge l'incontro & A chi è rivolto -->
        <div class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Svolgimento -->
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

          <!-- Destinatari -->
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
                      class="bg-aqua h-1.5 w-1.5 shrink-0 rounded-full"
                    ></span>
                    <span>{{ item | transloco }}</span>
                  </li>
                }
              </ul>
            </div>
          </section>
        </div>

        <!-- Sezione 5: Avvertenze e limiti etici -->
        <section
          class="mb-12 rounded-2xl border border-amber-200 bg-amber-50/70 p-6 text-sm text-amber-900"
          aria-labelledby="heading-avvertenze"
        >
          <div class="flex items-center gap-2 font-semibold">
            <svg
              class="h-5 w-5 shrink-0 text-amber-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 id="heading-avvertenze" class="text-sm font-semibold">
              {{ 'method.cautions.title' | transloco }}
            </h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-amber-900/90">
            {{ m.cautions | transloco }}
          </p>
        </section>

        <!-- CTA Box -->
        <app-cta-banner
          [title]="'method.cta.title' | transloco"
          [description]="'method.cta.description' | transloco"
          [buttons]="[
            {
              label: ('method.requestInfo' | transloco),
              route: '/contatti',
            },
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

        <!-- Altre Metodologie -->
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
                class="group hover:border-aqua/50 flex flex-col justify-between rounded-xl border border-stone-200/80 bg-white/70 p-5 transition-all hover:shadow-sm"
              >
                <div>
                  <h3
                    class="group-hover:text-aqua font-bold text-ink transition-colors"
                  >
                    {{ other.title | transloco }}
                  </h3>
                  <p class="mt-1 line-clamp-2 text-xs text-ink-muted">
                    {{ other.shortDescription | transloco }}
                  </p>
                </div>
                <span
                  class="text-aqua mt-3 inline-flex items-center gap-1 text-xs font-semibold"
                >
                  {{ 'method.otherMethods.discoverMore' | transloco }}
                  <svg
                    class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </a>
            }
          </div>
        </section>
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
