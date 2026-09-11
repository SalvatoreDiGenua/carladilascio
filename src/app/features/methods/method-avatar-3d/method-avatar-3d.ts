import {
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import {
  CarlaSceneContext,
  createCarlaAvatarScene,
  disposeCarlaAvatarScene,
  updateCarlaAvatarScene,
} from './carla-avatar-model';

@Component({
  selector: 'app-method-avatar-3d',
  host: {
    class: 'block h-full min-h-[380px] w-full',
  },
  imports: [TranslocoPipe],
  template: `
    <div
      class="relative h-full min-h-[380px] w-full overflow-hidden rounded-2xl"
    >
      @if (!isLoaded()) {
        <div
          class="absolute inset-0 z-10 animate-pulse rounded-2xl"
          [style.background]="skeletonGradient()"
          role="status"
          [attr.aria-label]="'methodAvatar.loadingAriaLabel' | transloco"
        >
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="flex flex-col items-center gap-3 opacity-40">
              <svg
                class="h-16 w-16 text-current"
                viewBox="0 0 64 64"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="32" cy="18" r="10" />
                <ellipse cx="32" cy="46" rx="16" ry="14" />
              </svg>

              <span class="text-xs font-medium tracking-wider uppercase">
                {{ 'methodAvatar.badgeLabel' | transloco }}
              </span>
            </div>
          </div>
        </div>
      }

      <canvas
        #avatarCanvas
        class="absolute inset-0 block h-full w-full"
        [class.opacity-0]="!isLoaded()"
        [class.opacity-100]="isLoaded()"
        style="
          display: block;
          width: 100%;
          height: 100%;
          transition: opacity 0.6s ease;
          touch-action: pan-y;
        "
        role="img"
        [attr.aria-label]="ariaLabel()"
      ></canvas>

      @if (isLoaded() && showBadge()) {
        <div
          class="pointer-events-none absolute top-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-sm transition-opacity duration-700"
          [class.opacity-100]="showBadge()"
          [class.opacity-0]="!showBadge()"
          aria-hidden="true"
        >
          {{ 'methodAvatar.dragHint' | transloco }}
        </div>
      }
    </div>
  `,
})
export class MethodAvatar3dComponent {
  readonly slug = input.required<string>();
  readonly title = input<string>('');
  readonly themeColor = input<string>('#2dd4bf');

  readonly isPlaying = signal(true);
  readonly isLoaded = signal(false);
  readonly showBadge = signal(false);

  private readonly transloco = inject(TranslocoService);

  readonly ariaLabel = computed(() =>
    this.transloco.translate('methodAvatar.ariaLabel', {
      treatment: this.title() || this.slug(),
    }),
  );

  readonly skeletonGradient = computed(() => {
    const color = this.themeColor();
    return `linear-gradient(135deg, #f5f5f4 0%, ${color}22 100%)`;
  });

  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private readonly canvasRef =
    viewChild<ElementRef<HTMLCanvasElement>>('avatarCanvas');

  private sceneCtx: CarlaSceneContext | null = null;
  private animationFrameId = 0;
  private resizeObserver: ResizeObserver | null = null;
  private badgeTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private visibilityHandler: (() => void) | null = null;

  private clock = {
    start: 0,
    prev: 0,
  };

  private isDragging = false;
  private activePointerId: number | null = null;
  private lastPointerX = 0;
  private lastPointerY = 0;

  private orbitTheta = 0;
  private orbitPhi = Math.PI / 8;
  private orbitThetaVelocity = 0;

  private orbitRadius = 3.5;
  private readonly autoRotateSpeed = 0.004;

  private isDocumentVisible = true;

  constructor() {
    afterNextRender(() => {
      this.initScene();
    });

    effect(() => {
      const slug = this.slug();
      const color = this.themeColor();

      void slug;
      void color;

      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      if (!this.sceneCtx) {
        return;
      }

      this.destroyScene();
      this.resetOrbitState();
      this.initScene();
    });

    this.destroyRef.onDestroy(() => {
      this.destroyScene();
    });
  }

  private initScene(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.sceneCtx) {
      return;
    }

    const canvasEl = this.canvasRef()?.nativeElement;

    if (!canvasEl) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    this.isPlaying.set(!prefersReducedMotion);

    this.cancelAnimationLoop();

    const now = performance.now();

    this.clock = {
      start: now,
      prev: now,
    };

    this.sceneCtx = createCarlaAvatarScene(
      canvasEl,
      this.slug(),
      this.themeColor(),
    );

    this.handleResize(canvasEl);
    this.setupResizeObserver(canvasEl);
    this.attachPointerEvents(canvasEl);
    this.setupVisibilityHandler();

    this.isLoaded.set(true);
    this.showBadge.set(true);

    this.clearBadgeTimeout();

    this.badgeTimeoutId = setTimeout(() => {
      this.showBadge.set(false);
      this.badgeTimeoutId = null;
    }, 3500);

    this.startAnimationLoop();
  }

  private startAnimationLoop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.animationFrameId !== 0) {
      return;
    }

    this.animationFrameId = requestAnimationFrame(() => {
      this.animationFrameId = 0;
      this.loop();
    });
  }

  private loop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const ctx = this.sceneCtx;

    if (!ctx || !this.isDocumentVisible) {
      return;
    }

    const now = performance.now();
    const elapsedTime = (now - this.clock.start) / 1000;
    const rawDelta = (now - this.clock.prev) / 1000;
    const delta = Math.min(rawDelta, 0.1);

    this.clock.prev = now;

    if (!this.isDragging) {
      this.orbitThetaVelocity *= 0.92;

      if (Math.abs(this.orbitThetaVelocity) < 0.0002) {
        this.orbitThetaVelocity = 0;

        if (this.isPlaying()) {
          this.orbitTheta += this.autoRotateSpeed;
        }
      } else {
        this.orbitTheta += this.orbitThetaVelocity;
      }
    }

    const x =
      this.orbitRadius * Math.sin(this.orbitTheta) * Math.cos(this.orbitPhi);

    const y = this.orbitRadius * Math.sin(this.orbitPhi);

    const z =
      this.orbitRadius * Math.cos(this.orbitTheta) * Math.cos(this.orbitPhi);

    ctx.camera.position.set(x, y + 0.5, z);
    ctx.camera.lookAt(0, 0.5, 0);

    updateCarlaAvatarScene(ctx, elapsedTime, delta, this.isPlaying());

    ctx.renderer.render(ctx.scene, ctx.camera);

    this.animationFrameId = requestAnimationFrame(() => {
      this.animationFrameId = 0;
      this.loop();
    });
  }

  private cancelAnimationLoop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.animationFrameId = 0;
      return;
    }

    if (this.animationFrameId !== 0) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }

  private setupResizeObserver(canvas: HTMLCanvasElement): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.resizeObserver?.disconnect();

    const container = canvas.parentElement ?? canvas;

    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize(canvas);
    });

    this.resizeObserver.observe(container);
  }

  private handleResize(canvas: HTMLCanvasElement): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const ctx = this.sceneCtx;

    if (!ctx) {
      return;
    }

    const container = canvas.parentElement;

    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();

    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));

    if (width <= 1 || height <= 1) {
      return;
    }

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    ctx.renderer.setPixelRatio(pixelRatio);
    ctx.renderer.setSize(width, height, false);

    ctx.camera.aspect = width / height;
    ctx.camera.updateProjectionMatrix();
  }

  private attachPointerEvents(canvas: HTMLCanvasElement): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const onPointerDown = (event: PointerEvent): void => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }

      this.isDragging = true;
      this.activePointerId = event.pointerId;
      this.lastPointerX = event.clientX;
      this.lastPointerY = event.clientY;

      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture non disponibile.
      }

      this.showBadge.set(false);
    };

    const onPointerMove = (event: PointerEvent): void => {
      if (!this.isDragging) {
        return;
      }

      if (
        this.activePointerId !== null &&
        event.pointerId !== this.activePointerId
      ) {
        return;
      }

      const dx = event.clientX - this.lastPointerX;
      const dy = event.clientY - this.lastPointerY;

      this.orbitTheta -= dx * 0.01;

      this.orbitPhi = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, this.orbitPhi + dy * 0.008),
      );

      this.orbitThetaVelocity = -dx * 0.01;

      this.lastPointerX = event.clientX;
      this.lastPointerY = event.clientY;
    };

    const onPointerUp = (event: PointerEvent): void => {
      if (
        this.activePointerId !== null &&
        event.pointerId !== this.activePointerId
      ) {
        return;
      }

      this.isDragging = false;

      if (
        this.activePointerId !== null &&
        canvas.hasPointerCapture(this.activePointerId)
      ) {
        try {
          canvas.releasePointerCapture(this.activePointerId);
        } catch {
          // Pointer capture già rilasciato.
        }
      }

      this.activePointerId = null;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    this.destroyRef.onDestroy(() => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
    });
  }

  private setupVisibilityHandler(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.visibilityHandler) {
      return;
    }

    this.isDocumentVisible = document.visibilityState === 'visible';

    this.visibilityHandler = () => {
      this.isDocumentVisible = document.visibilityState === 'visible';

      if (this.isDocumentVisible) {
        const now = performance.now();
        this.clock.prev = now;
        this.startAnimationLoop();
      } else {
        this.cancelAnimationLoop();
      }
    };

    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  togglePlay(): void {
    this.isPlaying.update((playing) => !playing);
  }

  resetCamera(): void {
    this.resetOrbitState();
  }

  private resetOrbitState(): void {
    this.isDragging = false;
    this.activePointerId = null;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.orbitTheta = 0;
    this.orbitPhi = Math.PI / 8;
    this.orbitThetaVelocity = 0;
  }

  private clearBadgeTimeout(): void {
    if (this.badgeTimeoutId !== null) {
      clearTimeout(this.badgeTimeoutId);
      this.badgeTimeoutId = null;
    }
  }

  private destroyScene(): void {
    this.cancelAnimationLoop();
    this.clearBadgeTimeout();

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (isPlatformBrowser(this.platformId) && this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }

    this.visibilityHandler = null;

    this.isDragging = false;
    this.activePointerId = null;

    if (this.sceneCtx) {
      disposeCarlaAvatarScene(this.sceneCtx);
      this.sceneCtx = null;
    }

    this.isLoaded.set(false);
    this.showBadge.set(false);
  }
}
