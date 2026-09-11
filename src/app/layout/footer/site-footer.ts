import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { SITE_CONTENT } from '../../core/data/site-content';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, TranslocoPipe],
  template: `
    <footer class="mt-20 border-t border-stone-200 bg-stone-100 text-ink">
      <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <!-- Colonna 1: Profilo e missione -->
          <div class="space-y-3">
            <h2 class="text-lg font-bold text-ink">
              {{ content.personalInfo.name }}
            </h2>
            <p class="text-sm font-medium text-ink-muted">
              {{ 'footer.profile.role' | transloco }}
            </p>
            <p class="text-sm text-ink-muted">
              {{ 'footer.profile.mission' | transloco }}
            </p>
          </div>

          <!-- Colonna 2: Navigazione rapida -->
          <div>
            <h3 class="text-sm font-semibold tracking-wider text-ink uppercase">
              {{ 'footer.navigation.title' | transloco }}
            </h3>
            <ul class="mt-3 space-y-2 text-sm text-ink-muted">
              <li>
                <a
                  routerLink="/"
                  class="hover:text-aqua transition-colors focus-visible:underline"
                >
                  {{ 'header.nav.home' | transloco }}
                </a>
              </li>
              <li>
                <a
                  routerLink="/chi-sono"
                  class="hover:text-aqua transition-colors focus-visible:underline"
                >
                  {{ 'header.nav.about' | transloco }}
                </a>
              </li>
              <li>
                <a
                  routerLink="/cromopuntura"
                  class="hover:text-aqua transition-colors focus-visible:underline"
                >
                  {{ 'footer.navigation.chromopuncture' | transloco }}
                </a>
              </li>
              <li>
                <a
                  routerLink="/kinesiologia-emozionale"
                  class="hover:text-aqua transition-colors focus-visible:underline"
                >
                  {{ 'footer.navigation.kinesiology' | transloco }}
                </a>
              </li>
              <li>
                <a
                  routerLink="/suonoterapia-vibrazionale"
                  class="hover:text-aqua transition-colors focus-visible:underline"
                >
                  {{ 'footer.navigation.soundTherapy' | transloco }}
                </a>
              </li>
              <li>
                <a
                  routerLink="/arte-terapia"
                  class="hover:text-aqua transition-colors focus-visible:underline"
                >
                  {{ 'footer.navigation.artTherapy' | transloco }}
                </a>
              </li>
              <li>
                <a
                  routerLink="/percorsi"
                  class="hover:text-aqua transition-colors focus-visible:underline"
                >
                  {{ 'footer.navigation.journeys' | transloco }}
                </a>
              </li>
              <li>
                <a
                  routerLink="/contatti"
                  class="hover:text-aqua transition-colors focus-visible:underline"
                >
                  {{ 'footer.navigation.contact' | transloco }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Colonna 3: Contatti e sede -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold tracking-wider text-ink uppercase">
              {{ 'header.nav.contact' | transloco }}
            </h3>
            <ul class="space-y-2 text-sm text-ink-muted">
              <li>
                <span class="font-medium text-ink"
                  >{{ 'footer.contact.phoneLabel' | transloco }}
                </span>
                <a
                  [href]="'tel:' + content.personalInfo.phoneRaw"
                  class="text-aqua font-medium hover:underline"
                >
                  {{ content.personalInfo.phone }}
                </a>
              </li>
              <li>
                <span class="font-medium text-ink"
                  >{{ 'footer.contact.emailLabel' | transloco }}
                </span>
                <a
                  [href]="'mailto:' + content.personalInfo.email"
                  class="text-aqua font-medium hover:underline"
                >
                  {{ content.personalInfo.email }}
                </a>
              </li>
              <li>
                <span class="font-medium text-ink"
                  >{{ 'footer.contact.addressLabel' | transloco }}
                </span>
                <span>{{ content.personalInfo.address }}</span>
              </li>
              <li class="pt-1 text-xs text-ink-muted italic">
                {{ content.personalInfo.availability | transloco }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Avvertenza sanitaria e deontologica -->
        <div
          class="mt-10 rounded-xl border border-stone-200/90 bg-cream p-4 text-xs text-ink-muted"
        >
          {{ content.personalInfo.medicalDisclaimer | transloco }}
        </div>

        <!-- Copyright e note -->
        <div
          class="mt-6 flex flex-col items-center justify-between gap-2 border-t border-stone-200 pt-6 text-xs text-ink-muted sm:flex-row"
        >
          <p>
            {{
              'footer.copyright'
                | transloco
                  : { year: currentYear, name: content.personalInfo.name }
            }}
          </p>
          <p>{{ 'footer.tagline' | transloco }}</p>
        </div>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  readonly content = SITE_CONTENT;
  readonly currentYear = 2026;
}
