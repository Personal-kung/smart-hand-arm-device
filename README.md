# Glove Keyboard — Prototype 0 Research Workbench

A browser-first research application designed for real-time 3D hand tracking, physical keyboard event capture, derived geometry calculation, and structured two-table dataset recording. This software platform acts as Prototype 0 for developing an ambidextrous wearable glove-based human-computer interface.

---

## Architecture Overview

```
                                  +-----------------------+
                                  |   Webcam Video Feed   |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------------------+
                                  | MediaPipe Landmarker  |
                                  | (21 3D Hand Points)   |
                                  +-----------+-----------+
                                              |
                                              v
+-----------------------+         +-----------------------+
| Physical Keyboard     |         | Derived Hand Geometry |
| (keydown / keyup)     |         | (Wrist Origin 0,0,0)  |
+-----------+-----------+         +-----------+-----------+
            |                                 |
            +----------------+----------------+
                             |
                             v
               +-----------------------------+
               |  Unified Monotonic Timeline |
               |     (performance.now())     |
               +--------------+--------------+
                              |
                              v
               +-----------------------------+
               |  Two-Table Dataset Recorder |
               | - Table 1: sensor_data      |
               | - Table 2: human_intended   |
               +--------------+--------------+
                              |
                              v
               +-----------------------------+
               |  JSON / CSV Export & Replay |
               +-----------------------------+
```

---

## Tech Stack & Justification

| Technology | Selection | Justification |
| :--- | :--- | :--- |
| **Framework** | Vite + React 18 (TypeScript) | High performance client-side rendering, strict schema typing, zero backend dependencies. |
| **Hand Tracking** | `@mediapipe/tasks-vision` (v0.10.14) | Google's official MediaPipe Vision WASM/WebGL solution. Provides 21 3D landmarks (`x, y, z`) and 3D world coordinates in meters. Runs locally without cloud APIs. |
| **Styling** | Custom Modern CSS3 | Rich dark-mode UI, glassmorphic panels, dynamic HTML5 Canvas overlays, and responsive grid layout. |
| **Icons** | `lucide-react` | Clean SVG research instrumentation iconography. |

---

## Selected Tracking Library Details

- **Library**: `@mediapipe/tasks-vision` (v0.10.14)
- **Model**: `HandLandmarker` (`hand_landmarker.task`)
- **Topology**: Standard 21-point hand landmark topology:
  - `0`: Wrist
  - `1-4`: Thumb (CMC, MCP, IP, Tip)
  - `5-8`: Index finger (MCP, PIP, DIP, Tip)
  - `9-12`: Middle finger (MCP, PIP, DIP, Tip)
  - `13-16`: Ring finger (MCP, PIP, DIP, Tip)
  - `17-20`: Little finger (MCP, PIP, DIP, Tip)
- **Reference Frame Rule**: The **Wrist** (Landmark 0) is strictly enforced as the coordinate origin $(0,0,0)$. The thumb is never used as the origin.

---

## Browser Compatibility

- **Google Chrome / Brave / Chromium** (Recommended): Full support for WebGL, WebAssembly, and High-Resolution Timers (`performance.now()`).
- **Mozilla Firefox**: Supported (ensure camera permissions are granted).
- **Apple Safari**: Supported (macOS/iOS).

---

## Project Structure

```
smart-hand-arm-device/
├── package.json               # Node.js dependencies & scripts
├── tsconfig.json              # TypeScript compiler configuration
├── vite.config.ts             # Vite bundler configuration
├── index.html                 # Main HTML entry point
├── dataset_schema.json        # Formal JSON Schema (v0.1) for research dataset
├── example_dataset.json        # Valid sample dataset JSON matching schema
├── README.md                  # Comprehensive documentation
└── src/
    ├── main.tsx               # Application bootstrap
    ├── App.tsx                # Main container layout
    ├── index.css              # Dark theme CSS design system
    ├── types/
    │   ├── dataset.ts         # Schema types (Session, SensorData, Intention, Trial)
    │   ├── hand.ts            # Hand landmark topology & derived geometry types
    │   └── experiment.ts      # Experiment protocols & presets
    ├── services/
    │   ├── timestamp.ts       # Unified monotonic clock (performance.now())
    │   ├── camera.ts          # MediaStream video capture & camera picker
    │   ├── handTracker.ts     # MediaPipe HandLandmarker wrapper
    │   ├── derivedGeometry.ts # Joint angles, flexion %, 3D distances, velocity
    │   ├── keyboard.ts        # Browser event capture (key vs code preservation)
    │   ├── recorder.ts        # Two-table dataset recorder & trial runner
    │   └── exporter.ts        # JSON & CSV export / session import parser
    ├── components/
    │   ├── Header.tsx         # App status bar & active state badges
    │   ├── CameraView.tsx     # Webcam video + 21-landmark Canvas skeleton
    │   ├── HandDataPanel.tsx  # Real-time joint angles, flexion bars, distances
    │   ├── KeyboardPanel.tsx  # Key event inspector & visual QWERTY keyboard
    │   ├── RecordingPanel.tsx # Recording controls & ground truth intention logger
    │   ├── ExperimentPanel.tsx# Structured trial prompt runner
    │   ├── DataPanel.tsx      # Export JSON/CSV, clear data, import session
    │   ├── TimelineView.tsx   # Multi-track synchronized timeline visualizer
    │   └── ReplayModal.tsx    # Interactive session replay player with scrubber
    └── utils/
        └── math.ts            # 3D vector math, Euclidean distance, joint angles
```

