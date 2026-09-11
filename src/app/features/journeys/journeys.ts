import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { SITE_CONTENT } from '../../core/data/site-content';
import { Seo } from '../../core/seo/seo';

@Component({
  selector: 'app-journeys',
  imports: [RouterLink, TranslocoPipe, HlmButtonImports, HlmCardImports],
  template: `
    <article class="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <!-- Intestazione -->
      <header class="mb-12 text-center">
        <span
          class="bg-aqua-light text-aqua inline-flex rounded-full px-3.5 py-1 text-xs font-semibold tracking-wider uppercase"
        >
          {{ 'journeys.eyebrow' | transloco }}
        </span>
        <h1
          class="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl"
        >
          {{ 'journeys.title' | transloco }}
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-ink-muted sm:text-xl">
          {{ 'journeys.subheadline' | transloco }}
        </p>
      </header>

      <!-- Lista dei Percorsi -->
      <div class="space-y-8">
        @for (journey of content.journeys; track journey.id; let idx = $index) {
          <section
            hlmCard
            class="border-stone-200/90 bg-white/80 shadow-xs transition-shadow hover:shadow-sm"
            [attr.aria-labelledby]="'heading-journey-' + journey.id"
          >
            <div
              hlmCardHeader
              class="flex flex-col justify-between gap-4 p-6 sm:p-10 md:flex-row md:items-start"
            >
              <div>
                <span
                  class="text-aqua text-xs font-bold tracking-wider uppercase"
                >
                  {{ 'journeys.optionLabel' | transloco: { n: idx + 1 } }}
                </span>
                <h2
                  hlmCardTitle
                  [id]="'heading-journey-' + journey.id"
                  class="mt-1 text-2xl font-bold text-ink sm:text-3xl"
                >
                  {{ journey.title | transloco }}
                </h2>
                <p hlmCardDescription class="mt-1 font-medium text-ink-muted">
                  {{ journey.subtitle | transloco }}
                </p>
              </div>

              <a hlmBtn routerLink="/contatti" class="shrink-0">
                {{ 'journeys.requestInfo' | transloco }}
              </a>
            </div>

            <div hlmCardContent class="px-6 pb-6 sm:px-10 sm:pb-10">
              <p class="text-base leading-relaxed text-ink-muted">
                {{ journey.description | transloco }}
              </p>

              <div
                class="mt-6 grid grid-cols-1 gap-4 border-t border-stone-100 pt-6 sm:grid-cols-2"
              >
                <div
                  class="rounded-xl border border-stone-200/60 bg-cream/40 p-4"
                >
                  <h3
                    class="text-xs font-bold tracking-wider text-ink uppercase"
                  >
                    {{ 'journeys.goalLabel' | transloco }}
                  </h3>
                  <p class="mt-1 text-sm text-ink-muted">
                    {{ journey.goal | transloco }}
                  </p>
                </div>

                <div
                  class="rounded-xl border border-stone-200/60 bg-cream/40 p-4"
                >
                  <h3
                    class="text-xs font-bold tracking-wider text-ink uppercase"
                  >
                    {{ 'journeys.formatLabel' | transloco }}
                  </h3>
                  <p class="mt-1 text-sm text-ink-muted">
                    {{ journey.format | transloco }}
                  </p>
                </div>
              </div>

              <div class="mt-4">
                <h3 class="text-xs font-bold tracking-wider text-ink uppercase">
                  {{ 'journeys.detailsLabel' | transloco }}
                </h3>
                <ul class="mt-2 space-y-1.5 text-sm text-ink-muted">
                  @for (d of journey.details; track d) {
                    <li class="flex items-center gap-2">
                      <span
                        class="bg-aqua h-1.5 w-1.5 shrink-0 rounded-full"
                      ></span>
                      <span>{{ d | transloco }}</span>
                    </li>
                  }
                </ul>
              </div>
            </div>
          </section>
        }
      </div>

      <!-- Nota Collaborazione Sanitaria -->
      <section
        hlmCard
        class="mt-12 border-stone-300/80 bg-white/90"
        aria-labelledby="heading-collaborazione"
      >
        <div hlmCardHeader class="p-6 sm:p-8">
          <h2
            hlmCardTitle
            id="heading-collaborazione"
            class="text-lg font-bold text-ink"
          >
            {{ 'journeys.healthcareIntegration.title' | transloco }}
          </h2>
          <p hlmCardDescription class="mt-2 leading-relaxed text-ink-muted">
            {{ 'journeys.healthcareIntegration.description' | transloco }}
          </p>
        </div>
      </section>

      <!-- CTA Finale -->
      <section class="mt-12 text-center">
        <a hlmBtn routerLink="/contatti">
          {{ 'journeys.finalCta' | transloco }}
        </a>
      </section>
    </article>
  `,
})
export class Journeys {
  readonly content = SITE_CONTENT;
  private readonly seo = inject(Seo);

  constructor() {
    this.seo.update({
      title: 'Percorsi | Carla Di Lascio',
      description:
        'Percorsi individuali, piccoli gruppi, laboratori esperienziali e collaborazioni con contesti aziendali o sanitari ad Avellino con Carla Di Lascio.',
    });
  }
}
