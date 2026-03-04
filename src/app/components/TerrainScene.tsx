import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

export interface TerrainSceneRef {
  getCanvas: () => HTMLCanvasElement | null;
}

export interface TerrainSceneProps {
  /** Called once after the very first WebGL frame has been rendered. */
  onReady?: () => void;
  /** When false the animation loop is paused (RAF cancelled). Geometry and
   *  WebGL context remain intact so resume is a single requestAnimationFrame call. */
  isActive?: boolean;
}

// ─── Configuration ─────────────────────────────────────────────────────────
const HEIGHTMAP_RES = 512;
const TERRAIN_SIZE  = 240;
const PARTICLE_GRID = 310;   // 310x310 = 96 100 points
const RIPPLE_RES    = 256;
const TERRAIN_H     = 32;
const RIPPLE_STR    = 4.0;
const SCROLL_SPEED  = 0.044;   // terrain lengths per second

export const BG_COLOR   = 0x000814;
export const CAM_POS: [number, number, number] = [9, 67, 57];
export const CAM_TARGET = new THREE.Vector3(-1, -29, -7);

// ─── Ripple Shaders ─────────────────────────────────────────────────────────
const RIPPLE_VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const RIPPLE_FRAG = /* glsl */`
  uniform sampler2D tState;
  uniform vec2      uMousePos;
  uniform float     uMouseActive;
  varying vec2 vUv;

  void main() {
    float curr = texture2D(tState, vUv).r;
    float next = curr * 0.985;

    float dist = distance(vUv, uMousePos);
    next += uMouseActive * 0.07 * exp(-dist * dist * 444.0);

    next = clamp(next, 0.0, 1.0);
    gl_FragColor = vec4(next, curr, 0.0, 1.0);
  }
`;

