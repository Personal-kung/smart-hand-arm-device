import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { CameraService, CameraDevice } from '../services/camera';
import { HandTrackerService } from '../services/handTracker';
import { HandTrackingResult, HandLandmarkIndex } from '../types/hand';

interface CameraViewProps {
  cameraService: CameraService;
  handTracker: HandTrackerService;
  onHandResults: (results: HandTrackingResult[], fps: number) => void;
  onCameraStateChange: (isActive: boolean) => void;
}

// Landmark connections matching standard 21-point topology
const HAND_CONNECTIONS = [
  // Thumb
  [HandLandmarkIndex.WRIST, HandLandmarkIndex.THUMB_CMC],
  [HandLandmarkIndex.THUMB_CMC, HandLandmarkIndex.THUMB_MCP],
  [HandLandmarkIndex.THUMB_MCP, HandLandmarkIndex.THUMB_IP],
  [HandLandmarkIndex.THUMB_IP, HandLandmarkIndex.THUMB_TIP],

  // Index finger
  [HandLandmarkIndex.WRIST, HandLandmarkIndex.INDEX_MCP],
  [HandLandmarkIndex.INDEX_MCP, HandLandmarkIndex.INDEX_PIP],
  [HandLandmarkIndex.INDEX_PIP, HandLandmarkIndex.INDEX_DIP],
  [HandLandmarkIndex.INDEX_DIP, HandLandmarkIndex.INDEX_TIP],

  // Middle finger
  [HandLandmarkIndex.WRIST, HandLandmarkIndex.MIDDLE_MCP],
  [HandLandmarkIndex.MIDDLE_MCP, HandLandmarkIndex.MIDDLE_PIP],
  [HandLandmarkIndex.MIDDLE_PIP, HandLandmarkIndex.MIDDLE_DIP],
  [HandLandmarkIndex.MIDDLE_DIP, HandLandmarkIndex.MIDDLE_TIP],

  // Ring finger
  [HandLandmarkIndex.WRIST, HandLandmarkIndex.RING_MCP],
  [HandLandmarkIndex.RING_MCP, HandLandmarkIndex.RING_PIP],
  [HandLandmarkIndex.RING_PIP, HandLandmarkIndex.RING_DIP],
  [HandLandmarkIndex.RING_DIP, HandLandmarkIndex.RING_TIP],

  // Little finger
  [HandLandmarkIndex.WRIST, HandLandmarkIndex.LITTLE_MCP],
  [HandLandmarkIndex.LITTLE_MCP, HandLandmarkIndex.LITTLE_PIP],
  [HandLandmarkIndex.LITTLE_PIP, HandLandmarkIndex.LITTLE_DIP],
  [HandLandmarkIndex.LITTLE_DIP, HandLandmarkIndex.LITTLE_TIP],

  // Palm base connection
  [HandLandmarkIndex.INDEX_MCP, HandLandmarkIndex.MIDDLE_MCP],
  [HandLandmarkIndex.MIDDLE_MCP, HandLandmarkIndex.RING_MCP],
  [HandLandmarkIndex.RING_MCP, HandLandmarkIndex.LITTLE_MCP],
];

