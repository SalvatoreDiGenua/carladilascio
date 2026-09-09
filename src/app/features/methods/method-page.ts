import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONTENT } from '../../core/data/site-content';
import { MethodItem } from '../../core/models/portfolio.model';
import { Seo } from '../../core/seo/seo';

@Component({
  selector: 'app-method-page',
  imports: [RouterLink],
  template: `
    @if (method(); as m) {
      <article class="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <!-- Breadcrumb / Navigazione a ritroso -->
        <nav aria-label="Percorso di navigazione" class="mb-6">
          <ol class="flex items-center gap-2 text-sm text-ink-muted">
            <li>
              <a routerLink="/" class="hover:text-aqua">Home</a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a routerLink="/" fragment="metodologie" class="hover:text-aqua">
                Metodologie
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li class="font-medium text-ink" aria-current="page">
              {{ m.title }}
            </li>
          </ol>
        </nav>

        <!-- Testata Metodologia -->
        <header
          class="mb-12 rounded-3xl border border-stone-200/90 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-10"
        >
          <div
            class="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider {{
              m.theme.badge
            }}"
          >
            <span>Metodologia di Benessere</span>
          </div>
          <h1
            class="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            {{ m.title }}
          </h1>
          <p class="mt-4 text-lg text-ink-muted sm:text-xl">
            {{ m.shortDescription }}
          </p>
        </header>

        <!-- Sezione 1: Cosa fa il trattamento -->
        <section
          class="mb-10 rounded-2xl border border-stone-200/80 bg-white/60 p-6 sm:p-8"
          aria-labelledby="heading-cosa-fa"
        >
          <div class="flex items-center gap-3">
            <span
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-aqua/10 text-sm font-bold text-aqua"
            >
              01
            </span>
            <h2
              id="heading-cosa-fa"
              class="text-2xl font-bold tracking-tight text-ink"
            >
              Cosa fa il trattamento
            </h2>
          </div>
          <p class="mt-4 text-base leading-relaxed text-ink-muted">
            {{ m.treatmentExplanation }}
          </p>
        </section>

        <!-- Sezione 2: Come si approccia Carla -->
        <section
          class="mb-10 rounded-2xl border border-aqua/30 bg-aqua-light/40 p-6 sm:p-8"
          aria-labelledby="heading-approccio-carla"
        >
          <div class="flex items-center gap-3">
            <span
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-aqua text-sm font-bold text-white"
            >
              02
            </span>
            <h2
              id="heading-approccio-carla"
              class="text-2xl font-bold tracking-tight text-ink"
            >
              Come Carla si approccia alla persona
            </h2>
          </div>
          <p class="mt-4 text-base leading-relaxed font-normal text-ink">
            {{ m.carlaApproach }}
          </p>
        </section>

        <!-- Sezione 3: Obiettivi del percorso -->
        <section class="mb-10" aria-labelledby="heading-obiettivi">
          <h2
            id="heading-obiettivi"
            class="text-2xl font-bold tracking-tight text-ink"
          >
            Possibili obiettivi del percorso
          </h2>
          <p class="mt-2 text-sm text-ink-muted">
            Il percorso è sempre personalizzato. Tra i benefici che può
            favorire:
          </p>
          <ul class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            @for (goal of m.goals; track goal) {
              <li
                class="flex items-start gap-3 rounded-xl border border-stone-200/70 bg-white/50 p-4"
              >
                <svg
                  class="mt-0.5 h-5 w-5 shrink-0 text-aqua"
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
                <span class="text-sm font-medium text-ink">{{ goal }}</span>
              </li>
            }
          </ul>
        </section>

        <!-- Sezione 4: Come si svolge l'incontro & A chi è rivolto -->
        <div class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Svolgimento -->
          <section
            class="rounded-2xl border border-stone-200/80 bg-white/60 p-6"
            aria-labelledby="heading-svolgimento"
          >
            <h3 id="heading-svolgimento" class="text-lg font-bold text-ink">
              Come si svolge un incontro
            </h3>
            <p class="mt-3 text-sm leading-relaxed text-ink-muted">
              {{ m.sessionFormat }}
            </p>
          </section>

          <!-- Destinatari -->
          <section
            class="rounded-2xl border border-stone-200/80 bg-white/60 p-6"
            aria-labelledby="heading-destinatari"
          >
            <h3 id="heading-destinatari" class="text-lg font-bold text-ink">
              A chi può essere rivolto
            </h3>
            <ul class="mt-3 space-y-2 text-sm text-ink-muted">
              @for (item of m.audience; track item) {
                <li class="flex items-center gap-2">
                  <span
                    class="h-1.5 w-1.5 shrink-0 rounded-full bg-aqua"
                  ></span>
                  <span>{{ item }}</span>
                </li>
              }
            </ul>
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
              Avvertenze e limiti del percorso
            </h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-amber-900/90">
            {{ m.cautions }}
          </p>
        </section>

        <!-- CTA Box -->
        <section
          class="mb-16 rounded-3xl bg-ink p-8 text-center text-white shadow-md sm:p-10"
          aria-label="Richiedi informazioni sul trattamento"
        >
          <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
            Vuoi approfondire come questo percorso può accompagnarti?
          </h2>
          <p class="mx-auto mt-3 max-w-xl text-sm text-stone-300 sm:text-base">
            Parliamo insieme delle tue esigenze per valutare la proposta più
            armonica e adatta al tuo momento presente.
          </p>
          <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              routerLink="/contatti"
              class="rounded-xl bg-aqua px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-aqua-dark focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Richiedi informazioni
            </a>
            <a
              [href]="'tel:' + content.personalInfo.phoneRaw"
              class="rounded-xl border border-stone-400/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Chiama il {{ content.personalInfo.phone }}
            </a>
          </div>
        </section>

        <!-- Altre Metodologie -->
        <section
          class="border-t border-stone-200 pt-10"
          aria-labelledby="heading-altre"
        >
          <h2 id="heading-altre" class="text-xl font-bold text-ink">
            Esplora le altre metodologie
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
                    {{ other.title }}
                  </h3>
                  <p class="mt-1 line-clamp-2 text-xs text-ink-muted">
                    {{ other.shortDescription }}
                  </p>
                </div>
                <span
                  class="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-aqua"
                >
                  Scopri di più
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
        this.seo.update({
          title: `${m.title} | Carla Di Lascio`,
          description: `${m.title}: ${m.shortDescription}`,
        });
      }
    });
  }
}