// ─── Particle Shaders ────────────────────────────────────────────────────────
const PARTICLE_VERT = /* glsl */`
  uniform sampler2D uHeightmap;
  uniform sampler2D uRipple;
  uniform float     uTerrainH;
  uniform float     uRippleStr;
  uniform float     uTime;
  uniform float     uScrollOffset;

  attribute vec2  aUv;
  attribute float aRand;

  varying float vHeight;
  varying float vRipVel;
  varying float vSizeScale;
  varying float vRiver;

  void main() {
    vec2  scrollUv = vec2(fract(aUv.x + uScrollOffset), aUv.y);
    vec4  hmSample = texture2D(uHeightmap, scrollUv);
    float h0       = hmSample.r;
    float riverMask = hmSample.b;
    float rip      = texture2D(uRipple, aUv).r;
    float h        = clamp(h0 + rip * (uRippleStr / uTerrainH), 0.0, 1.0);

    vHeight = h0;
    vRiver  = riverMask;
    vRipVel = clamp(rip * 2.8, 0.0, 1.0);

    vec3 pos = position;
    float breathe = sin(uTime * 0.9 + aRand) * 0.12;
    pos.y = h * uTerrainH + breathe;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    float camDist = -mvPos.z;

    float sz = mix(1.8, 4.8, smoothstep(0.70, 1.0, h0))
              + mix(1.4, 2.4, smoothstep(0.0, 0.25, h0)) * (1.0 - smoothstep(0.25, 0.35, h0));
    float ripBoost  = vRipVel * 4.0;
    float totalSz   = sz + ripBoost;
    vSizeScale      = totalSz / max(sz, 0.001);
    gl_PointSize = totalSz * (200.0 / max(camDist, 1.0));
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const PARTICLE_FRAG = /* glsl */`
  varying float vHeight;
  varying float vRipVel;
  varying float vSizeScale;
  varying float vRiver;

  vec3 heightColor(float h) {
    vec3 deepOcean  = vec3(0.00, 0.08, 0.28);
    vec3 ocean      = vec3(0.00, 0.20, 0.48);
    vec3 shallowSea = vec3(0.05, 0.38, 0.62);
    vec3 shore      = vec3(0.36, 0.48, 0.22);
    vec3 lowGrass   = vec3(0.22, 0.72, 0.10);
    vec3 midGrass   = vec3(0.16, 0.58, 0.06);
    vec3 forest     = vec3(0.08, 0.36, 0.04);
    vec3 highland   = vec3(0.52, 0.44, 0.26);
    vec3 rock       = vec3(0.66, 0.62, 0.52);
    vec3 stone      = vec3(0.76, 0.74, 0.68);
    vec3 alpine     = vec3(0.84, 0.88, 0.90);
    vec3 snow       = vec3(0.94, 0.97, 1.00);

    if (h < 0.18) return mix(deepOcean,  ocean,      h / 0.18);
    if (h < 0.25) return mix(ocean,      shallowSea, (h - 0.18) / 0.07);
    if (h < 0.30) return mix(shallowSea, shore,      (h - 0.25) / 0.05);
    if (h < 0.38) return mix(shore,      lowGrass,   (h - 0.30) / 0.08);
    if (h < 0.50) return mix(lowGrass,   midGrass,   (h - 0.38) / 0.12);
    if (h < 0.62) return mix(midGrass,   forest,     (h - 0.50) / 0.12);
    if (h < 0.72) return mix(forest,     highland,   (h - 0.62) / 0.10);
    if (h < 0.80) return mix(highland,   rock,       (h - 0.72) / 0.08);
    if (h < 0.86) return mix(rock,       stone,      (h - 0.80) / 0.06);
    if (h < 0.92) return mix(stone,      alpine,     (h - 0.86) / 0.06);
    return mix(alpine, snow, (h - 0.92) / 0.08);
  }

  void main() {
    vec2  c    = gl_PointCoord - vec2(0.5);
    float d    = length(c);
    if (d > 0.5) discard;

    float fade = 1.0 - smoothstep(0.08 / vSizeScale, 0.28 / vSizeScale, d);

    vec3  col   = heightColor(vHeight);

    vec3  riverCol = vec3(0.05, 0.38, 0.62);
    float riverBlend = smoothstep(0.05, 0.35, vRiver);
    col = mix(col, riverCol, riverBlend);

    float halo    = exp(-d * d * 55.0) * vRipVel * 0.55;
    vec3  glowTint = vec3(0.45, 0.72, 1.0);
    vec3  finalCol = col + glowTint * vRipVel * 0.55;

    float baseAlpha = mix(0.55, 0.90, smoothstep(0.60, 1.0, vHeight));
    float alpha = fade * baseAlpha + halo;
    gl_FragColor = vec4(finalCol, alpha);
  }
