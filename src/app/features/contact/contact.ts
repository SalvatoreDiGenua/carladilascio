import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { SITE_CONTENT } from '../../core/data/site-content';
import { Seo } from '../../core/seo/seo';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, TranslocoPipe],
  template: `
    <article class="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <!-- Intestazione -->
      <header class="mb-12 text-center">
        <span
          class="inline-flex rounded-full bg-aqua-light px-3.5 py-1 text-xs font-semibold tracking-wider text-aqua uppercase"
        >
          {{ 'contact.eyebrow' | transloco }}
        </span>
        <h1
          class="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl"
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
          <div
            class="rounded-3xl border border-stone-200/90 bg-white/80 p-6 shadow-xs sm:p-8"
          >
            <h2 class="text-xl font-bold text-ink">
              {{ 'contact.directContacts.title' | transloco }}
            </h2>
            <p class="mt-2 text-sm text-ink-muted">
              {{ 'contact.directContacts.description' | transloco }}
            </p>

            <ul class="mt-6 space-y-4 text-sm">
              <!-- Telefono -->
              <li class="flex items-start gap-3">
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aqua-light text-aqua"
                >
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <span class="block font-semibold text-ink">{{
                    'contact.directContacts.phoneLabel' | transloco
                  }}</span>
                  <a
                    [href]="'tel:' + content.personalInfo.phoneRaw"
                    class="font-medium text-aqua hover:underline focus-visible:ring-2 focus-visible:ring-aqua focus-visible:outline-none"
                  >
                    {{ content.personalInfo.phone }}
                  </a>
                </div>
              </li>

              <!-- Email -->
              <li class="flex items-start gap-3">
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral-light text-coral"
                >
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <span class="block font-semibold text-ink">{{
                    'contact.directContacts.emailLabel' | transloco
                  }}</span>
                  <a
                    [href]="'mailto:' + content.personalInfo.email"
                    class="font-medium text-coral hover:underline focus-visible:ring-2 focus-visible:ring-aqua focus-visible:outline-none"
                  >
                    {{ content.personalInfo.email }}
                  </a>
                </div>
              </li>

              <!-- Studio -->
              <li class="flex items-start gap-3">
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lavender-light text-lavender"
                >
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
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
            class="rounded-3xl border border-stone-200/90 bg-white/90 p-6 shadow-xs sm:p-8"
            aria-labelledby="heading-form"
          >
            <h2 id="heading-form" class="text-xl font-bold text-ink">
              {{ 'contact.form.title' | transloco }}
            </h2>
            <p class="mt-1 text-sm text-ink-muted">
              {{ 'contact.form.description' | transloco }}
            </p>

            <!-- Stato di invio simulato (Accessibile con aria-live) -->
            <div aria-live="polite" class="mt-4">
              @if (isSubmitted()) {
                <div
                  class="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900"
                >
                  <p class="font-bold">
                    {{ 'contact.form.successTitle' | transloco }}
                  </p>
                  <p class="mt-1 text-xs">
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
              class="mt-6 space-y-4"
              novalidate
            >
              <!-- Nome -->
              <div>
                <label for="name" class="block text-sm font-semibold text-ink">
                  {{ 'contact.form.nameLabel' | transloco }}
                  <span class="text-coral" aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  formControlName="name"
                  [attr.aria-invalid]="
                    contactForm.controls.name.invalid &&
                    contactForm.controls.name.touched
                  "
                  aria-describedby="name-error"
                  class="mt-1 block w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-ink placeholder-stone-400 focus:border-aqua focus:ring-2 focus:ring-aqua focus:outline-none"
                  [attr.placeholder]="
                    'contact.form.namePlaceholder' | transloco
                  "
                />
                @if (
                  contactForm.controls.name.invalid &&
                  contactForm.controls.name.touched
                ) {
                  <p id="name-error" class="mt-1 text-xs text-rose-600">
                    {{ 'contact.form.nameError' | transloco }}
                  </p>
                }
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-semibold text-ink">
                  {{ 'contact.form.emailLabel' | transloco }}
                  <span class="text-coral" aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  [attr.aria-invalid]="
                    contactForm.controls.email.invalid &&
                    contactForm.controls.email.touched
                  "
                  aria-describedby="email-error"
                  class="mt-1 block w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-ink placeholder-stone-400 focus:border-aqua focus:ring-2 focus:ring-aqua focus:outline-none"
                  [attr.placeholder]="
                    'contact.form.emailPlaceholder' | transloco
                  "
                />
                @if (
                  contactForm.controls.email.invalid &&
                  contactForm.controls.email.touched
                ) {
                  <p id="email-error" class="mt-1 text-xs text-rose-600">
                    {{ 'contact.form.emailError' | transloco }}
                  </p>
                }
              </div>

              <!-- Messaggio -->
              <div>
                <label
                  for="message"
                  class="block text-sm font-semibold text-ink"
                >
                  {{ 'contact.form.messageLabel' | transloco }}
                  <span class="text-coral" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="message"
                  rows="4"
                  formControlName="message"
                  [attr.aria-invalid]="
                    contactForm.controls.message.invalid &&
                    contactForm.controls.message.touched
                  "
                  aria-describedby="message-error"
                  class="mt-1 block w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-ink placeholder-stone-400 focus:border-aqua focus:ring-2 focus:ring-aqua focus:outline-none"
                  [attr.placeholder]="
                    'contact.form.messagePlaceholder' | transloco
                  "
                ></textarea>
                @if (
                  contactForm.controls.message.invalid &&
                  contactForm.controls.message.touched
                ) {
                  <p id="message-error" class="mt-1 text-xs text-rose-600">
                    {{ 'contact.form.messageError' | transloco }}
                  </p>
                }
              </div>

              <!-- Checkbox Privacy -->
              <div>
                <div class="flex items-start gap-2.5">
                  <input
                    id="privacy"
                    type="checkbox"
                    formControlName="privacy"
                    [attr.aria-invalid]="
                      contactForm.controls.privacy.invalid &&
                      contactForm.controls.privacy.touched
                    "
                    aria-describedby="privacy-error"
                    class="mt-1 h-4 w-4 rounded border-stone-300 text-aqua focus:ring-aqua"
                  />
                  <label
                    for="privacy"
                    class="text-xs leading-relaxed text-ink-muted"
                  >
                    {{ 'contact.form.privacyLabel' | transloco }}
                  </label>
                </div>
                @if (
                  contactForm.controls.privacy.invalid &&
                  contactForm.controls.privacy.touched
                ) {
                  <p id="privacy-error" class="mt-1 text-xs text-rose-600">
                    {{ 'contact.form.privacyError' | transloco }}
                  </p>
                }
              </div>

              <!-- Avviso Tecnico Demo -->
              <p class="text-[11px] text-stone-500 italic">
                {{ content.personalInfo.formNotice | transloco }}
              </p>

              <!-- Pulsante Invio -->
              <button
                type="submit"
                [disabled]="contactForm.invalid"
                class="w-full rounded-xl bg-aqua px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-aqua-dark focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                {{ 'contact.form.submit' | transloco }}
              </button>
            </form>
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

    // SIMULAZIONE INVIO:
    // In una fase successiva con backend o servizio esterno (es. Netlify Forms, Formspree, endpoint Express / Nest),
    // collegare qui l'invio HTTP tramite HttpClient:
    // this.http.post('/api/contact', this.contactForm.getRawValue()).subscribe(...)
    this.isSubmitted.set(true);
    this.contactForm.reset();
  }
}
