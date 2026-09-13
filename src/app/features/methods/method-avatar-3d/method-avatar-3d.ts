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
    class: 'block h-full min-h-[280px] w-full',
  },
  imports: [TranslocoPipe],
  template: `
    <div class="relative h-full min-h-[280px] w-full overflow-hidden rounded-2xl">
      @if (!isLoaded()) {
        <div
          class="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-stone-100/70"
          role="status"
          [attr.aria-label]="loadingLabel()"
        >
          <span class="text-xs font-medium tracking-[0.18em] text-ink-muted uppercase">
            3D
          </span>
        </div>
      }

      <canvas
        #instrumentCanvas
        class="absolute inset-0 block h-full w-full transition-opacity duration-500"
        [class.opacity-0]="!isLoaded()"
        [class.opacity-100]="isLoaded()"
        role="img"
        [attr.aria-label]="ariaLabel()"
      ></canvas>
    </div>
  `,
})
export class MethodAvatar3dComponent {
  readonly slug = input.required<string>();
  readonly title = input<string>('');
  readonly themeColor = input<string>('#3c607a');

  readonly isLoaded = signal(false);

  private readonly transloco = inject(TranslocoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly ariaLabel = computed(() =>
    `${this.transloco.translate(this.title() || this.slug())} — strumento 3D della metodologia`,
  );

  readonly loadingLabel = computed(() =>
    `Caricamento dello strumento 3D per ${this.transloco.translate(this.title() || this.slug())}`,
  );

  private readonly canvasRef =
    viewChild<ElementRef<HTMLCanvasElement>>('instrumentCanvas');

  private sceneCtx: CarlaSceneContext | null = null;
  private animationFrameId = 0;
  private resizeObserver: ResizeObserver | null = null;
  private visibilityHandler: (() => void) | null = null;
  private scrollHandler: (() => void) | null = null;

  private scrollProgress = 0;
  private targetScrollProgress = 0;
  private clock = { start: 0, prev: 0 };
  private isDocumentVisible = true;

  constructor() {
    afterNextRender(() => this.initScene());

    effect(() => {
      const slug = this.slug();
      const color = this.themeColor();
      void slug;
      void color;

      if (!isPlatformBrowser(this.platformId) || !this.sceneCtx) {
        return;
      }

      this.destroyScene();
      this.initScene();
    });

    this.destroyRef.onDestroy(() => this.destroyScene());
  }

  private initScene(): void {
    if (!isPlatformBrowser(this.platformId) || this.sceneCtx) {
      return;
    }

    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) {
      return;
    }

    const now = performance.now();
    this.clock = { start: now, prev: now };
    this.targetScrollProgress = this.readScrollProgress();
    this.scrollProgress = this.targetScrollProgress;

    this.sceneCtx = createCarlaAvatarScene(
      canvas,
      this.slug(),
      this.themeColor(),
    );

    this.sceneCtx.avatarGroup.visible = false;
    this.sceneCtx.treatmentGroup.visible = true;

    this.handleResize(canvas);
    this.setupResizeObserver(canvas);
    this.setupScrollTracking();
    this.setupVisibilityHandler();

    this.isLoaded.set(true);
    this.startAnimationLoop();
  }

  private setupScrollTracking(): void {
    if (!isPlatformBrowser(this.platformId) || this.scrollHandler) {
      return;
    }

    this.scrollHandler = () => {
      this.targetScrollProgress = this.readScrollProgress();
    };

    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  private readScrollProgress(): number {
    if (!isPlatformBrowser(this.platformId)) {
      return 0;
    }

    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );

    return Math.min(1, Math.max(0, window.scrollY / maxScroll));
  }

