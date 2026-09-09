import * as THREE from 'three';

/**
 * Context structure containing all Three.js scene elements,
 * references, animation state, and memory disposables.
 */
export interface CarlaSceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  avatarGroup: THREE.Group;
  treatmentGroup: THREE.Group;
  methodSlug: string;
  disposables: {
    geometries: THREE.BufferGeometry[];
    materials: THREE.Material[];
    textures: THREE.Texture[];
  };
  animationState: Record<string, unknown>;
}

/**
 * Normalizes theme colors from CSS variable names or hex strings into valid hex codes.
 */
function resolveColorHex(color: string, defaultHex = '#2d8a85'): string {
  if (!color) return defaultHex;
  const trimmed = color.trim();
  if (trimmed.startsWith('#')) return trimmed;

  const colorMap: Record<string, string> = {
    'var(--color-aqua)': '#2d8a85',
    'var(--color-aqua-dark)': '#226b67',
    'var(--color-aqua-light)': '#e6f4f2',
    'var(--color-powder)': '#548da7',
    'var(--color-powder-dark)': '#3f6d84',
    'var(--color-powder-light)': '#eef6fa',
    'var(--color-coral)': '#c95d4a',
    'var(--color-coral-dark)': '#a8492f',
    'var(--color-coral-light)': '#faece8',
    'var(--color-blush)': '#d9788a',
    'var(--color-blush-dark)': '#b95a6d',
    'var(--color-blush-light)': '#fbf0f2',
    'var(--color-lavender)': '#7c6ca6',
    'var(--color-lavender-dark)': '#61538a',
    'var(--color-lavender-light)': '#f3f0fa',
    'var(--color-cream)': '#faf7f2',
    'var(--color-cream-subtle)': '#f4efe6',
    'var(--color-ink)': '#162438',
    'var(--color-ink-muted)': '#4a5d73',
  };

  return colorMap[trimmed] ?? defaultHex;
}

/**
 * Helper to register a BufferGeometry for automatic disposal.
 */
function trackGeometry<T extends THREE.BufferGeometry>(
  ctx: CarlaSceneContext,
  geometry: T,
): T {
  ctx.disposables.geometries.push(geometry);
  return geometry;
}

/**
 * Helper to register a Material for automatic disposal.
 */
function trackMaterial<T extends THREE.Material>(
  ctx: CarlaSceneContext,
  material: T,
): T {
  ctx.disposables.materials.push(material);
  return material;
}

/**
 * Helper to register a Texture for automatic disposal.
 */
function trackTexture<T extends THREE.Texture>(
  ctx: CarlaSceneContext,
  texture: T,
): T {
  ctx.disposables.textures.push(texture);
  return texture;
}

/**
 * Procedurally generates a soft radial gradient shadow texture.
 */
function createContactShadowTexture(
  ctx: CarlaSceneContext,
  size = 256,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  if (context) {
    const center = size / 2;
    const gradient = context.createRadialGradient(
      center,
      center,
      size * 0.08,
      center,
      center,
      size * 0.48,
    );
    gradient.addColorStop(0, 'rgba(20, 24, 32, 0.45)');
    gradient.addColorStop(0.5, 'rgba(20, 24, 32, 0.20)');
    gradient.addColorStop(0.85, 'rgba(20, 24, 32, 0.05)');
    gradient.addColorStop(1, 'rgba(20, 24, 32, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return trackTexture(ctx, texture);
}

/**
 * Builds the circular satin zen pedestal with contact shadow.
 */
function buildZenPedestal(ctx: CarlaSceneContext): THREE.Group {
  const pedestalGroup = new THREE.Group();

  // Pedestal base disc
  const baseGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.95, 1.02, 0.08, 48),
  );
  const baseMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0xeae5dc,
      roughness: 0.65,
      metalness: 0.08,
    }),
  );
  const baseMesh = new THREE.Mesh(baseGeom, baseMat);
  baseMesh.position.y = -0.04;
  baseMesh.receiveShadow = true;
  pedestalGroup.add(baseMesh);

  // Pedestal upper ring bevel
  const ringGeom = trackGeometry(
    ctx,
    new THREE.TorusGeometry(0.95, 0.012, 16, 48),
  );
  const ringMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0xdfd9ce,
      roughness: 0.5,
      metalness: 0.15,
    }),
  );
  const ringMesh = new THREE.Mesh(ringGeom, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.y = 0.0;
  pedestalGroup.add(ringMesh);

  // Soft contact shadow directly under the avatar
  const shadowTexture = createContactShadowTexture(ctx);
  const shadowGeom = trackGeometry(ctx, new THREE.PlaneGeometry(1.2, 1.2));
  const shadowMat = trackMaterial(
    ctx,
    new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    }),
  );
  const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.002;
  pedestalGroup.add(shadowMesh);

  return pedestalGroup;
}

/**
 * Builds the procedural 3D model of Carla Di Lascio:
 * - Serene welcoming face with smile and bright chestnut eyes.
 * - Signature voluminous curly & wavy chestnut hair with warm copper highlights framing the face.
 * - Minimalist dark turtleneck with poised, elegant zen posture.
 * - Articulated arms positioned appropriately for each therapy.
 */
