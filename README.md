# ASTRA-9 SOVEREIGN CORE

An ultra-advanced, cinematic, fully 3D portfolio project focused on a futuristic synthetic robot head with premium visual direction and complex interaction systems.

## Core highlights

- **Procedural high-fidelity robot head rig** (cranium, face assembly, jaw pivot, halo, orbital coils, neural bus cables).
- **Physically based futuristic materials** with metallic, ceramic, translucent visor, and emissive systems.
- **Scroll-directed cinematic timeline** with multi-keyframe camera choreography and smooth interpolation.
- **Live servo micro-tracking** from pointer motion to simulate perception lock and robotic presence.
- **Dynamic lighting rig** with key/rim/under/fill behavior tied to scene “energy state.”
- **Advanced post-processing** with bloom + film pass to deliver premium presentation aesthetics.
- **Nebula particle field** and fog depth for scale and atmospheric complexity.
- **Real-time telemetry + diagnostics HUD** for data-rich cinematic UX.

## Run

```bash
python -m http.server 8000
```

Open:

- `http://localhost:8000/web/`

## Project map

- `web/index.html` — canvas stage, HUD layers, and multi-section story scroll.
- `web/styles.css` — cinematic visual system, overlays, responsive UI, typography.
- `web/app.js` — render engine, procedural modeling, animation rig, scroll director, telemetry.

## Interaction model

- **Scroll** controls the timeline phase (0–100%) and drives 3D positional/rotational transitions.
- **Pointer movement** applies real-time micro servo offsets for perception realism.

## Portfolio positioning

This project is built to look like a flagship product reveal: high-end 3D visuals, advanced motion systems, layered rendering, and engineering depth suitable for premium portfolio presentation.
