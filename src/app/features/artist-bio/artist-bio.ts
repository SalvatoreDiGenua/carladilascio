import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { SITE_CONTENT } from '../../core/data/site-content';
import { Seo } from '../../core/seo/seo';
import { CtaBannerComponent } from '../../shared/cta-banner/cta-banner';

@Component({
  selector: 'app-artist-bio',
  imports: [
    TranslocoPipe,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    CtaBannerComponent,
    NgOptimizedImage,
  ],
  template: `
    <main class="bg-cream">
      <section
        class="border-b border-stone-200/70 bg-cream-subtle px-4 py-14 sm:px-6 sm:py-20"
      >
        <div class="mx-auto grid max-w-6xl items-end gap-10 lg:grid-cols-12">
          <div class="lg:col-span-8">
            <p
              class="text-sm font-semibold tracking-[0.18em] text-primary uppercase"
            >
              {{ 'header.aboutModal.artistTitle' | transloco }}
            </p>
            <h1
              class="mt-4 max-w-4xl font-serif text-4xl leading-tight font-bold tracking-tight text-ink sm:text-6xl"
            >
              {{ content.personalInfo.name }}
            </h1>
            <p
              class="mt-5 max-w-2xl text-xl leading-relaxed text-ink-muted sm:text-2xl"
            >
              {{ 'artistBio.subheadline' | transloco }}
            </p>
          </div>
          <div class="lg:col-span-4 lg:border-l lg:border-primary/20 lg:pl-8">
            <p class="text-sm leading-relaxed text-ink-muted">
              {{ 'artistBio.featuredWork.description' | transloco }}
            </p>
          </div>
        </div>
      </section>

      <section class="px-4 py-16 sm:px-6 sm:py-20">
        <div
          class="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-12 lg:gap-16"
        >
          <figure class="lg:col-span-5">
            <div
              class="overflow-hidden rounded-[2rem] border border-primary/20 bg-ink shadow-xl shadow-ink/10"
            >
              <img
                ngSrc="/la-maddalena-cuore-blu.jpg"
                width="1458"
                height="1909"
                priority
                class="aspect-[1458/1909] w-full object-cover"
                [attr.alt]="'artistBio.portraitAlt' | transloco"
              />
            </div>
            <figcaption
              class="mt-4 border-l-2 border-primary pl-4 text-sm text-ink-muted"
            >
              {{ 'artistBio.portraitSubtitle' | transloco }}
            </figcaption>
          </figure>

          <div class="space-y-10 lg:col-span-7">
            <section aria-labelledby="artist-training">
              <h2
                id="artist-training"
                class="mt-2 font-serif text-3xl font-bold text-ink"
              >
                {{ 'artistBio.training.title' | transloco }}
              </h2>
              <p class="mt-4 text-base leading-relaxed text-ink-muted">
                {{ 'artistBio.training.paragraph1' | transloco }}
              </p>
              <p class="mt-4 text-base leading-relaxed text-ink-muted">
                {{ 'artistBio.training.paragraph2' | transloco }}
              </p>
            </section>
            <section
              aria-labelledby="artist-exhibitions"
              class="border-t border-stone-200 pt-8"
            >
              <h2
                id="artist-exhibitions"
                class="mt-2 font-serif text-3xl font-bold text-ink"
              >
                {{ 'artistBio.exhibitions.title' | transloco }}
              </h2>
              <p class="mt-3 text-base leading-relaxed text-ink-muted">
                {{ 'artistBio.exhibitions.description' | transloco }}
              </p>
              <ul class="mt-5 flex flex-wrap gap-2">
                @for (city of content.artistBio.exhibitionCities; track city) {
                  <li>
                    <span hlmBadge variant="outline" class="border-primary/30 text-primary">
                      {{ city | transloco }}
                    </span>
                  </li>
                }
              </ul>
            </section>
            <section
              aria-labelledby="artist-criticism"
              class="border-t border-stone-200 pt-8"
            >
              <h2
                id="artist-criticism"
                class="mt-2 font-serif text-3xl font-bold text-ink"
              >
                {{ 'artistBio.criticism.title' | transloco }}
              </h2>
              <p class="mt-4 text-base leading-relaxed text-ink-muted">
                {{ 'artistBio.criticism.paragraph1' | transloco }}
              </p>
              <p class="mt-4 text-base leading-relaxed text-ink-muted">
                {{ 'artistBio.criticism.paragraph2' | transloco }}
              </p>
            </section>
          </div>
        </div>
      </section>

      <section
        class="border-y border-stone-200/70 bg-ink px-4 py-16 text-cream sm:px-6 sm:py-20"
        [attr.aria-label]="'artistBio.philosophy.ariaLabel' | transloco"
      >
        <div class="mx-auto max-w-4xl text-center">
          <p
            class="text-xs font-semibold tracking-[0.18em] text-primary-light uppercase"
          >
            {{ 'artistBio.philosophy.ariaLabel' | transloco }}
          </p>
          <blockquote
            class="mt-6 font-serif text-2xl leading-relaxed font-semibold italic sm:text-4xl"
          >
            «{{ 'artistBio.philosophy.quote' | transloco }}»
          </blockquote>
          <p
            class="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-cream/70"
          >
            {{ 'artistBio.philosophy.closing' | transloco }}
          </p>
        </div>
      </section>

      <section
        class="px-4 py-16 sm:px-6 sm:py-20"
        aria-labelledby="artist-work"
      >
        <div class="mx-auto max-w-6xl">
          <div class="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div class="lg:col-span-7">
              <p
                class="text-sm font-semibold tracking-[0.16em] text-primary uppercase"
              >
                {{ 'artistBio.featuredWork.title' | transloco }}
              </p>
              <h2
                id="artist-work"
                class="mt-3 font-serif text-3xl font-bold text-ink sm:text-5xl"
              >
                {{ 'artistBio.featuredWork.workTitle' | transloco }}
              </h2>
            </div>
          </div>
          <div class="mt-10 grid gap-5 md:grid-cols-3">
            @for (frame of workFrames; track frame.id) {
              <hlm-card
                class="group overflow-hidden border-stone-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                [style.margin-top.px]="frame.offset ? 32 : 0"
              >
                <div class="overflow-hidden bg-ink">
                  <img
                    ngSrc="/la-maddalena-cuore-blu.jpg"
                    width="1458"
                    height="1909"
                    loading="lazy"
                    class="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    [class.object-center]="frame.position === 'center'"
                    [class.object-top]="frame.position === 'top'"
                    [class.object-bottom]="frame.position === 'bottom'"
                    [attr.alt]="'artistBio.portraitAlt' | transloco"
                  />
                </div>
                <div hlmCardContent class="p-5">
                  <p
                    class="text-xs font-semibold tracking-[0.14em] text-primary uppercase"
                  >
                    {{ frame.label | transloco }}
                  </p>
                  <p hlmCardDescription class="mt-2 leading-relaxed">
                    {{ 'artistBio.featuredWork.description' | transloco }}
                  </p>
                </div>
              </hlm-card>
            }
          </div>
        </div>
      </section>

      <app-cta-banner
        [title]="'artistBio.cta.title' | transloco"
        [description]="'artistBio.cta.description' | transloco"
        [buttons]="[
          {
            label: ('artistBio.cta.therapistLink' | transloco),
            route: '/terapeuta',
          },
          {
            label: ('artistBio.cta.contactLink' | transloco),
            route: '/contatti',
            variant: 'outline',
          },
        ]"
        sectionId="heading-cta-artist-bio"
      />
    </main>
  `,
})
export class ArtistBio {
  readonly content = SITE_CONTENT;
  readonly workFrames = [
    {
      id: 'hero',
      label: 'artistBio.featuredWork.title',
      position: 'center',
      offset: false,
    },
    {
      id: 'material',
      label: 'artistBio.training.title',
      position: 'top',
      offset: true,
    },
    {
      id: 'research',
      label: 'artistBio.philosophy.ariaLabel',
      position: 'bottom',
      offset: false,
    },
  ] as const;

  private readonly seo = inject(Seo);

  constructor() {
    this.seo.update({
      title: 'Carla Di Lascio | Artista e Arte Terapeuta',
      description:
        'La ricerca artistica di Carla Di Lascio tra pittura, ceramica, colore e arte terapia, insieme al percorso professionale nel benessere integrato.',
    });
  }
}
