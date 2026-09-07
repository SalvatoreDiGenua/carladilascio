import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONTENT } from '../../core/data/site-content';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
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
              Docente di Arte, Arte Terapeuta e operatrice in tecniche
              vibrazionali.
            </p>
            <p class="text-sm text-ink-muted">
              Percorsi di ascolto, benessere integrato e ricerca del proprio sé
              autentico ad Avellino e contesti dedicati.
            </p>
          </div>

          <!-- Colonna 2: Navigazione rapida -->
          <div>
            <h3 class="text-sm font-semibold tracking-wider text-ink uppercase">
              Navigazione
            </h3>
            <ul class="mt-3 space-y-2 text-sm text-ink-muted">
              <li>
                <a
                  routerLink="/"
                  class="transition-colors hover:text-aqua focus-visible:underline"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  routerLink="/chi-sono"
                  class="transition-colors hover:text-aqua focus-visible:underline"
                >
                  Chi sono
                </a>
              </li>
              <li>
                <a
                  routerLink="/cromopuntura"
                  class="transition-colors hover:text-aqua focus-visible:underline"
                >
                  Cromopuntura
                </a>
              </li>
              <li>
                <a
                  routerLink="/kinesiologia-emozionale"
                  class="transition-colors hover:text-aqua focus-visible:underline"
                >
                  Kinesiologia Emozionale
                </a>
              </li>
              <li>
                <a
                  routerLink="/suonoterapia-vibrazionale"
                  class="transition-colors hover:text-aqua focus-visible:underline"
                >
                  Suonoterapia Vibrazionale
                </a>
              </li>
              <li>
                <a
                  routerLink="/arte-terapia"
                  class="transition-colors hover:text-aqua focus-visible:underline"
                >
                  Arte Terapia
                </a>
              </li>
              <li>
                <a
                  routerLink="/percorsi"
                  class="transition-colors hover:text-aqua focus-visible:underline"
                >
                  Percorsi individuali e di gruppo
                </a>
              </li>
              <li>
                <a
                  routerLink="/contatti"
                  class="transition-colors hover:text-aqua focus-visible:underline"
                >
                  Contatti & Ricevimento
                </a>
              </li>
            </ul>
          </div>

          <!-- Colonna 3: Contatti e sede -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold tracking-wider text-ink uppercase">
              Contatti
            </h3>
            <ul class="space-y-2 text-sm text-ink-muted">
              <li>
                <span class="font-medium text-ink">Telefono: </span>
                <a
                  [href]="'tel:' + content.personalInfo.phoneRaw"
                  class="font-medium text-aqua hover:underline"
                >
                  {{ content.personalInfo.phone }}
                </a>
              </li>
              <li>
                <span class="font-medium text-ink">Email: </span>
                <a
                  [href]="'mailto:' + content.personalInfo.email"
                  class="font-medium text-aqua hover:underline"
                >
                  {{ content.personalInfo.email }}
                </a>
              </li>
              <li>
                <span class="font-medium text-ink">Sede: </span>
                <span>{{ content.personalInfo.address }}</span>
              </li>
              <li class="pt-1 text-xs text-ink-muted italic">
                {{ content.personalInfo.availability }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Avvertenza sanitaria e deontologica -->
        <div
          class="mt-10 rounded-xl border border-stone-200/90 bg-cream p-4 text-xs text-ink-muted"
        >
          {{ content.personalInfo.medicalDisclaimer }}
        </div>

        <!-- Copyright e note -->
        <div
          class="mt-6 flex flex-col items-center justify-between gap-2 border-t border-stone-200 pt-6 text-xs text-ink-muted sm:flex-row"
        >
          <p>© {{ currentYear }} Carla Di Lascio. Tutti i diritti riservati.</p>
          <p>Portfolio professionale per il benessere integrato.</p>
        </div>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  readonly content = SITE_CONTENT;
  readonly currentYear = 2026;
}
