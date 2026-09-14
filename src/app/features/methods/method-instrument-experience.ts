import { isPlatformBrowser } from '@angular/common';
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
import * as THREE from 'three';
import { TranslocoService } from '@jsverse/transloco';

interface SceneState {
  root: THREE.Group;
  instrument: THREE.Group;
  accent: THREE.Object3D | null;
  secondary: THREE.Object3D | null;
  particles: THREE.Points | null;
  reference: THREE.Mesh | null;
  dispose: () => void;
}

@Component({
  selector: 'app-method-instrument-experience',
  host: { class: 'block h-full min-h-[280px] w-full' },
  template: `
    <div class="relative h-full min-h-[280px] w-full overflow-hidden">
      @if (!isLoaded()) {
        <div class="absolute inset-0 z-10 flex items-center justify-center" role="status" [attr.aria-label]="loadingLabel()">
          <span class="text-xs font-medium tracking-[0.18em] text-ink-muted uppercase">3D</span>
        </div>
      }
      <canvas
        #canvas
        class="absolute inset-0 block h-full w-full transition-opacity duration-700"
        [class.opacity-0]="!isLoaded()"
        [class.opacity-100]="isLoaded()"
        role="img"
        [attr.aria-label]="ariaLabel()"
      ></canvas>
    </div>
  `,
})
export class MethodInstrumentExperienceComponent {
  readonly slug = input.required<string>();
  readonly title = input<string>('');
  readonly themeColor = input<string>('#3c607a');
  readonly isLoaded = signal(false);

  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly transloco = inject(TranslocoService);

  readonly ariaLabel = computed(() => `${this.transloco.translate(this.title() || this.slug())} — esperienza 3D dello strumento`);
  readonly loadingLabel = computed(() => `Caricamento dell'esperienza 3D per ${this.transloco.translate(this.title() || this.slug())}`);

  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private state: SceneState | null = null;
  private animationFrame = 0;
  private resizeObserver: ResizeObserver | null = null;
  private scrollHandler: (() => void) | null = null;
  private visibilityHandler: (() => void) | null = null;
  private targetProgress = 0;
  private progress = 0;
  private startTime = 0;
  private previousTime = 0;
  private reducedMotion = false;
  private visible = true;
  private referenceTexture: THREE.Texture | null = null;

  constructor() {
    afterNextRender(() => this.init());
    effect(() => {
      const slug = this.slug();
      const color = this.themeColor();
      void slug;
      void color;
      if (!isPlatformBrowser(this.platformId) || !this.renderer) return;
      this.rebuild();
    });
    this.destroyRef.onDestroy(() => this.destroy());
  }

  private init(): void {
    if (!isPlatformBrowser(this.platformId) || this.renderer) return;
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.96;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    this.camera.position.set(0.2, 0.55, 6.4);
    this.addLighting();
    this.rebuildScene();
    this.setupResize(canvas);
    this.setupScroll();
    this.setupVisibility();

    const now = performance.now();
    this.startTime = now;
    this.previousTime = now;
    this.targetProgress = this.readProgress();
    this.progress = this.targetProgress;
    this.handleResize(canvas);
    this.isLoaded.set(true);
    this.startLoop();
  }

