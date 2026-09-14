import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, ElementRef, PLATFORM_ID, afterNextRender, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import * as THREE from 'three';
import { TranslocoService } from '@jsverse/transloco';

interface SceneState { root: THREE.Group; instrument: THREE.Group; accent: THREE.Object3D | null; secondary: THREE.Object3D | null; particles: THREE.Points | null; reference: THREE.Mesh | null; dispose: () => void; }

@Component({
  selector: 'app-method-instrument-experience',
  host: { class: 'block h-full min-h-[280px] w-full' },
  template: `<div class="relative h-full min-h-[280px] w-full overflow-hidden">
    @if (!isLoaded()) { <div class="absolute inset-0 z-10 flex items-center justify-center" role="status" [attr.aria-label]="loadingLabel()"><span class="text-xs font-medium tracking-[0.18em] text-ink-muted uppercase">3D</span></div> }
    <canvas #canvas class="absolute inset-0 block h-full w-full transition-opacity duration-700" [class.opacity-0]="!isLoaded()" [class.opacity-100]="isLoaded()" role="img" [attr.aria-label]="ariaLabel()"></canvas>
  </div>`,
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
  readonly ariaLabel = computed(() => `${this.transloco.translate(this.title() || this.slug())} — esperienza 3D realistica dello strumento`);
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
    effect(() => { const slug = this.slug(); const color = this.themeColor(); void slug; void color; if (!isPlatformBrowser(this.platformId) || !this.renderer) return; this.rebuildScene(); });
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
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    this.camera.position.set(0.15, 0.45, 6.25);
    this.camera.lookAt(0, 0.15, 0);
    this.addLighting();
    this.rebuildScene();
    this.setupResize(canvas);
    this.setupScroll();
    this.setupVisibility();
    const now = performance.now(); this.startTime = now; this.previousTime = now; this.targetProgress = this.readProgress(); this.progress = this.targetProgress;
    this.handleResize(canvas); this.isLoaded.set(true); this.startLoop();
  }

  private addLighting(): void {
    if (!this.scene) return;
    this.scene.add(new THREE.HemisphereLight(0xf5f1e8, 0x26313a, 1.45));
    const key = new THREE.DirectionalLight(0xfff8ec, 3.5); key.position.set(3.5, 5.5, 4.5); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.camera.near = 0.5; key.shadow.camera.far = 20; this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xdde7ec, 1.35); fill.position.set(-4, 1.5, 3); this.scene.add(fill);
    const rim = new THREE.PointLight(this.resolveColor(this.themeColor()), 1.15, 9, 2); rim.position.set(-2.5, 1.8, 3); this.scene.add(rim);
  }

  private rebuildScene(): void { if (!this.scene) return; this.state?.dispose(); this.state = this.buildMethodScene(this.slug()); this.scene.add(this.state.root); }

  private buildMethodScene(slug: string): SceneState {
    const root = new THREE.Group(); const instrument = new THREE.Group(); root.add(instrument); const reference = this.createReferencePlane(slug); root.add(reference);
    let accent: THREE.Object3D | null = null; let secondary: THREE.Object3D | null = null; let particles: THREE.Points | null = null;
    switch (slug) {
      case 'cromopuntura': { const pen = this.buildChromopuncturePen(); instrument.add(pen.group); accent = pen.beam; secondary = pen.crystal; particles = this.buildParticles(14, 1.05, 0xe3a857); instrument.add(particles); break; }
      case 'kinesiologia-emozionale': { const hand = this.buildKinesiologyHand(); instrument.add(hand.group); accent = hand.rings; secondary = hand.pulse; particles = this.buildParticles(10, 0.95, 0xc87a6b); instrument.add(particles); break; }
      case 'suonoterapia-vibrazionale': { const bowl = this.buildSoundBowl(); instrument.add(bowl.group); accent = bowl.waves; secondary = bowl.mallet; particles = this.buildParticles(12, 1, 0xb48a9c); instrument.add(particles); break; }
      case 'arte-terapia': { const art = this.buildArtKit(); instrument.add(art.group); accent = art.paint; secondary = art.brush; particles = this.buildParticles(10, 1.05, 0xc87a6b); instrument.add(particles); break; }
      default: secondary = this.buildTargetRings(0xaec1a7); instrument.add(secondary);
    }
    instrument.position.y = 0.06; instrument.scale.setScalar(0.9);
    return { root, instrument, accent, secondary, particles, reference, dispose: () => {
      root.traverse((object) => { const mesh = object as THREE.Mesh; if (mesh.geometry) mesh.geometry.dispose(); const material = mesh.material; if (Array.isArray(material)) material.forEach((m) => m.dispose()); else if (material) material.dispose(); });
      if (this.referenceTexture) { this.referenceTexture.dispose(); this.referenceTexture = null; }
    } };
  }

  private createReferencePlane(slug: string): THREE.Mesh {
    const texture = new THREE.TextureLoader().load(`/metodi-${this.referenceName(slug)}.svg`); this.referenceTexture = texture;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.018, depthWrite: false, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.55, 2.55), material); plane.position.set(1.25, 0.22, -1.15); return plane;
  }
  private referenceName(slug: string): string { if (slug === 'arte-terapia') return 'arte-terapia'; if (slug === 'cromopuntura') return 'cromopuntura'; if (slug === 'kinesiologia-emozionale') return 'kinesiologia'; return 'suonoterapia'; }
  private metal(color: number, roughness = 0.28, metalness = 0.72): THREE.MeshStandardMaterial { return new THREE.MeshStandardMaterial({ color, roughness, metalness }); }
  private plastic(color: number, roughness = 0.36): THREE.MeshStandardMaterial { return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.08 }); }

  private buildChromopuncturePen(): { group: THREE.Group; beam: THREE.Mesh; crystal: THREE.Mesh } {
    const group = new THREE.Group(); const shell = this.metal(0x4d4945, 0.24, 0.7); const dark = this.metal(0x242321, 0.2, 0.82); const brass = this.metal(0xb18a50, 0.18, 0.86); const rubber = this.plastic(0x292826, 0.62);
    const profile = [[0, 0.15], [0.08, 0.18], [0.25, 0.2], [0.95, 0.205], [1.08, 0.18], [1.22, 0.16]].map(([y, r]) => new THREE.Vector2(r, y));
    const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 64), shell); body.rotation.z = -Math.PI / 4; body.position.set(0.08, -0.08, 0); body.castShadow = true; group.add(body);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.225, 0.205, 0.48, 64), rubber); grip.rotation.z = -Math.PI / 4; grip.position.set(-0.72, 0.72, 0); grip.castShadow = true; group.add(grip);
    for (let i = 0; i < 5; i++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.218, 0.009, 10, 64), dark); ring.rotation.y = Math.PI / 2; ring.rotation.z = -Math.PI / 4; ring.position.set(-0.56 + i * 0.09, 0.56 - i * 0.09, 0); group.add(ring); }
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.15, 0.23, 64), brass); collar.rotation.z = -Math.PI / 4; collar.position.set(-1, 1, 0); collar.castShadow = true; group.add(collar);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.4, 64), dark); nose.rotation.z = -Math.PI / 4; nose.position.set(-1.19, 1.19, 0); group.add(nose);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.32, 32), this.metal(0xd7d0c5, 0.18, 0.78)); shaft.rotation.z = -Math.PI / 4; shaft.position.set(-1.38, 1.38, 0); shaft.castShadow = true; group.add(shaft);
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.15, 2), new THREE.MeshPhysicalMaterial({ color: 0xf7f2df, roughness: 0.05, transmission: 0.62, thickness: 0.22, ior: 1.45, transparent: true, opacity: 0.9 })); crystal.scale.set(0.58, 1.55, 0.58); crystal.position.set(-1.55, 1.55, 0); crystal.castShadow = true; group.add(crystal);
    const button = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.1, 6, 16), brass); button.rotation.z = -Math.PI / 4; button.position.set(-0.12, 0.12, 0.2); group.add(button);
    const seam = new THREE.Mesh(new THREE.TorusGeometry(0.208, 0.012, 12, 64), dark); seam.rotation.y = Math.PI / 2; seam.rotation.z = -Math.PI / 4; seam.position.set(0.24, -0.24, 0); group.add(seam);
    const beam = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.95, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0xe3a857, transparent: true, opacity: 0.07, depthWrite: false, blending: THREE.AdditiveBlending })); beam.rotation.z = -Math.PI / 4; beam.position.set(-1.93, 1.93, -0.05); group.add(beam);
    group.rotation.y = -0.3; group.rotation.x = 0.08; return { group, beam, crystal };
  }

  private buildKinesiologyHand(): { group: THREE.Group; rings: THREE.Group; pulse: THREE.Mesh } {
    const group = new THREE.Group(); const skin = new THREE.MeshStandardMaterial({ color: 0xc79d82, roughness: 0.58, metalness: 0.01 }); const skinDark = new THREE.MeshStandardMaterial({ color: 0xb5846b, roughness: 0.64 }); const nailMat = new THREE.MeshPhysicalMaterial({ color: 0xe9d8cd, roughness: 0.32, transmission: 0.08, thickness: 0.08 });
    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.7, 64, 48), skin); palm.scale.set(0.78, 1.08, 0.48); palm.position.y = -0.05; palm.castShadow = true; group.add(palm);
    const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.66, 48), skin); wrist.position.y = -0.82; wrist.castShadow = true; group.add(wrist);
    const fingers = [{ x: -0.38, y: 0.66, len: 0.82, bend: -0.075 }, { x: -0.13, y: 0.82, len: 1.03, bend: -0.025 }, { x: 0.14, y: 0.81, len: 1, bend: 0.025 }, { x: 0.4, y: 0.67, len: 0.82, bend: 0.09 }];
    fingers.forEach(({ x, y, len, bend }) => {
      const proximal = new THREE.Mesh(new THREE.CapsuleGeometry(0.115, len * 0.5, 10, 20), skin); proximal.position.set(x, y, 0); proximal.rotation.z = bend; proximal.castShadow = true; group.add(proximal);
      const joint = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), skinDark); joint.position.set(x + bend * 0.04, y + len * 0.28, 0); joint.scale.set(0.94, 0.72, 0.82); group.add(joint);
      const distal = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, len * 0.27, 10, 20), skin); distal.position.set(x + bend * 0.06, y + len * 0.48, 0); distal.rotation.z = bend * 1.25; distal.castShadow = true; group.add(distal);
      const nail = new THREE.Mesh(new THREE.SphereGeometry(0.064, 24, 16), nailMat); nail.scale.set(0.88, 0.45, 0.24); nail.position.set(x + bend * 0.08, y + len * 0.64, 0.085); group.add(nail);
    });
    const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.58, 10, 20), skin); thumb.position.set(-0.63, 0.08, 0.03); thumb.rotation.z = -0.92; thumb.castShadow = true; group.add(thumb);
    const joint = new THREE.Mesh(new THREE.SphereGeometry(0.135, 24, 16), skinDark); joint.position.set(-0.42, 0.38, 0.04); group.add(joint);
    const rings = this.buildTargetRings(0xc87a6b); rings.scale.setScalar(0.72); rings.position.set(0, 0.05, 0.22); group.add(rings);
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.075, 32, 20), new THREE.MeshPhysicalMaterial({ color: 0xf4c9ba, emissive: 0x5b2419, emissiveIntensity: 0.15, roughness: 0.25, transmission: 0.18 })); pulse.position.set(0, 0.02, 0.28); group.add(pulse);
    group.rotation.z = -0.08; group.rotation.y = 0.08; return { group, rings, pulse };
  }

  private buildSoundBowl(): { group: THREE.Group; waves: THREE.Mesh; mallet: THREE.Group } {
    const group = new THREE.Group(); const bronze = new THREE.MeshPhysicalMaterial({ color: 0x9d7854, metalness: 0.86, roughness: 0.22, clearcoat: 0.55, clearcoatRoughness: 0.18 }); const darkBronze = new THREE.MeshStandardMaterial({ color: 0x4b3527, metalness: 0.78, roughness: 0.3 });
    const profile: THREE.Vector2[] = []; for (let i = 0; i <= 28; i++) { const t = i / 28; const r = 0.72 + 0.72 * Math.sin(t * Math.PI * 0.72); const y = -0.52 + t * 0.92; profile.push(new THREE.Vector2(r, y)); } profile.push(new THREE.Vector2(0.18, 0.43));
    const bowl = new THREE.Mesh(new THREE.LatheGeometry(profile, 96), bronze); bowl.scale.set(1, 0.82, 1); bowl.castShadow = true; bowl.receiveShadow = true; group.add(bowl);
    const inner = new THREE.Mesh(new THREE.LatheGeometry(profile.map((p) => new THREE.Vector2(Math.max(0.08, p.x - 0.055), p.y + 0.035)), 96), new THREE.MeshPhysicalMaterial({ color: 0x72563d, metalness: 0.8, roughness: 0.3, side: THREE.BackSide })); inner.scale.copy(bowl.scale); group.add(inner);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.43, 0.055, 18, 96), bronze); rim.scale.y = 0.82; rim.position.y = 0.39; rim.castShadow = true; group.add(rim);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.64, 0.16, 64), darkBronze); foot.position.y = -0.55; foot.castShadow = true; group.add(foot);
    const waves = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.012, 10, 96), new THREE.MeshBasicMaterial({ color: 0xb48a9c, transparent: true, opacity: 0.15, depthWrite: false })); waves.rotation.x = Math.PI / 2; waves.position.y = 0.43; group.add(waves);
    const mallet = new THREE.Group(); const wood = new THREE.MeshStandardMaterial({ color: 0x76543e, roughness: 0.62 });
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.052, 1.15, 32), wood); handle.rotation.z = -0.52; handle.position.set(1.45, 0.85, 0.12); handle.castShadow = true; mallet.add(handle);
    const head = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.16, 10, 20), new THREE.MeshStandardMaterial({ color: 0xc1a88e, roughness: 0.75 })); head.rotation.z = -0.52; head.position.set(1.72, 1.35, 0.12); head.castShadow = true; mallet.add(head); group.add(mallet);
    group.rotation.y = -0.22; return { group, waves, mallet };
  }

  private buildArtKit(): { group: THREE.Group; paint: THREE.Group; brush: THREE.Group } {
    const group = new THREE.Group(); const wood = new THREE.MeshPhysicalMaterial({ color: 0xb89065, roughness: 0.42, clearcoat: 0.3 }); const metal = this.metal(0xbfc1bd, 0.2, 0.76);
    const shape = new THREE.Shape(); shape.moveTo(-0.95, -0.72); shape.bezierCurveTo(-0.45, -0.92, 0, -0.74, 0.7, -0.62); shape.bezierCurveTo(0.92, -0.25, 0.82, 0.2, 0.55, 0.55); shape.bezierCurveTo(0.2, 0.82, -0.25, 0.78, -0.52, 0.56); shape.bezierCurveTo(-0.8, 0.34, -1, -0.1, -0.95, -0.72);
    const palette = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.045, bevelThickness: 0.035, curveSegments: 12 }), wood); palette.rotation.x = -0.1; palette.rotation.y = 0.16; palette.position.set(-0.15, -0.05, 0); palette.castShadow = true; palette.receiveShadow = true; group.add(palette);
    const thumbHole = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 16, 48), wood); thumbHole.rotation.x = Math.PI / 2; thumbHole.position.set(-0.48, -0.18, 0.09); group.add(thumbHole);
    const paint = new THREE.Group(); const colors = [0xc56f59, 0xd6a247, 0x637f62, 0x7b6f8e, 0xb7a9a0, 0x55708a]; const dots = [[-0.55, 0.4, 0.08], [-0.15, 0.52, 0.1], [0.28, 0.45, 0.085], [0.55, 0.18, 0.075], [0.42, -0.15, 0.095], [0.05, -0.34, 0.085]];
    dots.forEach(([x, y, r], index) => { const dot = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 18), new THREE.MeshPhysicalMaterial({ color: colors[index], roughness: 0.48, clearcoat: 0.25 })); dot.position.set(x, y, 0.13); dot.scale.y = 0.6; dot.castShadow = true; paint.add(dot); }); group.add(paint);
    const brush = new THREE.Group(); const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 1.35, 32), new THREE.MeshStandardMaterial({ color: 0x5d4636, roughness: 0.48 })); handle.rotation.z = 0.78; handle.position.set(0.85, 0.72, 0.22); handle.castShadow = true; brush.add(handle);
    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.24, 32), metal); ferrule.rotation.z = 0.78; ferrule.position.set(1.28, 1.15, 0.22); ferrule.castShadow = true; brush.add(ferrule);
    const bristles = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.38, 32), new THREE.MeshStandardMaterial({ color: 0x8f6c4f, roughness: 0.9 })); bristles.rotation.z = 0.78; bristles.position.set(1.47, 1.31, 0.22); bristles.castShadow = true; brush.add(bristles); group.add(brush);
    group.rotation.y = -0.2; group.rotation.x = -0.08; return { group, paint, brush };
  }

  private buildTargetRings(color: number): THREE.Group { const group = new THREE.Group(); for (let i = 0; i < 3; i++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26 + i * 0.13, 0.008, 8, 64), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.08 - i * 0.018, depthWrite: false })); ring.rotation.x = Math.PI / 2; group.add(ring); } return group; }

  private buildParticles(count: number, radius: number, color: number): THREE.Points {
    const geometry = new THREE.BufferGeometry(); const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { const a = (i / count) * Math.PI * 2; const r = radius * (0.35 + ((i * 17) % 100) / 100 * 0.65); positions[i * 3] = Math.cos(a) * r; positions[i * 3 + 1] = ((i * 31) % 100) / 100 * 1.7 - 0.8; positions[i * 3 + 2] = Math.sin(a) * r * 0.45; }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); return new THREE.Points(geometry, new THREE.PointsMaterial({ color, size: 0.018, transparent: true, opacity: 0.24, depthWrite: false, sizeAttenuation: true }));
  }

  private startLoop(): void {
    if (this.animationFrame) return;
    const frame = (time: number) => { this.animationFrame = requestAnimationFrame(frame); if (!this.visible || document.visibilityState !== 'visible') return; const dt = Math.min((time - this.previousTime) / 1000, 0.05); this.previousTime = time; this.progress += (this.targetProgress - this.progress) * Math.min(1, dt * 5.5); this.updateExperience(time); this.renderer?.render(this.scene!, this.camera!); };
    this.animationFrame = requestAnimationFrame(frame);
  }

  private updateExperience(time: number): void {
    if (!this.state || !this.camera) return;
    const p = this.progress; const t = (time - this.startTime) / 1000; const reveal = this.smoothstep(0.02, 0.16, p); const focus = this.smoothstep(0.12, 0.48, p); const interaction = this.smoothstep(0.4, 0.78, p); const settle = this.smoothstep(0.72, 0.98, p); const breathing = this.reducedMotion ? 0 : Math.sin(t * 0.75) * 0.018;
    this.state.instrument.position.y = 0.04 + breathing + (1 - reveal) * 0.18; this.state.instrument.rotation.y = -0.22 + (focus - interaction) * 0.16; this.state.instrument.rotation.x = breathing * 0.7; this.state.instrument.scale.setScalar(0.84 + reveal * 0.08 + focus * 0.035 - settle * 0.018);
    this.camera.position.x += ((0.18 + (interaction - 0.5) * 0.35) - this.camera.position.x) * 0.035; this.camera.position.y += ((0.42 + Math.sin(p * Math.PI) * 0.12) - this.camera.position.y) * 0.035; this.camera.position.z += ((6.35 - focus * 0.48 + settle * 0.2) - this.camera.position.z) * 0.035; this.camera.lookAt(0, 0.12 + focus * 0.06, 0);
    if (this.state.reference) { const material = this.state.reference.material as THREE.MeshBasicMaterial; material.opacity = 0.012 + reveal * 0.012; this.state.reference.position.x = 1.25 + Math.sin(p * Math.PI) * 0.08; this.state.reference.rotation.z = p * 0.06; }
    if (this.state.accent) { this.state.accent.scale.setScalar(0.8 + interaction * 0.18); this.state.accent.visible = interaction > 0.02; }
    if (this.state.secondary) { this.state.secondary.rotation.z += this.reducedMotion ? 0 : 0.0018; this.state.secondary.position.z = 0.03 + Math.sin(t * 0.7) * 0.015; }
    if (this.state.particles) { this.state.particles.rotation.y += this.reducedMotion ? 0 : 0.001; this.state.particles.position.y = Math.sin(t * 0.45) * 0.025; }
  }

  private setupResize(canvas: HTMLCanvasElement): void { this.resizeObserver = new ResizeObserver(() => this.handleResize(canvas)); this.resizeObserver.observe(canvas); }
  private handleResize(canvas: HTMLCanvasElement): void { if (!this.renderer || !this.camera) return; const width = Math.max(1, canvas.clientWidth); const height = Math.max(1, canvas.clientHeight); this.camera.aspect = width / height; this.camera.updateProjectionMatrix(); this.renderer.setSize(width, height, false); }
  private setupScroll(): void { this.scrollHandler = () => { this.targetProgress = this.readProgress(); }; window.addEventListener('scroll', this.scrollHandler, { passive: true }); }
  private readProgress(): number { const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); return THREE.MathUtils.clamp(window.scrollY / max, 0, 1); }
  private setupVisibility(): void { this.visibilityHandler = () => { this.visible = document.visibilityState === 'visible'; this.previousTime = performance.now(); }; document.addEventListener('visibilitychange', this.visibilityHandler); }
  private smoothstep(a: number, b: number, x: number): number { const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  private resolveColor(value: string): number { const match = value.trim().match(/^#([0-9a-f]{6})$/i); return match ? Number.parseInt(match[1], 16) : 0x3c607a; }
  private destroy(): void { if (this.animationFrame) cancelAnimationFrame(this.animationFrame); this.animationFrame = 0; if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler); if (this.visibilityHandler) document.removeEventListener('visibilitychange', this.visibilityHandler); this.resizeObserver?.disconnect(); this.resizeObserver = null; this.state?.dispose(); this.state = null; this.renderer?.dispose(); this.renderer = null; this.scene = null; this.camera = null; }
}
