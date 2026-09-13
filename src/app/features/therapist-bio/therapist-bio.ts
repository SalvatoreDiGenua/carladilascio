import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SITE_CONTENT } from '../../core/data/site-content';
import { Seo } from '../../core/seo/seo';
import { CtaBannerComponent } from '../../shared/cta-banner/cta-banner';

@Component({
  selector: 'app-about',
  imports: [
    TranslocoPipe,
    HlmButtonImports,
    CtaBannerComponent,
    NgOptimizedImage,
    RouterLink,
  ],
  template: `
    <main class="bg-cream">
      <section class="border-b border-stone-200/70 bg-cream-subtle px-4 py-14 sm:px-6 sm:py-20">
        <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:items-end">
          <div class="lg:col-span-8">
            <p class="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
              {{ 'about.eyebrow' | transloco }}
            </p>
            <h1 class="mt-4 max-w-4xl font-serif text-4xl leading-tight font-bold tracking-tight text-ink sm:text-6xl">
              {{ content.personalInfo.name }}
            </h1>
            <p class="mt-5 max-w-3xl text-xl leading-relaxed text-ink-muted sm:text-2xl">
              {{ 'about.subheadline' | transloco }}
            </p>
          </div>
          <aside class="lg:col-span-4 lg:border-l lg:border-primary/20 lg:pl-8">
            <p class="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              {{ 'about.skills.title' | transloco }}
            </p>
            <ul class="mt-4 space-y-2 text-sm leading-relaxed text-ink-muted">
              @for (role of content.personalInfo.roles; track role) {
                <li class="flex gap-3">
                  <span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></span>
                  <span>{{ role | transloco }}</span>
                </li>
              }
            </ul>
          </aside>
        </div>
      </section>

      <section class="px-4 py-16 sm:px-6 sm:py-20">
        <div class="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <figure class="lg:col-span-5">
            <div class="overflow-hidden rounded-[2rem] border border-primary/15 bg-white shadow-lg shadow-ink/5">
              <img
                ngSrc="/biogria carla.jpg"
                width="1200"
                height="1200"
                priority
                class="aspect-square w-full object-cover object-center"
                alt=""
              />
            </div>
            <figcaption class="mt-4 border-l-2 border-primary pl-4 text-sm leading-relaxed text-ink-muted">
              {{ content.personalInfo.availability | transloco }}
            </figcaption>
          </figure>

          <div class="space-y-10 lg:col-span-7">
            <section aria-labelledby="heading-percorso">
              <p class="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                {{ 'about.journey.title' | transloco }}
              </p>
              <h2 id="heading-percorso" class="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">
                {{ 'about.philosophy.title' | transloco }}
              </h2>
              <p class="mt-4 text-base leading-relaxed text-ink-muted">
                {{ 'about.journey.paragraph1' | transloco }}
              </p>
              <p class="mt-4 text-base leading-relaxed text-ink-muted">
                {{ 'about.journey.paragraph2' | transloco }}
              </p>
            </section>

            <section aria-labelledby="heading-filosofia" class="border-t border-stone-200 pt-8">
              <h2 id="heading-filosofia" class="font-serif text-2xl font-bold text-ink">
                {{ 'about.philosophy.title' | transloco }}
              </h2>
              <p class="mt-4 text-base leading-relaxed text-ink-muted">
                {{ 'about.philosophy.paragraph' | transloco }}
              </p>
            </section>
          </div>
        </div>
      </section>

      <section class="border-y border-stone-200/70 bg-white px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="heading-metodologie">
        <div class="mx-auto max-w-6xl">
          <div class="max-w-3xl">
            <p class="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
              {{ 'home.methods.eyebrow' | transloco }}
            </p>
            <h2 id="heading-metodologie" class="mt-3 font-serif text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              {{ 'home.methods.title' | transloco }}
            </h2>
            <p class="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
              {{ 'home.methods.subtitle' | transloco }}
            </p>
          </div>

          <div class="mt-12 grid gap-6 lg:grid-cols-2">
            @for (method of content.methods; track method.slug) {
              <article class="group overflow-hidden rounded-[1.75rem] border border-stone-200 bg-cream-subtle shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div class="grid md:grid-cols-[0.9fr_1.1fr]">
                  <div class="overflow-hidden bg-[#edf2f4]">
                    <img
                      ngSrc="{{ methodImages[method.slug].src }}"
                      width="1200"
                      height="800"
                      loading="lazy"
                      class="h-full min-h-64 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      [alt]="methodImages[method.slug].alt"
                    />
                  </div>
                  <div class="p-6 sm:p-7">
                    <p class="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                      {{ method.slug }}
                    </p>
                    <h3 class="mt-2 font-serif text-2xl font-bold text-ink">
                      {{ method.title | transloco }}
                    </h3>
                    <p class="mt-3 text-sm font-medium leading-relaxed text-ink">
                      {{ method.shortDescription | transloco }}
                    </p>
                    <p class="mt-3 text-sm leading-relaxed text-ink-muted">
                      {{ method.treatmentExplanation | transloco }}
                    </p>
                    <p class="mt-4 text-sm leading-relaxed text-ink-muted">
                      {{ method.carlaApproach | transloco }}
                    </p>
                    <div class="mt-6">
                      <a
                        hlmBtn
                        variant="outline"
                        size="sm"
                        [routerLink]="'/' + method.slug"
                      >
                        {{ 'home.methods.detailsLink' | transloco }}
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            }
          </div>
        </div>
      </section>

      <section class="px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="heading-approccio">
        <div class="mx-auto max-w-6xl">
          <div class="max-w-3xl">
            <p class="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
              {{ 'home.principles.eyebrow' | transloco }}
            </p>
            <h2 id="heading-approccio" class="mt-3 font-serif text-3xl font-bold text-ink sm:text-5xl">
              {{ 'home.principles.title' | transloco }}
            </h2>
          </div>
          <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            @for (principle of content.approachPrinciples; track principle.title) {
              <article class="border-t-2 border-primary/30 pt-5">
                <h3 class="text-base font-bold text-ink">{{ principle.title | transloco }}</h3>
                <p class="mt-2 text-sm leading-relaxed text-ink-muted">
                  {{ principle.description | transloco }}
                </p>
              </article>
            }
          </div>
        </div>
      </section>

      <section class="border-y border-stone-200/70 bg-cream-subtle px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="heading-valori">
        <div class="mx-auto max-w-6xl">
          <div class="max-w-3xl">
            <p class="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
              {{ 'about.values.eyebrow' | transloco }}
            </p>
            <h2 id="heading-valori" class="mt-3 font-serif text-3xl font-bold text-ink sm:text-5xl">
              {{ 'about.values.title' | transloco }}
            </h2>
          </div>
          <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            @for (pillar of content.pillars; track pillar.title) {
              <article class="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h3 class="text-base font-bold text-ink">{{ pillar.title | transloco }}</h3>
                <p class="mt-2 text-sm leading-relaxed text-ink-muted">
                  {{ pillar.description | transloco }}
                </p>
              </article>
            }
          </div>
        </div>
      </section>

      <section class="px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="heading-percorsi">
        <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:items-end">
          <div class="lg:col-span-8">
            <p class="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
              {{ 'home.journeys.eyebrow' | transloco }}
            </p>
            <h2 id="heading-percorsi" class="mt-3 font-serif text-3xl font-bold text-ink sm:text-5xl">
              {{ 'home.journeys.title' | transloco }}
            </h2>
            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              @for (journey of content.journeys; track journey.id) {
                <article class="rounded-2xl border border-stone-200 bg-white p-5">
                  <h3 class="font-bold text-ink">{{ journey.title | transloco }}</h3>
                  <p class="mt-2 text-sm leading-relaxed text-ink-muted">
                    {{ journey.description | transloco }}
                  </p>
                </article>
              }
            </div>
          </div>
          <div class="lg:col-span-4 lg:border-l lg:border-primary/20 lg:pl-8">
            <p class="text-sm leading-relaxed text-ink-muted">
              {{ 'journeys.healthcareIntegration.description' | transloco }}
            </p>
            <a hlmBtn class="mt-6" [routerLink]="'/percorsi'">
              {{ 'home.journeys.cta' | transloco }}
            </a>
          </div>
        </div>
      </section>

      <section class="border-y border-stone-200/70 bg-ink px-4 py-16 text-cream sm:px-6 sm:py-20" aria-labelledby="heading-arte-terapia">
        <div class="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-12">
          <div class="lg:col-span-7">
            <p class="text-xs font-semibold tracking-[0.18em] text-primary-light uppercase">
              {{ 'header.aboutModal.artistTitle' | transloco }} → {{ 'header.aboutModal.therapistTitle' | transloco }}
            </p>
            <h2 id="heading-arte-terapia" class="mt-3 font-serif text-3xl font-bold sm:text-5xl">
              {{ 'methods.arteTerapia.title' | transloco }}
            </h2>
            <p class="mt-5 max-w-2xl text-base leading-relaxed text-cream/75 sm:text-lg">
              {{ 'about.journey.paragraph1' | transloco }}
            </p>
            <p class="mt-4 max-w-2xl text-base leading-relaxed text-cream/75 sm:text-lg">
              {{ 'methods.arteTerapia.carlaApproach' | transloco }}
            </p>
            <a
              hlmBtn
              variant="secondary"
              class="mt-7"
              [routerLink]="'/artista'"
            >
              {{ 'header.aboutModal.artistTitle' | transloco }}
            </a>
          </div>
          <figure class="lg:col-span-5">
            <div class="overflow-hidden rounded-[2rem] border border-cream/10 bg-white/5">
              <img
                ngSrc="/la-maddalena-cuore-blu.jpg"
                width="1458"
                height="1909"
                loading="lazy"
                class="aspect-[4/5] w-full object-cover"
                [attr.alt]="'home.hero.artworkAlt' | transloco"
              />
            </div>
            <figcaption class="mt-3 text-xs text-cream/55">
              {{ 'home.hero.artworkTitle' | transloco }} · {{ 'home.hero.artworkCredit' | transloco: { name: content.personalInfo.name } }}
            </figcaption>
          </figure>
        </div>
      </section>

      <app-cta-banner
        [title]="'about.cta.title' | transloco"
        [description]="'about.cta.description' | transloco"
        [buttons]="[
          {
            label: ('about.cta.contactLink' | transloco),
            route: '/contatti',
          },
          {
            label: ('about.cta.callLabel' | transloco: { phone: content.personalInfo.phone }),
            href: 'tel:' + content.personalInfo.phoneRaw,
            variant: 'outline',
          },
        ]"
        sectionId="heading-cta-about"
      />
    </main>
  `,
})
export class TherapistBio {
  readonly content = SITE_CONTENT;

  readonly methodImages: Record<
    string,
    { src: string; alt: string }
  > = {
    cromopuntura: {
      src: '/metodi-cromopuntura.svg',
      alt: 'Lampada e filtri colorati che rappresentano la cromopuntura',
    },
    'kinesiologia-emozionale': {
      src: '/metodi-kinesiologia.svg',
      alt: 'Mani durante un test muscolare di kinesiologia emozionale',
    },
    'suonoterapia-vibrazionale': {
      src: '/metodi-suonoterapia.svg',
      alt: 'Campana tibetana e onde sonore che rappresentano la suonoterapia vibrazionale',
    },
    'arte-terapia': {
      src: '/metodi-arte-terapia.svg',
      alt: 'Tavolozza, pennelli e tela che rappresentano l’arte terapia',
    },
  };

  private readonly seo = inject(Seo);

  constructor() {
    this.seo.update({
      title: 'Chi sono | Carla Di Lascio',
      description:
        'Profilo professionale di Carla Di Lascio: arte terapeuta, docente di arte e operatrice in tecniche vibrazionali, con metodologie, approccio e percorsi di lavoro.',
    });
  }
}
