import {
  HandLandmarkIndex,
  LandmarkObservation,
  Handedness,
  DerivedHandGeometry,
  Point3D,
  LANDMARK_NAMES
} from '../types/hand';
import {
  distance3D,
  subtract3D,
  calculateAngleDeg,
  flexionPercentage,
  calculateOrientation
} from '../utils/math';

interface KinematicsHistoryEntry {
  timestamp: number;
  positions: Record<string, Point3D>; // fingertip name -> 3D position
  velocities?: Record<string, Point3D>; // fingertip name -> 3D velocity
}

export class DerivedGeometryService {
  private kinematicsHistory: Record<Handedness, KinematicsHistoryEntry[]> = {
    Left: [],
    Right: []
  };

  /**
   * Main calculation function to derive hand geometry from raw landmarks.
   */
  public computeDerivedGeometry(
    hand: Handedness,
    rawNormalizedLandmarks: Point3D[],
    rawWorldLandmarks: Point3D[] | undefined,
    timestamp: number
  ): { landmarks: LandmarkObservation[]; derived: DerivedHandGeometry } {
    const wristNormalized = rawNormalizedLandmarks[HandLandmarkIndex.WRIST];
    const wristWorld = rawWorldLandmarks ? rawWorldLandmarks[HandLandmarkIndex.WRIST] : undefined;

    // 1. Convert landmarks to Wrist-Relative frame (Wrist is (0,0,0))
    const landmarks: LandmarkObservation[] = rawNormalizedLandmarks.map((lm, idx) => {
      const worldLm = rawWorldLandmarks ? rawWorldLandmarks[idx] : undefined;
      // If world landmarks exist, use world metric coordinates for wrist-relative; else use normalized coordinates
      const refWrist = wristWorld || wristNormalized;
      const refLm = worldLm || lm;

      const wristRelative = subtract3D(refLm, refWrist);

      return {
        index: idx,
        name: LANDMARK_NAMES[idx] || `lm_${idx}`,
        normalized: lm,
        world: worldLm,
        wrist_relative: wristRelative
      };
    });

    // Extract reference points for geometry math (using world landmarks if available for metric accuracy)
    const getPt = (index: HandLandmarkIndex): Point3D => {
      return rawWorldLandmarks ? rawWorldLandmarks[index] : rawNormalizedLandmarks[index];
    };

    const wrist = getPt(HandLandmarkIndex.WRIST);

    // Thumb points
    const thumbCMC = getPt(HandLandmarkIndex.THUMB_CMC);
    const thumbMCP = getPt(HandLandmarkIndex.THUMB_MCP);
    const thumbIP = getPt(HandLandmarkIndex.THUMB_IP);
    const thumbTip = getPt(HandLandmarkIndex.THUMB_TIP);

    // Index points
    const indexMCP = getPt(HandLandmarkIndex.INDEX_MCP);
    const indexPIP = getPt(HandLandmarkIndex.INDEX_PIP);
    const indexDIP = getPt(HandLandmarkIndex.INDEX_DIP);
    const indexTip = getPt(HandLandmarkIndex.INDEX_TIP);

    // Middle points
    const middleMCP = getPt(HandLandmarkIndex.MIDDLE_MCP);
    const middlePIP = getPt(HandLandmarkIndex.MIDDLE_PIP);
    const middleDIP = getPt(HandLandmarkIndex.MIDDLE_DIP);
    const middleTip = getPt(HandLandmarkIndex.MIDDLE_TIP);

    // Ring points
    const ringMCP = getPt(HandLandmarkIndex.RING_MCP);
    const ringPIP = getPt(HandLandmarkIndex.RING_PIP);
    const ringDIP = getPt(HandLandmarkIndex.RING_DIP);
    const ringTip = getPt(HandLandmarkIndex.RING_TIP);

    // Little points
    const littleMCP = getPt(HandLandmarkIndex.LITTLE_MCP);
    const littlePIP = getPt(HandLandmarkIndex.LITTLE_PIP);
    const littleDIP = getPt(HandLandmarkIndex.LITTLE_DIP);
    const littleTip = getPt(HandLandmarkIndex.LITTLE_TIP);

    // 2. Joint Angles (Estimated degrees)
    const jointAngles = {
      thumb: {
        cmc_deg: Math.round(calculateAngleDeg(wrist, thumbCMC, thumbMCP)),
        mcp_deg: Math.round(calculateAngleDeg(thumbCMC, thumbMCP, thumbIP)),
        ip_deg: Math.round(calculateAngleDeg(thumbMCP, thumbIP, thumbTip)),
      },
      index: {
        mcp_deg: Math.round(calculateAngleDeg(wrist, indexMCP, indexPIP)),
        pip_deg: Math.round(calculateAngleDeg(indexMCP, indexPIP, indexDIP)),
        dip_deg: Math.round(calculateAngleDeg(indexPIP, indexDIP, indexTip)),
      },
      middle: {
        mcp_deg: Math.round(calculateAngleDeg(wrist, middleMCP, middlePIP)),
        pip_deg: Math.round(calculateAngleDeg(middleMCP, middlePIP, middleDIP)),
        dip_deg: Math.round(calculateAngleDeg(middlePIP, middleDIP, middleTip)),
      },
      ring: {
        mcp_deg: Math.round(calculateAngleDeg(wrist, ringMCP, ringPIP)),
        pip_deg: Math.round(calculateAngleDeg(ringMCP, ringPIP, ringDIP)),
        dip_deg: Math.round(calculateAngleDeg(ringPIP, ringDIP, ringTip)),
      },
      little: {
        mcp_deg: Math.round(calculateAngleDeg(wrist, littleMCP, littlePIP)),
        pip_deg: Math.round(calculateAngleDeg(littleMCP, littlePIP, littleDIP)),
        dip_deg: Math.round(calculateAngleDeg(littlePIP, littleDIP, littleTip)),
      },
    };

    // 3. Flexion Percentages
    const flexion = {
      thumb_pct: flexionPercentage(jointAngles.thumb.mcp_deg, 160, 90),
      index_pct: flexionPercentage(jointAngles.index.pip_deg, 175, 50),
      middle_pct: flexionPercentage(jointAngles.middle.pip_deg, 175, 50),
      ring_pct: flexionPercentage(jointAngles.ring.pip_deg, 175, 50),
      little_pct: flexionPercentage(jointAngles.little.pip_deg, 175, 50),
    };

    // 4. Inter-Fingertip Distances (Euclidean)
    const fingertipDistances = {
      thumb_to_index: parseFloat(distance3D(thumbTip, indexTip).toFixed(4)),
      thumb_to_middle: parseFloat(distance3D(thumbTip, middleTip).toFixed(4)),
      thumb_to_ring: parseFloat(distance3D(thumbTip, ringTip).toFixed(4)),
      thumb_to_little: parseFloat(distance3D(thumbTip, littleTip).toFixed(4)),
      index_to_middle: parseFloat(distance3D(indexTip, middleTip).toFixed(4)),
      middle_to_ring: parseFloat(distance3D(middleTip, ringTip).toFixed(4)),
      ring_to_little: parseFloat(distance3D(ringTip, littleTip).toFixed(4)),
    };

    // 5. Wrist to Fingertip Distances
    const wristToTipDistances = {
      thumb_tip: parseFloat(distance3D(wrist, thumbTip).toFixed(4)),
      index_tip: parseFloat(distance3D(wrist, indexTip).toFixed(4)),
      middle_tip: parseFloat(distance3D(wrist, middleTip).toFixed(4)),
      ring_tip: parseFloat(distance3D(wrist, ringTip).toFixed(4)),
      little_tip: parseFloat(distance3D(wrist, littleTip).toFixed(4)),
    };

    // 6. Kinematics (Velocity & Acceleration calculation)
    const currentFingertips: Record<string, Point3D> = {
      thumb: thumbTip,
      index: indexTip,
      middle: middleTip,
      ring: ringTip,
      little: littleTip,
    };

    const kinematics = this.computeKinematics(hand, currentFingertips, timestamp);

    // 7. Hand Orientation (Estimated Pitch, Yaw, Roll, Palm Normal)
    const orientation = calculateOrientation(wrist, middleMCP, indexMCP, littleMCP);

    // 8. Palm Dimensions
    const palmDimensions = {
      width: parseFloat(distance3D(indexMCP, littleMCP).toFixed(4)),
      length: parseFloat(distance3D(wrist, middleMCP).toFixed(4)),
    };

    const derived: DerivedHandGeometry = {
      hand,
      joint_angles: jointAngles,
      flexion,
      fingertip_distances: fingertipDistances,
      wrist_to_tip_distances: wristToTipDistances,
      kinematics,
      orientation,
      palm_dimensions: palmDimensions,
    };

    return { landmarks, derived };
  }

