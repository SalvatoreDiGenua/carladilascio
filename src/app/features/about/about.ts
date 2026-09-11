import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { SITE_CONTENT } from '../../core/data/site-content';
import { Seo } from '../../core/seo/seo';

@Component({
  selector: 'app-about',
  imports: [RouterLink, TranslocoPipe],
  template: `
    <article class="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <!-- Intestazione Pagina -->
      <header class="mb-12 text-center">
        <span
          class="bg-powder/10 text-powder inline-flex rounded-full px-3.5 py-1 text-xs font-semibold tracking-wider uppercase"
        >
          {{ 'about.eyebrow' | transloco }}
        </span>
        <h1
          class="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl"
        >
          {{ content.personalInfo.name }}
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-ink-muted sm:text-xl">
          {{ 'about.subheadline' | transloco }}
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
              [attr.aria-label]="'about.portraitAlt' | transloco"
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
                {{ 'about.portraitAddress' | transloco }}
              </p>
            </div>
          </div>
          <div
            class="mt-4 rounded-xl border border-stone-200/80 bg-white/70 p-4 text-center text-xs text-ink-muted"
          >
            {{ content.personalInfo.availability | transloco }}
          </div>
        </div>

        <!-- Colonna 2: Presentazione Narrativa -->
        <div class="space-y-6 lg:col-span-7">
          <section aria-labelledby="heading-percorso">
            <h2 id="heading-percorso" class="text-2xl font-bold text-ink">
              {{ 'about.journey.title' | transloco }}
            </h2>
            <p class="mt-3 text-base leading-relaxed text-ink-muted">
              {{ 'about.journey.paragraph1' | transloco }}
            </p>
            <p class="mt-3 text-base leading-relaxed text-ink-muted">
              {{ 'about.journey.paragraph2' | transloco }}
            </p>
          </section>

          <!-- Ambiti di competenza -->
          <section aria-labelledby="heading-competenze-chi-sono">
            <h2
              id="heading-competenze-chi-sono"
              class="text-xl font-bold text-ink"
            >
              {{ 'about.skills.title' | transloco }}
            </h2>
            <ul class="mt-3 space-y-2 text-sm text-ink-muted">
              @for (role of content.personalInfo.roles; track role) {
                <li class="flex items-center gap-2">
                  <span class="bg-aqua h-2 w-2 shrink-0 rounded-full"></span>
                  <span>{{ role | transloco }}</span>
                </li>
              }
            </ul>
          </section>

          <!-- Filosofia di lavoro -->
          <section aria-labelledby="heading-filosofia">
            <h2 id="heading-filosofia" class="text-xl font-bold text-ink">
              {{ 'about.philosophy.title' | transloco }}
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-ink-muted">
              {{ 'about.philosophy.paragraph' | transloco }}
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
            class="text-aqua text-xs font-bold tracking-wider uppercase"
          >
            {{ 'about.values.eyebrow' | transloco }}
          </h2>
          <p class="mt-2 text-3xl font-extrabold text-ink">
            {{ 'about.values.title' | transloco }}
          </p>
        </div>

        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (pillar of content.pillars; track pillar.title) {
            <div class="rounded-2xl border border-stone-200/80 bg-white/70 p-6">
              <h3 class="text-base font-bold text-ink">
                {{ pillar.title | transloco }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-ink-muted">
                {{ pillar.description | transloco }}
              </p>
            </div>
          }
        </div>
      </section>

      <!-- CTA Contatti -->
      <section
        class="mt-16 rounded-3xl bg-ink p-8 text-center text-white sm:p-12"
        [attr.aria-label]="'about.cta.ariaLabel' | transloco"
      >
        <h2 class="text-2xl font-bold sm:text-3xl">
          {{ 'about.cta.title' | transloco }}
        </h2>
        <p class="mx-auto mt-3 max-w-xl text-sm text-stone-300">
          {{ 'about.cta.description' | transloco }}
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-4">
          <a
            routerLink="/contatti"
            class="bg-aqua hover:bg-aqua-dark rounded-xl px-6 py-3 text-sm font-semibold text-white"
          >
            {{ 'about.cta.contactLink' | transloco }}
          </a>
          <a
            [href]="'tel:' + content.personalInfo.phoneRaw"
            class="rounded-xl border border-stone-400/50 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800"
          >
            {{
              'about.cta.callLabel'
                | transloco: { phone: content.personalInfo.phone }
            }}
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
