import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONTENT } from '../../core/data/site-content';
import { Seo } from '../../core/seo/seo';

@Component({
  selector: 'app-journeys',
  imports: [RouterLink],
  template: `
    <article class="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <!-- Intestazione -->
      <header class="mb-12 text-center">
        <span
          class="inline-flex rounded-full bg-aqua-light px-3.5 py-1 text-xs font-semibold tracking-wider text-aqua uppercase"
        >
          Modalità di lavoro
        </span>
        <h1
          class="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl"
        >
          I Percorsi
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-ink-muted sm:text-xl">
          Soluzioni su misura per il singolo, percorsi in piccoli gruppi,
          laboratori esperienziali e collaborazioni dedicate.
        </p>
      </header>

      <!-- Lista dei Percorsi -->
      <div class="space-y-8">
        @for (journey of content.journeys; track journey.id; let idx = $index) {
          <section
            class="rounded-3xl border border-stone-200/90 bg-white/80 p-6 shadow-xs transition-shadow hover:shadow-sm sm:p-10"
            [attr.aria-labelledby]="'heading-journey-' + journey.id"
          >
            <div
              class="flex flex-col justify-between gap-4 md:flex-row md:items-start"
            >
              <div>
                <span
                  class="text-xs font-bold tracking-wider text-aqua uppercase"
                >
                  Opzione 0{{ idx + 1 }}
                </span>
                <h2
                  [id]="'heading-journey-' + journey.id"
                  class="mt-1 text-2xl font-bold text-ink sm:text-3xl"
                >
                  {{ journey.title }}
                </h2>
                <p class="mt-1 text-sm font-medium text-ink-muted">
                  {{ journey.subtitle }}
                </p>
              </div>

              <a
                routerLink="/contatti"
                class="inline-flex shrink-0 items-center justify-center rounded-xl bg-aqua px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:ring-2 focus-visible:ring-aqua focus-visible:outline-none"
              >
                Richiedi info
              </a>
            </div>

            <p class="mt-4 text-base leading-relaxed text-ink-muted">
              {{ journey.description }}
            </p>

            <div
              class="mt-6 grid grid-cols-1 gap-4 border-t border-stone-100 pt-6 sm:grid-cols-2"
            >
              <div
                class="rounded-xl border border-stone-200/60 bg-cream/40 p-4"
              >
                <h3 class="text-xs font-bold tracking-wider text-ink uppercase">
                  Obiettivo generale
                </h3>
                <p class="mt-1 text-sm text-ink-muted">
                  {{ journey.goal }}
                </p>
              </div>

              <div
                class="rounded-xl border border-stone-200/60 bg-cream/40 p-4"
              >
                <h3 class="text-xs font-bold tracking-wider text-ink uppercase">
                  Formato e modalità
                </h3>
                <p class="mt-1 text-sm text-ink-muted">
                  {{ journey.format }}
                </p>
              </div>
            </div>

            <div class="mt-4">
              <h3 class="text-xs font-bold tracking-wider text-ink uppercase">
                Caratteristiche del percorso:
              </h3>
              <ul class="mt-2 space-y-1.5 text-sm text-ink-muted">
                @for (d of journey.details; track d) {
                  <li class="flex items-center gap-2">
                    <span
                      class="h-1.5 w-1.5 shrink-0 rounded-full bg-aqua"
                    ></span>
                    <span>{{ d }}</span>
                  </li>
                }
              </ul>
            </div>
          </section>
        }
      </div>

      <!-- Nota Collaborazione Sanitaria -->
      <section
        class="mt-12 rounded-2xl border border-stone-300/80 bg-white/90 p-6 sm:p-8"
        aria-labelledby="heading-collaborazione"
      >
        <h2 id="heading-collaborazione" class="text-lg font-bold text-ink">
          Integrazione nei percorsi di cura
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-ink-muted">
          Le metodologie non si sostituiscono mai all’intervento sanitario.
          Possono tuttavia affiancare i percorsi terapeutici concordati con
          medici specialisti, psicoterapeuti, neurologi e psichiatri, offrendo
          uno spazio protetto di ascolto, defaticamento sensoriale ed
          espressione artistica.
        </p>
      </section>

      <!-- CTA Finale -->
      <section class="mt-12 text-center">
        <a
          routerLink="/contatti"
          class="inline-flex items-center gap-2 rounded-xl bg-aqua px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-600"
        >
          Contatta Carla Di Lascio per maggiori informazioni
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
