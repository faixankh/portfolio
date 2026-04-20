import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FilmPass } from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/postprocessing/FilmPass.js";

const canvas = document.getElementById("stage");
const telemetryEl = document.getElementById("telemetry");
const diagnosticsEl = document.getElementById("diagnostics");

const DPR = Math.min(window.devicePixelRatio, 2);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.setPixelRatio(DPR);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const scene = new THREE.Scene();
scene.background = null;
scene.fog = new THREE.FogExp2(0x060a1a, 0.03);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.05, 200);
camera.position.set(0, 0.3, 6.8);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.45, 0.23));
composer.addPass(new FilmPass(0.18, 0.16, 648, false));

const lightRig = {
  key: new THREE.DirectionalLight(0xcce7ff, 2.0),
  rim: new THREE.DirectionalLight(0x7e7eff, 1.35),
  under: new THREE.PointLight(0x4de0ff, 28, 28, 2),
  fill: new THREE.PointLight(0xb083ff, 16, 40, 2),
  ambient: new THREE.AmbientLight(0x3f4f80, 0.4),
};
lightRig.key.position.set(4.5, 5.8, 5.8);
lightRig.rim.position.set(-5, 2, -4.5);
lightRig.under.position.set(0, -1.8, 2.4);
lightRig.fill.position.set(1.2, 1.8, -3.2);
Object.values(lightRig).forEach((l) => scene.add(l));

const materials = {
  brushed: new THREE.MeshPhysicalMaterial({ color: 0x95abc9, metalness: 1.0, roughness: 0.2, clearcoat: 1.0, clearcoatRoughness: 0.07, envMapIntensity: 1.1 }),
  dark: new THREE.MeshPhysicalMaterial({ color: 0x28364f, metalness: 1.0, roughness: 0.43, clearcoat: 0.8, clearcoatRoughness: 0.18 }),
  ceramic: new THREE.MeshPhysicalMaterial({ color: 0x637595, metalness: 0.75, roughness: 0.16, sheen: 0.8, sheenColor: new THREE.Color(0x99b8ff) }),
  emissive: new THREE.MeshStandardMaterial({ color: 0x7ce4ff, emissive: 0x4de8ff, emissiveIntensity: 1.4, metalness: 0.3, roughness: 0.24 }),
  visor: new THREE.MeshPhysicalMaterial({
    color: 0x0f1d3e,
    transmission: 0.5,
    thickness: 0.2,
    metalness: 0.65,
    roughness: 0.07,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    emissive: 0x59c3ff,
    emissiveIntensity: 0.8,
  }),
};

function tubeFromCurve(points, radius, radialSegments = 22) {
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.TubeGeometry(curve, 80, radius, radialSegments, false);
}

class RobotHeadRig {
  constructor() {
    this.root = new THREE.Group();
    this.jawPivot = new THREE.Group();
    this.eyeGroup = new THREE.Group();
    this.orbitals = new THREE.Group();
    this.coils = [];
    this.reactorRings = [];

    this.#buildNeckBase();
    this.#buildCranium();
    this.#buildFaceAssembly();
    this.#buildOrbitalCoils();
    this.#buildBackNeuralBus();
    this.#buildHalo();

    scene.add(this.root);
  }