function buildCarlaAvatar(
  ctx: CarlaSceneContext,
  slug: string,
): {
  avatarGroup: THREE.Group;
  parts: {
    torsoGroup: THREE.Group;
    headGroup: THREE.Group;
    leftArmGroup: THREE.Group;
    rightArmGroup: THREE.Group;
    leftForearmGroup: THREE.Group;
    rightForearmGroup: THREE.Group;
    rightHandGroup: THREE.Group;
    leftHandGroup: THREE.Group;
  };
} {
  const avatarGroup = new THREE.Group();
  avatarGroup.position.set(0, 0, 0);

  // Common materials
  const skinMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0xf5d6c2,
      roughness: 0.55,
      metalness: 0.02,
    }),
  );

  const blushMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0xeb9c97,
      roughness: 0.7,
      transparent: true,
      opacity: 0.35,
    }),
  );

  const lipsMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0xca6868,
      roughness: 0.45,
      metalness: 0.05,
    }),
  );

  const eyeWhiteMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0xfdfdfd,
      roughness: 0.25,
    }),
  );

  const eyeIrisMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0x422618,
      roughness: 0.3,
    }),
  );

  const eyePupilMat = trackMaterial(
    ctx,
    new THREE.MeshBasicMaterial({
      color: 0x120d0b,
    }),
  );

  const eyeHighlightMat = trackMaterial(
    ctx,
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
    }),
  );

  const browMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0x3d2317,
      roughness: 0.7,
    }),
  );

  // Hair materials: warm chestnut base with warm copper/auburn reflections
  const hairBaseMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0x442416,
      roughness: 0.68,
      metalness: 0.06,
    }),
  );

  const hairCopperMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0x6e351d,
      roughness: 0.6,
      metalness: 0.08,
    }),
  );

  const hairHighlightMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0x884323,
      roughness: 0.55,
      metalness: 0.1,
    }),
  );

  // Clothing materials: minimalist dark turtleneck with soft satin sheen
  const turtleneckMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0x1f2227,
      roughness: 0.72,
      metalness: 0.12,
    }),
  );

  const culottesMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0x1b1d22,
      roughness: 0.8,
      metalness: 0.05,
    }),
  );

  // --- LOWER BODY & ZEN DRAPED SILHOUETTE ---
  const lowerBodyGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.24, 0.42, 0.65, 32),
  );
  const lowerBodyMesh = new THREE.Mesh(lowerBodyGeom, culottesMat);
  lowerBodyMesh.position.y = 0.32;
  avatarGroup.add(lowerBodyMesh);

  // --- TORSO GROUP ---
  const torsoGroup = new THREE.Group();
  torsoGroup.position.y = 0.65;
  avatarGroup.add(torsoGroup);

  // Fitted turtleneck torso
  const torsoGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.2, 0.22, 0.42, 28),
  );
  const torsoMesh = new THREE.Mesh(torsoGeom, turtleneckMat);
  torsoMesh.position.y = 0.21;
  torsoGroup.add(torsoMesh);

  // Shoulders yoke
  const shouldersGeom = trackGeometry(
    ctx,
    new THREE.SphereGeometry(0.24, 24, 16),
  );
  const shouldersMesh = new THREE.Mesh(shouldersGeom, turtleneckMat);
  shouldersMesh.scale.set(1.4, 0.65, 0.88);
  shouldersMesh.position.y = 0.38;
  torsoGroup.add(shouldersMesh);

  // Turtleneck high collar
  const collarGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.095, 0.105, 0.14, 24),
  );
  const collarMesh = new THREE.Mesh(collarGeom, turtleneckMat);
  collarMesh.position.y = 0.48;
  torsoGroup.add(collarMesh);

  // Slender neck
  const neckGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.075, 0.08, 0.12, 20),
  );
  const neckMesh = new THREE.Mesh(neckGeom, skinMat);
  neckMesh.position.y = 0.54;
  torsoGroup.add(neckMesh);

  // --- HEAD GROUP ---
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.66;
  torsoGroup.add(headGroup);

  // Cranium / Face base (gentle oval)
  const faceGeom = trackGeometry(ctx, new THREE.SphereGeometry(0.165, 32, 24));
  const faceMesh = new THREE.Mesh(faceGeom, skinMat);
  faceMesh.scale.set(0.96, 1.15, 0.98);
  faceMesh.position.set(0, 0.12, 0.02);
  headGroup.add(faceMesh);

  // Gentle cheeks blush
  const blushGeom = trackGeometry(ctx, new THREE.SphereGeometry(0.05, 16, 12));
  const leftBlush = new THREE.Mesh(blushGeom, blushMat);
  leftBlush.scale.set(1.4, 0.7, 0.4);
  leftBlush.position.set(-0.085, 0.09, 0.14);
  headGroup.add(leftBlush);

  const rightBlush = new THREE.Mesh(blushGeom, blushMat);
  rightBlush.scale.set(1.4, 0.7, 0.4);
  rightBlush.position.set(0.085, 0.09, 0.14);
  headGroup.add(rightBlush);

  // Delicate nose bridge and tip
  const noseGeom = trackGeometry(ctx, new THREE.ConeGeometry(0.022, 0.065, 16));
  const noseMesh = new THREE.Mesh(noseGeom, skinMat);
  noseMesh.rotation.x = -0.3;
  noseMesh.position.set(0, 0.1, 0.17);
  headGroup.add(noseMesh);

  // Warm welcoming smile (curved torus slice)
  const smileGeom = trackGeometry(
    ctx,
    new THREE.TorusGeometry(0.042, 0.009, 12, 24, Math.PI * 0.8),
  );
  const smileMesh = new THREE.Mesh(smileGeom, lipsMat);
  smileMesh.rotation.x = 0.25;
  smileMesh.rotation.z = Math.PI * 1.1;
  smileMesh.position.set(0, 0.045, 0.155);
  headGroup.add(smileMesh);

  // Eyes (welcoming, kind almond shape)
  const eyeGeom = trackGeometry(ctx, new THREE.SphereGeometry(0.028, 16, 12));
  const irisGeom = trackGeometry(ctx, new THREE.SphereGeometry(0.015, 14, 10));
  const pupilGeom = trackGeometry(ctx, new THREE.SphereGeometry(0.007, 12, 8));
  const sparkleGeom = trackGeometry(
    ctx,
    new THREE.SphereGeometry(0.004, 10, 6),
  );

  // Left Eye
  const leftEyeGroup = new THREE.Group();
  leftEyeGroup.position.set(-0.062, 0.13, 0.142);
  const leftWhite = new THREE.Mesh(eyeGeom, eyeWhiteMat);
  leftWhite.scale.set(1.1, 0.85, 0.6);
  leftEyeGroup.add(leftWhite);

  const leftIris = new THREE.Mesh(irisGeom, eyeIrisMat);
  leftIris.position.set(0.004, 0, 0.014);
  leftEyeGroup.add(leftIris);

  const leftPupil = new THREE.Mesh(pupilGeom, eyePupilMat);
  leftPupil.position.set(0.004, 0, 0.02);
  leftEyeGroup.add(leftPupil);

  const leftSparkle = new THREE.Mesh(sparkleGeom, eyeHighlightMat);
  leftSparkle.position.set(0.007, 0.005, 0.023);
  leftEyeGroup.add(leftSparkle);
  headGroup.add(leftEyeGroup);

  // Right Eye
  const rightEyeGroup = new THREE.Group();
  rightEyeGroup.position.set(0.062, 0.13, 0.142);
  const rightWhite = new THREE.Mesh(eyeGeom, eyeWhiteMat);
  rightWhite.scale.set(1.1, 0.85, 0.6);
  rightEyeGroup.add(rightWhite);

  const rightIris = new THREE.Mesh(irisGeom, eyeIrisMat);
  rightIris.position.set(-0.004, 0, 0.014);
  rightEyeGroup.add(rightIris);

  const rightPupil = new THREE.Mesh(pupilGeom, eyePupilMat);
  rightPupil.position.set(-0.004, 0, 0.02);
  rightEyeGroup.add(rightPupil);

  const rightSparkle = new THREE.Mesh(sparkleGeom, eyeHighlightMat);
  rightSparkle.position.set(-0.001, 0.005, 0.023);
  rightEyeGroup.add(rightSparkle);
  headGroup.add(rightEyeGroup);

  // Delicate refined eyebrows
  const browGeom = trackGeometry(
    ctx,
    new THREE.TorusGeometry(0.045, 0.0055, 8, 16, Math.PI * 0.65),
  );
  const leftBrow = new THREE.Mesh(browGeom, browMat);
  leftBrow.rotation.z = -0.22;
  leftBrow.position.set(-0.062, 0.165, 0.145);
  headGroup.add(leftBrow);

  const rightBrow = new THREE.Mesh(browGeom, browMat);
  rightBrow.rotation.y = Math.PI;
  rightBrow.rotation.z = -0.22;
  rightBrow.position.set(0.062, 0.165, 0.145);
  headGroup.add(rightBrow);

  // --- SIGNATURE VOLUMINOUS CURLY CHESTNUT & COPPER HAIR ---
  const hairGroup = new THREE.Group();
  headGroup.add(hairGroup);

  // Scalp / Crown hair base
  const scalpGeom = trackGeometry(ctx, new THREE.SphereGeometry(0.18, 24, 20));
  const scalpMesh = new THREE.Mesh(scalpGeom, hairBaseMat);
  scalpMesh.scale.set(1.06, 1.15, 1.18);
  scalpMesh.position.set(0, 0.15, -0.04);
  hairGroup.add(scalpMesh);

  // Procedural curls and wavy clusters framing the face and shoulders
  const curlGeom = trackGeometry(
    ctx,
    new THREE.TorusGeometry(0.045, 0.028, 12, 16),
  );
  const waveGeom = trackGeometry(
    ctx,
    new THREE.TorusGeometry(0.065, 0.032, 12, 18),
  );
  const lockGeom = trackGeometry(ctx, new THREE.SphereGeometry(0.06, 16, 12));

  interface CurlSpec {
    pos: [number, number, number];
    rot: [number, number, number];
    scale: [number, number, number];
    mat: THREE.Material;
    geom: THREE.BufferGeometry;
  }

  const curlsData: CurlSpec[] = [
    // Left crown and temple volume
    {
      pos: [-0.14, 0.22, 0.05],
      rot: [0.3, 0.4, 0.6],
      scale: [1.1, 1.1, 1.0],
      mat: hairBaseMat,
      geom: waveGeom,
    },
    {
      pos: [-0.17, 0.16, 0.08],
      rot: [0.1, 0.2, 0.8],
      scale: [1.2, 1.0, 1.1],
      mat: hairCopperMat,
      geom: waveGeom,
    },
    {
      pos: [-0.15, 0.08, 0.11],
      rot: [0.2, 0.1, 0.4],
      scale: [1.0, 1.2, 0.9],
      mat: hairHighlightMat,
      geom: curlGeom,
    },
    {
      pos: [-0.16, -0.02, 0.09],
      rot: [0.3, 0.5, 0.2],
      scale: [1.1, 1.3, 1.0],
      mat: hairCopperMat,
      geom: curlGeom,
    },
    {
      pos: [-0.14, -0.12, 0.05],
      rot: [0.1, 0.2, 0.5],
      scale: [1.2, 1.3, 1.1],
      mat: hairBaseMat,
      geom: waveGeom,
    },

    // Right crown and temple volume
    {
      pos: [0.14, 0.22, 0.05],
      rot: [0.3, -0.4, -0.6],
      scale: [1.1, 1.1, 1.0],
      mat: hairCopperMat,
      geom: waveGeom,
    },
    {
      pos: [0.17, 0.16, 0.08],
      rot: [0.1, -0.2, -0.8],
      scale: [1.2, 1.0, 1.1],
      mat: hairBaseMat,
      geom: waveGeom,
    },
    {
      pos: [0.15, 0.08, 0.11],
      rot: [0.2, -0.1, -0.4],
      scale: [1.0, 1.2, 0.9],
      mat: hairHighlightMat,
      geom: curlGeom,
    },
    {
      pos: [0.16, -0.02, 0.09],
      rot: [0.3, -0.5, -0.2],
      scale: [1.1, 1.3, 1.0],
      mat: hairCopperMat,
      geom: curlGeom,
    },
    {
      pos: [0.14, -0.12, 0.05],
      rot: [0.1, -0.2, -0.5],
      scale: [1.2, 1.3, 1.1],
      mat: hairBaseMat,
      geom: waveGeom,
    },

    // Top bangs & soft waves framing forehead
    {
      pos: [-0.07, 0.27, 0.12],
      rot: [0.4, 0.2, 0.3],
      scale: [1.1, 0.8, 0.9],
      mat: hairHighlightMat,
      geom: curlGeom,
    },
    {
      pos: [0.06, 0.28, 0.11],
      rot: [0.4, -0.2, -0.3],
      scale: [1.2, 0.8, 0.9],
      mat: hairCopperMat,
      geom: curlGeom,
    },
    {
      pos: [0.0, 0.29, 0.12],
      rot: [0.5, 0.0, 0.0],
      scale: [1.0, 0.85, 0.9],
      mat: hairBaseMat,
      geom: lockGeom,
    },

    // Back cascading curly volume
    {
      pos: [0, 0.14, -0.18],
      rot: [0.6, 0, 0],
      scale: [1.5, 1.4, 1.2],
      mat: hairBaseMat,
      geom: lockGeom,
    },
    {
      pos: [-0.09, 0.05, -0.16],
      rot: [0.5, 0.2, 0.4],
      scale: [1.4, 1.3, 1.1],
      mat: hairCopperMat,
      geom: lockGeom,
    },
    {
      pos: [0.09, 0.05, -0.16],
      rot: [0.5, -0.2, -0.4],
      scale: [1.4, 1.3, 1.1],
      mat: hairBaseMat,
      geom: lockGeom,
    },
    {
      pos: [0, -0.06, -0.15],
      rot: [0.7, 0, 0],
      scale: [1.6, 1.4, 1.3],
      mat: hairCopperMat,
      geom: lockGeom,
    },
    {
      pos: [-0.11, -0.14, -0.11],
      rot: [0.4, 0.3, 0.2],
      scale: [1.3, 1.4, 1.2],
      mat: hairBaseMat,
      geom: lockGeom,
    },
    {
      pos: [0.11, -0.14, -0.11],
      rot: [0.4, -0.3, -0.2],
      scale: [1.3, 1.4, 1.2],
      mat: hairHighlightMat,
      geom: lockGeom,
    },
  ];

  for (const c of curlsData) {
    const curlMesh = new THREE.Mesh(c.geom, c.mat);
    curlMesh.position.set(...c.pos);
    curlMesh.rotation.set(...c.rot);
    curlMesh.scale.set(...c.scale);
    hairGroup.add(curlMesh);
  }

  // --- ARTICULATED ARMS ---
  const upperArmGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.045, 0.04, 0.26, 16),
  );
  const forearmGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.038, 0.032, 0.24, 16),
  );
  const handGeom = trackGeometry(ctx, new THREE.SphereGeometry(0.042, 16, 12));
  const thumbGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.012, 0.01, 0.045, 12),
  );

  // Left Arm
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.25, 0.36, 0.0);
  torsoGroup.add(leftArmGroup);

  const leftUpperArm = new THREE.Mesh(upperArmGeom, turtleneckMat);
  leftUpperArm.position.y = -0.13;
  leftArmGroup.add(leftUpperArm);

  const leftForearmGroup = new THREE.Group();
  leftForearmGroup.position.y = -0.26;
  leftArmGroup.add(leftForearmGroup);

  const leftForearm = new THREE.Mesh(forearmGeom, skinMat);
  leftForearm.position.y = -0.12;
  leftForearmGroup.add(leftForearm);

  const leftHandGroup = new THREE.Group();
  leftHandGroup.position.y = -0.24;
  leftForearmGroup.add(leftHandGroup);

  const leftHand = new THREE.Mesh(handGeom, skinMat);
  leftHand.scale.set(0.7, 1.2, 0.5);
  leftHandGroup.add(leftHand);

  const leftThumb = new THREE.Mesh(thumbGeom, skinMat);
  leftThumb.position.set(0.03, -0.01, 0.015);
  leftThumb.rotation.z = -0.4;
  leftHandGroup.add(leftThumb);

  // Right Arm
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.25, 0.36, 0.0);
  torsoGroup.add(rightArmGroup);

  const rightUpperArm = new THREE.Mesh(upperArmGeom, turtleneckMat);
  rightUpperArm.position.y = -0.13;
  rightArmGroup.add(rightUpperArm);

  const rightForearmGroup = new THREE.Group();
  rightForearmGroup.position.y = -0.26;
  rightArmGroup.add(rightForearmGroup);

  const rightForearm = new THREE.Mesh(forearmGeom, skinMat);
  rightForearm.position.y = -0.12;
  rightForearmGroup.add(rightForearm);

  const rightHandGroup = new THREE.Group();
  rightHandGroup.position.y = -0.24;
  rightForearmGroup.add(rightHandGroup);

  const rightHand = new THREE.Mesh(handGeom, skinMat);
  rightHand.scale.set(0.7, 1.2, 0.5);
  rightHandGroup.add(rightHand);

  const rightThumb = new THREE.Mesh(thumbGeom, skinMat);
  rightThumb.position.set(-0.03, -0.01, 0.015);
  rightThumb.rotation.z = 0.4;
  rightHandGroup.add(rightThumb);

  // Set default relaxed posture or customize pose per treatment slug
  if (slug === 'kinesiologia-emozionale') {
    // Biofeedback test pose: Left arm raised horizontally forward at 90 degrees
    leftArmGroup.rotation.x = -Math.PI / 2.05;
    leftArmGroup.rotation.z = -0.05;
    leftForearmGroup.rotation.x = -0.15;
    leftHandGroup.rotation.x = 0.1;

    // Right arm poised in supportive diagnostic listening gesture
    rightArmGroup.rotation.x = -0.45;
    rightArmGroup.rotation.z = -0.25;
    rightForearmGroup.rotation.x = -0.7;
    rightForearmGroup.rotation.y = -0.3;
  } else if (slug === 'arte-terapia') {
    // Left arm relaxed gracefully
    leftArmGroup.rotation.x = 0.15;
    leftArmGroup.rotation.z = 0.22;
    leftForearmGroup.rotation.x = -0.4;

    // Right arm raised holding artist brush
    rightArmGroup.rotation.x = -0.75;
    rightArmGroup.rotation.z = -0.35;
    rightForearmGroup.rotation.x = -0.55;
    rightHandGroup.rotation.x = -0.2;
  } else if (slug === 'suonoterapia-vibrazionale') {
    // Both arms lowered towards lap/singing bowl
    leftArmGroup.rotation.x = -0.4;
    leftArmGroup.rotation.z = 0.35;
    leftForearmGroup.rotation.x = -0.75;

    rightArmGroup.rotation.x = -0.5;
    rightArmGroup.rotation.z = -0.25;
    rightForearmGroup.rotation.x = -0.8;
  } else {
    // Cromopuntura: Right arm holding light pen poised towards energy pathways
    leftArmGroup.rotation.x = 0.15;
    leftArmGroup.rotation.z = 0.3;
    leftForearmGroup.rotation.x = -0.35;

    rightArmGroup.rotation.x = -0.65;
    rightArmGroup.rotation.z = -0.35;
    rightForearmGroup.rotation.x = -0.6;
    rightHandGroup.rotation.x = -0.3;
  }

  return {
    avatarGroup,
    parts: {
      torsoGroup,
      headGroup,
      leftArmGroup,
      rightArmGroup,
      leftForearmGroup,
      rightForearmGroup,
      rightHandGroup,
      leftHandGroup,
    },
  };
}

