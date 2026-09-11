import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SITE_CONTENT } from '../../core/data/site-content';
import { Seo } from '../../core/seo/seo';
import { CtaBannerComponent } from '../../shared/cta-banner/cta-banner';

@Component({
  selector: 'app-artist-bio',
  imports: [TranslocoPipe, HlmButtonImports, CtaBannerComponent],
  template: `
    <article class="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <!-- Intestazione Pagina -->
      <header class="mb-12 text-center">
        <span
          class="bg-coral/10 text-coral inline-flex rounded-full px-3.5 py-1 text-xs font-semibold tracking-wider uppercase"
        >
          {{ 'artistBio.eyebrow' | transloco }}
        </span>
        <h1
          class="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl"
        >
          {{ content.personalInfo.name }}
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-ink-muted sm:text-xl">
          {{ 'artistBio.subheadline' | transloco }}
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
              [attr.aria-label]="'artistBio.portraitAlt' | transloco"
            >
              <rect width="200" height="200" rx="24" fill="#faf7f2" />
              <ellipse
                cx="95"
                cy="105"
                rx="58"
                ry="42"
                stroke="#c95d4a"
                stroke-width="1.5"
                stroke-dasharray="4 4"
                transform="rotate(-18 95 105)"
              />
              <circle cx="70" cy="80" r="9" fill="#c95d4a" />
              <circle cx="100" cy="70" r="9" fill="#7c6ca6" />
              <circle cx="128" cy="82" r="9" fill="#548da7" />
              <circle cx="118" cy="112" r="9" fill="#2d8a85" />
              <circle cx="82" cy="115" r="9" fill="#d9788a" />
              <path
                d="M132 118 L160 155"
                stroke="#162438"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M156 150 L168 168"
                stroke="#4a5d73"
                stroke-width="6"
                stroke-linecap="round"
              />
            </svg>
            <div
              class="absolute right-4 bottom-4 left-4 rounded-xl border border-stone-200 bg-white/90 p-3 text-center"
            >
              <p class="text-xs font-bold text-ink">
                {{ content.personalInfo.name }}
              </p>
              <p class="text-[11px] text-ink-muted">
                {{ 'artistBio.portraitSubtitle' | transloco }}
              </p>
            </div>
          </div>
        </div>

        <!-- Colonna 2: Presentazione Narrativa -->
        <div class="space-y-6 lg:col-span-7">
          <section aria-labelledby="heading-formazione-artista">
            <h2
              id="heading-formazione-artista"
              class="text-2xl font-bold text-ink"
            >
              {{ 'artistBio.training.title' | transloco }}
            </h2>
            <p class="mt-3 text-base leading-relaxed text-ink-muted">
              {{ 'artistBio.training.paragraph1' | transloco }}
            </p>
            <p class="mt-3 text-base leading-relaxed text-ink-muted">
              {{ 'artistBio.training.paragraph2' | transloco }}
            </p>
          </section>

          <!-- Mostre ed esposizioni -->
          <section aria-labelledby="heading-mostre">
            <h2 id="heading-mostre" class="text-xl font-bold text-ink">
              {{ 'artistBio.exhibitions.title' | transloco }}
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-ink-muted">
              {{ 'artistBio.exhibitions.description' | transloco }}
            </p>
            <ul class="mt-3 flex flex-wrap gap-2">
              @for (city of content.artistBio.exhibitionCities; track city) {
                <li
                  class="border-coral/30 bg-coral-light text-coral-dark rounded-full border px-3 py-1 text-xs font-semibold"
                >
                  {{ city | transloco }}
                </li>
              }
            </ul>
          </section>

          <!-- Riconoscimenti e critica -->
          <section aria-labelledby="heading-critica">
            <h2 id="heading-critica" class="text-xl font-bold text-ink">
              {{ 'artistBio.criticism.title' | transloco }}
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-ink-muted">
              {{ 'artistBio.criticism.paragraph1' | transloco }}
            </p>
            <p class="mt-3 text-sm leading-relaxed text-ink-muted">
              {{ 'artistBio.criticism.paragraph2' | transloco }}
            </p>
          </section>
        </div>
      </div>

      <!-- Ricerca pittorica: citazione evocativa -->
      <section
        class="mt-16 border-t border-stone-200/80 pt-12"
        [attr.aria-label]="'artistBio.philosophy.ariaLabel' | transloco"
      >
        <blockquote
          class="border-coral/20 bg-coral-light/30 rounded-3xl border p-8 text-center sm:p-12"
        >
          <h2 class="text-coral text-xs font-bold tracking-wider uppercase">
            {{ 'artistBio.philosophy.title' | transloco }}
          </h2>
          <p
            class="mx-auto mt-4 max-w-2xl text-xl leading-relaxed font-semibold text-ink italic sm:text-2xl"
          >
            «{{ 'artistBio.philosophy.quote' | transloco }}»
          </p>
          <footer class="mx-auto mt-4 max-w-xl text-sm text-ink-muted">
            {{ 'artistBio.philosophy.closing' | transloco }}
          </footer>
        </blockquote>
      </section>

      <!-- CTA: rimando al percorso da terapeuta -->
      <app-cta-banner
        [title]="'artistBio.cta.title' | transloco"
        [description]="'artistBio.cta.description' | transloco"
        [buttons]="[
          {
            label: ('artistBio.cta.therapistLink' | transloco),
            route: '/chi-sono',
          },
          {
            label: ('artistBio.cta.contactLink' | transloco),
            route: '/contatti',
            variant: 'outline',
            className:
              'border border-stone-200 bg-white/90 px-6 py-3 text-ink shadow-sm hover:bg-stone-100 hover:text-ink',
          },
        ]"
        sectionId="heading-cta-artist-bio"
      />
    </article>
  `,
})
export class ArtistBio {
  readonly content = SITE_CONTENT;
  private readonly seo = inject(Seo);

  constructor() {
    this.seo.update({
      title: 'Carla Di Lascio, Artista | Pittrice e Ceramista',
      description:
        'La formazione artistica, le mostre e la ricerca pittorica di Carla Di Lascio: diploma di Arte del tessuto, decorazione su ceramica, esposizioni in Italia e in Europa.',
    });
  }
}
