import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AboutMenu {
  private readonly openRequest = signal(0);
  readonly openRequested = this.openRequest.asReadonly();

  requestOpen(): void {
    this.openRequest.update((request) => request + 1);
  }
}
