import {
  DatasetSession,
  SessionMetadata,
  SensorDataPoint,
  CameraSensorDataPoint,
  KeyboardSensorDataPoint,
  GenericGloveSensorDataPoint,
  HumanIntendedOutput,
  Trial
} from '../types/dataset';
import { HandTrackingResult } from '../types/hand';
import { TimestampService } from './timestamp';

export type RecorderStateCallback = (session: DatasetSession, isRecording: boolean, isPaused: boolean) => void;

export class RecorderService {
  private isRecording = false;
  private isPaused = false;
  private currentFrameIndex = 0;
  private callbacks: RecorderStateCallback[] = [];

  private sessionMetadata: SessionMetadata;
  private sensorDataBuffer: SensorDataPoint[] = [];
  private humanIntendedOutputBuffer: HumanIntendedOutput[] = [];
  private trialsBuffer: Trial[] = [];
  private activeTrial: Trial | null = null;

  constructor() {
    this.sessionMetadata = this.createNewSessionMetadata();
  }

  public createNewSessionMetadata(
    experimentName = 'surface_typing',
    participantId = 'P001',
    handTested: 'left' | 'right' | 'both' = 'right'
  ): SessionMetadata {
    const { perfTime, isoTime } = TimestampService.resetSessionStart();
    const sessionId = `session_${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}_${Math.random().toString(36).substr(2, 4)}`;

    return {
      id: sessionId,
      schema_version: '0.1',
      application_version: '0.1.0',
      tracking_library: '@mediapipe/tasks-vision 0.10.14',
      experiment_name: experimentName,
      participant_id: participantId,
      hand_tested: handTested,
      created_timestamp_iso: isoTime,
      start_perf_timestamp: perfTime,
      screen_resolution: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      user_agent: navigator.userAgent,
      notes: ''
    };
  }

  public startRecording(): void {
    if (this.isRecording) return;
    this.isRecording = true;
    this.isPaused = false;
    this.currentFrameIndex = 0;
    this.sessionMetadata.start_perf_timestamp = TimestampService.now();
    this.notifyState();
  }

  public stopRecording(): void {
    if (!this.isRecording) return;
    if (this.activeTrial) {
      this.endCurrentTrial();
    }
    this.isRecording = false;
    this.isPaused = false;
    this.sessionMetadata.end_perf_timestamp = TimestampService.now();
    this.notifyState();
  }

  public pauseRecording(): void {
    if (!this.isRecording) return;
    this.isPaused = !this.isPaused;
    this.notifyState();
  }

  public resetSession(
    experimentName = 'surface_typing',
    participantId = 'P001',
    handTested: 'left' | 'right' | 'both' = 'right'
  ): void {
    this.stopRecording();
    this.sessionMetadata = this.createNewSessionMetadata(experimentName, participantId, handTested);
    this.sensorDataBuffer = [];
    this.humanIntendedOutputBuffer = [];
    this.trialsBuffer = [];
    this.activeTrial = null;
    this.currentFrameIndex = 0;
    this.notifyState();
  }

