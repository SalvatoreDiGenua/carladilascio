import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';

export interface CtaButtonConfig {
  label: string;
  route?: string | any[] | null;
  href?: string | null;
  variant?: 'default' | 'outline';
  target?: string | null;
  className?: string;
}

@Component({
  selector: 'app-cta-banner',
  imports: [RouterLink, HlmButtonImports],
  templateUrl: './cta-banner.html',
})
export class CtaBannerComponent {
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly buttons = input<CtaButtonConfig[]>([]);
  readonly sectionId = input<string>('cta-banner');

  resolveButtonClass(button: CtaButtonConfig): string {
    if (button.className) {
      return button.className;
    }

    return button.variant === 'outline'
      ? 'border border-stone-200 bg-white/90 px-6 py-3.5 text-ink shadow-sm hover:bg-stone-100 hover:text-ink'
      : 'px-6 py-3.5';
  }
}