  #buildNeckBase() {
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.54, 1.1, 56), materials.dark);
    neck.position.y = -1.52;
    this.root.add(neck);

    const collarA = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.12, 22, 96), materials.brushed);
    collarA.rotation.x = Math.PI / 2;
    collarA.position.y = -1.08;

    const collarB = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.04, 18, 64), materials.emissive);
    collarB.rotation.x = Math.PI / 2;
    collarB.position.y = -1.08;

    this.root.add(collarA, collarB);
    this.reactorRings.push(collarB);
  }

  #buildCranium() {
    const shell = new THREE.Mesh(new THREE.SphereGeometry(1.12, 90, 90, 0, Math.PI * 2, 0, Math.PI * 0.96), materials.brushed);
    shell.scale.set(1.0, 1.06, 0.96);

    const backShell = new THREE.Mesh(new THREE.SphereGeometry(1.0, 72, 60), materials.dark);
    backShell.scale.set(1.06, 1.03, 0.78);
    backShell.position.z = -0.3;

    const temporalWingL = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.46, 0.62), materials.ceramic);
    temporalWingL.position.set(-0.86, 0.22, 0.05);
    const temporalWingR = temporalWingL.clone();
    temporalWingR.position.x *= -1;

    this.root.add(shell, backShell, temporalWingL, temporalWingR);
  }

  #buildFaceAssembly() {
    const faceMain = new THREE.Mesh(new THREE.CapsuleGeometry(0.64, 1.02, 18, 42), materials.dark);
    faceMain.position.set(0, -0.1, 0.46);
    faceMain.scale.set(0.95, 0.98, 0.67);

    const visorBand = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.1, 24, 120, Math.PI), materials.visor);
    visorBand.position.set(0, 0.21, 0.94);
    visorBand.rotation.z = Math.PI;

    const browLine = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.7, 16), materials.emissive);
    browLine.rotation.z = Math.PI / 2;
    browLine.position.set(0, 0.34, 0.89);

    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 28, 24), materials.emissive);
    eyeL.position.set(-0.2, 0.17, 1.0);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.2;

    this.eyeGroup.add(eyeL, eyeR);

    this.jawPivot.position.set(0, -0.38, 0.16);
    const jawShell = new THREE.Mesh(new THREE.CapsuleGeometry(0.52, 0.7, 12, 30), materials.brushed);
    jawShell.position.set(0, -0.2, 0.28);
    jawShell.scale.set(0.98, 0.66, 0.61);

    for (let i = 0; i < 8; i++) {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.04, 0.03), materials.emissive);
      vent.position.set(-0.23 + i * 0.066, -0.1, 0.58);
      this.jawPivot.add(vent);
      this.coils.push(vent);
    }

    this.jawPivot.add(jawShell);
    this.root.add(faceMain, visorBand, browLine, this.eyeGroup, this.jawPivot);
    this.reactorRings.push(browLine);
  }

  #buildOrbitalCoils() {
    for (let i = 0; i < 12; i++) {
      const radius = 0.98 + i * 0.016;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.008 + i * 0.0006, 14, 88), materials.emissive);
      ring.rotation.set(Math.PI / 2, 0, i * 0.32);
      ring.position.y = -0.06 + i * 0.012;
      this.orbitals.add(ring);
      this.reactorRings.push(ring);
    }
    this.root.add(this.orbitals);
  }

  #buildBackNeuralBus() {
    for (let i = 0; i < 10; i++) {
      const x = -0.38 + i * 0.086;
      const points = [
        new THREE.Vector3(x, -0.45, -0.24),
        new THREE.Vector3(x + (Math.random() - 0.5) * 0.1, -0.7, -0.62),
        new THREE.Vector3(x + (Math.random() - 0.5) * 0.12, -1.0, -0.42),
        new THREE.Vector3(x + (Math.random() - 0.5) * 0.1, -1.3, -0.12),
      ];
      const cable = new THREE.Mesh(tubeFromCurve(points, 0.012 + (i % 3) * 0.002), materials.ceramic);
      this.root.add(cable);
      this.coils.push(cable);
    }
  }

  #buildHalo() {
    this.halo = new THREE.Group();
    const haloOuter = new THREE.Mesh(new THREE.TorusGeometry(1.84, 0.034, 20, 180), materials.emissive);
    haloOuter.rotation.x = Math.PI / 2;
    haloOuter.position.y = 0.32;

    const haloInner = new THREE.Mesh(new THREE.TorusGeometry(1.64, 0.012, 12, 120), materials.visor);
    haloInner.rotation.x = Math.PI / 2;
    haloInner.position.y = 0.34;

    this.halo.add(haloOuter, haloInner);
    this.root.add(this.halo);
    this.reactorRings.push(haloOuter, haloInner);
  }

  update(time, dt, cursor, timeline) {
    const targetRotY = timeline.headRot.y + cursor.x * 0.2;
    const targetRotX = timeline.headRot.x + cursor.y * 0.11;
    const targetRotZ = timeline.headRot.z - cursor.x * 0.05;

    this.root.position.lerp(timeline.headPos, 0.09);
    this.root.rotation.x += (targetRotX - this.root.rotation.x) * 0.08;
    this.root.rotation.y += (targetRotY - this.root.rotation.y) * 0.08;
    this.root.rotation.z += (targetRotZ - this.root.rotation.z) * 0.08;

    const jawAmp = 0.04 + timeline.energy * 0.09;
    this.jawPivot.rotation.x = Math.sin(time * (2.2 + timeline.energy * 2.4)) * jawAmp;

    this.orbitals.rotation.y += dt * (0.1 + timeline.energy * 0.55);
    this.orbitals.rotation.z = Math.sin(time * 0.31) * 0.07;

    this.eyeGroup.children.forEach((eye, idx) => {
      eye.scale.setScalar(1 + Math.sin(time * 4.2 + idx * Math.PI + timeline.energy * 6.0) * 0.18);
      eye.material.emissiveIntensity = 1.0 + timeline.energy * 1.8;
    });

    this.reactorRings.forEach((mesh, idx) => {
      mesh.material.emissiveIntensity = 0.7 + timeline.energy * 1.9 + Math.sin(time * 2.7 + idx * 0.55) * 0.28;
    });

    this.coils.forEach((mesh, idx) => {
      mesh.rotation.y += dt * (0.02 + (idx % 5) * 0.01);
    });

    this.halo.rotation.y += dt * (0.09 + timeline.energy * 0.25);
  }
}

