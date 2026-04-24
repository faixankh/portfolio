# ASTRA-9 Sovereign Core

ASTRA-9 is a cinematic 3D portfolio project built around a procedural robotic head, scroll-directed camera movement, interactive motion response, and a layered diagnostic interface.

The project is designed as a visual showcase for front-end engineering, real-time graphics, interaction design, and technical presentation. It avoids external 3D assets by constructing the main subject procedurally in the browser.

## Core features

- procedural robot head assembly with cranium, face shell, jaw pivot, halo, orbital coils, and neural bus cables
- physically based material setup for metal, ceramic, translucent visor, and emissive parts
- scroll-directed scene timeline with multi-stage camera choreography
- pointer-driven servo tracking for subtle interaction feedback
- dynamic lighting states tied to scene progression
- bloom and film-style post-processing
- particle field and atmospheric depth effects
- telemetry and diagnostics HUD for a technical product-reveal feel

## Run locally

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/web/
```

## Project map

```text
web/index.html    canvas stage, HUD layers, and page structure
web/styles.css    visual system, overlays, responsive layout, and typography
web/app.js        render engine, procedural geometry, animation rig, and telemetry
```

## Interaction model

- scrolling controls the scene phase and drives camera/subject transitions
- pointer movement adds small servo offsets to the robot head
- the diagnostics layer updates as the scene state changes

## Portfolio positioning

This repository is meant to work as a compact but high-impact portfolio piece: one page, no heavy setup, and enough implementation detail to show real engineering work behind the visual result.