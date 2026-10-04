import {
  ACESFilmicToneMapping,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  RepeatWrapping,
  SRGBColorSpace,
  Scene,
  SphereGeometry,
  Texture,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { roastRgb } from '../../core/utils/roast-color';

export interface BeanSceneOptions {
  quality: 'low' | 'high';
  animate: boolean;
  /** Follow the pointer with a gentle tilt (fine pointers only). */
  pointer: boolean;
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * A single procedurally-modelled coffee bean whose colour, sheen and size are
 * driven by a roast level (0 → green, 1 → dark). Framework-agnostic; the Angular
 * wrapper owns lifecycle, visibility and fallback.
 */
export class BeanScene {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(28, 1, 0.1, 50);
  private readonly pivot = new Group();
  private readonly material: MeshPhysicalMaterial;
  private readonly mesh: Mesh;
  private readonly textures: Texture[] = [];
  private readonly envTexture: Texture;
  private readonly resizeObserver: ResizeObserver;

  private raf = 0;
  private running = false;
  private startTime = performance.now();
  private readonly pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private readonly color = new Color();
  private progress = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly opts: BeanSceneOptions,
  ) {
    const high = opts.quality === 'high';
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: high ? 'high-performance' : 'low-power',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, high ? 1.75 : 1.5));
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    const pmrem = new PMREMGenerator(this.renderer);
    this.envTexture = pmrem.fromScene(new RoomEnvironment(this.renderer), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = this.envTexture;

    this.camera.position.set(0, 0, 7.2);

    const mottling = this.makeNoiseTexture(high ? 256 : 128);
    this.material = new MeshPhysicalMaterial({
      map: mottling,
      bumpMap: mottling,
      bumpScale: 2.2,
      roughness: 0.8,
      clearcoat: 0,
      clearcoatRoughness: 0.35,
      envMapIntensity: 0.55,
      sheen: 0.4,
      sheenRoughness: 0.8,
      sheenColor: new Color('#e9d9b0'),
    });

    this.mesh = new Mesh(this.buildGeometry(high ? 168 : 84, high ? 128 : 64), this.material);
    this.mesh.rotation.set(0.18, -0.55, -0.42);
    this.pivot.add(this.mesh);
    this.scene.add(this.pivot);

    this.scene.add(new HemisphereLight(0xfff1dc, 0x2a1a10, 0.9));
    const key = new DirectionalLight(0xffe2c0, 2.6);
    key.position.set(3, 4, 5);
    const rim = new DirectionalLight(0xff7436, 3.2);
    rim.position.set(-4.5, 1.5, -3);
    const under = new DirectionalLight(0xc9d6ff, 0.35);
    under.position.set(0, -4, 2);
    this.scene.add(key, rim, under);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();

    if (opts.pointer) window.addEventListener('pointermove', this.onPointer, { passive: true });

    this.setProgress(0);
  }

  /** 0 → green coffee, 1 → dark roast. */
  setProgress(p: number): void {
    this.progress = MathUtils.clamp(p, 0, 1);
    const [r, g, b] = roastRgb(this.progress);
    this.material.color.setRGB(r / 255, g / 255, b / 255, SRGBColorSpace);
    const oil = smoothstep(0.62, 1, this.progress);
    this.material.roughness = MathUtils.lerp(0.82, 0.38, oil);
    this.material.clearcoat = oil * 0.75;
    this.material.sheen = MathUtils.lerp(0.45, 0, smoothstep(0.1, 0.5, this.progress));
    // Beans swell by roughly half their volume while roasting.
    this.mesh.scale.setScalar(0.9 + 0.14 * smoothstep(0.25, 0.85, this.progress));
    if (!this.running) this.render();
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.tick();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  dispose(): void {
    this.stop();
    window.removeEventListener('pointermove', this.onPointer);
    this.resizeObserver.disconnect();
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.textures.forEach((t) => t.dispose());
    this.envTexture.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  // ---------------------------------------------------------------------------

  private tick(): void {
    const t = (performance.now() - this.startTime) / 1000;
    const p = this.pointer;
    p.x += (p.tx - p.x) * 0.06;
    p.y += (p.ty - p.y) * 0.06;

    if (this.opts.animate) {
      this.pivot.rotation.y = Math.sin(t * 0.35) * 0.55 + p.x * 0.5;
      this.pivot.rotation.x = Math.sin(t * 0.27) * 0.12 + p.y * 0.3;
      this.pivot.position.y = Math.sin(t * 0.8) * 0.06;
    }
    this.render();
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private resize(): void {
    const { clientWidth: w, clientHeight: h } = this.canvas;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Keep the bean fully in frame on tall/narrow canvases.
    this.camera.position.z = this.camera.aspect < 0.8 ? (7.2 * 0.8) / Math.max(this.camera.aspect, 0.55) : 7.2;
    this.camera.updateProjectionMatrix();
    if (!this.running) this.render();
  }

  private readonly onPointer = (e: PointerEvent) => {
    this.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };

  /** Ellipsoid → flat face with an S-shaped centre cut → slight irregularity. */
  private buildGeometry(w: number, h: number): SphereGeometry {
    const geo = new SphereGeometry(1, w, h);
    const pos = geo.attributes['position'];
    const v = new Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const { x: nx, y: ny, z: nz } = v;

      let x = nx * 0.92;
      let y = ny * 1.3;
      let z = nz > 0 ? nz * 0.4 : nz * 0.74;

      // S-curve crease on the flat face, fading out toward the tips.
      const curve = 0.085 * Math.sin(ny * 2.6);
      const d = nx - curve;
      const tipFade = 1 - smoothstep(0.72, 0.97, Math.abs(ny));
      const face = smoothstep(0.05, 0.35, nz);
      const groove = Math.exp(-(d * d) / 0.0035) * 0.24 * tipFade * face;
      const lip = Math.exp(-(d * d) / 0.03) * 0.035 * tipFade * face;
      z = z - groove + lip;

      // Organic irregularity so it never looks machined.
      const wobble = 1 + 0.018 * Math.sin(nx * 3.1 + ny * 2.3) * Math.sin(nz * 2.7 + ny * 1.3);
      pos.setXYZ(i, x * wobble, y * wobble, z * wobble);
    }

    geo.computeVertexNormals();
    return geo;
  }

  /** Horizontally tileable value-noise used for colour mottling and bump. */
  private makeNoiseTexture(size: number): CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const img = ctx.createImageData(size, size);

    const octave = (cells: number, seed: number) => {
      const grid: number[] = [];
      for (let i = 0; i < (cells + 1) * (cells + 1); i++) {
        grid.push(Math.abs(Math.sin(i * 127.1 + seed * 311.7) * 43758.5453) % 1);
      }
      const at = (gx: number, gy: number) => grid[(gy % (cells + 1)) * (cells + 1) + (gx % cells)];
      return (u: number, vv: number) => {
        const fx = u * cells;
        const fy = vv * cells;
        const x0 = Math.floor(fx);
        const y0 = Math.floor(fy);
        const tx = smoothstep(0, 1, fx - x0);
        const ty = smoothstep(0, 1, fy - y0);
        const a = MathUtils.lerp(at(x0, y0), at(x0 + 1, y0), tx);
        const b = MathUtils.lerp(at(x0, y0 + 1), at(x0 + 1, y0 + 1), tx);
        return MathUtils.lerp(a, b, ty);
      };
    };

    const o1 = octave(8, 1);
    const o2 = octave(24, 2);
    const o3 = octave(64, 3);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = x / size;
        const vv = y / size;
        const n = o1(u, vv) * 0.5 + o2(u, vv) * 0.32 + o3(u, vv) * 0.18;
        const c = Math.round(MathUtils.lerp(205, 255, n));
        const k = (y * size + x) * 4;
        img.data[k] = img.data[k + 1] = img.data[k + 2] = c;
        img.data[k + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    const tex = new CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.colorSpace = SRGBColorSpace;
    this.textures.push(tex);
    return tex;
  }
}