  private startAnimationLoop(): void {
    if (!isPlatformBrowser(this.platformId) || this.animationFrameId !== 0) {
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
    const delta = Math.min((now - this.clock.prev) / 1000, 0.1);
    this.clock.prev = now;

    this.scrollProgress +=
      (this.targetScrollProgress - this.scrollProgress) * 0.085;

    this.updateScrollComposition(ctx, this.scrollProgress, elapsedTime);
    updateCarlaAvatarScene(ctx, elapsedTime, delta, true);

    ctx.renderer.render(ctx.scene, ctx.camera);

    this.animationFrameId = requestAnimationFrame(() => {
      this.animationFrameId = 0;
      this.loop();
    });
  }

  private updateScrollComposition(
    ctx: CarlaSceneContext,
    progress: number,
    elapsedTime: number,
  ): void {
    const phase = progress * Math.PI * 2;

    ctx.treatmentGroup.rotation.y = phase * 1.55 + Math.sin(elapsedTime * 0.45) * 0.08;
    ctx.treatmentGroup.rotation.x =
      Math.sin(phase * 0.5) * 0.18 + Math.sin(elapsedTime * 0.3) * 0.025;
    ctx.treatmentGroup.rotation.z = Math.cos(phase * 0.75) * 0.08;

    ctx.treatmentGroup.position.x = Math.sin(phase) * 0.24;
    ctx.treatmentGroup.position.y = Math.sin(phase * 0.5) * 0.2;
    ctx.treatmentGroup.position.z = Math.cos(phase) * 0.18;

    const scale = 0.86 + Math.sin(progress * Math.PI) * 0.16;
    ctx.treatmentGroup.scale.setScalar(scale);

    const cameraAngle = phase * 0.22;
    const radius = 3.1 - Math.sin(progress * Math.PI) * 0.35;
    const height = 0.65 + Math.sin(phase * 0.5) * 0.18;

    ctx.camera.position.set(
      Math.sin(cameraAngle) * radius,
      height,
      Math.cos(cameraAngle) * radius,
    );
    ctx.camera.lookAt(0, 0.45, 0);
  }

  private setupResizeObserver(canvas: HTMLCanvasElement): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const container = canvas.parentElement ?? canvas;
    this.resizeObserver = new ResizeObserver(() => this.handleResize(canvas));
    this.resizeObserver.observe(container);
  }

  private handleResize(canvas: HTMLCanvasElement): void {
    if (!isPlatformBrowser(this.platformId) || !this.sceneCtx) {
      return;
    }

    const container = canvas.parentElement;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);

    this.sceneCtx.renderer.setPixelRatio(pixelRatio);
    this.sceneCtx.renderer.setSize(width, height, false);
    this.sceneCtx.camera.aspect = width / height;
    this.sceneCtx.camera.updateProjectionMatrix();
  }

  private setupVisibilityHandler(): void {
    if (!isPlatformBrowser(this.platformId) || this.visibilityHandler) {
      return;
    }

    this.isDocumentVisible = document.visibilityState === 'visible';
    this.visibilityHandler = () => {
      this.isDocumentVisible = document.visibilityState === 'visible';

      if (this.isDocumentVisible) {
        this.clock.prev = performance.now();
        this.startAnimationLoop();
      } else {
        this.cancelAnimationLoop();
      }
    };

    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  private cancelAnimationLoop(): void {
    if (
      isPlatformBrowser(this.platformId) &&
      this.animationFrameId !== 0
    ) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.animationFrameId = 0;
  }

  private destroyScene(): void {
    this.cancelAnimationLoop();

    if (isPlatformBrowser(this.platformId)) {
      if (this.visibilityHandler) {
        document.removeEventListener('visibilitychange', this.visibilityHandler);
      }

      if (this.scrollHandler) {
        window.removeEventListener('scroll', this.scrollHandler);
      }
    }

    this.visibilityHandler = null;
    this.scrollHandler = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (this.sceneCtx) {
      disposeCarlaAvatarScene(this.sceneCtx);
      this.sceneCtx = null;
    }

    this.isLoaded.set(false);
  }
}
