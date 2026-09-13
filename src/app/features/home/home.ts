import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { SITE_CONTENT } from '../../core/data/site-content';
import { Seo } from '../../core/seo/seo';
import { CtaBannerComponent } from '../../shared/cta-banner/cta-banner';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    TranslocoPipe,
    HlmButtonImports,
    HlmCardImports,
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
      title: 'Carla Di Lascio | Arte Terapia & Benessere Integrato',
      description:
        'Percorsi di arte terapia, benessere integrato e tecniche vibrazionali con Carla Di Lascio ad Avellino. Cromopuntura, suonoterapia e kinesiologia emozionale.',
    });
  }
}
