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
  host: { class: 'block h-full min-h-[280px] w-full' },
  imports: [TranslocoPipe],
  template: `
    <div class="relative h-full min-h-[280px] w-full overflow-hidden rounded-2xl">
      @if (!isLoaded()) {
        <div class="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-stone-100/70" role="status" [attr.aria-label]="loadingLabel()">
          <span class="text-xs font-medium tracking-[0.18em] text-ink-muted uppercase">3D</span>
        </div>
      }
      <canvas #instrumentCanvas class="absolute inset-0 block h-full w-full transition-opacity duration-500" [class.opacity-0]="!isLoaded()" [class.opacity-100]="isLoaded()" role="img" [attr.aria-label]="ariaLabel()"></canvas>
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
  readonly ariaLabel = computed(() => `${this.transloco.translate(this.title() || this.slug())} — strumento 3D della metodologia`);
  readonly loadingLabel = computed(() => `Caricamento dello strumento 3D per ${this.transloco.translate(this.title() || this.slug())}`);
  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('instrumentCanvas');
  private sceneCtx: CarlaSceneContext | null = null;
  private animationFrameId = 0;
  private resizeObserver: ResizeObserver | null = null;
  private visibilityHandler: (() => void) | null = null;
  private scrollHandler: (() => void) | null = null;
  private scrollProgress = 0;
  private targetScrollProgress = 0;
  private clock = { start: 0, prev: 0 };
  private isDocumentVisible = true;
  private prefersReducedMotion = false;

  constructor() {
    afterNextRender(() => this.initScene());
    effect(() => {
      const slug = this.slug();
      const color = this.themeColor();
      void slug;
      void color;
      if (!isPlatformBrowser(this.platformId) || !this.sceneCtx) return;
      this.destroyScene();
      this.initScene();
    });
    this.destroyRef.onDestroy(() => this.destroyScene());
  }

  private initScene(): void {
    if (!isPlatformBrowser(this.platformId) || this.sceneCtx) return;
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const now = performance.now();
    this.clock = { start: now, prev: now };
    this.targetScrollProgress = this.readScrollProgress();
    this.scrollProgress = this.targetScrollProgress;
    this.sceneCtx = createCarlaAvatarScene(canvas, this.slug(), this.themeColor());
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
    if (!isPlatformBrowser(this.platformId) || this.scrollHandler) return;
    this.scrollHandler = () => { this.targetScrollProgress = this.readScrollProgress(); };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  private readScrollProgress(): number {
    if (!isPlatformBrowser(this.platformId)) return 0;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return Math.min(1, Math.max(0, window.scrollY / maxScroll));
  }

  private startAnimationLoop(): void {
    if (!isPlatformBrowser(this.platformId) || this.animationFrameId !== 0) return;
    this.animationFrameId = requestAnimationFrame(() => { this.animationFrameId = 0; this.loop(); });
  }

  private loop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const ctx = this.sceneCtx;
    if (!ctx || !this.isDocumentVisible) return;
    const now = performance.now();
    const elapsedTime = (now - this.clock.start) / 1000;
    const delta = Math.min((now - this.clock.prev) / 1000, 0.1);
    this.clock.prev = now;
    if (this.prefersReducedMotion) this.scrollProgress = this.targetScrollProgress;
    else this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.085;
    this.updateScrollComposition(ctx, this.scrollProgress, elapsedTime);
    updateCarlaAvatarScene(ctx, elapsedTime, delta, !this.prefersReducedMotion);
    ctx.renderer.render(ctx.scene, ctx.camera);
    this.animationFrameId = requestAnimationFrame(() => { this.animationFrameId = 0; this.loop(); });
  }

  private updateScrollComposition(ctx: CarlaSceneContext, progress: number, elapsedTime: number): void {
    const phase = progress * Math.PI * 2;
    const ambientRotation = this.prefersReducedMotion ? 0 : Math.sin(elapsedTime * 0.45) * 0.08;
    switch (ctx.methodSlug) {
      case 'cromopuntura': this.composeCromopuntura(ctx, phase, ambientRotation); break;
      case 'kinesiologia-emozionale': this.composeKinesiologia(ctx, phase, ambientRotation); break;
      case 'suonoterapia-vibrazionale': this.composeSuonoterapia(ctx, phase, ambientRotation); break;
      case 'arte-terapia': this.composeArteTerapia(ctx, phase, ambientRotation); break;
      default: this.composeDefault(ctx, phase, progress, ambientRotation);
    }
  }

  private composeCromopuntura(ctx: CarlaSceneContext, phase: number, ambientRotation: number): void {
    ctx.treatmentGroup.rotation.y = phase * 0.58 + ambientRotation;
    ctx.treatmentGroup.rotation.x = Math.sin(phase * 0.5) * 0.08;
    ctx.treatmentGroup.rotation.z = Math.sin(phase) * 0.055;
    ctx.treatmentGroup.position.x = Math.sin(phase) * 0.34;
    ctx.treatmentGroup.position.y = Math.sin(phase * 2) * 0.11;
    ctx.treatmentGroup.position.z = Math.cos(phase) * 0.16;
    ctx.treatmentGroup.scale.setScalar(0.9 + Math.sin(phase * 2) * 0.045);
    this.setCamera(ctx, phase * 0.12, 3.35, 0.58 + Math.sin(phase) * 0.1);
    this.applyReducedMotion(ctx, 0.9);
  }

  private composeKinesiologia(ctx: CarlaSceneContext, phase: number, ambientRotation: number): void {
    const testCycle = Math.sin(phase);
    ctx.treatmentGroup.rotation.y = phase * 0.82 + ambientRotation;
    ctx.treatmentGroup.rotation.x = testCycle * 0.1;
    ctx.treatmentGroup.rotation.z = testCycle * 0.16;
    ctx.treatmentGroup.position.x = testCycle * 0.2;
    ctx.treatmentGroup.position.y = Math.sin(phase * 0.5) * 0.08;
    ctx.treatmentGroup.position.z = Math.cos(phase) * 0.1;
    ctx.treatmentGroup.scale.setScalar(0.88 + Math.abs(testCycle) * 0.07);
    this.setCamera(ctx, phase * 0.16, 3.18, 0.64 + testCycle * 0.08);
    this.applyReducedMotion(ctx, 0.9);
  }

  private composeSuonoterapia(ctx: CarlaSceneContext, phase: number, ambientRotation: number): void {
    const resonance = Math.sin(phase * 1.5);
    ctx.treatmentGroup.rotation.y = phase * 0.96 + ambientRotation;
    ctx.treatmentGroup.rotation.x = Math.sin(phase * 0.5) * 0.07;
    ctx.treatmentGroup.rotation.z = resonance * 0.09;
    ctx.treatmentGroup.position.x = Math.cos(phase) * 0.2;
    ctx.treatmentGroup.position.y = Math.sin(phase * 1.5) * 0.16;
    ctx.treatmentGroup.position.z = Math.sin(phase) * 0.24;
    ctx.treatmentGroup.scale.setScalar(0.86 + (resonance + 1) * 0.045);
    this.setCamera(ctx, phase * 0.2, 2.98, 0.68 + Math.sin(phase) * 0.1);
    this.applyReducedMotion(ctx, 0.9);
  }

  private composeArteTerapia(ctx: CarlaSceneContext, phase: number, ambientRotation: number): void {
    const stroke = Math.sin(phase);
    ctx.treatmentGroup.rotation.y = phase * 1.2 + ambientRotation;
    ctx.treatmentGroup.rotation.x = Math.cos(phase) * 0.14;
    ctx.treatmentGroup.rotation.z = stroke * 0.18;
    ctx.treatmentGroup.position.x = stroke * 0.38;
    ctx.treatmentGroup.position.y = Math.sin(phase * 0.5) * 0.24;
    ctx.treatmentGroup.position.z = Math.cos(phase) * 0.25;
    ctx.treatmentGroup.scale.setScalar(0.84 + (Math.sin(phase * 0.5) + 1) * 0.07);
    this.setCamera(ctx, phase * 0.24, 3.02, 0.62 + Math.cos(phase) * 0.12);
    this.applyReducedMotion(ctx, 0.9);
  }

  private composeDefault(ctx: CarlaSceneContext, phase: number, progress: number, ambientRotation: number): void {
    ctx.treatmentGroup.rotation.y = phase * 1.1 + ambientRotation;
    ctx.treatmentGroup.rotation.x = Math.sin(phase * 0.5) * 0.14;
    ctx.treatmentGroup.rotation.z = Math.cos(phase * 0.75) * 0.08;
    ctx.treatmentGroup.position.x = Math.sin(phase) * 0.24;
    ctx.treatmentGroup.position.y = Math.sin(phase * 0.5) * 0.2;
    ctx.treatmentGroup.position.z = Math.cos(phase) * 0.18;
    ctx.treatmentGroup.scale.setScalar(0.86 + Math.sin(progress * Math.PI) * 0.16);
    this.setCamera(ctx, phase * 0.22, 3.1 - Math.sin(progress * Math.PI) * 0.35, 0.65 + Math.sin(phase * 0.5) * 0.18);
  }

  private applyReducedMotion(ctx: CarlaSceneContext, scale: number): void {
    if (!this.prefersReducedMotion) return;
    ctx.treatmentGroup.rotation.x = 0;
    ctx.treatmentGroup.rotation.z = 0;
    ctx.treatmentGroup.position.set(0, 0, 0);
    ctx.treatmentGroup.scale.setScalar(scale);
  }

  private setCamera(ctx: CarlaSceneContext, angle: number, radius: number, height: number): void {
    ctx.camera.position.set(Math.sin(angle) * radius, height, Math.cos(angle) * radius);
    ctx.camera.lookAt(0, 0.45, 0);
  }

  private setupResizeObserver(canvas: HTMLCanvasElement): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const container = canvas.parentElement ?? canvas;
    this.resizeObserver = new ResizeObserver(() => this.handleResize(canvas));
    this.resizeObserver.observe(container);
  }

  private handleResize(canvas: HTMLCanvasElement): void {
    if (!isPlatformBrowser(this.platformId) || !this.sceneCtx) return;
    const container = canvas.parentElement;
    if (!container) return;
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
    if (!isPlatformBrowser(this.platformId) || this.visibilityHandler) return;
    this.isDocumentVisible = document.visibilityState === 'visible';
    this.visibilityHandler = () => {
      this.isDocumentVisible = document.visibilityState === 'visible';
      if (this.isDocumentVisible) { this.clock.prev = performance.now(); this.startAnimationLoop(); }
      else this.cancelAnimationLoop();
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  private cancelAnimationLoop(): void {
    if (isPlatformBrowser(this.platformId) && this.animationFrameId !== 0) cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = 0;
  }

  private destroyScene(): void {
    this.cancelAnimationLoop();
    if (isPlatformBrowser(this.platformId)) {
      if (this.visibilityHandler) document.removeEventListener('visibilitychange', this.visibilityHandler);
      if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
    }
    this.visibilityHandler = null;
    this.scrollHandler = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.sceneCtx) { disposeCarlaAvatarScene(this.sceneCtx); this.sceneCtx = null; }
    this.isLoaded.set(false);
  }
}