  private computeKinematics(
    hand: Handedness,
    currentFingertips: Record<string, Point3D>,
    timestamp: number
  ) {
    const history = this.kinematicsHistory[hand];
    const velocity: Record<string, Point3D> = {
      thumb: { x: 0, y: 0, z: 0 },
      index: { x: 0, y: 0, z: 0 },
      middle: { x: 0, y: 0, z: 0 },
      ring: { x: 0, y: 0, z: 0 },
      little: { x: 0, y: 0, z: 0 },
    };
    const speed: Record<string, number> = {
      thumb: 0,
      index: 0,
      middle: 0,
      ring: 0,
      little: 0,
    };
    const acceleration: Record<string, Point3D> = {
      thumb: { x: 0, y: 0, z: 0 },
      index: { x: 0, y: 0, z: 0 },
      middle: { x: 0, y: 0, z: 0 },
      ring: { x: 0, y: 0, z: 0 },
      little: { x: 0, y: 0, z: 0 },
    };

    if (history.length > 0) {
      const prevEntry = history[history.length - 1];
      const dt = (timestamp - prevEntry.timestamp) / 1000; // convert ms to seconds

      if (dt > 0.001 && dt < 0.5) {
        // Calculate velocity v = (p_now - p_prev) / dt
        Object.keys(currentFingertips).forEach((finger) => {
          const pNow = currentFingertips[finger];
          const pPrev = prevEntry.positions[finger];
          if (pNow && pPrev) {
            const vx = (pNow.x - pPrev.x) / dt;
            const vy = (pNow.y - pPrev.y) / dt;
            const vz = (pNow.z - pPrev.z) / dt;

            velocity[finger] = {
              x: parseFloat(vx.toFixed(4)),
              y: parseFloat(vy.toFixed(4)),
              z: parseFloat(vz.toFixed(4)),
            };
            speed[finger] = parseFloat(Math.sqrt(vx * vx + vy * vy + vz * vz).toFixed(4));

            // Calculate acceleration a = (v_now - v_prev) / dt
            if (prevEntry.velocities && prevEntry.velocities[finger]) {
              const vPrev = prevEntry.velocities[finger];
              acceleration[finger] = {
                x: parseFloat(((vx - vPrev.x) / dt).toFixed(4)),
                y: parseFloat(((vy - vPrev.y) / dt).toFixed(4)),
                z: parseFloat(((vz - vPrev.z) / dt).toFixed(4)),
              };
            }
          }
        });
      }
    }

    // Push new entry to history (keep last 10 entries)
    history.push({
      timestamp,
      positions: currentFingertips,
      velocities: velocity,
    });
    if (history.length > 10) history.shift();

    return { velocity, speed, acceleration };
  }

  public clearHistory(): void {
    this.kinematicsHistory = { Left: [], Right: [] };
  }
}
