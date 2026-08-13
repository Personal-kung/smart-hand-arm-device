import { Handedness, LandmarkObservation, DerivedHandGeometry } from './hand';

export type SensorDataSource = 
  | 'camera' 
  | 'keyboard' 
  | 'imu' 
  | 'flex' 
  | 'strain' 
  | 'contact' 
  | 'vibration' 
  | 'proximity' 
  | 'future_sensor';

export interface SessionMetadata {
  id: string;
  schema_version: string; // e.g. "0.1"
  application_version: string; // e.g. "0.1.0"
  tracking_library: string; // e.g. "@mediapipe/tasks-vision 0.10.14"
  experiment_name: string;
  participant_id: string;
  hand_tested: 'left' | 'right' | 'both';
  created_timestamp_iso: string;
  start_perf_timestamp: number;
  end_perf_timestamp?: number;
  screen_resolution: {
    width: number;
    height: number;
  };
  user_agent: string;
  notes: string;
}

export interface BaseSensorDataPoint {
  id: string;
  timestamp: number; // Monotonic browser timestamp (performance.now())
  relative_timestamp_ms: number; // Time relative to session start
  source: SensorDataSource;
  frame_index?: number;
}

export interface CameraSensorDataPoint extends BaseSensorDataPoint {
  source: 'camera';
  type: 'hand_landmark';
  hand: Handedness;
  confidence: number;
  landmarks: LandmarkObservation[];
  derived_geometry: DerivedHandGeometry;
}

export interface KeyboardSensorDataPoint extends BaseSensorDataPoint {
  source: 'keyboard';
  type: 'keydown' | 'keyup';
  key: string;
  code: string;
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
    capsLock: boolean;
  };
  repeat: boolean;
}

export interface GenericGloveSensorDataPoint extends BaseSensorDataPoint {
  source: 'imu' | 'flex' | 'strain' | 'contact' | 'vibration' | 'proximity' | 'future_sensor';
  type: string;
  sensor_id: string;
  raw_value: number | number[] | Record<string, number>;
  calibrated_value?: number | number[] | Record<string, number>;
  unit?: string;
}

export type SensorDataPoint = 
  | CameraSensorDataPoint 
  | KeyboardSensorDataPoint 
  | GenericGloveSensorDataPoint;

export interface HumanIntendedOutput {
  id: string;
  timestamp: number;
  relative_timestamp_ms: number;
  trial_id?: string;
  intended_action: string; // e.g. "index_finger_tap", "thumb_index_pinch"
  expected_output?: string; // e.g. "KeyA", "Space"
  notes?: string;
}

export interface Trial {
  trial_id: string;
  trial_number: number;
  name: string;
  instructions: string;
  intended_action: string;
  expected_output?: string;
  start_timestamp: number;
  start_relative_ms: number;
  end_timestamp?: number;
  end_relative_ms?: number;
  completed: boolean;
  notes?: string;
}

export interface DatasetSession {
  schema_version: string;
  session: SessionMetadata;
  trials: Trial[];
  sensor_data: SensorDataPoint[];
  human_intended_output: HumanIntendedOutput[];
}
