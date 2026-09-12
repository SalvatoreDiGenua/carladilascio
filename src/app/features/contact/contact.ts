import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMail, lucideMapPin, lucidePhone } from '@ng-icons/lucide';
import { TranslocoPipe } from '@jsverse/transloco';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { SITE_CONTENT } from '../../core/data/site-content';
import { Seo } from '../../core/seo/seo';

@Component({
  selector: 'app-contact',
  providers: [provideIcons({ lucideMail, lucideMapPin, lucidePhone })],
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    NgIcon,
    HlmFieldImports,
    HlmInputImports,
    HlmTextareaImports,
    HlmLabelImports,
    HlmCheckboxImports,
    HlmButtonImports,
    HlmCardImports,
  ],
  template: `
    <article class="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <!-- Intestazione -->
      <header class="mb-12 text-center">
        <h1
          class="font-serif text-3xl font-bold tracking-tight text-ink sm:text-5xl"
        >
          {{ 'contact.title' | transloco }}
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-ink-muted sm:text-xl">
          {{ 'contact.subheadline' | transloco }}
        </p>
      </header>

      <div class="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <!-- Colonna Recapiti Diretti -->
        <div class="space-y-6 lg:col-span-5">
          <div hlmCard class="border-stone-200/90 bg-white/80 shadow-xs">
            <div hlmCardHeader class="p-6 sm:p-8">
              <h2 hlmCardTitle class="text-xl font-bold text-ink">
                {{ 'contact.directContacts.title' | transloco }}
              </h2>
              <p hlmCardDescription class="mt-2 text-ink-muted">
                {{ 'contact.directContacts.description' | transloco }}
              </p>
            </div>

            <div hlmCardContent class="px-6 pb-6 sm:px-8 sm:pb-8">
              <ul class="space-y-4 text-sm">
                <!-- Telefono -->
                <li class="flex items-start gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                  >
                    <ng-icon
                      name="lucidePhone"
                      class="size-5"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <span class="block font-semibold text-ink">{{
                      'contact.directContacts.phoneLabel' | transloco
                    }}</span>
                    <a
                      [href]="'tel:' + content.personalInfo.phoneRaw"
                      class="font-medium text-primary hover:text-primary-dark hover:underline focus-visible:outline-none"
                    >
                      {{ content.personalInfo.phone }}
                    </a>
                  </div>
                </li>

                <!-- Email -->
                <li class="flex items-start gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-antique-gold/15 text-bronze"
                  >
                    <ng-icon
                      name="lucideMail"
                      class="size-5"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <span class="block font-semibold text-ink">{{
                      'contact.directContacts.emailLabel' | transloco
                    }}</span>
                    <a
                      [href]="'mailto:' + content.personalInfo.email"
                      class="font-medium text-bronze hover:text-deep-brown hover:underline focus-visible:outline-none"
                    >
                      {{ content.personalInfo.email }}
                    </a>
                  </div>
                </li>

                <!-- Studio -->
                <li class="flex items-start gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warm-ivory/30 text-ink-muted"
                  >
                    <ng-icon
                      name="lucideMapPin"
                      class="size-5"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <span class="block font-semibold text-ink">{{
                      'contact.directContacts.studioLabel' | transloco
                    }}</span>
                    <span class="text-ink-muted">{{
                      content.personalInfo.address
                    }}</span>
                  </div>
                </li>
              </ul>

              <div
                class="mt-6 rounded-2xl border border-stone-200 bg-cream/70 p-4 text-xs font-medium text-ink"
              >
                {{ content.personalInfo.availability | transloco }}
              </div>
            </div>
          </div>

          <!-- Nota deontologica e informativa -->
          <div
            class="rounded-2xl border border-stone-200/80 bg-white/60 p-4 text-xs text-ink-muted"
          >
            {{ content.personalInfo.medicalDisclaimer | transloco }}
          </div>
        </div>

        <!-- Colonna Modulo Contatto Front-End -->
        <div class="lg:col-span-7">
          <section
            hlmCard
            class="border-stone-200/90 bg-white/90 shadow-xs"
            aria-labelledby="heading-form"
          >
            <div hlmCardHeader class="p-6 sm:p-8">
              <h2
                hlmCardTitle
                id="heading-form"
                class="text-xl font-bold text-ink"
              >
                {{ 'contact.form.title' | transloco }}
              </h2>
              <p hlmCardDescription class="mt-1 text-ink-muted">
                {{ 'contact.form.description' | transloco }}
              </p>
            </div>

            <div hlmCardContent class="px-6 pb-6 sm:px-8 sm:pb-8">
              <!-- Stato di invio simulato (Accessibile con aria-live) -->
              <div aria-live="polite" class="mt-0">
                @if (isSubmitted()) {
                  <div
                    class="rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-ink"
                  >
                    <p class="font-bold text-primary-dark">
                      {{ 'contact.form.successTitle' | transloco }}
                    </p>
                    <p class="mt-1 text-xs text-ink-muted">
                      {{
                        'contact.form.successMessage'
                          | transloco: { phone: content.personalInfo.phone }
                      }}
                    </p>
                  </div>
                }
              </div>

              <!-- Form -->
              <form
                [formGroup]="contactForm"
                (ngSubmit)="onSubmit()"
                class="mt-6 space-y-5"
                novalidate
              >
                <!-- Nome -->
                <hlm-field>
                  <label hlmFieldLabel for="name">
                    {{ 'contact.form.nameLabel' | transloco }}
                    <span class="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="name"
                    hlmInput
                    type="text"
                    formControlName="name"
                    class="w-full bg-white"
                    [attr.placeholder]="
                      'contact.form.namePlaceholder' | transloco
                    "
                  />
                  @if (
                    contactForm.controls.name.invalid &&
                    contactForm.controls.name.touched
                  ) {
                    <hlm-field-error>
                      {{ 'contact.form.nameError' | transloco }}
                    </hlm-field-error>
                  }
                </hlm-field>

                <!-- Email -->
                <hlm-field>
                  <label hlmFieldLabel for="email">
                    {{ 'contact.form.emailLabel' | transloco }}
                    <span class="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="email"
                    hlmInput
                    type="email"
                    formControlName="email"
                    class="w-full bg-white"
                    [attr.placeholder]="
                      'contact.form.emailPlaceholder' | transloco
                    "
                  />
                  @if (
                    contactForm.controls.email.invalid &&
                    contactForm.controls.email.touched
                  ) {
                    <hlm-field-error>
                      {{ 'contact.form.emailError' | transloco }}
                    </hlm-field-error>
                  }
                </hlm-field>

                <!-- Messaggio -->
                <hlm-field>
                  <label hlmFieldLabel for="message">
                    {{ 'contact.form.messageLabel' | transloco }}
                    <span class="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="message"
                    hlmTextarea
                    rows="4"
                    formControlName="message"
                    class="w-full bg-white"
                    [attr.placeholder]="
                      'contact.form.messagePlaceholder' | transloco
                    "
                  ></textarea>
                  @if (
                    contactForm.controls.message.invalid &&
                    contactForm.controls.message.touched
                  ) {
                    <hlm-field-error>
                      {{ 'contact.form.messageError' | transloco }}
                    </hlm-field-error>
                  }
                </hlm-field>

                <!-- Checkbox Privacy -->
                <hlm-field orientation="horizontal" class="items-start gap-2.5">
                  <hlm-checkbox
                    id="privacy"
                    formControlName="privacy"
                    class="mt-0.5"
                  />
                  <hlm-field-content>
                    <label
                      hlmFieldLabel
                      for="privacy"
                      class="cursor-pointer text-xs leading-relaxed text-ink-muted select-none"
                    >
                      {{ 'contact.form.privacyLabel' | transloco }}
                    </label>
                    @if (
                      contactForm.controls.privacy.invalid &&
                      contactForm.controls.privacy.touched
                    ) {
                      <hlm-field-error>
                        {{ 'contact.form.privacyError' | transloco }}
                      </hlm-field-error>
                    }
                  </hlm-field-content>
                </hlm-field>

                <!-- Pulsante Invio -->
                <button
                  hlmBtn
                  type="submit"
                  size="lg"
                  [disabled]="contactForm.invalid"
                  class="w-full shadow-sm"
                >
                  {{ 'contact.form.submit' | transloco }}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </article>
  `,
})
export class Contact {
  readonly content = SITE_CONTENT;
  private readonly seo = inject(Seo);

  readonly isSubmitted = signal(false);

  readonly contactForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    privacy: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

  constructor() {
    this.seo.update({
      title: 'Contatti | Carla Di Lascio',
      description:
        'Contatta Carla Di Lascio: telefono 327 623 1815, email dilascio.carla@gmail.com, studio in via Vasto 20 ad Avellino. Ricevimento su appuntamento.',
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    // SIMULAZIONE INVIO
    this.isSubmitted.set(true);
    toast.success('Richiesta inviata con successo', {
      description: 'Grazie per il messaggio. Ti risponderò al più presto.',
    });
    this.contactForm.reset();
  }
}
