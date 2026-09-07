import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONTENT } from '../../core/data/site-content';
import { Seo } from '../../core/seo/seo';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
    <article class="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <!-- Intestazione Pagina -->
      <header class="mb-12 text-center">
        <span
          class="inline-flex rounded-full bg-powder/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-powder uppercase"
        >
          Chi Sono
        </span>
        <h1
          class="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl"
        >
          Carla Di Lascio
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-ink-muted sm:text-xl">
          Docente di Arte, Arte Terapeuta e facilitatrice di benessere
          integrato.
        </p>
      </header>

      <!-- Griglia Profilo: Ritratto Simbolico + Biografia Narrativa -->
      <div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <!-- Colonna 1: Ritratto Astratto Simbolico -->
        <div class="flex flex-col items-center lg:col-span-5">
          <div
            class="relative flex h-80 w-80 items-center justify-center rounded-3xl border border-stone-200/90 bg-white p-6 shadow-sm sm:h-96 sm:w-96"
          >
            <svg
              class="h-full w-full"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Rappresentazione simbolica del profilo di Carla Di Lascio"
            >
              <rect width="200" height="200" rx="24" fill="#faf7f2" />
              <circle
                cx="100"
                cy="100"
                r="70"
                stroke="#2d8a85"
                stroke-width="1.5"
                stroke-dasharray="4 4"
              />
              <circle
                cx="100"
                cy="80"
                r="28"
                fill="#e6f4f2"
                stroke="#2d8a85"
                stroke-width="2"
              />
              <path
                d="M55 160 C 55 125, 145 125, 145 160"
                fill="#f4efe6"
                stroke="#548da7"
                stroke-width="2"
              />
              <circle cx="100" cy="80" r="6" fill="#c95d4a" />
              <circle cx="100" cy="120" r="4" fill="#7c6ca6" />
            </svg>
            <div
              class="absolute right-4 bottom-4 left-4 rounded-xl border border-stone-200 bg-white/90 p-3 text-center"
            >
              <p class="text-xs font-bold text-ink">
                {{ content.personalInfo.name }}
              </p>
              <p class="text-[11px] text-ink-muted">
                Studio ad Avellino, Via Vasto 20
              </p>
            </div>
          </div>
          <div
            class="mt-4 rounded-xl border border-stone-200/80 bg-white/70 p-4 text-center text-xs text-ink-muted"
          >
            {{ content.personalInfo.availability }}
          </div>
        </div>

        <!-- Colonna 2: Presentazione Narrativa -->
        <div class="space-y-6 lg:col-span-7">
          <section aria-labelledby="heading-percorso">
            <h2 id="heading-percorso" class="text-2xl font-bold text-ink">
              Il mio percorso
            </h2>
            <p class="mt-3 text-base leading-relaxed text-ink-muted">
              L’arte e l’insegnamento hanno sempre costituito il fulcro della
              mia ricerca. Nel tempo, osservando come le persone interagiscono
              con forme, colori e ritmi interiori, ho avvertito l’esigenza di
              ampliare lo sguardo verso discipline capaci di sostenere il
              benessere globale della persona.
            </p>
            <p class="mt-3 text-base leading-relaxed text-ink-muted">
              La specializzazione in Arte Terapia ha unito la mia formazione
              visiva con l’ascolto dei processi emotivi. Parallelamente, ho
              approfondito l’efficacia delle tecniche vibrazionali: la Suono
              Terapia con campane tibetane, la Cromopuntura con frequenze di
              luce, la meditazione guidata e la Kinesiologia emozionale.
            </p>
          </section>

          <!-- Ambiti di competenza -->
          <section aria-labelledby="heading-competenze-chi-sono">
            <h2
              id="heading-competenze-chi-sono"
              class="text-xl font-bold text-ink"
            >
              Competenze e ambiti di approfondimento
            </h2>
            <ul class="mt-3 space-y-2 text-sm text-ink-muted">
              @for (role of content.personalInfo.roles; track role) {
                <li class="flex items-center gap-2">
                  <span class="h-2 w-2 shrink-0 rounded-full bg-aqua"></span>
                  <span>{{ role }}</span>
                </li>
              }
            </ul>
          </section>

          <!-- Filosofia di lavoro -->
          <section aria-labelledby="heading-filosofia">
            <h2 id="heading-filosofia" class="text-xl font-bold text-ink">
              Filosofia di lavoro
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-ink-muted">
              Non esistono risposte preconfezionate o percorsi standard. Credo
              nell’accoglienza incondizionata, nel rispetto dei tempi personali
              e nella creazione di un’alleanza fondata sulla fiducia e
              sull’assenza di giudizio. Ogni tecnica è uno strumento per aiutare
              la persona a riconnettersi con la propria voce autentica.
            </p>
          </section>
        </div>
      </div>

      <!-- Pilastri e Valori -->
      <section
        class="mt-16 border-t border-stone-200/80 pt-12"
        aria-labelledby="heading-valori"
      >
        <div class="text-center">
          <h2
            id="heading-valori"
            class="text-xs font-bold tracking-wider text-aqua uppercase"
          >
            I Valori
          </h2>
          <p class="mt-2 text-3xl font-extrabold text-ink">
            I pilastri del mio approccio
          </p>
        </div>

        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (pillar of content.pillars; track pillar.title) {
            <div class="rounded-2xl border border-stone-200/80 bg-white/70 p-6">
              <h3 class="text-base font-bold text-ink">{{ pillar.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-ink-muted">
                {{ pillar.description }}
              </p>
            </div>
          }
        </div>
      </section>

      <!-- CTA Contatti -->
      <section
        class="mt-16 rounded-3xl bg-ink p-8 text-center text-white sm:p-12"
        aria-label="Richiesta appuntamento"
      >
        <h2 class="text-2xl font-bold sm:text-3xl">
          Vuoi iniziare un percorso di ascolto o richiedere un chiarimento?
        </h2>
        <p class="mx-auto mt-3 max-w-xl text-sm text-stone-300">
          Scrivimi o telefona per concordare un incontro presso lo studio di
          Avellino.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-4">
          <a
            routerLink="/contatti"
            class="rounded-xl bg-aqua px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Vai ai Contatti
          </a>
          <a
            [href]="'tel:' + content.personalInfo.phoneRaw"
            class="rounded-xl border border-stone-400/50 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800"
          >
            Chiama il {{ content.personalInfo.phone }}
          </a>
        </div>
      </section>
    </article>
  `,
})
export class About {
  readonly content = SITE_CONTENT;
  private readonly seo = inject(Seo);

  constructor() {
    this.seo.update({
      title: 'Chi sono | Carla Di Lascio',
      description:
        'Docente di Arte, Arte Terapeuta ed esperta in tecniche vibrazionali e cromopuntura ad Avellino. Profilo professionale, formazione e approccio.',
    });
  }
}
