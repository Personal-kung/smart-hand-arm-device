import { Point3D } from '../types/hand';

export function distance3D(p1: Point3D, p2: Point3D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = p1.z - p2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function subtract3D(p1: Point3D, p2: Point3D): Point3D {
  return {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
    z: p1.z - p2.z
  };
}

export function add3D(p1: Point3D, p2: Point3D): Point3D {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
    z: p1.z + p2.z
  };
}

export function scale3D(p: Point3D, scalar: number): Point3D {
  return {
    x: p.x * scalar,
    y: p.y * scalar,
    z: p.z * scalar
  };
}

export function magnitude3D(v: Point3D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export function normalize3D(v: Point3D): Point3D {
  const mag = magnitude3D(v);
  if (mag < 1e-7) return { x: 0, y: 0, z: 0 };
  return {
    x: v.x / mag,
    y: v.y / mag,
    z: v.z / mag
  };
}

export function dotProduct3D(v1: Point3D, v2: Point3D): number {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

export function crossProduct3D(v1: Point3D, v2: Point3D): Point3D {
  return {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x
  };
}

/**
 * Calculates the 3D angle in degrees formed by three points (pA -> pVertex <- pC).
 */
export function calculateAngleDeg(pA: Point3D, pVertex: Point3D, pC: Point3D): number {
  const v1 = normalize3D(subtract3D(pA, pVertex));
  const v2 = normalize3D(subtract3D(pC, pVertex));
  const dot = Math.max(-1, Math.min(1, dotProduct3D(v1, v2)));
  return (Math.acos(dot) * 180) / Math.PI;
}

/**
 * Maps a joint angle in degrees to a 0-100% flexion percentage estimate.
 * Extended = ~180°, Flexed = ~60° or less depending on joint.
 */
export function flexionPercentage(jointAngleDeg: number, openDeg = 175, closedDeg = 60): number {
  if (jointAngleDeg >= openDeg) return 0;
  if (jointAngleDeg <= closedDeg) return 100;
  const pct = ((openDeg - jointAngleDeg) / (openDeg - closedDeg)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

/**
 * Calculates the palm normal vector using Wrist, Index MCP, and Little MCP.
 */
export function calculatePalmNormal(wrist: Point3D, indexMCP: Point3D, littleMCP: Point3D): Point3D {
  const vIndex = subtract3D(indexMCP, wrist);
  const vLittle = subtract3D(littleMCP, wrist);
  return normalize3D(crossProduct3D(vIndex, vLittle));
}

/**
 * Estimates pitch, yaw, and roll orientation angles in degrees from palm normal and finger direction.
 */
export function calculateOrientation(
  wrist: Point3D,
  middleMCP: Point3D,
  indexMCP: Point3D,
  littleMCP: Point3D
) {
  const palmNormal = calculatePalmNormal(wrist, indexMCP, littleMCP);
  const handDirection = normalize3D(subtract3D(middleMCP, wrist));

  // Pitch: Angle of hand direction with respect to horizon (Y-Z plane)
  const pitch_deg = Math.round((Math.asin(-handDirection.y) * 180) / Math.PI);

  // Yaw: Horizontal heading (X-Z plane)
  const yaw_deg = Math.round((Math.atan2(handDirection.x, -handDirection.z) * 180) / Math.PI);

  // Roll: Rotation around hand axis
  const roll_deg = Math.round((Math.atan2(palmNormal.x, palmNormal.y) * 180) / Math.PI);

  return {
    pitch_deg,
    yaw_deg,
    roll_deg,
    palm_normal: palmNormal
  };
}
