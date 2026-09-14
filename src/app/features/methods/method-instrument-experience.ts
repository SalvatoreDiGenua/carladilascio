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
  accent: THREE.Mesh | THREE.Points | null;
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
        <div
          class="absolute inset-0 z-10 flex items-center justify-center"
          role="status"
          [attr.aria-label]="loadingLabel()"
        >
          <span
            class="text-xs font-medium tracking-[0.18em] text-ink-muted uppercase"
            >3D</span
          >
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

  private readonly canvasRef =
    viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly transloco = inject(TranslocoService);

  readonly ariaLabel = computed(
    () =>
      `${this.transloco.translate(this.title() || this.slug())} — esperienza 3D dello strumento`,
  );
  readonly loadingLabel = computed(
    () =>
      `Caricamento dell'esperienza 3D per ${this.transloco.translate(this.title() || this.slug())}`,
  );

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

    this.reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.92;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    this.camera.position.set(0, 0.65, 6.4);

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
    this.scene.add(new THREE.HemisphereLight(0xf7f5f0, 0x26313a, 1.9));

    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(3.5, 5, 4);
    this.scene.add(key);

    const rim = new THREE.PointLight(
      this.resolveColor(this.themeColor()),
      1.2,
      7,
    );
    rim.position.set(-2.5, 1.5, 2.5);
    this.scene.add(rim);
  }

  private rebuild(): void {
    if (!this.renderer) return;
    this.rebuildScene();
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

    let accent: THREE.Mesh | THREE.Points | null = null;
    let secondary: THREE.Object3D | null = null;
    let particles: THREE.Points | null = null;

    switch (slug) {
      case 'cromopuntura': {
        const pen = this.buildChromopuncturePen();
        instrument.add(pen.group);
        accent = pen.beam;
        particles = this.buildParticles(44, 1.35, this.resolveColor('#E3A857'));
        instrument.add(particles);
        secondary = this.buildTargetRings(0xaec1a7);
        instrument.add(secondary);
        break;
      }
      case 'kinesiologia-emozionale': {
        const hand = this.buildKinesiologyHand();
        instrument.add(hand.group);
        accent = hand.rings;
        particles = this.buildParticles(34, 1.1, this.resolveColor('#C87A6B'));
        instrument.add(particles);
        secondary = hand.pulse;
        instrument.add(secondary);
        break;
      }
      case 'suonoterapia-vibrazionale': {
        const bowl = this.buildSoundBowl();
        instrument.add(bowl.group);
        accent = bowl.waves;
        secondary = bowl.mallet;
        instrument.add(secondary);
        particles = this.buildParticles(30, 1.2, this.resolveColor('#B48A9C'));
        instrument.add(particles);
        break;
      }
      case 'arte-terapia': {
        const art = this.buildArtKit();
        instrument.add(art.group);
        accent = art.paint;
        secondary = art.brush;
        instrument.add(secondary);
        particles = this.buildParticles(40, 1.3, this.resolveColor('#C87A6B'));
        instrument.add(particles);
        break;
      }
      default:
        secondary = this.buildTargetRings(0xaec1a7);
        instrument.add(secondary);
    }

    instrument.position.y = 0.15;
    instrument.scale.setScalar(0.86);

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
      },
    };
  }

  private createReferencePlane(slug: string): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(2.45, 2.45);
    const material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(
        `/metodi-${this.referenceName(slug)}.svg`,
      ),
      transparent: true,
      opacity: 0.045,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(1.35, 0.25, -0.75);
    plane.rotation.z = -0.04;
    return plane;
  }

  private referenceName(slug: string): string {
    if (slug === 'arte-terapia') return 'arte-terapia';
    if (slug === 'cromopuntura') return 'cromopuntura';
    if (slug === 'kinesiologia-emozionale') return 'kinesiologia';
    return 'suonoterapia';
  }

  private buildChromopuncturePen(): { group: THREE.Group; beam: THREE.Mesh } {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.19, 2.25, 32),
      new THREE.MeshStandardMaterial({
        color: 0x6b5b52,
        roughness: 0.36,
        metalness: 0.18,
      }),
    );
    body.rotation.z = -Math.PI / 4;
    group.add(body);

    const grip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.205, 0.205, 0.46, 32),
      new THREE.MeshStandardMaterial({
        color: 0xc8b29b,
        roughness: 0.28,
        metalness: 0.32,
      }),
    );
    grip.rotation.z = -Math.PI / 4;
    grip.position.set(-0.72, 0.72, 0);
    group.add(grip);

    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.23, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.12,
        transmission: 0.55,
        transparent: true,
        opacity: 0.9,
      }),
    );
    crystal.position.set(-1.03, 1.03, 0);
    crystal.scale.set(0.7, 1.25, 0.7);
    group.add(crystal);

    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 1.45, 32, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xe3a857,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    beam.position.set(-1.48, 1.5, 0);
    beam.rotation.z = -Math.PI / 4;
    group.add(beam);

    group.position.set(0.1, -0.15, 0);
    group.rotation.y = -0.22;
    return { group, beam };
  }

  private buildKinesiologyHand(): {
    group: THREE.Group;
    rings: THREE.Mesh;
    pulse: THREE.Mesh;
  } {
    const group = new THREE.Group();
    const skin = new THREE.MeshStandardMaterial({
      color: 0xc8b29b,
      roughness: 0.7,
    });
    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 24), skin);
    palm.scale.set(0.72, 1.05, 0.34);
    group.add(palm);

    const fingerLengths = [0.92, 1.04, 1.0, 0.9];
    fingerLengths.forEach((length, index) => {
      const finger = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.12, length, 6, 12),
        skin,
      );
      finger.position.set(-0.4 + index * 0.26, 0.78 + (index % 2) * 0.04, 0);
      finger.rotation.z = (index - 1.5) * 0.08;
      group.add(finger);
    });

    const thumb = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.13, 0.65, 6, 12),
      skin,
    );
    thumb.position.set(-0.67, 0.2, 0);
    thumb.rotation.z = -0.9;
    group.add(thumb);

    const rings = this.buildTargetRings(0xc87a6b) as THREE.Mesh;
    rings.rotation.x = Math.PI / 2;
    rings.position.z = 0.35;
    group.add(rings);

    const pulse = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 20, 16),
      new THREE.MeshBasicMaterial({
        color: 0xc87a6b,
        transparent: true,
        opacity: 0.65,
      }),
    );
    pulse.position.set(0, 0.05, 0.39);
    group.add(pulse);
    group.rotation.z = -0.18;
    group.position.y = -0.15;
    return { group, rings, pulse };
  }

  private buildSoundBowl(): {
    group: THREE.Group;
    waves: THREE.Mesh;
    mallet: THREE.Group;
  } {
    const group = new THREE.Group();
    const gold = new THREE.MeshStandardMaterial({
      color: 0xe3a857,
      roughness: 0.28,
      metalness: 0.62,
    });
    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.92, 0.68, 0.42, 64, 1, true),
      gold,
    );
    bowl.position.y = 0.05;
    group.add(bowl);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.92, 0.045, 16, 64),
      gold,
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.27;
    group.add(rim);

    const inner = new THREE.Mesh(
      new THREE.CircleGeometry(0.83, 64),
      new THREE.MeshStandardMaterial({
        color: 0xc58f3c,
        roughness: 0.34,
        metalness: 0.5,
      }),
    );
    inner.rotation.x = -Math.PI / 2;
    inner.position.y = 0.27;
    group.add(inner);

    const waves = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.014, 10, 96),
      new THREE.MeshBasicMaterial({
        color: 0x8a9a86,
        transparent: true,
        opacity: 0.42,
      }),
    );
    waves.rotation.x = Math.PI / 2;
    waves.position.y = 0.36;
    group.add(waves);

    const mallet = new THREE.Group();
    const stick = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.055, 1.25, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0x6b5b52, roughness: 0.55 }),
    );
    stick.position.y = 0.75;
    mallet.add(stick);
    const head = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.11, 0.24, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0xc8b29b, roughness: 0.65 }),
    );
    head.position.y = 0.1;
    mallet.add(head);
    mallet.position.set(0.95, 0.65, 0.35);
    mallet.rotation.z = -0.48;
    return { group, waves, mallet };
  }

  private buildArtKit(): {
    group: THREE.Group;
    paint: THREE.Mesh;
    brush: THREE.Group;
  } {
    const group = new THREE.Group();
    const palette = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 40, 24),
      new THREE.MeshStandardMaterial({ color: 0xe8d8c8, roughness: 0.62 }),
    );
    palette.scale.set(1.18, 0.12, 0.84);
    group.add(palette);

    const paintColors = [0xc87a6b, 0x8a9a86, 0xb48a9c, 0xe3a857];
    paintColors.forEach((color, index) => {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 20, 14),
        new THREE.MeshStandardMaterial({ color, roughness: 0.5 }),
      );
      const angle = index * Math.PI * 0.5;
      dot.position.set(Math.cos(angle) * 0.48, 0.16, Math.sin(angle) * 0.38);
      group.add(dot);
    });

    const paint = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 24, 16),
      new THREE.MeshBasicMaterial({
        color: 0xc87a6b,
        transparent: true,
        opacity: 0.35,
      }),
    );
    paint.scale.set(1.6, 0.35, 1.6);
    paint.position.set(-0.05, 0.19, 0.05);
    group.add(paint);

    const brush = new THREE.Group();
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.065, 1.65, 20),
      new THREE.MeshStandardMaterial({ color: 0x6b5b52, roughness: 0.5 }),
    );
    handle.rotation.z = -0.65;
    brush.add(handle);
    const ferrule = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.07, 0.22, 20),
      new THREE.MeshStandardMaterial({
        color: 0xc8b29b,
        roughness: 0.28,
        metalness: 0.35,
      }),
    );
    ferrule.rotation.z = -0.65;
    ferrule.position.set(-0.52, 0.55, 0);
    brush.add(ferrule);
    const bristles = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.38, 20),
      new THREE.MeshStandardMaterial({ color: 0xc87a6b, roughness: 0.72 }),
    );
    bristles.rotation.z = -0.65;
    bristles.position.set(-0.7, 0.76, 0);
    brush.add(bristles);
    brush.position.set(0.5, 0.35, 0.25);
    return { group, paint, brush };
  }

  private buildTargetRings(color: number): THREE.Mesh {
    const group = new THREE.Group();
    [0.32, 0.52, 0.76].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.012 + index * 0.004, 10, 64),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.38 - index * 0.08,
        }),
      );
      ring.position.z = index * 0.012;
      group.add(ring);
    });
    const wrapper = new THREE.Group();
    wrapper.add(group);
    return wrapper as unknown as THREE.Mesh;
  }

  private buildParticles(
    count: number,
    radius: number,
    color: number,
  ): THREE.Points {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius * (0.55 + (i % 7) / 14);
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = (Math.sin(angle * 1.7) * 0.5 + (i % 5) / 10) * 0.9;
      positions[i * 3 + 2] = Math.sin(angle) * r * 0.35;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color,
        size: 0.035,
        transparent: true,
        opacity: 0.38,
        sizeAttenuation: true,
      }),
    );
  }

  private setupScroll(): void {
    if (this.scrollHandler) return;
    this.scrollHandler = () => (this.targetProgress = this.readProgress());
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  private readProgress(): number {
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
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
    if (
      !this.renderer ||
      !this.scene ||
      !this.camera ||
      !this.state ||
      !this.visible
    )
      return;
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

  private updateExperience(
    progress: number,
    elapsed: number,
    delta: number,
  ): void {
    if (!this.state || !this.camera) return;
    const s = this.state;
    const smooth = THREE.MathUtils.smoothstep(progress, 0, 1);
    const reveal = THREE.MathUtils.smoothstep(progress, 0.02, 0.2);
    const focus = THREE.MathUtils.smoothstep(progress, 0.24, 0.48);
    const interaction = THREE.MathUtils.smoothstep(progress, 0.42, 0.72);
    const settle = THREE.MathUtils.smoothstep(progress, 0.78, 1);
    const motion = this.reducedMotion ? 0 : 1;

    s.instrument.position.y = THREE.MathUtils.lerp(-0.65, 0.12, reveal);
    s.instrument.position.x =
      Math.sin(progress * Math.PI * 1.2) * 0.14 * motion;
    s.instrument.rotation.y =
      THREE.MathUtils.lerp(-0.34, 0.18, focus) +
      Math.sin(elapsed * 0.25) * 0.035 * motion;
    s.instrument.rotation.x =
      Math.sin(progress * Math.PI * 1.5) * 0.08 * motion;
    const scale =
      THREE.MathUtils.lerp(0.74, 1, reveal) *
      THREE.MathUtils.lerp(1.02, 0.95, settle);
    s.instrument.scale.setScalar(scale);

    this.camera.position.x = THREE.MathUtils.lerp(0.18, -0.18, smooth);
    this.camera.position.y = THREE.MathUtils.lerp(0.78, 0.48, smooth);
    this.camera.position.z = THREE.MathUtils.lerp(6.7, 6.0, focus);
    this.camera.lookAt(0, 0.45, 0);

    if (s.reference) {
      (s.reference.material as THREE.Material<THREE.MaterialEventMap>).opacity =
        THREE.MathUtils.lerp(0.015, 0.065, focus) * (1 - settle * 0.35);
      s.reference.rotation.z =
        -0.04 + Math.sin(elapsed * 0.16) * 0.015 * motion;
      s.reference.position.x = 1.35 + Math.sin(progress * Math.PI) * 0.18;
    }

    if (s.accent) {
      const accent = s.accent as THREE.Object3D;
      const pulse =
        1 +
        Math.sin((progress * 7 + elapsed * 0.55) * Math.PI) * 0.035 * motion;
      accent.scale.setScalar(pulse + interaction * 0.08);
      accent.rotation.z += delta * 0.025 * motion;
    }

    if (s.secondary) {
      s.secondary.rotation.y += delta * 0.12 * motion;
      s.secondary.rotation.z = Math.sin(progress * Math.PI * 2) * 0.07 * motion;
      s.secondary.scale.setScalar(1 + interaction * 0.08);
    }

    if (s.particles) {
      s.particles.rotation.y += delta * 0.08 * motion;
      s.particles.rotation.x = Math.sin(elapsed * 0.2) * 0.04 * motion;
      const material = s.particles.material as THREE.PointsMaterial;
      material.opacity =
        THREE.MathUtils.lerp(0.08, 0.34, focus) * (1 - settle * 0.25);
    }
  }

  private resolveColor(value: string): number {
    const map: Record<string, number> = {
      '#C87A6B': 0xc87a6b,
      '#E3A857': 0xe3a857,
      '#8A9A86': 0x8a9a86,
      '#B48A9C': 0xb48a9c,
      '#3c607a': 0x3c607a,
    };
    return map[value] ?? 0x3c607a;
  }

  private destroy(): void {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (this.scrollHandler)
      window.removeEventListener('scroll', this.scrollHandler);
    if (this.visibilityHandler)
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.resizeObserver?.disconnect();
    this.state?.dispose();
    this.renderer?.dispose();
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.state = null;
  }
}