  /**
   * Records camera hand tracking observations into Table 1: sensor_data.
   */
  public recordCameraFrame(handResults: HandTrackingResult[]): void {
    if (!this.isRecording || this.isPaused || handResults.length === 0) return;
    this.currentFrameIndex++;

    handResults.forEach(res => {
      const dataPoint: CameraSensorDataPoint = {
        id: `cam_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        timestamp: res.timestamp,
        relative_timestamp_ms: TimestampService.getRelativeMs(res.timestamp),
        source: 'camera',
        type: 'hand_landmark',
        frame_index: this.currentFrameIndex,
        hand: res.handedness,
        confidence: parseFloat(res.score.toFixed(3)),
        landmarks: res.landmarks,
        derived_geometry: res.derived_geometry
      };
      this.sensorDataBuffer.push(dataPoint);
    });

    this.notifyState();
  }

  /**
   * Records keyboard events into Table 1: sensor_data.
   */
  public recordKeyboardEvent(kbdPoint: KeyboardSensorDataPoint): void {
    if (!this.isRecording || this.isPaused) return;
    this.sensorDataBuffer.push(kbdPoint);
    this.notifyState();
  }

  /**
   * Generic recording method for future glove sensors (IMU, Flex, Contact, etc.).
   */
  public recordGloveSensorData(glovePoint: GenericGloveSensorDataPoint): void {
    if (!this.isRecording || this.isPaused) return;
    this.sensorDataBuffer.push(glovePoint);
    this.notifyState();
  }

  /**
   * Records ground truth human intention into Table 2: human_intended_output.
   */
  public logHumanIntention(intendedAction: string, expectedOutput?: string, notes?: string): void {
    const timestamp = TimestampService.now();
    const intentionPoint: HumanIntendedOutput = {
      id: `intent_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp,
      relative_timestamp_ms: TimestampService.getRelativeMs(timestamp),
      trial_id: this.activeTrial ? this.activeTrial.trial_id : undefined,
      intended_action: intendedAction,
      expected_output: expectedOutput,
      notes: notes || ''
    };
    this.humanIntendedOutputBuffer.push(intentionPoint);
    this.notifyState();
  }

  /**
   * Starts a structured trial.
   */
  public startNewTrial(name: string, instructions: string, intendedAction: string, expectedOutput?: string): Trial {
    if (this.activeTrial) {
      this.endCurrentTrial();
    }

    const timestamp = TimestampService.now();
    const trialNumber = this.trialsBuffer.length + 1;
    const trial: Trial = {
      trial_id: `trial_${trialNumber}_${Math.random().toString(36).substr(2, 4)}`,
      trial_number: trialNumber,
      name,
      instructions,
      intended_action: intendedAction,
      expected_output: expectedOutput,
      start_timestamp: timestamp,
      start_relative_ms: TimestampService.getRelativeMs(timestamp),
      completed: false
    };

    this.activeTrial = trial;
    this.trialsBuffer.push(trial);

    // Automatically log intention for start of trial
    this.logHumanIntention(intendedAction, expectedOutput, `Trial #${trialNumber} started: ${name}`);
    this.notifyState();
    return trial;
  }

  public endCurrentTrial(notes?: string): void {
    if (!this.activeTrial) return;
    const timestamp = TimestampService.now();
    this.activeTrial.end_timestamp = timestamp;
    this.activeTrial.end_relative_ms = TimestampService.getRelativeMs(timestamp);
    this.activeTrial.completed = true;
    if (notes) this.activeTrial.notes = notes;

    this.notifyState();
    this.activeTrial = null;
  }

  public markEvent(eventName: string): void {
    this.logHumanIntention(`MARK: ${eventName}`, undefined, 'Manual marker');
  }

  public updateSessionMetadata(updates: Partial<SessionMetadata>): void {
    this.sessionMetadata = { ...this.sessionMetadata, ...updates };
    this.notifyState();
  }

  public getSession(): DatasetSession {
    return {
      schema_version: '0.1',
      session: this.sessionMetadata,
      trials: this.trialsBuffer,
      sensor_data: this.sensorDataBuffer,
      human_intended_output: this.humanIntendedOutputBuffer
    };
  }

  public loadSession(importedSession: DatasetSession): void {
    this.stopRecording();
    this.sessionMetadata = importedSession.session;
    this.trialsBuffer = importedSession.trials || [];
    this.sensorDataBuffer = importedSession.sensor_data || [];
    this.humanIntendedOutputBuffer = importedSession.human_intended_output || [];
    this.activeTrial = null;
    this.notifyState();
  }

  public subscribe(callback: RecorderStateCallback): () => void {
    this.callbacks.push(callback);
    callback(this.getSession(), this.isRecording, this.isPaused);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  private notifyState(): void {
    const session = this.getSession();
    this.callbacks.forEach(cb => cb(session, this.isRecording, this.isPaused));
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public getActiveTrial(): Trial | null {
    return this.activeTrial;
  }

  // Add this method inside your RecorderService class in src/services/recorder.ts:
  public downloadSessionJSON(filename = `dataset_session_${this.sessionMetadata.id}.json`): void {
    const sessionData = this.getSession();
    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