  private addLighting(): void {
    if (!this.scene) return;
    this.scene.add(new THREE.HemisphereLight(0xf7f5f0, 0x26313a, 1.8));
    const key = new THREE.DirectionalLight(0xffffff, 2.7);
    key.position.set(3.5, 5, 4.5);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xe7edf0, 1.1);
    fill.position.set(-4, 1.5, 2);
    this.scene.add(fill);
    const rim = new THREE.PointLight(this.resolveColor(this.themeColor()), 1.05, 8);
    rim.position.set(-2.5, 1.8, 3);
    this.scene.add(rim);
  }

  private rebuild(): void {
    if (this.renderer) this.rebuildScene();
  }

  private rebuildScene(): void {
    if (!this.scene) return;
    this.state?.dispose();
    this.state = this.buildMethodScene(this.slug());
    this.scene.add(this.state.root);
  }

  private buildMethodScene(slug: string): SceneState {
    const root = new THREE.Group();
    const instrument = new THREE.Group();
    root.add(instrument);
    const reference = this.createReferencePlane(slug);
    root.add(reference);

    let accent: THREE.Object3D | null = null;
    let secondary: THREE.Object3D | null = null;
    let particles: THREE.Points | null = null;

    switch (slug) {
      case 'cromopuntura': {
        const pen = this.buildChromopuncturePen();
        instrument.add(pen.group);
        accent = pen.beam;
        secondary = pen.tip;
        particles = this.buildParticles(28, 1.15, 0xe3a857);
        instrument.add(particles);
        break;
      }
      case 'kinesiologia-emozionale': {
        const hand = this.buildKinesiologyHand();
        instrument.add(hand.group);
        accent = hand.rings;
        secondary = hand.pulse;
        particles = this.buildParticles(20, 1.0, 0xc87a6b);
        instrument.add(particles);
        break;
      }
      case 'suonoterapia-vibrazionale': {
        const bowl = this.buildSoundBowl();
        instrument.add(bowl.group);
        accent = bowl.waves;
        secondary = bowl.mallet;
        particles = this.buildParticles(24, 1.15, 0xb48a9c);
        instrument.add(particles);
        break;
      }
      case 'arte-terapia': {
        const art = this.buildArtKit();
        instrument.add(art.group);
        accent = art.paint;
        secondary = art.brush;
        particles = this.buildParticles(22, 1.2, 0xc87a6b);
        instrument.add(particles);
        break;
      }
      default:
        secondary = this.buildTargetRings(0xaec1a7);
        instrument.add(secondary);
    }

    instrument.position.y = 0.08;
    instrument.scale.setScalar(0.88);
    return {
      root,
      instrument,
      accent,
      secondary,
      particles,
      reference,
      dispose: () => {
        root.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const material = mesh.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else if (material) material.dispose();
        });
        if (this.referenceTexture) {
          this.referenceTexture.dispose();
          this.referenceTexture = null;
        }
      },
    };
  }

  private createReferencePlane(slug: string): THREE.Mesh {
    const texture = new THREE.TextureLoader().load(`/metodi-${this.referenceName(slug)}.svg`);
    this.referenceTexture = texture;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.035, depthWrite: false, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.55, 2.55), material);
    plane.position.set(1.3, 0.25, -0.9);
    return plane;
  }

  private referenceName(slug: string): string {
    if (slug === 'arte-terapia') return 'arte-terapia';
    if (slug === 'cromopuntura') return 'cromopuntura';
    if (slug === 'kinesiologia-emozionale') return 'kinesiologia';
    return 'suonoterapia';
  }

  private metal(color: number, roughness = 0.25, metalness = 0.72): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness });
  }

  private buildChromopuncturePen(): { group: THREE.Group; beam: THREE.Mesh; tip: THREE.Mesh } {
    const group = new THREE.Group();
    const shell = this.metal(0x5e5048, 0.3, 0.55);
    const dark = this.metal(0x302c29, 0.24, 0.78);
    const brass = this.metal(0xc8a15f, 0.2, 0.82);

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 1.85, 48), shell);
    body.rotation.z = -Math.PI / 4;
    group.add(body);

    const rear = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 18), shell);
    rear.scale.set(1, 0.7, 1);
    rear.position.set(0.6, -0.6, 0);
    group.add(rear);

    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.235, 0.21, 0.48, 48), brass);
    grip.rotation.z = -Math.PI / 4;
    grip.position.set(-0.7, 0.7, 0);
    group.add(grip);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.42, 40), dark);
    nose.rotation.z = -Math.PI / 4;
    nose.position.set(-1.0, 1.0, 0);
    group.add(nose);

    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.16, 32), this.metal(0xe8e2d9, 0.16, 0.65));
    tip.rotation.z = -Math.PI / 4;
    tip.position.set(-1.2, 1.2, 0);
    group.add(tip);

    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 1), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.08, transmission: 0.72, thickness: 0.16, transparent: true, opacity: 0.92 }));
    crystal.scale.set(0.62, 1.4, 0.62);
    crystal.position.set(-1.34, 1.34, 0);
    group.add(crystal);

    const button = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.12, 4, 10), brass);
    button.rotation.z = -Math.PI / 4;
    button.position.set(-0.08, 0.08, 0.2);
    group.add(button);

    const seam = new THREE.Mesh(new THREE.TorusGeometry(0.195, 0.012, 10, 48), dark);
    seam.rotation.y = Math.PI / 2;
    seam.rotation.z = -Math.PI / 4;
    seam.position.set(0.18, -0.18, 0);
    group.add(seam);

    const beam = new THREE.Mesh(new THREE.ConeGeometry(0.06, 1.35, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0xe3a857, transparent: true, opacity: 0.11, depthWrite: false, blending: THREE.AdditiveBlending }));
    beam.rotation.z = -Math.PI / 4;
    beam.position.set(-1.82, 1.82, -0.04);
    group.add(beam);

    group.rotation.y = -0.28;
    return { group, beam, tip: crystal };
  }

  private buildKinesiologyHand(): { group: THREE.Group; rings: THREE.Group; pulse: THREE.Mesh } {
    const group = new THREE.Group();
    const skin = new THREE.MeshStandardMaterial({ color: 0xc8a88e, roughness: 0.72, metalness: 0.02 });
    const skinDark = new THREE.MeshStandardMaterial({ color: 0xb98f75, roughness: 0.78 });

    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.72, 48, 32), skin);
    palm.scale.set(0.72, 1.08, 0.48);
    palm.position.y = -0.05;
    group.add(palm);

    const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 0.62, 32), skin);
    wrist.position.y = -0.78;
    group.add(wrist);

    const fingers = [
      { x: -0.38, y: 0.72, len: 0.82, bend: -0.07 },
      { x: -0.13, y: 0.84, len: 1.02, bend: -0.02 },
      { x: 0.14, y: 0.83, len: 0.98, bend: 0.03 },
      { x: 0.4, y: 0.7, len: 0.82, bend: 0.1 },
    ];
    fingers.forEach(({ x, y, len, bend }, index) => {
      const proximal = new THREE.Mesh(new THREE.CapsuleGeometry(0.115, len * 0.58, 8, 16), skin);
      proximal.position.set(x, y, 0);
      proximal.rotation.z = bend;
      group.add(proximal);
      const joint = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 14), skinDark);
      joint.position.set(x + bend * 0.05, y + len * 0.31, 0);
      joint.scale.set(0.92, 0.72, 0.82);
      group.add(joint);
      const distal = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, len * 0.28, 8, 16), skin);
      distal.position.set(x + bend * 0.04, y + len * 0.48, 0);
      distal.rotation.z = bend * 1.4;
      group.add(distal);
      if (index < 3) {
        const nail = new THREE.Mesh(new THREE.SphereGeometry(0.058, 18, 12), new THREE.MeshStandardMaterial({ color: 0xe5cfc2, roughness: 0.48 }));
        nail.scale.set(0.9, 0.38, 0.2);
        nail.position.set(x + bend * 0.07, y + len * 0.67, 0.09);
        group.add(nail);
      }
    });

    const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.55, 8, 16), skin);
    thumb.position.set(-0.66, 0.1, 0.02);
    thumb.rotation.z = -0.92;
    group.add(thumb);
    const thumbJoint = new THREE.SphereGeometry(0.145, 20, 14);
    const thumbTip = new THREE.Mesh(thumbJoint, skin);
    thumbTip.position.set(-0.9, 0.37, 0.03);
    thumbTip.scale.set(0.92, 0.72, 0.85);
    group.add(thumbTip);

    const rings = this.buildTargetRings(0xc87a6b);
    rings.rotation.x = Math.PI / 2;
    rings.position.set(0.02, 0.02, 0.48);
    group.add(rings);

    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 18), new THREE.MeshBasicMaterial({ color: 0xc87a6b, transparent: true, opacity: 0.75 }));
    pulse.position.set(0.02, 0.02, 0.52);
    group.add(pulse);
    group.rotation.z = -0.13;
    return { group, rings, pulse };
  }

  private buildSoundBowl(): { group: THREE.Group; waves: THREE.Mesh; mallet: THREE.Group } {
    const group = new THREE.Group();
    const brass = new THREE.MeshStandardMaterial({ color: 0xd39a43, roughness: 0.23, metalness: 0.76 });
    const innerMat = new THREE.MeshStandardMaterial({ color: 0x9c6b25, roughness: 0.3, metalness: 0.7, side: THREE.DoubleSide });

    const profile = [
      new THREE.Vector2(0.62, 0.02),
      new THREE.Vector2(0.72, 0.06),
      new THREE.Vector2(0.84, 0.16),
      new THREE.Vector2(0.93, 0.34),
      new THREE.Vector2(0.98, 0.52),
      new THREE.Vector2(0.94, 0.64),
      new THREE.Vector2(0.86, 0.72),
    ];
    const outer = new THREE.Mesh(new THREE.LatheGeometry(profile, 64), brass);
    outer.rotation.x = Math.PI;
    outer.position.y = -0.18;
    group.add(outer);

    const innerProfile = [
      new THREE.Vector2(0.08, 0.08),
      new THREE.Vector2(0.55, 0.1),
      new THREE.Vector2(0.72, 0.18),
      new THREE.Vector2(0.82, 0.34),
      new THREE.Vector2(0.86, 0.5),
      new THREE.Vector2(0.82, 0.59),
    ];
    const inner = new THREE.Mesh(new THREE.LatheGeometry(innerProfile, 64), innerMat);
    inner.rotation.x = Math.PI;
    inner.position.y = -0.16;
    group.add(inner);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.055, 18, 80), brass);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.47;
    group.add(rim);

    const base = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.055, 14, 64), brass);
    base.rotation.x = Math.PI / 2;
    base.position.y = -0.2;
    group.add(base);

    const waves = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.012, 10, 96), new THREE.MeshBasicMaterial({ color: 0x8a9a86, transparent: true, opacity: 0.34 }));
    waves.rotation.x = Math.PI / 2;
    waves.position.y = 0.58;
    group.add(waves);

    const mallet = new THREE.Group();
    const wood = new THREE.MeshStandardMaterial({ color: 0x6b5142, roughness: 0.55 });
    const leather = new THREE.MeshStandardMaterial({ color: 0xc8b29b, roughness: 0.76 });
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 1.45, 24), wood);
    shaft.position.y = 0.65;
    mallet.add(shaft);
    const head = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, 0.24, 8, 16), leather);
    head.position.y = -0.03;
    mallet.add(head);
    mallet.position.set(1.02, 0.72, 0.42);
    mallet.rotation.z = -0.5;
    return { group, waves, mallet };
  }

  private buildArtKit(): { group: THREE.Group; paint: THREE.Mesh; brush: THREE.Group } {
    const group = new THREE.Group();
    const shape = new THREE.Shape();
    shape.moveTo(-0.95, -0.35);
    shape.bezierCurveTo(-1.05, 0.5, -0.35, 0.85, 0.5, 0.72);
    shape.bezierCurveTo(1.0, 0.64, 1.05, 0.05, 0.64, -0.48);
    shape.bezierCurveTo(0.25, -0.85, -0.52, -0.82, -0.82, -0.55);
    shape.lineTo(-0.38, -0.32);
    shape.bezierCurveTo(-0.22, -0.2, -0.28, 0.04, -0.48, 0.03);
    shape.closePath();
    const palette = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.035, bevelThickness: 0.035 }), new THREE.MeshStandardMaterial({ color: 0xe8d8c8, roughness: 0.58 }));
    palette.rotation.x = -Math.PI / 2;
    palette.position.y = -0.02;
    group.add(palette);

    const paintColors = [0xc87a6b, 0x8a9a86, 0xb48a9c, 0xe3a857];
    paintColors.forEach((color, index) => {
      const angle = index * Math.PI * 0.5 + 0.3;
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), new THREE.MeshStandardMaterial({ color, roughness: 0.42 }));
      dot.scale.y = 0.55;
      dot.position.set(Math.cos(angle) * 0.43, 0.16, Math.sin(angle) * 0.3);
      group.add(dot);
    });

    const paint = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 16), new THREE.MeshStandardMaterial({ color: 0xc87a6b, roughness: 0.48 }));
    paint.scale.set(1.35, 0.5, 1.35);
    paint.position.set(-0.1, 0.18, 0.05);
    group.add(paint);

    const brush = new THREE.Group();
    const wood = new THREE.MeshStandardMaterial({ color: 0x6b5142, roughness: 0.5 });
    const ferruleMat = this.metal(0xc8b29b, 0.25, 0.45);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.07, 1.55, 24), wood);
    handle.rotation.z = -0.66;
    brush.add(handle);
    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.075, 0.23, 24), ferruleMat);
    ferrule.rotation.z = -0.66;
    ferrule.position.set(-0.5, 0.54, 0);
    brush.add(ferrule);
    const bristles = new THREE.Mesh(new THREE.ConeGeometry(0.105, 0.38, 24), new THREE.MeshStandardMaterial({ color: 0x8a5b45, roughness: 0.88 }));
    bristles.rotation.z = -0.66;
    bristles.position.set(-0.69, 0.76, 0);
    brush.add(bristles);
    brush.position.set(0.55, 0.34, 0.32);
    return { group, paint, brush };
  }

  private buildTargetRings(color: number): THREE.Group {
    const group = new THREE.Group();
    [0.28, 0.47, 0.67].forEach((radius, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.009 + index * 0.003, 10, 64), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.32 - index * 0.06 }));
      group.add(ring);
    });
    return group;
  }

  private buildParticles(count: number, radius: number, color: number): THREE.Points {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius * (0.55 + (i % 5) / 14);
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = (Math.sin(angle * 1.7) * 0.35 + (i % 4) / 12) * 0.9;
      positions[i * 3 + 2] = Math.sin(angle) * r * 0.3;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return new THREE.Points(geometry, new THREE.PointsMaterial({ color, size: 0.026, transparent: true, opacity: 0.24, sizeAttenuation: true }));
  }

  private setupScroll(): void {
    if (this.scrollHandler) return;
    this.scrollHandler = () => (this.targetProgress = this.readProgress());
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  private readProgress(): number {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
  }

  private setupResize(canvas: HTMLCanvasElement): void {
    this.resizeObserver = new ResizeObserver(() => this.handleResize(canvas));
    this.resizeObserver.observe(canvas.parentElement ?? canvas);
  }

  private handleResize(canvas: HTMLCanvasElement): void {
    if (!this.renderer || !this.camera) return;
    const parent = canvas.parentElement ?? canvas;
    const width = Math.max(1, parent.clientWidth);
    const height = Math.max(1, parent.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private setupVisibility(): void {
    this.visibilityHandler = () => {
      this.visible = document.visibilityState === 'visible';
      if (this.visible) {
        this.previousTime = performance.now();
        this.startLoop();
      }
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  private startLoop(): void {
    if (this.animationFrame || !this.renderer) return;
    this.animationFrame = requestAnimationFrame(() => {
      this.animationFrame = 0;
      this.loop();
    });
  }

  private loop(): void {
    if (!this.renderer || !this.scene || !this.camera || !this.state || !this.visible) return;
    const now = performance.now();
    const elapsed = (now - this.startTime) / 1000;
    const delta = Math.min((now - this.previousTime) / 1000, 0.1);
    this.previousTime = now;
    const follow = this.reducedMotion ? 1 : 0.055;
    this.progress += (this.targetProgress - this.progress) * follow;
    this.updateExperience(this.progress, elapsed, delta);
    this.renderer.render(this.scene, this.camera);
    this.animationFrame = requestAnimationFrame(() => {
      this.animationFrame = 0;
      this.loop();
    });
  }

  private updateExperience(progress: number, elapsed: number, delta: number): void {
    if (!this.state || !this.camera) return;
    const s = this.state;
    const smooth = THREE.MathUtils.smoothstep(progress, 0, 1);
    const reveal = THREE.MathUtils.smoothstep(progress, 0.02, 0.18);
    const focus = THREE.MathUtils.smoothstep(progress, 0.2, 0.48);
    const interaction = THREE.MathUtils.smoothstep(progress, 0.44, 0.72);
    const settle = THREE.MathUtils.smoothstep(progress, 0.78, 1);
    const motion = this.reducedMotion ? 0 : 1;

    s.instrument.position.y = THREE.MathUtils.lerp(-0.72, 0.08, reveal);
    s.instrument.position.x = Math.sin(progress * Math.PI) * 0.11 * motion;
    s.instrument.rotation.y = THREE.MathUtils.lerp(-0.24, 0.13, focus) + Math.sin(elapsed * 0.22) * 0.018 * motion;
    s.instrument.rotation.x = Math.sin(progress * Math.PI * 1.2) * 0.045 * motion;
    const scale = THREE.MathUtils.lerp(0.78, 1, reveal) * THREE.MathUtils.lerp(1.01, 0.97, settle);
    s.instrument.scale.setScalar(scale);

    this.camera.position.x = THREE.MathUtils.lerp(0.2, -0.15, smooth);
    this.camera.position.y = THREE.MathUtils.lerp(0.76, 0.5, smooth);
    this.camera.position.z = THREE.MathUtils.lerp(6.8, 5.75, focus);
    this.camera.lookAt(0, 0.38, 0);

    if (s.reference) {
      const material = s.reference.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.lerp(0.008, 0.045, focus) * (1 - settle * 0.4);
      s.reference.position.x = 1.3 + Math.sin(progress * Math.PI) * 0.12;
      s.reference.rotation.z = Math.sin(elapsed * 0.12) * 0.008;
    }

    if (s.accent) {
      const pulse = 1 + Math.sin(progress * Math.PI * 6 + elapsed * 0.7) * 0.025 * motion;
      s.accent.scale.setScalar(pulse + interaction * 0.05);
      if (s.accent instanceof THREE.Mesh) {
        const material = s.accent.material as THREE.Material & { opacity?: number };
        if ('opacity' in material) material.opacity = Math.max(0.06, (material.opacity ?? 0.2) * (0.9 + interaction * 0.1));
      }
    }

    if (s.secondary) {
      s.secondary.rotation.y += delta * 0.045 * motion;
      s.secondary.scale.setScalar(1 + interaction * 0.045);
    }

    if (s.particles) {
      s.particles.rotation.y += delta * 0.035 * motion;
      const material = s.particles.material as THREE.PointsMaterial;
      material.opacity = THREE.MathUtils.lerp(0.04, 0.22, focus) * (1 - settle * 0.25);
    }
  }

  private resolveColor(value: string): number {
    const normalized = value.trim().replace('#', '');
    if (/^[0-9a-fA-F]{6}$/.test(normalized)) return Number.parseInt(normalized, 16);
    return 0x3c607a;
  }

  private destroy(): void {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
    if (this.visibilityHandler) document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.resizeObserver?.disconnect();
    this.state?.dispose();
    this.renderer?.dispose();
    this.referenceTexture?.dispose();
    this.referenceTexture = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.state = null;
  }
}