class NebulaField {
  constructor(count = 4200) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cA = new THREE.Color(0x4de0ff);
    const cB = new THREE.Color(0x9d7eff);

    for (let i = 0; i < count; i++) {
      const r = 16 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const mix = Math.random();
      const c = cA.clone().lerp(cB, mix);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.028,
      transparent: true,
      opacity: 0.84,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(geometry, material);
    scene.add(this.points);
  }

  update(time, timeline) {
    this.points.rotation.y = time * 0.012;
    this.points.rotation.x = Math.sin(time * 0.16) * 0.05;
    this.points.material.opacity = 0.72 + timeline.energy * 0.26;
  }
}

const timelineKeyframes = [
  {
    t: 0,
    headPos: new THREE.Vector3(0, -0.1, 0),
    headRot: new THREE.Euler(-0.05, -0.28, 0),
    camPos: new THREE.Vector3(0.15, 0.32, 6.8),
    lookAt: new THREE.Vector3(0, 0.05, 0.2),
    exposure: 1.0,
    energy: 0.24,
  },
  {
    t: 0.23,
    headPos: new THREE.Vector3(-0.42, 0.07, 0.08),
    headRot: new THREE.Euler(-0.07, 0.42, 0.06),
    camPos: new THREE.Vector3(0.95, 0.58, 5.55),
    lookAt: new THREE.Vector3(-0.1, 0.02, 0.2),
    exposure: 1.15,
    energy: 0.42,
  },
  {
    t: 0.47,
    headPos: new THREE.Vector3(0.44, -0.22, 0.52),
    headRot: new THREE.Euler(0.15, -0.52, -0.05),
    camPos: new THREE.Vector3(-1.1, 0.38, 4.95),
    lookAt: new THREE.Vector3(0.08, -0.12, 0.3),
    exposure: 1.29,
    energy: 0.67,
  },
  {
    t: 0.73,
    headPos: new THREE.Vector3(-0.22, 0.22, 0.74),
    headRot: new THREE.Euler(-0.11, 0.22, 0.08),
    camPos: new THREE.Vector3(0.55, 0.72, 4.4),
    lookAt: new THREE.Vector3(-0.02, 0.12, 0.3),
    exposure: 1.36,
    energy: 0.83,
  },
  {
    t: 1,
    headPos: new THREE.Vector3(0, 0.3, 0.32),
    headRot: new THREE.Euler(0.03, 0, 0),
    camPos: new THREE.Vector3(0, 0.55, 4.2),
    lookAt: new THREE.Vector3(0, 0.14, 0.35),
    exposure: 1.45,
    energy: 1,
  },
];

