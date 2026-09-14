import { DOCUMENT } from '@angular/common';
import { inject, Service } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description?: string;
  canonicalUrl?: string;
  robots?: string;
  image?: string;
}

const OPEN_GRAPH_IMAGES: Record<string, string> = {
  '/': '/og/home.svg',
  '/terapeuta': '/og/chi-sono.svg',
  '/artista': '/og/artista.svg',
  '/cromopuntura': '/og/cromopuntura.svg',
  '/kinesiologia-emozionale': '/og/kinesiologia-emozionale.svg',
  '/suonoterapia-vibrazionale': '/og/suonoterapia-vibrazionale.svg',
  '/arte-terapia': '/og/arte-terapia.svg',
  '/percorsi': '/og/percorsi.svg',
  '/contatti': '/og/contatti.svg',
};

@Service()
export class Seo {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  update(config: SeoConfig): void {
    this.title.setTitle(config.title);

    if (config.description !== undefined) {
      this.meta.updateTag({ name: 'description', content: config.description });
    }

    if (config.robots !== undefined) {
      this.meta.updateTag({ name: 'robots', content: config.robots });
    }

    if (config.canonicalUrl !== undefined) {
      this.setCanonical(config.canonicalUrl);
    }

    this.setOpenGraph({
      title: config.title,
      description: config.description,
      image: config.image ?? this.getOpenGraphImage(),
    });
  }

  setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }

    link.href = url;
  }

  setOpenGraph(config: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  }): void {
    if (config.title) {
      this.meta.updateTag({ property: 'og:title', content: config.title });
    }
    if (config.description) {
      this.meta.updateTag({
        property: 'og:description',
        content: config.description,
      });
    }
    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
      this.meta.updateTag({ property: 'og:image:type', content: 'image/svg+xml' });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }
    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
    }

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    if (config.title) {
      this.meta.updateTag({ name: 'twitter:title', content: config.title });
    }
    if (config.description) {
      this.meta.updateTag({
        name: 'twitter:description',
        content: config.description,
      });
    }
    if (config.image) {
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }
  }

  private getOpenGraphImage(): string | undefined {
    const pathname = this.document.location?.pathname ?? '/';
    return OPEN_GRAPH_IMAGES[pathname];
  }
}
