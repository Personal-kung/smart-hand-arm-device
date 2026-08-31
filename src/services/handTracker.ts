import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { HandTrackingResult, Handedness, Point3D } from '../types/hand';
import { DerivedGeometryService } from './derivedGeometry';
import { TimestampService } from './timestamp';

export class HandTrackerService {
  private handLandmarker: HandLandmarker | null = null;
  private derivedGeometryService = new DerivedGeometryService();
  private isLoading = false;
  private isInitialized = false;
  private lastVideoTime = -1;

  public async initialize(): Promise<void> {
    if (this.isInitialized || this.isLoading) return;
    this.isLoading = true;

    try {
      // Load WASM binaries from CDN or local fallback
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );

      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU' //" Use 'GPU' if you want to leverage GPU acceleration"
        },
        runningMode: 'VIDEO',
        numHands: 2,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.isInitialized = true;
      console.log('MediaPipe HandLandmarker initialized successfully.');
    } catch (err) {
      console.error('Failed to initialize MediaPipe HandLandmarker:', err);
      throw err;
    } finally {
      this.isLoading = false;
    }
  }

  public detectVideoFrame(videoElement: HTMLVideoElement): HandTrackingResult[] {
    if (!this.handLandmarker || !this.isInitialized) return [];
    if (videoElement.currentTime === this.lastVideoTime || videoElement.paused || videoElement.ended) {
      return [];
    }
    this.lastVideoTime = videoElement.currentTime;

    // Use performance.now() or ensure millisecond integer conversion strictly increasing
    const timestamp = performance.now();
    const results: HandTrackingResult[] = [];

    try {
      const mpResult = this.handLandmarker.detectForVideo(videoElement, timestamp);      

      if (mpResult && mpResult.landmarks && mpResult.landmarks.length > 0) {
        for (let i = 0; i < mpResult.landmarks.length; i++) {
          const normLandmarks: Point3D[] = mpResult.landmarks[i].map(lm => ({
            x: lm.x,
            y: lm.y,
            z: lm.z
          }));

          const worldLandmarks: Point3D[] | undefined = mpResult.worldLandmarks && mpResult.worldLandmarks[i]
            ? mpResult.worldLandmarks[i].map(lm => ({ x: lm.x, y: lm.y, z: lm.z }))
            : undefined;

          // Handedness string label (Left or Right)          
          const handednessCategory = mpResult.handednesses[i]?.[0];
          const handedness: Handedness = handednessCategory?.categoryName === 'Left' ? 'Right' : 'Left';
          const score = handednessCategory?.score || 0.9;

          // Derive wrist-relative landmarks and hand geometry features
          const { landmarks, derived } = this.derivedGeometryService.computeDerivedGeometry(
            handedness,
            normLandmarks,
            worldLandmarks,
            timestamp
          );

          results.push({
            timestamp,
            handedness,
            score,
            landmarks,
            derived_geometry: derived
          });
        }
      }
    } catch (err) {
      console.warn('Frame detection error:', err);
    }

    return results;
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  public getIsLoading(): boolean {
    return this.isLoading;
  }
}