function smoothstep(v) {
  return v * v * (3 - 2 * v);
}

function sampleTimeline(alpha) {
  const clamped = THREE.MathUtils.clamp(alpha, 0, 1);
  for (let i = 0; i < timelineKeyframes.length - 1; i++) {
    const a = timelineKeyframes[i];
    const b = timelineKeyframes[i + 1];
    if (clamped >= a.t && clamped <= b.t) {
      const local = smoothstep((clamped - a.t) / (b.t - a.t));
      return {
        headPos: a.headPos.clone().lerp(b.headPos, local),
        headRot: new THREE.Euler(
          THREE.MathUtils.lerp(a.headRot.x, b.headRot.x, local),
          THREE.MathUtils.lerp(a.headRot.y, b.headRot.y, local),
          THREE.MathUtils.lerp(a.headRot.z, b.headRot.z, local)
        ),
        camPos: a.camPos.clone().lerp(b.camPos, local),
        lookAt: a.lookAt.clone().lerp(b.lookAt, local),
        exposure: THREE.MathUtils.lerp(a.exposure, b.exposure, local),
        energy: THREE.MathUtils.lerp(a.energy, b.energy, local),
      };
    }
  }
  return timelineKeyframes.at(-1);
}

const state = {
  scroll: 0,
  cursorTarget: new THREE.Vector2(),
  cursor: new THREE.Vector2(),
};

window.addEventListener("pointermove", (e) => {
  state.cursorTarget.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
});

window.addEventListener("scroll", () => {
  const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
  state.scroll = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
});

const robot = new RobotHeadRig();
const nebula = new NebulaField();
const clock = new THREE.Clock();

function animate() {
  const dt = Math.min(clock.getDelta(), 0.033);
  const time = clock.elapsedTime;

  state.cursor.lerp(state.cursorTarget, 0.08);
  const timeline = sampleTimeline(state.scroll);

  camera.position.lerp(timeline.camPos, 0.07);
  const targetLook = timeline.lookAt.clone();
  targetLook.x += state.cursor.x * 0.16;
  targetLook.y += state.cursor.y * 0.1;
  camera.lookAt(targetLook);

  renderer.toneMappingExposure += (timeline.exposure - renderer.toneMappingExposure) * 0.05;
  lightRig.key.intensity = 1.4 + timeline.energy * 1.0 + Math.sin(time * 0.8) * 0.25;
  lightRig.rim.intensity = 1.1 + timeline.energy * 0.55;
  lightRig.under.intensity = 12 + timeline.energy * 28;
  lightRig.fill.intensity = 8 + timeline.energy * 13;

  robot.update(time, dt, state.cursor, timeline);
  nebula.update(time, timeline);

  telemetryEl.innerHTML = [
    `SCROLL_SYNC    ${(state.scroll * 100).toFixed(1)}%`,
    `ENERGY_LEVEL   ${(timeline.energy * 100).toFixed(0)}%`,
    `CAMERA_Z       ${camera.position.z.toFixed(2)}`,
    `LOOK_VECTOR_X  ${targetLook.x.toFixed(2)}`,
    `EXPOSURE       ${renderer.toneMappingExposure.toFixed(2)}`,
  ].join("<br>");

  diagnosticsEl.innerHTML = [
    `MESH_COMPLEXITY  HIGH`,
    `PARTICLE_COUNT   4200`,
    `POSTFX_CHAIN     BLOOM+FILM`,
    `FRAME_DELTA_MS   ${(dt * 1000).toFixed(2)}`,
    `RIG_STATE        ACTIVE`,
  ].join("<br>");

  composer.render();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

animate();
