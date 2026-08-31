# Comprehensive Context Guide: Human Operating System (hOS) Interface / Glove Keyboard (Prototype 0)

This document is the ultimate source of truth for this project, designed to be passed as context to Large Language Models (LLMs) working on feature additions, refactoring, or documentation.

---

## 1. Core Vision & The "hOS" Concept
The project represents a fundamental shift from **monitoring the body** (like a smartwatch) to **enabling the body** (smart apparel). It is the **Human Operating System (hOS) Interface**, focusing on capturing high-degree-of-freedom movements of the human hand and arm.

### 1.1 The 2-Part Modular System
1. **The Glove (End-Effector):** Functions like a smartwatch but mapped to the hand's anatomy. Captures sub-millimeter joint tracking.
2. **The Sleeve (Processor & Power Hub):** Adds battery life, high-torque haptics, and specialized industrial modules via a physical "Rail" system.

### 1.2 Use Cases & Scenarios
- **Data & Diagnostics (Medical):** Early detection of tremors, rehabilitation tracking.
- **Human Interface (Office/Creative):** "Hand-Mouse" and slider, eliminating the standard mouse, 3D model navigation.
- **Input/Output (Logistics):** Palm-integrated scanner/display, allowing package scanning without dropping items.
- **Communication (Assistive):** Sign language translation to speech/text.
- **Storage/Utility:** "Smart Wallet" with haptic guidance.
- **Environmental:** Active thermal modulation (heating/cooling).

---

## 2. Prototype 0: Glove Keyboard Research Workbench
Currently, the codebase is a **browser-first research application** designed to record synchronized human hand movement, keyboard/mobile interaction, and future wearable glove sensor data. 

**Ultimate Goal for Prototype 0:** Build a general-purpose wearable hand-interface dataset to eventually infer meaningful actions for typing (desktop/laptop/mobile) and gesture control.
**Design Philosophy:** Record raw movement rather than aggressively filtering events. Later stages will determine which movements are meaningful.

### 2.1 Software Architecture & Tech Stack
- **Framework:** Vite + React 18 + TypeScript.
- **Hand Tracking:** Google MediaPipe Tasks Vision (`@mediapipe/tasks-vision` v0.10.14) - HandLandmarker (21 3D landmarks). **Rule:** Wrist (Landmark 0) is strictly the origin `(0,0,0)`. Thumb is never the origin.
- **Styling:** Custom Modern CSS3 (Dark mode, glassmorphic panels, Canvas overlays).
- **Icons:** `lucide-react`.
- **Clock Synchronization:** Uses a unified monotonic timeline via `performance.now()` for sub-millisecond accuracy. Records absolute and relative timestamps.
- **Privacy:** 100% local client-side processing. No video uploaded. Only numerical coordinates are stored.

### 2.2 Dataset Architecture (Two-Table Strategy)
Research data is logged in two parallel structures to allow for later machine learning correlation.
1. **`sensor_data` (Objective Observations):**
   - Observations tagged with a `source` (camera, keyboard, imu, flex, strain, contact, vibration, proximity).
   - Contains numerical arrays, joint angles, derived geometry.
2. **`human_intended_output` (Ground-Truth Intention):**
   - What the user meant to do (e.g., `intended_action: "index_finger_tap"`, `expected_output: "KeyA"`).

---

## 3. Hardware Prototype Specifications (Japan-Based Prototyping)
The physical prototype is optimized for local sourcing in Japan (Iizuka, Fukuoka).

### 3.1 Bill of Materials Strategy (~¥34,000 - ¥40,000)
- **Controller:** Seeed Studio XIAO ESP32-S3 (or ESP32-S3-DevKitC-1-N8R8 for larger prototyping). Target sampling at 250Hz - 500Hz.
- **IMU:** 5x BNO085 IMUs (for high-fidelity tracking) or MPU-6050 for baseline dorsal tracking.
- **Finger Sensors:** 
  - 5x Resistive flex sensors (2.2-inch, dorsal side) to measure finger curvature.
  - 5x FSR contact/force sensors to detect mechanical reaction without obstructing fingertips.
  - 1x Rotary angle sensor/potentiometer for Index PIP (as experimental ground-truth reference).
- **Haptics:** Small 3V vibration motor on the wrist (driven by logic-level N-MOSFET).
- **Textiles:** Compression gear (laminated with Heat-Transfer Vinyl) to protect silicone wiring. Uses Meander (S-curve) wiring patterns.
- **Connectivity:** USB wired connection to the browser workbench initially (wireless/BLE deferred).

### 3.2 User Requirements (Mechanical Constraints)
- **Hand:** Right hand only for Prototype 0 (must be mirrorable for left hand later).
- **Freedom:** Full hand agility required. Fingertips must remain completely free for tactile feedback. Palm minimally obstructed.
- **Exoskeleton Location:** Dorsal (back of hand) preferred. Velcro/adjustable straps.

---

## 4. Current Codespace Structure
```text
smart-hand-arm-device/
├── package.json               # Dependencies: React 18, MediaPipe, Three.js, Lucide-React
├── vite.config.ts             # Vite configuration
├── index.html                 # Entry point
├── dataset_schema.json        # Formal JSON schema for the two-table dataset
├── example_dataset.json       # Valid sample
├── src/
│   ├── main.tsx & App.tsx     # Application bootstrap and layout container
│   ├── index.css              # Dark theme CSS
│   ├── types/                 # TS Types: dataset.ts, hand.ts, experiment.ts
│   ├── services/              # Logic layer
│   │   ├── timestamp.ts       # Unified monotonic clock
│   │   ├── camera.ts          # MediaStream video capture
│   │   ├── handTracker.ts     # MediaPipe HandLandmarker wrapper
│   │   ├── derivedGeometry.ts # Joint angles, distances, velocities
│   │   ├── keyboard.ts        # Browser event capture
│   │   ├── recorder.ts        # Two-table dataset recorder
│   │   └── exporter.ts        # JSON & CSV I/O
│   ├── components/            # UI Layer (React components for panels, visualization)
│   └── utils/
│       └── math.ts            # 3D vector math
```

## 5. Strategic Next Steps & LLM Instructions
- **Rule 1 (Data):** Do not discard information before the first research datasets establish which signals are actually useful. Log everything.
- **Rule 2 (Browser Keys):** Browser keyboard events only work when focused. This is a known limitation.
- **Focus Areas for Future Features:**
  - Real-time event detection derived from raw data (e.g., inferring a pinch, tap, or flight-time).
  - Integration of Web Serial API to parse timestamped raw sensor frames from the ESP32 into the `sensor_data` table alongside camera data.
  - Building visual analytics tools inside the browser to replay and scrub through the multi-modal dataset.