`;

// ─── Component ───────────────────────────────────────────────────────────────
export const TerrainScene = forwardRef<TerrainSceneRef, TerrainSceneProps>(
  function TerrainScene({ onReady, isActive = true }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stable refs so the animation loop can always read the latest values
  // without being a dependency of the setup effect.
  const onReadyRef  = useRef(onReady);
  const isActiveRef = useRef(isActive);
  useEffect(() => { onReadyRef.current  = onReady;   }, [onReady]);
  useEffect(() => { isActiveRef.current = isActive;  }, [isActive]);

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: false,  // point-sprite scene — MSAA has no effect on particle edges
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(BG_COLOR);
    container.appendChild(renderer.domElement);
    canvasRef.current = renderer.domElement;

    // ── Scene / Camera ───────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG_COLOR, 0.004);

    const camera = new THREE.PerspectiveCamera(54, W / H, 0.1, 600);
    camera.position.set(...CAM_POS);
    camera.lookAt(CAM_TARGET);
    const camBasePos = camera.position.clone();

    // ── Heightmap generation ──────────────────────────────────────────────
    // Seeded PRNG (mulberry32) — random base seed per page load for unique terrain.
    function mulberry32(seed: number): () => number {
      let s = seed | 0;
      return () => {
        s = (s + 0x6D2B79F5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    // #4 — Random seed per page load, salted per generator
    const baseSeed = (Math.random() * 0xFFFFFFFF) >>> 0;
    const noiseA = createNoise3D(mulberry32(baseSeed + 12345));
    const noiseB = createNoise3D(mulberry32(baseSeed + 67890));
    const noiseC = createNoise3D(mulberry32(baseSeed + 24680));
    const noiseD = createNoise3D(mulberry32(baseSeed + 13579));

    const hmRes  = HEIGHTMAP_RES;
    const hmData = new Float32Array(hmRes * hmRes * 4);

    // Utilities
    const smst    = (t: number) => t * t * (3.0 - 2.0 * t);
    const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
    const lerp    = (a: number, b: number, t: number) => a + (b - a) * t;

    // #2 — Linear noise sampling (no tiling, no trig)
    function ns(
      noise: (x: number, y: number, z: number) => number,
      nx: number, ny: number, freq: number
    ): number {
      return noise(nx * freq, ny * freq, 0);
    }

    // ── Parameterised fBm ──────────────────────────────────────────────────
    function fbm(
      noise: (x: number, y: number, z: number) => number,
      nx: number, ny: number,
      freq: number, octaves: number, persistence: number, lacunarity: number
    ): number {
      let v = 0, amp = 1.0, f = freq, tot = 0.0;
      for (let o = 0; o < octaves; o++) {
        v += ns(noise, nx, ny, f) * amp;
        tot += amp; amp *= persistence; f *= lacunarity;
      }
      return v / tot;
    }

    // ── Ridged multifractal (Musgrave) ─────────────────────────────────────
    function ridgedFbm(
      noise: (x: number, y: number, z: number) => number,
      nx: number, ny: number,
      freq: number, octaves: number, persistence: number, lacunarity: number
    ): number {
      let v = 0, amp = 1.0, f = freq, tot = 0.0, prev = 1.0;
      for (let o = 0; o < octaves; o++) {
        let n = 1.0 - Math.abs(ns(noise, nx, ny, f));
        n = n * n * prev;
        prev = n;
        v += n * amp;
        tot += amp; amp *= persistence; f *= lacunarity;
      }
      return (v / tot) * 2.0 - 1.0;
    }

    // ── River-specific ridged noise ───────────────────────────────────────
    function riverRidged(
      noise: (x: number, y: number, z: number) => number,
      nx: number, ny: number,
      freq: number, octaves: number, persistence: number, lacunarity: number
    ): number {
      let v = 0, amp = 1.0, f = freq, tot = 0.0, prev = 1.0;
      for (let o = 0; o < octaves; o++) {
        let n = 1.0 - Math.abs(ns(noise, nx, ny, f));
        n = n * n * prev;
        prev = clamp01(n);
        v += n * amp;
        tot += amp;
        amp *= persistence;
        f *= lacunarity;
      }
      return clamp01(v / tot);
    }

    // #1 — Streaming ring-buffer: per-column generator
    function generateColumn(worldCol: number) {
      const nx     = worldCol / hmRes;
      const texCol = ((worldCol % hmRes) + hmRes) % hmRes;

      for (let y = 0; y < hmRes; y++) {
        const ny = y / hmRes;

        // ── Layer 1: Continental — broad terrain shape ─────────────────────
        const cwx = fbm(noiseA, nx, ny + 2.1, 1.0, 3, 0.50, 2.0);
        const cwy = fbm(noiseC, nx, ny + 6.5, 1.0, 3, 0.50, 2.0);
        const cnx = nx + 0.45 * cwx;
        const cny = ny + 0.45 * cwy;

        const contRaw = fbm(noiseA, cnx, cny, 0.8, 5, 0.48, 2.0);

        const ct          = contRaw * 0.5 + 0.5;
        const continental = smst(smst(ct));
        // #3b — removed Math.pow(continental, 0.96)
        const contH       = continental * 0.83;

        // ── Layer 2: Mountain masses ───────────────────────────────────────
        const zoneRaw = fbm(noiseB, nx, ny + 1.3, 0.55, 3, 0.50, 2.0) * 0.5 + 0.5;
        const zone    = smst(clamp01((zoneRaw - 0.48) / 0.35));

        const mtnRaw    = fbm(noiseB, cnx, cny, 0.9, 3, 0.45, 2.0) * 0.5 + 0.5;
        const mtnShaped = smst(smst(mtnRaw));
        const mtnFat    = Math.pow(mtnShaped, 0.7);
        const mtnH      = mtnFat * 0.28 * zone;

        // #3a — Plains layer removed (< 4% amplitude, visually redundant)

        // ── Layer 4: Multi-scale surface detail ──────────────────────────

        // #3c — Ridge detail with height-varying amplitude (absorbs crags)
        const highMask    = smst(clamp01((contH + mtnH - 0.58) / 0.15));
        const ridgeAmp    = 0.08 + highMask * 0.055;
        const ridgeDetail = ridgedFbm(noiseB, cnx, cny, 4.0, 4, 0.42, 2.1);
        const ridgeVal    = (ridgeDetail * 0.5 + 0.5) * ridgeAmp * zone;

        // #3d — Erosion + coastal roughness merged into single band detail
        const bandMask = smst(clamp01((contH - 0.22) / 0.06))
                       * (1.0 - smst(clamp01((contH - 0.70) / 0.12)));
        const bandAmp  = lerp(0.045, 0.06, smst(clamp01((contH - 0.30) / 0.15)));
        const bandVal  = bandMask > 0.001
                       ? fbm(noiseC, cnx, cny + 20.3, 5.5, 4, 0.44, 2.05) * bandAmp * bandMask
                       : 0;

        // #3e — Three micro-detail layers merged into one
        const microNoise = fbm(noiseA, nx, ny + 16.2, 12.0, 3, 0.42, 2.1);
        const landMask   = smst(clamp01((contH - 0.20) / 0.10));
        const microVal   = microNoise * lerp(0.015, 0.055, clamp01(contH)) * landMask;

        const detailAdd = ridgeVal + bandVal + microVal;

        // ── Composite ─────────────────────────────────────────────────────
        let h = contH + mtnH + detailAdd;

        // ── Layer 5: River channels ───────────────────────────────────────
        const rwx = fbm(noiseD, nx, ny + 42.7, 0.7, 2, 0.50, 2.0);
        const rwy = fbm(noiseD, nx, ny + 47.1, 0.7, 2, 0.50, 2.0);
        const rnx = nx + 0.38 * rwx;
        const rny = ny + 0.38 * rwy;

        // #3f — Single 6-octave river, width reuses continental warp
        const river = riverRidged(noiseD, rnx, rny + 55.0, 0.6, 6, 0.48, 2.1);

        const widthMod   = cwx * 0.5 + 0.5;
        const sharpRiver = Math.pow(river, lerp(3.0, 6.0, widthMod));

        const riverLandMask = smst(clamp01((h - 0.28) / 0.18))
                            * (1.0 - smst(clamp01((h - 0.72) / 0.14)));

        h -= sharpRiver * 0.13 * riverLandMask;
        h = clamp01(h);

        const idx = (y * hmRes + texCol) * 4;
        hmData[idx]     = h;
        hmData[idx + 1] = 0;  // #11 — G channel unused, zeroed
        hmData[idx + 2] = clamp01(sharpRiver * riverLandMask);
        hmData[idx + 3] = 1;
      }
    }

    // Initial fill
    for (let c = 0; c < hmRes; c++) generateColumn(c);
    let lastGeneratedCol = hmRes - 1;

    const heightmapTex = new THREE.DataTexture(
      hmData, hmRes, hmRes,
      THREE.RGBAFormat, THREE.FloatType
    );
    heightmapTex.wrapS     = THREE.RepeatWrapping;
    heightmapTex.wrapT     = THREE.ClampToEdgeWrapping;
    heightmapTex.minFilter = THREE.LinearFilter;
    heightmapTex.magFilter = THREE.LinearFilter;
    heightmapTex.needsUpdate = true;

    // ── Ripple render targets (ping-pong) ─────────────────────────────────
    const rtOpts: THREE.RenderTargetOptions = {
      type:      THREE.HalfFloatType,
      format:    THREE.RGBAFormat,
      wrapS:     THREE.ClampToEdgeWrapping,
      wrapT:     THREE.ClampToEdgeWrapping,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    };
    let rtRead  = new THREE.WebGLRenderTarget(RIPPLE_RES, RIPPLE_RES, rtOpts);
    let rtWrite = new THREE.WebGLRenderTarget(RIPPLE_RES, RIPPLE_RES, rtOpts);

    // Initialise both targets to zero
    const initScene = new THREE.Scene();
    const initCam   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const initMesh  = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    initScene.add(initMesh);
    renderer.setRenderTarget(rtRead);  renderer.render(initScene, initCam);
    renderer.setRenderTarget(rtWrite); renderer.render(initScene, initCam);
    renderer.setRenderTarget(null);
    initMesh.geometry.dispose();
    (initMesh.material as THREE.MeshBasicMaterial).dispose();

    // ── Ripple simulation scene ───────────────────────────────────────────
    const rippleScene = new THREE.Scene();
    const rippleCam   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const rippleUniforms = {
      tState:       { value: rtRead.texture },
      uMousePos:    { value: new THREE.Vector2(0.5, 0.5) },
      uMouseActive: { value: 0.0 },
    };

    // #10 — Named references + depthTest/depthWrite disabled
    const rippleGeo = new THREE.PlaneGeometry(2, 2);
    const rippleMat = new THREE.ShaderMaterial({
      uniforms:       rippleUniforms,
      vertexShader:   RIPPLE_VERT,
      fragmentShader: RIPPLE_FRAG,
      depthTest:      false,
      depthWrite:     false,
    });
    rippleScene.add(new THREE.Mesh(rippleGeo, rippleMat));

    // ── Particle system ────────────────────────────────────────────────────
    const pGrid = PARTICLE_GRID;
    // #16 — pCount removed, inlined pGrid * pGrid
    const pPos  = new Float32Array(pGrid * pGrid * 3);
    const pUv   = new Float32Array(pGrid * pGrid * 2);
    const pRand = new Float32Array(pGrid * pGrid);

    // Seeded random for particle breathe offsets — fully deterministic
    const particleRng = mulberry32(99999);
    for (let j = 0; j < pGrid; j++) {
      for (let i = 0; i < pGrid; i++) {
        const idx = j * pGrid + i;
        const u   = i / (pGrid - 1);
        const v   = j / (pGrid - 1);
        pPos[idx * 3]     = (u - 0.5) * TERRAIN_SIZE;
        pPos[idx * 3 + 1] = 0;
        pPos[idx * 3 + 2] = (v - 0.5) * TERRAIN_SIZE;
        pUv[idx * 2]      = u;
        pUv[idx * 2 + 1]  = v;
        pRand[idx]         = particleRng() * Math.PI * 2;
      }
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos,  3));
    particleGeo.setAttribute('aUv',      new THREE.BufferAttribute(pUv,   2));
    particleGeo.setAttribute('aRand',    new THREE.BufferAttribute(pRand, 1));

    const particleUniforms = {
      uHeightmap:    { value: heightmapTex },
      uRipple:       { value: rtRead.texture },
      uTerrainH:     { value: TERRAIN_H },
      uRippleStr:    { value: RIPPLE_STR },
      uTime:         { value: 0 },
      uScrollOffset: { value: 0 },
    };

    const particleMat = new THREE.ShaderMaterial({
      uniforms:       particleUniforms,
      vertexShader:   PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent:    true,
      blending:       THREE.AdditiveBlending,
      depthWrite:     false,
      depthTest:      true,
    });

    scene.add(new THREE.Points(particleGeo, particleMat));

    // ── Cursor tracking ────────────────────────────────────────────────────
    const mouse           = new THREE.Vector2(0.5, 0.5);
    const mouseTarget     = new THREE.Vector2(0.5, 0.5);   // raw ray-march result
    const mousePrev       = new THREE.Vector2(0.5, 0.5);   // previous-frame smoothed pos
    const camDriftTarget  = new THREE.Vector2(0, 0);
    const camDriftCurrent = new THREE.Vector2(0, 0);
    let   mouseActive     = 0.0;
    let   mouseOver       = false;
    let   currentScrollOffset = 0.0;   // shared between animate() and onMouseMove()

    const raycaster = new THREE.Raycaster();

    // #12 — Cached BoundingClientRect, refreshed on resize
    let cachedRect = container.getBoundingClientRect();

    // #13 — Pre-allocated NDC vector (eliminates per-mousemove allocation)
    const _ndcVec = new THREE.Vector2();

    // CPU heightmap sampler
    function sampleTerrainHeight(u: number, v: number, scrollOff: number): number {
      const su  = ((u + scrollOff) % 1.0 + 1.0) % 1.0;  // scroll-adjusted, wrapped [0,1)
      const col = Math.min(Math.floor(su * hmRes), hmRes - 1);
      const row = Math.min(Math.floor(v  * hmRes), hmRes - 1);
      return hmData[(row * hmRes + col) * 4] * TERRAIN_H;
    }

    // CPU ray-march against heightmap
    const HALF = TERRAIN_SIZE * 0.5;   // 120 — half the terrain extent
    const MARCH_STEPS  = 40;           // coarse steps along the ray
    const REFINE_STEPS = 7;            // binary-search iterations after crossing detected

    function rayMarchTerrain(ray: THREE.Ray, scrollOff: number): THREE.Vector2 | null {
      // Compute parametric t range where ray overlaps the terrain AABB
      // AABB: x ∈ [-120, 120], y ∈ [-1, 34], z ∈ [-120, 120]
      const invDirX = 1.0 / (ray.direction.x || 1e-12);
      const invDirY = 1.0 / (ray.direction.y || 1e-12);
      const invDirZ = 1.0 / (ray.direction.z || 1e-12);

      let tMinX = (-HALF - ray.origin.x) * invDirX;
      let tMaxX = ( HALF - ray.origin.x) * invDirX;
      if (tMinX > tMaxX) { const tmp = tMinX; tMinX = tMaxX; tMaxX = tmp; }

      let tMinY = (-1       - ray.origin.y) * invDirY;
      let tMaxY = ((TERRAIN_H + 2) - ray.origin.y) * invDirY;
      if (tMinY > tMaxY) { const tmp = tMinY; tMinY = tMaxY; tMaxY = tmp; }

      let tMinZ = (-HALF - ray.origin.z) * invDirZ;
      let tMaxZ = ( HALF - ray.origin.z) * invDirZ;
      if (tMinZ > tMaxZ) { const tmp = tMinZ; tMinZ = tMaxZ; tMaxZ = tmp; }

      const tEnter = Math.max(tMinX, tMinY, tMinZ, 0);
      const tExit  = Math.min(tMaxX, tMaxY, tMaxZ);
      if (tEnter >= tExit) return null;  // ray misses the terrain bounding box entirely

      // Coarse march
      const dt = (tExit - tEnter) / MARCH_STEPS;
      let tPrev = tEnter;
      let yPrev = ray.origin.y + ray.direction.y * tEnter;
      let hPrev = -Infinity;

      // Evaluate first step terrain height
      {
        const wx = ray.origin.x + ray.direction.x * tEnter;
        const wz = ray.origin.z + ray.direction.z * tEnter;
        const u  = (wx + HALF) / TERRAIN_SIZE;
        const v  = (wz + HALF) / TERRAIN_SIZE;
        if (u >= 0 && u <= 1 && v >= 0 && v <= 1) {
          hPrev = sampleTerrainHeight(u, v, scrollOff);
        }
      }

      for (let i = 1; i <= MARCH_STEPS; i++) {
        const t  = tEnter + dt * i;
        const wx = ray.origin.x + ray.direction.x * t;
        const wz = ray.origin.z + ray.direction.z * t;
        const ry = ray.origin.y + ray.direction.y * t;

        const u = (wx + HALF) / TERRAIN_SIZE;
        const v = (wz + HALF) / TERRAIN_SIZE;
        if (u < 0 || u > 1 || v < 0 || v > 1) { tPrev = t; yPrev = ry; continue; }

        const th = sampleTerrainHeight(u, v, scrollOff);

        // Ray crossed below terrain surface
        if (ry <= th && yPrev > hPrev) {
          // Binary-search refinement
          let tLo = tPrev, tHi = t;
          for (let r = 0; r < REFINE_STEPS; r++) {
            const tMid = (tLo + tHi) * 0.5;
            const mx   = ray.origin.x + ray.direction.x * tMid;
            const mz   = ray.origin.z + ray.direction.z * tMid;
            const my   = ray.origin.y + ray.direction.y * tMid;
            const mu   = (mx + HALF) / TERRAIN_SIZE;
            const mv   = (mz + HALF) / TERRAIN_SIZE;
            const mh   = sampleTerrainHeight(mu, mv, scrollOff);
            if (my > mh) tLo = tMid; else tHi = tMid;
          }
          const tFinal = (tLo + tHi) * 0.5;
          const fx = ray.origin.x + ray.direction.x * tFinal;
          const fz = ray.origin.z + ray.direction.z * tFinal;
          const fu = Math.max(0, Math.min(1, (fx + HALF) / TERRAIN_SIZE));
          const fv = Math.max(0, Math.min(1, (fz + HALF) / TERRAIN_SIZE));
          return _ndcVec.set(fu, fv);  // reuse _ndcVec as return carrier
        }

        tPrev = t;
        yPrev = ry;
        hPrev = th;
      }

      return null;
    }

    const onMouseMove = (e: MouseEvent) => {
      const sx = (e.clientX - cachedRect.left) / cachedRect.width;
      const sy = (e.clientY - cachedRect.top)  / cachedRect.height;

      camDriftTarget.set((sx - 0.5) * 12, (0.5 - sy) * 5);

      // Cast ray through cursor — _ndcVec is reused: setFromCamera reads it
      // immediately, then rayMarchTerrain overwrites it with the hit UV.
      _ndcVec.set(sx * 2 - 1, -(sy * 2 - 1));
      raycaster.setFromCamera(_ndcVec, camera);

      const hit = rayMarchTerrain(raycaster.ray, currentScrollOffset);
      if (hit) mouseTarget.set(hit.x, hit.y);
    };

    const onMouseEnter = () => { mouseOver = true; };
    const onMouseLeave = () => { mouseOver = false; };

    // #14 — Passive mousemove listener
    window.addEventListener('mousemove',  onMouseMove, { passive: true });
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseleave', onMouseLeave);

    // ── Resize ─────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      cachedRect = container.getBoundingClientRect();  // #12 — refresh on resize
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ───────────────────────────────────────────────────
    let rafId: number;
    let elapsedTime    = 0;
    let lastTimestamp   = performance.now();
    const MAX_FRAME_DT  = 0.1;  // 100ms cap — prevents time-jump on tab resume
    let readyFired      = false;

    function animate() {
      rafId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt  = Math.min((now - lastTimestamp) / 1000, MAX_FRAME_DT);
      lastTimestamp = now;
      elapsedTime += dt;
      const time = elapsedTime;

      // Smooth camera parallax
      camDriftCurrent.x += (camDriftTarget.x - camDriftCurrent.x) * 0.045;
      camDriftCurrent.y += (camDriftTarget.y - camDriftCurrent.y) * 0.045;
      camera.position.x  = camBasePos.x + camDriftCurrent.x + Math.sin(time * 0.04) * 3.0;
      camera.position.y  = camBasePos.y + camDriftCurrent.y;
      camera.lookAt(CAM_TARGET);

      // Smooth mouse toward target + compute velocity for ripple activation
      mousePrev.copy(mouse);
      mouse.x += (mouseTarget.x - mouse.x) * 0.3;
      mouse.y += (mouseTarget.y - mouse.y) * 0.3;
      const smoothVel = Math.sqrt(
        (mouse.x - mousePrev.x) ** 2 + (mouse.y - mousePrev.y) ** 2
      );
      mouseActive = Math.min(1.0, mouseActive + smoothVel * 18.0);

      // Ripple step
      rippleUniforms.tState.value       = rtRead.texture;
      rippleUniforms.uMousePos.value.copy(mouse);
      rippleUniforms.uMouseActive.value = mouseActive;

      renderer.setRenderTarget(rtWrite);
      renderer.render(rippleScene, rippleCam);
      renderer.setRenderTarget(null);

      const tmp = rtRead; rtRead = rtWrite; rtWrite = tmp;
      mouseActive *= 0.82;
      if (mouseOver) mouseActive = Math.max(mouseActive, 0.25);

      // Scroll offset
      currentScrollOffset = (time * SCROLL_SPEED) % 1.0;

      // Update particle uniforms
      particleUniforms.uRipple.value        = rtRead.texture;
      particleUniforms.uTime.value          = time;
      particleUniforms.uScrollOffset.value  = currentScrollOffset;

      renderer.render(scene, camera);

      // Signal readiness after the very first completed frame
      if (!readyFired) {
        readyFired = true;
        onReadyRef.current?.();
      }

      // #1 — Stream new columns as scroll advances
      const rightmostNeeded = Math.floor(time * SCROLL_SPEED * hmRes) + hmRes - 1;
      if (rightmostNeeded > lastGeneratedCol) {
        for (let c = lastGeneratedCol + 1; c <= rightmostNeeded; c++) {
          generateColumn(c);
        }
        lastGeneratedCol = rightmostNeeded;
        heightmapTex.needsUpdate = true;
      }
    }

    animate();

    // ── Pause / resume based on isActive prop ────────────────────────────
    // A separate effect (below) watches isActive and calls this.
    // We expose start/stop as closures captured by that effect.
    (containerRef.current as unknown as { _terrainStop?: () => void; _terrainStart?: () => void })
      ._terrainStop  = () => { cancelAnimationFrame(rafId); };
    (containerRef.current as unknown as { _terrainStop?: () => void; _terrainStart?: () => void })
      ._terrainStart = () => {
        // Reset timestamp so dt doesn't spike after a long pause
        lastTimestamp = performance.now();
        animate();
      };

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      rtRead.dispose();
      rtWrite.dispose();
      heightmapTex.dispose();
      rippleGeo.dispose();   // #15 — added
      rippleMat.dispose();   // #15 — added
      particleGeo.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pause / resume loop when isActive changes ───────────────────────────
  // The setup effect above stashes _terrainStop / _terrainStart on the
  // container element so this effect can reach them without coupling.
  useEffect(() => {
    const el = containerRef.current as (HTMLDivElement & {
      _terrainStop?:  () => void;
      _terrainStart?: () => void;
    }) | null;
    if (!el) return;

    if (isActive) {
      el._terrainStart?.();
    } else {
      el._terrainStop?.();
    }
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        background: '#000814',
        overflow: 'hidden',
        display: 'block',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    />
  );
});

