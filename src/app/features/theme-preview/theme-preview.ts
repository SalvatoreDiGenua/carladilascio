import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';

@Component({
  selector: 'app-theme-preview',
  imports: [
    HlmButtonImports,
    HlmDialogImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSwitchImports,
    HlmCheckboxImports,
  ],
  template: `
    <div class="mx-auto max-w-4xl space-y-10 px-6 py-12">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-foreground">
          Verifica Tema "Quadro" & spartan/ui
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          Componente di test per verificare i token cromatici, gli stati
          hover/focus e i componenti spartan.
        </p>
      </div>

      <!-- Palette Swatches -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-foreground">Palette "Quadro"</h2>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          <div class="rounded-lg border border-border p-3 text-center">
            <div class="mx-auto mb-2 size-12 rounded-md bg-primary"></div>
            <span class="text-xs font-medium text-foreground">Primary</span>
            <span class="block text-[11px] text-muted-foreground">#5B8FA3</span>
          </div>
          <div class="rounded-lg border border-border p-3 text-center">
            <div
              class="mx-auto mb-2 size-12 rounded-md bg-[var(--color-primary-light)]"
            ></div>
            <span class="text-xs font-medium text-foreground">
              Primary Light
            </span>
            <span class="block text-[11px] text-muted-foreground">#6C9CAF</span>
          </div>
          <div class="rounded-lg border border-border p-3 text-center">
            <div
              class="mx-auto mb-2 size-12 rounded-md bg-[var(--color-antique-gold)]"
            ></div>
            <span class="text-xs font-medium text-foreground">
              Antique Gold
            </span>
            <span class="block text-[11px] text-muted-foreground">#A99473</span>
          </div>
          <div class="rounded-lg border border-border p-3 text-center">
            <div
              class="mx-auto mb-2 size-12 rounded-md bg-[var(--color-bronze)]"
            ></div>
            <span class="text-xs font-medium text-foreground">Bronze</span>
            <span class="block text-[11px] text-muted-foreground">#795021</span>
          </div>
          <div class="rounded-lg border border-border p-3 text-center">
            <div class="mx-auto mb-2 size-12 rounded-md bg-destructive"></div>
            <span class="text-xs font-medium text-foreground">Destructive</span>
            <span class="block text-[11px] text-muted-foreground">#b94a37</span>
          </div>
          <div class="rounded-lg border border-border p-3 text-center">
            <div
              class="mx-auto mb-2 size-12 rounded-md bg-[var(--color-warm-ivory)]"
            ></div>
            <span class="text-xs font-medium text-foreground">Warm Ivory</span>
            <span class="block text-[11px] text-muted-foreground">#C4B7A1</span>
          </div>
        </div>
      </section>

      <!-- Bottoni spartan -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-foreground">
          Varianti Spartan Button
        </h2>
        <div class="flex flex-wrap items-center gap-3">
          <button hlmBtn variant="default">Primary / Default</button>
          <button hlmBtn variant="secondary">Secondary</button>
          <button hlmBtn variant="outline">Outline</button>
          <button hlmBtn variant="destructive">Destructive</button>
          <button hlmBtn variant="ghost">Ghost</button>
          <button hlmBtn variant="link">Link</button>
          <button hlmBtn variant="default" disabled>Disabled</button>
        </div>
      </section>

      <!-- Form Inputs & Toggles spartan -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-foreground">
          Controlli Form (Input, Label, Checkbox, Switch)
        </h2>
        <div
          class="grid max-w-md gap-4 rounded-xl border border-border bg-card p-6"
        >
          <div class="space-y-1.5">
            <label hlmLabel for="test-input">Campo di testo</label>
            <input
              hlmInput
              id="test-input"
              type="text"
              placeholder="Inserisci testo..."
              class="w-full"
            />
          </div>

          <div class="flex items-center gap-3 pt-2">
            <hlm-checkbox id="test-check" />
            <label hlmLabel for="test-check">Accetta condizioni</label>
          </div>

          <div class="flex items-center justify-between pt-2">
            <label hlmLabel for="test-switch">Notifiche email</label>
            <hlm-switch id="test-switch" />
          </div>
        </div>
      </section>

      <!-- Dialog spartan -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-foreground">Spartan Dialog</h2>
        <hlm-dialog>
          <button hlmBtn variant="outline" hlmDialogTrigger>
            Apri Dialog di Test
          </button>
          <hlm-dialog-content *hlmDialogPortal="let ctx" class="sm:max-w-md">
            <hlm-dialog-header>
              <h3 hlmDialogTitle>Verifica Spartan Dialog</h3>
              <p hlmDialogDescription>
                Il modal eredita correttamente lo sfondo cream/popover, il testo
                ink e il focus ring Quadro.
              </p>
            </hlm-dialog-header>
            <div class="py-2 text-sm text-foreground">
              Questo componente attesta l'integrazione tra CDK Overlay, Tailwind
              v4 e i token semantici.
            </div>
            <hlm-dialog-footer>
              <button hlmBtn variant="outline" hlmDialogClose>Chiudi</button>
              <button hlmBtn variant="default" hlmDialogClose>Conferma</button>
            </hlm-dialog-footer>
          </hlm-dialog-content>
        </hlm-dialog>
      </section>
    </div>
  `,
})
export class ThemePreview {}
