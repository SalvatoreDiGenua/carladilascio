import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONTENT } from '../../core/data/site-content';
import { Seo } from '../../core/seo/seo';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
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
