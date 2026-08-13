/**
 * Standard 21-point hand landmark topology definitions (MediaPipe specification).
 */
export enum HandLandmarkIndex {
  WRIST = 0,
  THUMB_CMC = 1,
  THUMB_MCP = 2,
  THUMB_IP = 3,
  THUMB_TIP = 4,
  INDEX_MCP = 5,
  INDEX_PIP = 6,
  INDEX_DIP = 7,
  INDEX_TIP = 8,
  MIDDLE_MCP = 9,
  MIDDLE_PIP = 10,
  MIDDLE_DIP = 11,
  MIDDLE_TIP = 12,
  RING_MCP = 13,
  RING_PIP = 14,
  RING_DIP = 15,
  RING_TIP = 16,
  LITTLE_MCP = 17,
  LITTLE_PIP = 18,
  LITTLE_DIP = 19,
  LITTLE_TIP = 20,
}

export const LANDMARK_NAMES: Record<number, string> = {
  [HandLandmarkIndex.WRIST]: 'wrist',
  [HandLandmarkIndex.THUMB_CMC]: 'thumb_cmc',
  [HandLandmarkIndex.THUMB_MCP]: 'thumb_mcp',
  [HandLandmarkIndex.THUMB_IP]: 'thumb_ip',
  [HandLandmarkIndex.THUMB_TIP]: 'thumb_tip',
  [HandLandmarkIndex.INDEX_MCP]: 'index_mcp',
  [HandLandmarkIndex.INDEX_PIP]: 'index_pip',
  [HandLandmarkIndex.INDEX_DIP]: 'index_dip',
  [HandLandmarkIndex.INDEX_TIP]: 'index_tip',
  [HandLandmarkIndex.MIDDLE_MCP]: 'middle_mcp',
  [HandLandmarkIndex.MIDDLE_PIP]: 'middle_pip',
  [HandLandmarkIndex.MIDDLE_DIP]: 'middle_dip',
  [HandLandmarkIndex.MIDDLE_TIP]: 'middle_tip',
  [HandLandmarkIndex.RING_MCP]: 'ring_mcp',
  [HandLandmarkIndex.RING_PIP]: 'ring_pip',
  [HandLandmarkIndex.RING_DIP]: 'ring_dip',
  [HandLandmarkIndex.RING_TIP]: 'ring_tip',
  [HandLandmarkIndex.LITTLE_MCP]: 'little_mcp',
  [HandLandmarkIndex.LITTLE_PIP]: 'little_pip',
  [HandLandmarkIndex.LITTLE_DIP]: 'little_dip',
  [HandLandmarkIndex.LITTLE_TIP]: 'little_tip',
};

export type Handedness = 'Left' | 'Right';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface LandmarkObservation {
  index: number;
  name: string;
  normalized: Point3D;
  world?: Point3D; // Metric coordinates in meters (if provided by tracking library)
  wrist_relative: Point3D; // Coordinates relative to wrist origin (0,0,0)
  visibility?: number;
}

export interface SingleFingerAngles {
  mcp_deg: number;
  pip_deg: number;
  dip_deg: number;
}

export interface JointAngles {
  thumb: {
    cmc_deg: number;
    mcp_deg: number;
    ip_deg: number;
  };
  index: SingleFingerAngles;
  middle: SingleFingerAngles;
  ring: SingleFingerAngles;
  little: SingleFingerAngles;
}

export interface FingerFlexion {
  thumb_pct: number;
  index_pct: number;
  middle_pct: number;
  ring_pct: number;
  little_pct: number;
}

export interface FingertipDistances {
  thumb_to_index: number;
  thumb_to_middle: number;
  thumb_to_ring: number;
  thumb_to_little: number;
  index_to_middle: number;
  middle_to_ring: number;
  ring_to_little: number;
}

export interface WristDistances {
  thumb_tip: number;
  index_tip: number;
  middle_tip: number;
  ring_tip: number;
  little_tip: number;
}

export interface FingertipKinematics {
  velocity: Record<string, Point3D>; // m/s or unit/s per fingertip
  speed: Record<string, number>; // Scalar speed
  acceleration: Record<string, Point3D>; // m/s² per fingertip
}

export interface HandOrientation {
  pitch_deg: number;
  yaw_deg: number;
  roll_deg: number;
  palm_normal: Point3D;
}

export interface PalmDimensions {
  width: number;  // Distance between Index MCP and Little MCP
  length: number; // Distance from Wrist to Middle MCP
}

export interface DerivedHandGeometry {
  hand: Handedness;
  joint_angles: JointAngles;
  flexion: FingerFlexion;
  fingertip_distances: FingertipDistances;
  wrist_to_tip_distances: WristDistances;
  kinematics: FingertipKinematics;
  orientation: HandOrientation;
  palm_dimensions: PalmDimensions;
}

export interface HandTrackingResult {
  timestamp: number; // Monotonic browser timestamp
  handedness: Handedness;
  score: number; // Confidence score (0..1)
  landmarks: LandmarkObservation[];
  derived_geometry: DerivedHandGeometry;
}
