import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { JourneysService } from './journeys.service';

@Component({
  selector: 'cl-journeys',
  standalone: true,
  imports: [RouterLink, HlmButtonDirective, HlmCardModule, NgOptimizedImage, TranslocoModule],
  template: `
    <section class="container py-12">
      <h1 class="text-3xl font-bold mb-8">{{ 'journeys.title' | transloco }}</h1>
      
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        @for (journey of journeys(); track journey.id) {
          <hlm-card class="overflow-hidden">
            <img
              [src]="journey.image"
              [alt]="journey.title"
              class="w-full h-48 object-cover"
              width="400"
              height="200"
            />
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">{{ journey.title }}</h3>
              <p class="text-muted-foreground mb-4">{{ journey.description }}</p>
              <a
                hlmBtn
                [routerLink]="['/journeys', journey.id]"
                variant="outline"
                class="w-full"
              >
                {{ 'journeys.readMore' | transloco }}
              </a>
            </div>
          </hlm-card>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneysComponent {
  private readonly journeysService = inject(JourneysService);
  readonly journeys = this.journeysService.getAll;
}
