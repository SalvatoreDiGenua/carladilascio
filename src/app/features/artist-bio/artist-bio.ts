import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SITE_CONTENT } from '../../core/data/site-content';
import { Seo } from '../../core/seo/seo';
import { CtaBannerComponent } from '../../shared/cta-banner/cta-banner';

@Component({
  selector: 'app-artist-bio',
  imports: [
    TranslocoPipe,
    HlmButtonImports,
    CtaBannerComponent,
    NgOptimizedImage,
  ],
  template: `
    <article class="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <!-- Intestazione Pagina -->
      <header class="mb-12 text-center">
        <h1
          class="font-serif text-3xl font-bold tracking-tight text-ink sm:text-5xl"
        >
          {{ content.personalInfo.name }}
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-ink-muted sm:text-xl">
          {{ 'artistBio.subheadline' | transloco }}
        </p>
      </header>

      <!-- Griglia Profilo: Ritratto Simbolico + Biografia Narrativa -->
      <div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <!-- Colonna 1: Opera pittorica in evidenza -->
        <div class="flex flex-col items-center lg:col-span-5">
          <figure
            class="relative w-full max-w-sm overflow-hidden rounded-3xl border border-stone-200/90 bg-ink shadow-sm"
          >
            <img
              ngSrc="/la-maddalena-cuore-blu.jpg"
              width="1458"
              height="1909"
              class="aspect-[1458/1909] w-full object-cover"
              [attr.alt]="'artistBio.portraitAlt' | transloco"
            />
            <div
              class="from-ink/85 pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent pt-16"
            ></div>
            <figcaption class="absolute inset-x-0 bottom-0 px-5 py-4">
              <p
                class="font-serif text-base font-semibold text-cream italic"
              >
                {{ 'artistBio.portraitSubtitle' | transloco }}
              </p>
            </figcaption>
          </figure>
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

      <!-- Opera in evidenza: "La Maddalena: cuore blu" -->
      <section
        class="mt-16 border-t border-stone-200/80 pt-12"
        aria-labelledby="heading-opera-evidenza"
      >
        <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <figure class="lg:col-span-6">
            <div
              class="overflow-hidden rounded-3xl border border-stone-200/90 shadow-md"
            >
              <img
                ngSrc="/la-maddalena-cuore-blu.jpg"
                width="1458"
                height="1909"
                loading="lazy"
                class="aspect-[1458/1909] w-full object-cover"
                [attr.alt]="'home.hero.artworkAlt' | transloco"
              />
            </div>
          </figure>
          <div class="lg:col-span-6">
            <span
              class="bg-primary/60 block h-0.5 w-10 rounded-full"
            ></span>
            <h2
              id="heading-opera-evidenza"
              class="mt-4 font-serif text-2xl font-bold text-ink sm:text-3xl"
            >
              {{ 'artistBio.featuredWork.title' | transloco }}
            </h2>
            <p
              class="mt-2 text-sm font-semibold tracking-wide text-primary uppercase"
            >
              {{ 'artistBio.featuredWork.workTitle' | transloco }}
            </p>
            <p class="mt-4 text-base leading-relaxed text-ink-muted">
              {{ 'artistBio.featuredWork.description' | transloco }}
            </p>
          </div>
        </div>
      </section>

      <!-- Ricerca pittorica: citazione evocativa -->
      <section
        class="mt-16 border-t border-stone-200/80 pt-12"
        [attr.aria-label]="'artistBio.philosophy.ariaLabel' | transloco"
      >
        <blockquote
          class="border-coral/20 bg-coral-light/30 rounded-3xl border p-8 text-center sm:p-12"
        >
          <p
            class="mx-auto max-w-2xl text-xl leading-relaxed font-semibold text-ink italic sm:text-2xl"
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
