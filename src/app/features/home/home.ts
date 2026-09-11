import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SITE_CONTENT } from '../../core/data/site-content';
import { Seo } from '../../core/seo/seo';
import { CtaBannerComponent } from '../../shared/cta-banner/cta-banner';
import { AboutMenu } from '../../core/services/about-menu';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslocoPipe, HlmButtonImports, CtaBannerComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly content = SITE_CONTENT;
  private readonly aboutMenu = inject(AboutMenu);
  private readonly seo = inject(Seo);

  openAboutMenu(): void {
    this.aboutMenu.requestOpen();
  }

  constructor() {
    this.seo.update({
      title: 'Carla Di Lascio | Arte Terapia & Benessere Integrato',
      description:
        'Percorsi di arte terapia, benessere integrato e tecniche vibrazionali con Carla Di Lascio ad Avellino. Cromopuntura, suonoterapia e kinesiologia emozionale.',
    });
  }
}
