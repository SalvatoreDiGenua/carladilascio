import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SITE_CONTENT } from '../../core/data/site-content';
import { Seo } from '../../core/seo/seo';
import { CtaBannerComponent } from '../../shared/cta-banner/cta-banner';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    TranslocoPipe,
    HlmButtonImports,
    CtaBannerComponent,
    NgOptimizedImage,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly content = SITE_CONTENT;
  private readonly seo = inject(Seo);

  constructor() {
    this.seo.update({
      title: 'Carla Di Lascio | Artista, Arte Terapeuta e Benessere Integrato',
      description:
        'Carla Di Lascio unisce il percorso professionale nell’arte terapia e nel benessere integrato alla ricerca artistica tra pittura, ceramica e colore.',
    });
  }
}