// -------------------------------------------------------------
// TREATMENT 1: CROMOPUNTURA
// Optical light pen with chromatic beam, meridian points, bio-photons
// -------------------------------------------------------------
function buildCromopunturaScene(
  ctx: CarlaSceneContext,
  parts: ReturnType<typeof buildCarlaAvatar>['parts'],
): void {
  const treatmentGroup = ctx.treatmentGroup;

  // 1. Sleek optical pen (Penna Ottica) attached to right hand
  const penGroup = new THREE.Group();
  penGroup.position.set(0, -0.06, 0.04);
  penGroup.rotation.x = Math.PI / 2.3;
  penGroup.rotation.y = -0.15;
  parts.rightHandGroup.add(penGroup);

  // Pen body (satin chrome)
  const penGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.014, 0.016, 0.28, 20),
  );
  const penMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0xd8dde6,
      metalness: 0.88,
      roughness: 0.22,
    }),
  );
  const penMesh = new THREE.Mesh(penGeom, penMat);
  penGroup.add(penMesh);

  // Optical quartz tip
  const tipGeom = trackGeometry(ctx, new THREE.ConeGeometry(0.013, 0.045, 16));
  const tipMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      roughness: 0.1,
      metalness: 0.3,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.85,
    }),
  );
  const tipMesh = new THREE.Mesh(tipGeom, tipMat);
  tipMesh.rotation.x = Math.PI;
  tipMesh.position.y = -0.16;
  penGroup.add(tipMesh);

  // Conical light beam expanding from tip
  const beamGeom = trackGeometry(
    ctx,
    new THREE.ConeGeometry(0.24, 0.85, 32, 1, true),
  );
  // Shift pivot so apex is at origin
  beamGeom.translate(0, -0.425, 0);

  const beamMat = trackMaterial(
    ctx,
    new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  const beamMesh = new THREE.Mesh(beamGeom, beamMat);
  beamMesh.position.y = -0.18;
  penGroup.add(beamMesh);

  // 2. Meridian energy loci (brow, throat, thymus/heart, solar plexus, receptive left palm)
  const meridianPositions: [number, number, number][] = [
    [0.0, 0.88, 0.19], // Third Eye / Ajna
    [0.0, 0.72, 0.17], // Throat / Vishuddha
    [0.0, 0.54, 0.21], // Thymus & Heart / Anahata
    [0.0, 0.38, 0.22], // Solar Plexus / Manipura
    [-0.26, 0.28, 0.26], // Receptive palm acupuncture point
  ];

  const nodeGeom = trackGeometry(ctx, new THREE.SphereGeometry(0.024, 16, 12));
  const meridianMeshes: THREE.Mesh[] = [];

  for (const pos of meridianPositions) {
    const nodeMat = trackMaterial(
      ctx,
      new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      }),
    );
    const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
    nodeMesh.position.set(pos[0], pos[1] + 0.65, pos[2]); // Adjusted to world height
    treatmentGroup.add(nodeMesh);
    meridianMeshes.push(nodeMesh);
  }

  // 3. Floating bio-photons swarm
  const photonCount = 90;
  const photonPositions = new Float32Array(photonCount * 3);
  const photonVelocities: number[] = [];

  for (let i = 0; i < photonCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.08 + Math.random() * 0.45;
    const y = 0.6 + Math.random() * 0.9;
    photonPositions[i * 3] = Math.cos(angle) * radius;
    photonPositions[i * 3 + 1] = y;
    photonPositions[i * 3 + 2] = 0.12 + Math.sin(angle) * radius;

    photonVelocities.push(0.4 + Math.random() * 1.2);
  }

  const photonGeom = trackGeometry(ctx, new THREE.BufferGeometry());
  photonGeom.setAttribute(
    'position',
    new THREE.BufferAttribute(photonPositions, 3),
  );

  const photonMat = trackMaterial(
    ctx,
    new THREE.PointsMaterial({
      color: 0x55ffff,
      size: 0.038,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );

  const bioPhotons = new THREE.Points(photonGeom, photonMat);
  treatmentGroup.add(bioPhotons);

  // Store state for animation
  ctx.animationState['cromopuntura'] = {
    penGroup,
    beamMesh,
    beamMat,
    tipMat,
    meridianMeshes,
    bioPhotons,
    photonPositions,
    photonVelocities,
    colorCycleTime: 0,
  };
}

// -------------------------------------------------------------
// TREATMENT 2: KINESIOLOGIA EMOZIONALE
// Biofeedback arm test, delicate touch, and expanding coral stress-release waves
// -------------------------------------------------------------
function buildKinesiologiaScene(
  ctx: CarlaSceneContext,
  parts: ReturnType<typeof buildCarlaAvatar>['parts'],
): void {
  const treatmentGroup = ctx.treatmentGroup;

  // 1. Diagnostic test guide touch probe hovering on forearm
  const testerGroup = new THREE.Group();
  testerGroup.position.set(-0.25, 1.05, 0.28);
  treatmentGroup.add(testerGroup);

  const probeGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.016, 0.012, 0.16, 16),
  );
  const probeMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0xfaece8,
      roughness: 0.4,
      metalness: 0.1,
    }),
  );
  const probeMesh = new THREE.Mesh(probeGeom, probeMat);
  probeMesh.rotation.x = 0.4;
  testerGroup.add(probeMesh);

  // Gentle touch sensor tip
  const touchTipGeom = trackGeometry(
    ctx,
    new THREE.SphereGeometry(0.018, 16, 12),
  );
  const touchTipMat = trackMaterial(
    ctx,
    new THREE.MeshBasicMaterial({
      color: 0xc95d4a,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    }),
  );
  const touchTip = new THREE.Mesh(touchTipGeom, touchTipMat);
  touchTip.position.set(0, -0.08, 0.03);
  testerGroup.add(touchTip);

  // 2. Concentric emotional release rings (expanding coral wave)
  const ringCount = 4;
  const coralRings: THREE.Mesh[] = [];
  const ringGeom = trackGeometry(
    ctx,
    new THREE.TorusGeometry(0.18, 0.01, 16, 48),
  );

  for (let i = 0; i < ringCount; i++) {
    const ringMat = trackMaterial(
      ctx,
      new THREE.MeshBasicMaterial({
        color: 0xc95d4a,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(-0.25, 1.05, 0.3);
    treatmentGroup.add(ringMesh);
    coralRings.push(ringMesh);
  }

  // 3. Heart aura glow (release of emotional tension)
  const auraGeom = trackGeometry(ctx, new THREE.SphereGeometry(0.24, 24, 18));
  const auraMat = trackMaterial(
    ctx,
    new THREE.MeshBasicMaterial({
      color: 0xc95d4a,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const heartAura = new THREE.Mesh(auraGeom, auraMat);
  heartAura.position.set(0, 1.05, 0.12);
  treatmentGroup.add(heartAura);

  ctx.animationState['kinesiologia'] = {
    leftArmGroup: parts.leftArmGroup,
    leftForearmGroup: parts.leftForearmGroup,
    testerGroup,
    touchTipMat,
    coralRings,
    heartAura,
    cycleTimer: 0,
  };
}

// -------------------------------------------------------------
// TREATMENT 3: SUONOTERAPIA VIBRAZIONALE
// Tibetan singing bowl, wooden/suede striker mallet, concentric 3D sound waves
// -------------------------------------------------------------
function buildSuonoterapiaScene(ctx: CarlaSceneContext): void {
  const treatmentGroup = ctx.treatmentGroup;

  // 1. Tibetan singing bowl group
  const bowlGroup = new THREE.Group();
  bowlGroup.position.set(0, 0.72, 0.38);
  treatmentGroup.add(bowlGroup);

  // Meditation silk cushion
  const cushionGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.3, 0.32, 0.06, 32),
  );
  const cushionMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0x7c6ca6,
      roughness: 0.75,
      metalness: 0.15,
    }),
  );
  const cushionMesh = new THREE.Mesh(cushionGeom, cushionMat);
  cushionMesh.position.y = -0.03;
  bowlGroup.add(cushionMesh);

  // Singing bowl body (hammered golden bronze)
  const bowlBodyGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.26, 0.18, 0.19, 36, 1, true),
  );
  const bowlMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.28,
    }),
  );
  const bowlBody = new THREE.Mesh(bowlBodyGeom, bowlMat);
  bowlBody.position.y = 0.09;
  bowlGroup.add(bowlBody);

  // Bowl bottom base
  const bowlBottomGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.18, 0.18, 0.015, 36),
  );
  const bowlBottom = new THREE.Mesh(bowlBottomGeom, bowlMat);
  bowlBottom.position.y = 0.005;
  bowlGroup.add(bowlBottom);

  // Bowl rounded resonant rim
  const rimGeom = trackGeometry(
    ctx,
    new THREE.TorusGeometry(0.26, 0.015, 16, 48),
  );
  const rimMesh = new THREE.Mesh(rimGeom, bowlMat);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.y = 0.185;
  bowlGroup.add(rimMesh);

  // 2. Wooden mallet (battente) with suede tip
  const malletGroup = new THREE.Group();
  bowlGroup.add(malletGroup);

  const handleGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.016, 0.018, 0.26, 16),
  );
  const handleMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0x6e4120,
      roughness: 0.6,
      metalness: 0.05,
    }),
  );
  const handleMesh = new THREE.Mesh(handleGeom, handleMat);
  handleMesh.position.y = 0.13;
  malletGroup.add(handleMesh);

  const strikerGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.024, 0.024, 0.1, 16),
  );
  const strikerMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0xc8aa82,
      roughness: 0.85,
      metalness: 0.02,
    }),
  );
  const strikerMesh = new THREE.Mesh(strikerGeom, strikerMat);
  strikerMesh.position.y = 0.05;
  malletGroup.add(strikerMesh);

  // Initial mallet placement near the rim
  malletGroup.position.set(0.27, 0.16, 0.0);
  malletGroup.rotation.z = -0.3;

  // 3. 3D Concentric Sound Wave Toroids (expanding gold & lavender harmonics)
  const soundWaveCount = 6;
  const soundWaves: {
    mesh: THREE.Mesh;
    phase: number;
    colorType: 'gold' | 'lavender';
  }[] = [];
  const waveGeom = trackGeometry(
    ctx,
    new THREE.TorusGeometry(0.28, 0.012, 16, 64),
  );

  for (let i = 0; i < soundWaveCount; i++) {
    const isGold = i % 2 === 0;
    const waveMat = trackMaterial(
      ctx,
      new THREE.MeshBasicMaterial({
        color: isGold ? 0xffdf73 : 0xab96e6,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    const waveMesh = new THREE.Mesh(waveGeom, waveMat);
    waveMesh.rotation.x = Math.PI / 2;
    waveMesh.position.set(0, 0.9, 0.38);
    treatmentGroup.add(waveMesh);

    soundWaves.push({
      mesh: waveMesh,
      phase: i / soundWaveCount,
      colorType: isGold ? 'gold' : 'lavender',
    });
  }

  ctx.animationState['suonoterapia'] = {
    bowlGroup,
    malletGroup,
    soundWaves,
  };
}

// -------------------------------------------------------------
// TREATMENT 4: ARTE TERAPIA
// Artist's brush, 3D flowing color ribbon, and floating pigment sparks
// -------------------------------------------------------------
function buildArteTerapiaScene(
  ctx: CarlaSceneContext,
  parts: ReturnType<typeof buildCarlaAvatar>['parts'],
): void {
  const treatmentGroup = ctx.treatmentGroup;

  // 1. Fine-art brush held in right hand
  const brushGroup = new THREE.Group();
  brushGroup.position.set(0, -0.05, 0.04);
  brushGroup.rotation.x = Math.PI / 2.2;
  brushGroup.rotation.y = -0.25;
  parts.rightHandGroup.add(brushGroup);

  // Brush handle (turned dark birchwood)
  const brushHandleGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.01, 0.014, 0.32, 16),
  );
  const brushHandleMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0x3d271d,
      roughness: 0.5,
      metalness: 0.1,
    }),
  );
  const brushHandle = new THREE.Mesh(brushHandleGeom, brushHandleMat);
  brushGroup.add(brushHandle);

  // Polished ferrule
  const ferruleGeom = trackGeometry(
    ctx,
    new THREE.CylinderGeometry(0.011, 0.011, 0.05, 16),
  );
  const ferruleMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0xdde2ea,
      metalness: 0.9,
      roughness: 0.18,
    }),
  );
  const ferrule = new THREE.Mesh(ferruleGeom, ferruleMat);
  ferrule.position.y = -0.16;
  brushGroup.add(ferrule);

  // Bristles dipped in vibrant coral/aqua pigment
  const bristlesGeom = trackGeometry(
    ctx,
    new THREE.ConeGeometry(0.01, 0.05, 16),
  );
  const bristlesMat = trackMaterial(
    ctx,
    new THREE.MeshStandardMaterial({
      color: 0xc95d4a,
      roughness: 0.65,
      emissive: 0xc95d4a,
      emissiveIntensity: 0.45,
    }),
  );
  const bristles = new THREE.Mesh(bristlesGeom, bristlesMat);
  bristles.rotation.x = Math.PI;
  bristles.position.y = -0.21;
  brushGroup.add(bristles);

  // 2. 3D Flowing color ribbons
  const ribbonColors = [0x2d8a85, 0xc95d4a, 0x548da7, 0x7c6ca6];
  const ribbonCount = ribbonColors.length;
  const ribbons: { mesh: THREE.Mesh; offset: number }[] = [];

  for (let i = 0; i < ribbonCount; i++) {
    // Generate curved ribbon strip using smooth tube
    const points: THREE.Vector3[] = [];
    const segments = 24;
    for (let s = 0; s <= segments; s++) {
      const u = s / segments;
      const angle = u * Math.PI * 2.2 + i * 0.8;
      const radius = 0.35 + Math.sin(u * Math.PI) * 0.25;
      const x = Math.cos(angle) * radius + (i % 2 === 0 ? 0.08 : -0.08);
      const y = 0.8 + u * 0.45 + Math.sin(u * 5 + i) * 0.1;
      const z = 0.25 + Math.sin(angle) * radius * 0.7;
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const ribbonGeom = trackGeometry(
      ctx,
      new THREE.TubeGeometry(curve, 36, 0.018, 12, false),
    );
    const ribbonMat = trackMaterial(
      ctx,
      new THREE.MeshStandardMaterial({
        color: ribbonColors[i],
        roughness: 0.4,
        metalness: 0.15,
        transparent: true,
        opacity: 0.82,
        emissive: ribbonColors[i],
        emissiveIntensity: 0.25,
      }),
    );
    const ribbonMesh = new THREE.Mesh(ribbonGeom, ribbonMat);
    treatmentGroup.add(ribbonMesh);

    ribbons.push({ mesh: ribbonMesh, offset: i * 1.5 });
  }

  // 3. Floating creative pigment spark particles
  const sparkCount = 90;
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkColors = new Float32Array(sparkCount * 3);

  const palette = [
    new THREE.Color(0x2d8a85),
    new THREE.Color(0xc95d4a),
    new THREE.Color(0x548da7),
    new THREE.Color(0x7c6ca6),
    new THREE.Color(0xf5b041),
  ];

  for (let i = 0; i < sparkCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 0.2 + Math.random() * 0.55;
    sparkPositions[i * 3] = Math.cos(angle) * r;
    sparkPositions[i * 3 + 1] = 0.75 + Math.random() * 0.75;
    sparkPositions[i * 3 + 2] = 0.15 + Math.sin(angle) * r;

    const col = palette[Math.floor(Math.random() * palette.length)];
    sparkColors[i * 3] = col.r;
    sparkColors[i * 3 + 1] = col.g;
    sparkColors[i * 3 + 2] = col.b;
  }

  const sparkGeom = trackGeometry(ctx, new THREE.BufferGeometry());
  sparkGeom.setAttribute(
    'position',
    new THREE.BufferAttribute(sparkPositions, 3),
  );
  sparkGeom.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));

  const sparkMat = trackMaterial(
    ctx,
    new THREE.PointsMaterial({
      size: 0.032,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );

  const paintSparks = new THREE.Points(sparkGeom, sparkMat);
  treatmentGroup.add(paintSparks);

  ctx.animationState['arte-terapia'] = {
    brushGroup,
    ribbons,
    paintSparks,
    sparkPositions,
    rightArmGroup: parts.rightArmGroup,
    rightForearmGroup: parts.rightForearmGroup,
  };
}

/**
 * Frames the camera around the procedural avatar using its actual world-space
 * bounds. The treatment effects are intentionally given a little extra margin
 * by using a conservative distance multiplier.
 */
function frameAvatarCamera(ctx: CarlaSceneContext): void {
  const bounds = new THREE.Box3().setFromObject(ctx.avatarGroup);

  if (bounds.isEmpty()) {
    ctx.camera.position.set(0, 1.02, 3.5);
    ctx.camera.lookAt(0, 0.78, 0);
    return;
  }

  const center = new THREE.Vector3();
  const size = new THREE.Vector3();

  bounds.getCenter(center);
  bounds.getSize(size);

  const maxDimension = Math.max(size.x, size.y, size.z, 0.1);

  const verticalFov = THREE.MathUtils.degToRad(ctx.camera.fov);
  const horizontalFov =
    2 * Math.atan(Math.tan(verticalFov / 2) * Math.max(ctx.camera.aspect, 0.1));

  const distanceForHeight = (maxDimension * 0.5) / Math.tan(verticalFov / 2);

  const distanceForWidth = (maxDimension * 0.5) / Math.tan(horizontalFov / 2);

  const distance = Math.max(distanceForHeight, distanceForWidth) * 1.45;

  const target = new THREE.Vector3(center.x, center.y + 0.02, center.z);

  ctx.camera.position.set(
    target.x,
    target.y + Math.min(maxDimension * 0.12, 0.18),
    target.z + distance,
  );

  ctx.camera.lookAt(target);

  ctx.animationState['cameraFrame'] = {
    target: target.clone(),
    distance,
    boundsCenter: center.clone(),
    boundsSize: size.clone(),
  };
}

/**
 * Creates and initializes the complete Three.js scene for Carla's 3D avatar.
 */
export function createCarlaAvatarScene(
  canvas: HTMLCanvasElement,
  slug: string,
  themeColorHex: string,
): CarlaSceneContext {
  const scene = new THREE.Scene();

  // 1. Perspective Camera
  const width = canvas.clientWidth || 400;
  const height = canvas.clientHeight || 450;
  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
  camera.position.set(0, 1.02, 3.5);
  camera.lookAt(0, 0.78, 0);

  // 2. WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height, false);
  const pixelRatio =
    typeof window !== 'undefined'
      ? Math.min(window.devicePixelRatio || 1, 2)
      : 1;
  renderer.setPixelRatio(pixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // 3. Scene Groups
  const avatarGroup = new THREE.Group();
  const treatmentGroup = new THREE.Group();
  scene.add(avatarGroup);
  scene.add(treatmentGroup);

  // Initialize context
  const ctx: CarlaSceneContext = {
    scene,
    camera,
    renderer,
    avatarGroup,
    treatmentGroup,
    methodSlug: slug,
    disposables: {
      geometries: [],
      materials: [],
      textures: [],
    },
    animationState: {},
  };

  // 4. Lighting System
  const resolvedColor = resolveColorHex(themeColorHex);

  // Soft warm ambient fill
  const ambientLight = new THREE.AmbientLight(0xfff8f2, 0.85);
  scene.add(ambientLight);

  // Warm key light at 45 degrees
  const keyLight = new THREE.DirectionalLight(0xfffdf6, 1.25);
  keyLight.position.set(2.4, 3.2, 2.5);
  scene.add(keyLight);

  // Subtle cool fill light
  const fillLight = new THREE.DirectionalLight(0xdbe8f5, 0.45);
  fillLight.position.set(-2.2, 1.6, -1.0);
  scene.add(fillLight);

  // Colored treatment rim light (accent highlighting silhouette and hair)
  const rimLight = new THREE.DirectionalLight(
    new THREE.Color(resolvedColor),
    1.45,
  );
  rimLight.position.set(0, 2.2, -2.4);
  scene.add(rimLight);

  // 5. Build Pedestal with contact shadow
  const pedestal = buildZenPedestal(ctx);
  scene.add(pedestal);

  // 6. Build Procedural Avatar of Carla
  const { avatarGroup: carlaModel, parts } = buildCarlaAvatar(ctx, slug);
  avatarGroup.add(carlaModel);

  // Store base avatar parts in animation state
  ctx.animationState['avatarParts'] = parts;

  // Calculate a stable camera framing from the actual avatar bounds.
  // This prevents the procedural model from appearing too high/low or being
  // cropped when its dimensions/pose change between methodologies.
  frameAvatarCamera(ctx);

  // 7. Build Specific Treatment Props and VFX
  switch (slug) {
    case 'cromopuntura':
      buildCromopunturaScene(ctx, parts);
      break;
    case 'kinesiologia-emozionale':
      buildKinesiologiaScene(ctx, parts);
      break;
    case 'suonoterapia-vibrazionale':
      buildSuonoterapiaScene(ctx);
      break;
    case 'arte-terapia':
      buildArteTerapiaScene(ctx, parts);
      break;
    default:
      buildCromopunturaScene(ctx, parts);
      break;
  }

  // Initial render pass
  renderer.render(scene, camera);

  return ctx;
}

/**
 * Updates animations for Carla's avatar and treatment-specific effects.
 */
export function updateCarlaAvatarScene(
  ctx: CarlaSceneContext,
  elapsedTime: number,
  delta: number,
  isPlaying: boolean,
): void {
  if (!isPlaying) {
    // When paused, maintain scene rendering without advancing dynamic elements
    ctx.renderer.render(ctx.scene, ctx.camera);
    return;
  }

  // --- 1. COMMON ZEN BREATHING LOOP ---
  const parts = ctx.animationState['avatarParts'] as
    ReturnType<typeof buildCarlaAvatar>['parts'] | undefined;

  if (parts) {
    // Gentle thoracic breathing: chest expands and contracts smoothly
    const breath = Math.sin(elapsedTime * 1.5) * 0.015;
    parts.torsoGroup.position.y = 0.65 + breath * 0.5;
    parts.torsoGroup.scale.set(
      1 + breath * 0.35,
      1 + breath,
      1 + breath * 0.35,
    );

    // Subtle micro-tilt of head conveying peace and attention
    parts.headGroup.rotation.x = Math.sin(elapsedTime * 1.2) * 0.02;
    parts.headGroup.rotation.y = Math.cos(elapsedTime * 0.8) * 0.025;
  }

  // --- 2. TREATMENT-SPECIFIC ANIMATION ROUTINES ---
  switch (ctx.methodSlug) {
    case 'cromopuntura': {
      const state = ctx.animationState['cromopuntura'] as
        | {
            penGroup: THREE.Group;
            beamMesh: THREE.Mesh;
            beamMat: THREE.MeshBasicMaterial;
            tipMat: THREE.MeshStandardMaterial;
            meridianMeshes: THREE.Mesh[];
            bioPhotons: THREE.Points;
            photonPositions: Float32Array;
            photonVelocities: number[];
            colorCycleTime: number;
          }
        | undefined;

      if (state) {
        // Natural hand micro-tremor / organic hover
        state.penGroup.rotation.z = -0.15 + Math.sin(elapsedTime * 2.2) * 0.025;
        state.penGroup.rotation.x =
          Math.PI / 2.3 + Math.cos(elapsedTime * 1.6) * 0.03;

        // Chromatic frequency spectrum cycling: Cyan -> Jade -> Amber -> Violet -> Cyan
        const cycleSpeed = 0.35;
        const colorT = (elapsedTime * cycleSpeed) % 4;
        const cCyan = new THREE.Color(0x00f0ff);
        const cJade = new THREE.Color(0x00e676);
        const cAmber = new THREE.Color(0xffb300);
        const cViolet = new THREE.Color(0xba68c8);

        const currentColor = new THREE.Color();
        if (colorT < 1) {
          currentColor.lerpColors(cCyan, cJade, colorT);
        } else if (colorT < 2) {
          currentColor.lerpColors(cJade, cAmber, colorT - 1);
        } else if (colorT < 3) {
          currentColor.lerpColors(cAmber, cViolet, colorT - 2);
        } else {
          currentColor.lerpColors(cViolet, cCyan, colorT - 3);
        }

        state.beamMat.color.copy(currentColor);
        state.tipMat.emissive.copy(currentColor);
        state.beamMat.opacity = 0.5 + Math.sin(elapsedTime * 4.5) * 0.18;

        // Animate meridian nodes
        state.meridianMeshes.forEach((mesh, index) => {
          const mat = mesh.material as THREE.MeshBasicMaterial;
          mat.color.copy(currentColor);
          const pulse = Math.sin(elapsedTime * 3.5 + index * 1.2);
          const scale = 1.0 + pulse * 0.25;
          mesh.scale.set(scale, scale, scale);
          mat.opacity = 0.6 + pulse * 0.3;
        });

        // Animate streaming bio-photons
        const positions = state.photonPositions;
        const count = positions.length / 3;
        for (let i = 0; i < count; i++) {
          positions[i * 3 + 1] += state.photonVelocities[i] * delta * 0.45;
          if (positions[i * 3 + 1] > 1.55) {
            positions[i * 3 + 1] = 0.65;
          }
          positions[i * 3] += Math.sin(elapsedTime * 2 + i) * 0.002;
        }
        state.bioPhotons.geometry.attributes['position'].needsUpdate = true;
        (state.bioPhotons.material as THREE.PointsMaterial).color.copy(
          currentColor,
        );
      }
      break;
    }

    case 'kinesiologia-emozionale': {
      const state = ctx.animationState['kinesiologia'] as
        | {
            leftArmGroup: THREE.Group;
            leftForearmGroup: THREE.Group;
            testerGroup: THREE.Group;
            touchTipMat: THREE.MeshBasicMaterial;
            coralRings: THREE.Mesh[];
            heartAura: THREE.Mesh;
            cycleTimer: number;
          }
        | undefined;

      if (state) {
        // Cyclic biofeedback test every 3.8 seconds
        const cycleDuration = 3.8;
        const t = elapsedTime % cycleDuration;

        // Phase 1 (0 to 1.1s): Gentle downward testing pressure on forearm
        // Phase 2 (1.1 to 1.5s): Arm holds firm with biofeedback tone
        // Phase 3 (1.5 to 3.8s): Emotional tension release wave propagates
        let armDeflect = 0;
        let testerY = 1.05;

        if (t < 1.1) {
          const pressProgress = Math.sin((t / 1.1) * Math.PI);
          armDeflect = pressProgress * 0.09;
          testerY = 1.05 - pressProgress * 0.045;
        } else if (t < 1.5) {
          // Rebound and hold
          armDeflect = 0;
          testerY = 1.05 + 0.02;
        } else {
          // Rest
          armDeflect = 0;
          testerY = 1.05;
        }

        state.leftArmGroup.rotation.x = -Math.PI / 2.05 + armDeflect;
        state.testerGroup.position.y = testerY;

        // Animate expanding coral release rings during Phase 3
        const releaseStart = 1.2;
        const releaseTime = t >= releaseStart ? t - releaseStart : 0;
        const releaseDuration = cycleDuration - releaseStart;

        state.coralRings.forEach((ring, idx) => {
          const ringMat = ring.material as THREE.MeshBasicMaterial;
          if (t >= releaseStart) {
            const stagger = idx * 0.28;
            const progress = (releaseTime - stagger) / (releaseDuration * 0.7);

            if (progress > 0 && progress <= 1) {
              const scale = 0.3 + progress * 2.6;
              ring.scale.set(scale, scale, scale);
              ringMat.opacity = (1 - progress) * 0.85;
            } else {
              ringMat.opacity = 0;
            }
          } else {
            ringMat.opacity = 0;
          }
        });

        // Heart aura breath
        const auraMat = state.heartAura.material as THREE.MeshBasicMaterial;
        const auraPulse = Math.sin(elapsedTime * 2.0);
        auraMat.opacity = 0.12 + (auraPulse + 1) * 0.08;
        const auraScale = 1.0 + (auraPulse + 1) * 0.12;
        state.heartAura.scale.set(auraScale, auraScale, auraScale);
      }
      break;
    }

    case 'suonoterapia-vibrazionale': {
      const state = ctx.animationState['suonoterapia'] as
        | {
            bowlGroup: THREE.Group;
            malletGroup: THREE.Group;
            soundWaves: {
              mesh: THREE.Mesh;
              phase: number;
              colorType: 'gold' | 'lavender';
            }[];
          }
        | undefined;

      if (state) {
        // Continuous, smooth orbital friction of striker around singing bowl rim
        const speed = 1.65;
        const angle = elapsedTime * speed;
        const radius = 0.28;

        state.malletGroup.position.x = Math.cos(angle) * radius;
        state.malletGroup.position.z = Math.sin(angle) * radius;
        state.malletGroup.rotation.y = -angle + Math.PI / 2;
        state.malletGroup.rotation.z =
          -0.25 + Math.sin(elapsedTime * 6.0) * 0.03;

        // Bowl micro-vibration resonance
        state.bowlGroup.scale.set(
          1 + Math.sin(elapsedTime * 14.0) * 0.008,
          1 + Math.cos(elapsedTime * 14.0) * 0.008,
          1 + Math.sin(elapsedTime * 14.0) * 0.008,
        );

        // Concentric 3D sound waves expanding radially outward and fading
        const waveDuration = 3.2;
        for (const wave of state.soundWaves) {
          const currentPhase =
            (((elapsedTime / waveDuration + wave.phase) % 1.0) + 1.0) % 1.0;
          const scale = 1.0 + currentPhase * 3.8;
          wave.mesh.scale.set(scale, scale, scale);

          const waveMat = wave.mesh.material as THREE.MeshBasicMaterial;
          // Fade in rapidly, then fade out gradually
          const opacity =
            currentPhase < 0.2
              ? currentPhase * 5 * 0.75
              : (1 - currentPhase) * 0.75;
          waveMat.opacity = Math.max(0, opacity);

          // Subtle harmonic float
          wave.mesh.position.y = 0.9 + Math.sin(currentPhase * Math.PI) * 0.12;
        }
      }
      break;
    }

    case 'arte-terapia': {
      const state = ctx.animationState['arte-terapia'] as
        | {
            brushGroup: THREE.Group;
            ribbons: { mesh: THREE.Mesh; offset: number }[];
            paintSparks: THREE.Points;
            sparkPositions: Float32Array;
            rightArmGroup: THREE.Group;
            rightForearmGroup: THREE.Group;
          }
        | undefined;

      if (state) {
        // Expressive harmonic 3D painting gestures with the right arm
        const speed = 1.35;
        const armX = Math.sin(elapsedTime * speed) * 0.25 - 0.65;
        const armZ = Math.cos(elapsedTime * speed * 0.8) * 0.18 - 0.28;
        state.rightArmGroup.rotation.x = armX;
        state.rightArmGroup.rotation.z = armZ;
        state.rightForearmGroup.rotation.x =
          -0.55 + Math.sin(elapsedTime * speed * 1.2) * 0.18;

        // Undulating 3D color ribbons dancing in the air
        state.ribbons.forEach((ribbon, index) => {
          ribbon.mesh.rotation.y =
            Math.sin(elapsedTime * 0.8 + ribbon.offset) * 0.18;
          ribbon.mesh.rotation.z =
            Math.cos(elapsedTime * 0.6 + ribbon.offset) * 0.12;
          const wave = Math.sin(elapsedTime * 1.5 + index * 1.4) * 0.05;
          ribbon.mesh.position.y = wave;
        });

        // Floating swirling creative sparks
        const positions = state.sparkPositions;
        const count = positions.length / 3;
        for (let i = 0; i < count; i++) {
          positions[i * 3 + 1] += Math.sin(elapsedTime * 2 + i) * 0.0015;
          positions[i * 3] += Math.cos(elapsedTime * 1.2 + i * 0.5) * 0.0012;
          positions[i * 3 + 2] +=
            Math.sin(elapsedTime * 1.5 + i * 0.3) * 0.0012;
        }
        state.paintSparks.geometry.attributes['position'].needsUpdate = true;
      }
      break;
    }
  }

  // Render scene
  ctx.renderer.render(ctx.scene, ctx.camera);
}

/**
 * Total WebGL cleanup routine to guarantee zero memory leaks.
 * Recursively disposes all geometries, materials, textures, scene nodes, and renderer context.
 */
export function disposeCarlaAvatarScene(ctx: CarlaSceneContext): void {
  // 1. Recursive scene traversal to catch and dispose all geometries & materials
  ctx.scene.traverse((obj) => {
    if (
      obj instanceof THREE.Mesh ||
      obj instanceof THREE.Points ||
      obj instanceof THREE.Line
    ) {
      if (obj.geometry) {
        obj.geometry.dispose();
      }

      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat) => {
            if ('map' in mat && mat.map && mat.map instanceof THREE.Texture) {
              mat.map.dispose();
            }
            mat.dispose();
          });
        } else {
          if (
            'map' in obj.material &&
            obj.material.map &&
            obj.material.map instanceof THREE.Texture
          ) {
            obj.material.map.dispose();
          }
          obj.material.dispose();
        }
      }
    }
  });

  // 2. Explicitly dispose all tracked geometries
  for (const geom of ctx.disposables.geometries) {
    try {
      geom.dispose();
    } catch {
      // already disposed
    }
  }
  ctx.disposables.geometries.length = 0;

  // 3. Explicitly dispose all tracked materials
  for (const mat of ctx.disposables.materials) {
    try {
      mat.dispose();
    } catch {
      // already disposed
    }
  }
  ctx.disposables.materials.length = 0;

  // 4. Explicitly dispose all tracked textures
  for (const tex of ctx.disposables.textures) {
    try {
      tex.dispose();
    } catch {
      // already disposed
    }
  }
  ctx.disposables.textures.length = 0;

  // 5. Clear animation state references
  for (const key of Object.keys(ctx.animationState)) {
    delete ctx.animationState[key];
  }

  // 6. Clear all children from the scene
  ctx.scene.clear();

  // 7. Dispose WebGL renderer and force context loss
  try {
    ctx.renderer.dispose();
    ctx.renderer.forceContextLoss();
  } catch {
    // context may already be lost
  }
}