export const CameraView: React.FC<CameraViewProps> = ({
  cameraService,
  handTracker,
  onHandResults,
  onCameraStateChange
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const animFrameIdRef = useRef<number | null>(null);
  const lastFpsCalcTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const [currentFps, setCurrentFps] = useState<number>(0);

  useEffect(() => {
    cameraService.getAvailableCameras().then((devs) => {
      setCameras(devs);
      if (devs.length > 0) {
        setSelectedCameraId(devs[0].deviceId);
      }
    });

    handTracker.initialize().catch((err) => {
      setTrackingError(`Hand Landmarker Init Error: ${err.message}`);
    });

    return () => {
      stopCameraAndLoop();
    };
  }, []);

  const handleStartCamera = async () => {
    if (!videoRef.current) return;
    try {
      setTrackingError(null);
      await cameraService.startCamera(videoRef.current, selectedCameraId);
      setIsCameraActive(true);
      onCameraStateChange(true);
      startDetectionLoop();
    } catch (err: any) {
      setTrackingError(`Camera Access Error: ${err.message || 'Permission denied'}`);
      setIsCameraActive(false);
      onCameraStateChange(false);
    }
  };

  const handleStopCamera = () => {
    stopCameraAndLoop();
    setIsCameraActive(false);
    onCameraStateChange(false);
  };

  const stopCameraAndLoop = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    cameraService.stopCamera();
  };

  const startDetectionLoop = () => {
    const loop = () => {
      if (videoRef.current && canvasRef.current && cameraService.isStreaming()) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video.videoWidth > 0 && video.videoHeight > 0) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }

          frameCountRef.current++;
          const now = performance.now();
          if (now - lastFpsCalcTimeRef.current >= 1000) {
            const fps = Math.round((frameCountRef.current * 1000) / (now - lastFpsCalcTimeRef.current));
            setCurrentFps(fps);
            frameCountRef.current = 0;
            lastFpsCalcTimeRef.current = now;
          }

          // Detects up to 2 hands concurrently via HandTrackerService
          const results = handTracker.detectVideoFrame(video);
          onHandResults(results, currentFps);

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (showSkeleton && results.length > 0) {
              drawHandSkeletons(ctx, results, canvas.width, canvas.height, isMirrored);
            }
          }
        }
      }
      animFrameIdRef.current = requestAnimationFrame(loop);
    };
    animFrameIdRef.current = requestAnimationFrame(loop);
  };

  const drawHandSkeletons = (
    ctx: CanvasRenderingContext2D,
    results: HandTrackingResult[],
    width: number,
    height: number,
    mirrored: boolean
  ) => {
    results.forEach((res) => {
      // In a mirrored layout, MediaPipe's internal classification treats the feed as a selfie layout.
      // We invert display assignment if mirrored so physical right hand matches screen right hand indicator.
      const effectiveHandedness = mirrored 
        ? (res.handedness === 'Right' ? 'Left' : 'Right') 
        : res.handedness;

      const isRight = effectiveHandedness === 'Right';
      const mainColor = isRight ? '#38bdf8' : '#a855f7'; // Cyan for Right, Purple for Left

      const pxPoints = res.landmarks.map((lm) => {
        let x = lm.normalized.x * width;
        if (mirrored) {
          x = width - x;
        }
        const y = lm.normalized.y * height;
        return { x, y };
      });

      // 1. Draw Skeleton Connection Lines
      ctx.strokeStyle = mainColor;
      ctx.lineWidth = 3;
      HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
        const p1 = pxPoints[startIdx];
        const p2 = pxPoints[endIdx];
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      // 2. Draw Landmark Dots
      pxPoints.forEach((pt, idx) => {
        const isTip = [4, 8, 12, 16, 20].includes(idx);
        const isWrist = idx === 0;

        ctx.beginPath();
        if (isWrist) {
          ctx.arc(pt.x, pt.y, 9, 0, 2 * Math.PI);
          ctx.fillStyle = '#ef4444';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (isTip) {
          ctx.arc(pt.x, pt.y, 7, 0, 2 * Math.PI);
          ctx.fillStyle = '#10b981';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = mainColor;
          ctx.fill();
        }
      });

      // 3. Draw Dual Handedness Label Tag at Wrist (wristPt declared from pxPoints[0])
      const wristPt = pxPoints[0];
      if (wristPt) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(wristPt.x - 45, wristPt.y + 12, 90, 22);
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(wristPt.x - 45, wristPt.y + 12, 90, 22);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${effectiveHandedness} (${Math.round(res.score * 100)}%)`, wristPt.x, wristPt.y + 27);
      }
    });
  };

  return (
    <div className="panel col-span-7">
      <div className="panel-header">
        <div className="panel-title">
          <Camera size={18} />
          <span>Camera & Dual-Hand Skeleton View</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn"
            onClick={() => setIsMirrored(!isMirrored)}
            title="Toggle Mirror Preview"
          >
            <RefreshCw size={14} />
            <span>{isMirrored ? 'Mirrored' : 'Normal'}</span>
          </button>
          <button
            className="btn"
            onClick={() => setShowSkeleton(!showSkeleton)}
            title="Toggle Skeleton Overlay"
          >
            {showSkeleton ? <Eye size={14} /> : <EyeOff size={14} />}
            <span>Skeleton</span>
          </button>
        </div>
      </div>

      {trackingError && (
        <div style={{ background: '#7f1d1d', color: '#fecaca', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem' }}>
          ⚠️ {trackingError}
        </div>
      )}

      <div className="camera-container">
        <video
          ref={videoRef}
          className={`camera-video ${isMirrored ? 'mirror-video' : ''}`}
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="camera-canvas" />

        {isCameraActive && (
          <div className="overlay-badge">
            FPS: {currentFps} | Dual-Hand Tracking Active
          </div>
        )}

        {!isCameraActive && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <Camera size={48} style={{ marginBottom: '12px', opacity: 0.4 }} />
            <div>Webcam Stream Inactive</div>
            <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Click "Start Camera" to track both hands simultaneously</div>
          </div>
        )}
      </div>

      <div className="camera-controls">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Camera Device:</label>
          <select
            className="select-input"
            value={selectedCameraId}
            onChange={(e) => setSelectedCameraId(e.target.value)}
            disabled={isCameraActive}
            style={{ flex: 1 }}
          >
            {cameras.map((c) => (
              <option key={c.deviceId} value={c.deviceId}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          {!isCameraActive ? (
            <button className="btn btn-success" onClick={handleStartCamera}>
              Start Camera
            </button>
          ) : (
            <button className="btn btn-danger" onClick={handleStopCamera}>
              Stop Camera
            </button>
          )}
        </div>
      </div>
    </div>
  );
};