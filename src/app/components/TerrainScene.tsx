import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

export interface TerrainSceneRef {
  getCanvas: () => HTMLCanvasElement | null;
}

// ─── Configuration ─────────────────────────────────────────────────────────
// Exported so the host project can match page background / overlay positioning
// to the terrain scene.
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

    // Pure exponential decay — no wave propagation, no oscillation
    float next = curr * 0.985;

    // Stamp a Gaussian footprint wherever the cursor is active
    float dist = distance(vUv, uMousePos);
    next += uMouseActive * 0.07 * exp(-dist * dist * 160.0);

    next = clamp(next, 0.0, 1.0);
    // Store current in G channel so particles can still read amplitude
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
  varying float vRipple;
  varying float vRipVel;
  varying float vSizeScale;
  varying float vRiver;

  void main() {
    // Scroll the heightmap U axis — right-to-left infinite terrain
    vec2  scrollUv = vec2(fract(aUv.x + uScrollOffset), aUv.y);
    float h0      = texture2D(uHeightmap, scrollUv).r;
    float riverMask = texture2D(uHeightmap, scrollUv).b;
    float rip     = texture2D(uRipple, aUv).r;
    float h       = clamp(h0 + rip * (uRippleStr / uTerrainH), 0.0, 1.0);

    vHeight = h0;
    vRipple = rip;
    vRiver  = riverMask;
    // Drive glow directly from decay amplitude — no pulse, just a fading trail
    vRipVel = clamp(rip * 2.8, 0.0, 1.0);

    vec3 pos = position;
    // Very subtle breathe — keeps the cloud alive without visually drifting
    float breathe = sin(uTime * 0.9 + aRand) * 0.12;
    pos.y = h * uTerrainH + breathe;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    float camDist = -mvPos.z;

    // Size: bigger near snow, smaller in ocean depths, all scaled by distance
    float sz = mix(1.8, 4.8, smoothstep(0.70, 1.0, h0))
              + mix(1.4, 2.4, smoothstep(0.0, 0.25, h0)) * (1.0 - smoothstep(0.25, 0.35, h0));
    // Boost point size in ripple-affected areas; pass the ratio so the frag
    // shader can keep the hard core at a fixed pixel width.
    float ripBoost  = vRipVel * 4.0;
    float totalSz   = sz + ripBoost;
    vSizeScale      = totalSz / max(sz, 0.001);
    gl_PointSize = totalSz * (200.0 / max(camDist, 1.0));
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const PARTICLE_FRAG = /* glsl */`
  varying float vHeight;
  varying float vRipple;
  varying float vRipVel;
  varying float vSizeScale;
  varying float vRiver;

  vec3 heightColor(float h) {
    // Full 12-stop gradient matching the original terrain palette
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

    // Tight circular core — sharp falloff so particles stay crisp.
    // Dividing thresholds by vSizeScale keeps the solid core the same
    // pixel width regardless of how large the point sprite has grown.
    float fade = 1.0 - smoothstep(0.08 / vSizeScale, 0.28 / vSizeScale, d);

    vec3  col   = heightColor(vHeight);

    // River overlay: blend toward shallow-sea water color where river mask is active
    vec3  riverCol = vec3(0.05, 0.38, 0.62); // shallowSea from the gradient
    float riverBlend = smoothstep(0.05, 0.35, vRiver);
    col = mix(col, riverCol, riverBlend);

    // Glow: tight bright halo (high coefficient = narrow bell) + colour tint
    float halo    = exp(-d * d * 55.0) * vRipVel * 0.55;
    vec3  glowTint = vec3(0.45, 0.72, 1.0);
    vec3  finalCol = col + glowTint * vRipVel * 0.55;

    float baseAlpha = mix(0.55, 0.90, smoothstep(0.60, 1.0, vHeight));
    float alpha = fade * baseAlpha + halo;
    gl_FragColor = vec4(finalCol, clamp(alpha, 0.0, 1.0));
  }
`;

// ─── Component ───────────────────────────────────────────────────────────────
export const TerrainScene = forwardRef<TerrainSceneRef>(function TerrainScene(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      antialias: true,
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
    // X axis is mapped onto a circle in 3D noise space so the texture tiles
    // seamlessly along the scroll axis — eliminates the wrap seam.

    // Seeded PRNG (mulberry32) — deterministic terrain on every load.
    // Change the seed constants to get a different (but stable) map.
    function mulberry32(seed: number): () => number {
      let s = seed | 0;
      return () => {
        s = (s + 0x6D2B79F5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    const noiseA = createNoise3D(mulberry32(12345)); // continental base / zone selector
    const noiseB = createNoise3D(mulberry32(67890)); // mountain ridges + tectonic mask
    const noiseC = createNoise3D(mulberry32(24680)); // plains, detail, warp field Y
    const noiseD = createNoise3D(mulberry32(13579)); // river channels / negative ridges

    const hmRes  = HEIGHTMAP_RES;
    const hmData = new Float32Array(hmRes * hmRes * 4);

    const TAU = Math.PI * 2;

    // Utilities
    const smst    = (t: number) => t * t * (3.0 - 2.0 * t);
    const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
    const lerp    = (a: number, b: number, t: number) => a + (b - a) * t;

    // ── Seamless circle-mapped sample ────────────────────────────────────
    function ns(
      noise: (x: number, y: number, z: number) => number,
      nx: number, ny: number, freq: number
    ): number {
      const r = freq / TAU;
      const a = nx * TAU;
      return noise(Math.cos(a) * r, Math.sin(a) * r, ny * freq);
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
      return v / tot; // [-1, +1]
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
      return (v / tot) * 2.0 - 1.0; // [-1, +1]
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

    for (let y = 0; y < hmRes; y++) {
      for (let x = 0; x < hmRes; x++) {
        const nx = x / hmRes;
        const ny = y / hmRes;

        // ── Layer 1: Continental — broad terrain shape ─────────────────────
        const cwx = fbm(noiseA, nx, ny + 2.1, 1.0, 3, 0.50, 2.0);
        const cwy = fbm(noiseC, nx, ny + 6.5, 1.0, 3, 0.50, 2.0);
        const cnx = nx + 0.45 * cwx;
        const cny = ny + 0.45 * cwy;

        const contRaw = fbm(noiseA, cnx, cny, 0.8, 5, 0.48, 2.0); // [-1, +1]

        const ct          = contRaw * 0.5 + 0.5;                    // [0, 1]
        const continental = smst(smst(ct));                          // double smoothstep
        const contSkewed  = Math.pow(continental, 0.96);             // gentle lift
        const contH       = contSkewed * 0.83;                      // cap at 0.83

        // ── Layer 2: Mountain masses ───────────────────────────────────────
        const zoneRaw = fbm(noiseB, nx, ny + 1.3, 0.55, 3, 0.50, 2.0) * 0.5 + 0.5;
        const zone    = smst(clamp01((zoneRaw - 0.48) / 0.35));

        const mtnRaw    = fbm(noiseB, cnx, cny, 0.9, 3, 0.45, 2.0) * 0.5 + 0.5;
        const mtnShaped = smst(smst(mtnRaw));
        const mtnFat    = Math.pow(mtnShaped, 0.7);
        const mtnH      = mtnFat * 0.28 * zone;

        // ── Layer 3: Plains / rolling hills ───────────────────────────────
        const plainsRaw = fbm(noiseC, nx, ny + 8.3, 2.2, 4, 0.42, 2.1);
        const plainsH   = plainsRaw * 0.04;

        // ── Layer 4: Multi-scale surface detail ──────────────────────────

        // 4a: Mountain ridgelines
        const ridgeDetail = ridgedFbm(noiseB, cnx, cny, 4.0, 4, 0.42, 2.1);
        const ridgeVal    = (ridgeDetail * 0.5 + 0.5);
        const ridge4a     = ridgeVal * 0.08 * zone;

        // 4b: Erosion / fold texture
        const erosion4b   = fbm(noiseC, cnx, cny + 20.3, 5.5, 4, 0.44, 2.05);
        const midBandMask = smst(clamp01((contH - 0.30) / 0.10))
                          * (1.0 - smst(clamp01((contH - 0.70) / 0.12)));
        const erosionVal  = erosion4b * 0.06 * midBandMask;

        // 4c: Coastal roughness
        const coastNoise = fbm(noiseA, nx, ny + 30.7, 7.0, 3, 0.40, 2.2);
        const coastMask  = smst(clamp01((contH - 0.22) / 0.06))
                         * (1.0 - smst(clamp01((contH - 0.35) / 0.06)));
        const coastVal   = coastNoise * 0.045 * coastMask;

        // 4d: Highland crags
        const cragNoise = ridgedFbm(noiseD, cnx, cny + 35.1, 7.5, 3, 0.38, 2.15);
        const cragVal01 = cragNoise * 0.5 + 0.5;
        const highMask  = smst(clamp01((contH + mtnH - 0.58) / 0.15));
        const cragVal   = cragVal01 * 0.055 * highMask;

        // 4e: Medium micro-detail
        const micro1    = fbm(noiseA, nx, ny + 16.2, 12.0, 3, 0.42, 2.1);
        const landMask4 = smst(clamp01((contH - 0.20) / 0.10));
        const microVal1 = micro1 * lerp(0.012, 0.04, clamp01(contH)) * landMask4;

        // 4f: Ultra-fine grain
        const micro2    = fbm(noiseB, nx, ny + 44.8, 22.0, 2, 0.38, 2.0);
        const microVal2 = micro2 * lerp(0.006, 0.025, clamp01(contH));

        // 4g: Sub-pixel texture
        const micro3    = fbm(noiseC, nx, ny + 52.3, 40.0, 2, 0.35, 2.0);
        const microVal3 = micro3 * 0.01;

        const detailAdd = ridge4a + erosionVal + coastVal + cragVal
                        + microVal1 + microVal2 + microVal3;

        // ── Composite ─────────────────────────────────────────────────────
        let h = contH + mtnH + plainsH + detailAdd;

        // ── Layer 5: River channels ───────────────────────────────────────
        const rwx = fbm(noiseD, nx, ny + 42.7, 0.7, 2, 0.50, 2.0);
        const rwy = fbm(noiseD, nx, ny + 47.1, 0.7, 2, 0.50, 2.0);
        const rnx = nx + 0.38 * rwx;
        const rny = ny + 0.38 * rwy;

        const riv1 = riverRidged(noiseD, rnx, rny + 55.0, 0.6, 5, 0.48, 2.1);
        const riv2 = riverRidged(noiseA, rnx, rny + 60.0, 1.1, 4, 0.45, 2.2);

        const widthMod = fbm(noiseC, nx, ny + 73.0, 0.6, 2, 0.50, 2.0) * 0.5 + 0.5;

        const sharp1 = Math.pow(riv1, lerp(3.0, 5.0, widthMod));
        const sharp2 = Math.pow(riv2, lerp(4.0, 7.0, widthMod));

        const riverRidge = Math.max(sharp1, sharp2 * 0.6);

        const riverLandMask = smst(clamp01((h - 0.28) / 0.18))
                            * (1.0 - smst(clamp01((h - 0.72) / 0.14)));

        h -= riverRidge * 0.13 * riverLandMask;
        h = clamp01(h);

        const idx = (y * hmRes + x) * 4;
        hmData[idx]     = h;
        hmData[idx + 1] = h;
        hmData[idx + 2] = clamp01(riverRidge * riverLandMask); // river mask in B channel
        hmData[idx + 3] = 1;
      }
    }

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
    rippleScene.add(new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms:       rippleUniforms,
        vertexShader:   RIPPLE_VERT,
        fragmentShader: RIPPLE_FRAG,
      })
    ));

    // ── Particle system ────────────────────────────────────────────────────
    const pGrid  = PARTICLE_GRID;
    const pCount = pGrid * pGrid;
    const pPos   = new Float32Array(pCount * 3);
    const pUv    = new Float32Array(pCount * 2);
    const pRand  = new Float32Array(pCount);

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
    const camDriftTarget  = new THREE.Vector2(0, 0);
    const camDriftCurrent = new THREE.Vector2(0, 0);
    let   mouseActive     = 0.0;
    let   mouseOver       = false;

    const raycaster   = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(TERRAIN_H * 0.20));
    const hitPoint    = new THREE.Vector3();

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const sx   = (e.clientX - rect.left) / rect.width;
      const sy   = (e.clientY - rect.top)  / rect.height;

      camDriftTarget.set((sx - 0.5) * 12, (0.5 - sy) * 5);

      raycaster.setFromCamera(new THREE.Vector2(sx * 2 - 1, -(sy * 2 - 1)), camera);
      if (!raycaster.ray.intersectPlane(groundPlane, hitPoint)) return;

      const u = Math.max(0, Math.min(1, (hitPoint.x + TERRAIN_SIZE * 0.5) / TERRAIN_SIZE));
      const v = Math.max(0, Math.min(1, (hitPoint.z + TERRAIN_SIZE * 0.5) / TERRAIN_SIZE));

      const vel = Math.sqrt((u - mouse.x) ** 2 + (v - mouse.y) ** 2);
      mouse.set(u, v);
      mouseActive = Math.min(1.0, mouseActive + vel * 18.0);
    };

    const onMouseEnter = () => { mouseOver = true; };
    const onMouseLeave = () => { mouseOver = false; };

    window.addEventListener('mousemove',  onMouseMove);
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseleave', onMouseLeave);

    // ── Resize ─────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ───────────────────────────────────────────────────
    let rafId: number;
    const timer = new THREE.Timer();

    function animate() {
      rafId = requestAnimationFrame(animate);
      timer.update();
      const time = timer.getElapsed();

      // Smooth camera parallax
      camDriftCurrent.x += (camDriftTarget.x - camDriftCurrent.x) * 0.045;
      camDriftCurrent.y += (camDriftTarget.y - camDriftCurrent.y) * 0.045;
      camera.position.x  = camBasePos.x + camDriftCurrent.x + Math.sin(time * 0.04) * 3.0;
      camera.position.y  = camBasePos.y + camDriftCurrent.y;
      camera.lookAt(CAM_TARGET);

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

      // Update particle uniforms
      particleUniforms.uRipple.value        = rtRead.texture;
      particleUniforms.uTime.value          = time;
      particleUniforms.uScrollOffset.value  = (time * SCROLL_SPEED) % 1.0;

      renderer.render(scene, camera);
    }

    animate();

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
      particleGeo.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

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