---

## Installation & Running Instructions

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Setup Steps

1. **Clone & Install Dependencies**:
   ```bash
   cd smart-hand-arm-device
   npm install
   ```

2. **Run Local Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser Interface**:
   Open the local URL output by Vite (usually `http://localhost:3000` or `http://localhost:5173`).

---

## Camera Permissions & Privacy

- Camera data is processed **100% locally** in your browser using client-side WebAssembly.
- Video streams are **never** recorded, uploaded, or transmitted to external servers.
- The application stores **numerical landmark coordinates**, derived geometry, and timestamps only.
- Ensure your browser permits webcam access when prompted.

---

## Keyboard Limitations Notice

> [!WARNING]
> Standard web browser security limits keyboard event capture to when the application tab/window is **focused and active**. Browsers do not permit OS-level global keyboard hooks without native browser extension helper binaries. Keep the Workbench window active during recording sessions.

---

## Timestamp Synchronization Mechanism

Synchronizing data across multiple sensors is critical for research data integrity.

1. **Monotonic Base Clock**: All observations utilize `performance.now()`, which returns high-resolution monotonic timestamps (sub-millisecond accuracy) unaffected by system clock adjustments.
2. **Session Zero Reference**: When a recording session starts, `TimestampService` captures `start_perf_timestamp`.
3. **Relative Time Axis**: Every camera frame, keydown/keyup event, and ground-truth intention records both `timestamp` (absolute `performance.now()`) and `relative_timestamp_ms` (`timestamp - start_perf_timestamp`).
4. **Future Glove Microcontroller Synchronization**: When physical glove microcontrollers (ESP32/nRF52/Teensy) connect via Web Serial or USB HID, the MCU sends a millisecond counter tick. The workbench maps MCU hardware timestamps to the browser timeline using periodic heartbeat sync packets.

---

## Future Glove Sensor Compatibility

The dataset architecture uses a **two-table research design** (`sensor_data` and `human_intended_output`). Table 1 accepts observations tagged with a `source` enum:

- `camera` (Camera hand landmarks & derived geometry)
- `keyboard` (Physical keyboard events)
- `imu` (Glove wrist/finger IMU orientation & accelerations)
- `flex` (Flex sensor joint bend readings)
- `strain` (Strain gauge deflection readings)
- `contact` (Nail-side impact & mechanical contact sensors)
- `vibration` (Piezo vibration tap sensors)
- `proximity` (Optical/capacitive finger proximity)

When glove hardware is connected in future phases via Web Serial or WebUSB, sensor frames will stream directly into the `sensor_data` array alongside camera and keyboard points without modifying the schema or UI architecture.

---

## Dataset Format (Two-Table Architecture)

### Table 1: `sensor_data` (Objective Observations)
```json
{
  "timestamp": 12516.6,
  "relative_timestamp_ms": 471.48,
  "source": "camera",
  "type": "hand_landmark",
  "hand": "Right",
  "confidence": 0.98,
  "landmarks": [ ... ],
  "derived_geometry": { ... }
}
```

### Table 2: `human_intended_output` (Ground-Truth Intention)
```json
{
  "timestamp": 12500.0,
  "relative_timestamp_ms": 454.88,
  "intended_action": "index_finger_tap",
  "expected_output": "KeyA",
  "notes": "Trial #1"
}
```

---

## Known Limitations

1. **Depth Estimation**: Camera `z` coordinate is derived from MediaPipe relative depth heuristics rather than true metric 3D depth cameras (e.g. Intel RealSense).
2. **Single Camera Occlusion**: Finger tracking can degrade when fingers are occluded from camera line-of-sight (e.g., thumb tucked under palm).
3. **Browser Key Capture**: Keyboard events are captured only while the browser tab remains active.

---

## Recommended Next Experiments

1. **Surface Tap Flight Time vs Contact Profile**: Record high-frequency index finger surface taps to measure the time offset between camera-observed finger descent and physical keyboard event triggering.
2. **Finger-to-Finger Pinch Geometry**: Measure inter-fingertip distance thresholds for thumb-to-index, thumb-to-middle, thumb-to-ring, and thumb-to-pinky contact gestures.
3. **Typing Surface Flexibility**: Compare surface tap kinematics across hard desk surfaces vs soft mousepads.
