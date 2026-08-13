import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, X } from 'lucide-react';
import { DatasetSession, CameraSensorDataPoint, KeyboardSensorDataPoint } from '../types/dataset';

interface ReplayModalProps {
  session: DatasetSession;
  onClose: () => void;
}

export const ReplayModal: React.FC<ReplayModalProps> = ({ session, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentMs, setCurrentMs] = useState<number>(0);

  const cameraPoints = (session.sensor_data || []).filter(
    (d) => d.source === 'camera'
  ) as CameraSensorDataPoint[];

  const keyboardPoints = (session.sensor_data || []).filter(
    (d) => d.source === 'keyboard'
  ) as KeyboardSensorDataPoint[];

  const maxMs =
    session.sensor_data && session.sensor_data.length > 0
      ? session.sensor_data[session.sensor_data.length - 1].relative_timestamp_ms
      : 1000;

  // Find nearest camera frame for current replay timestamp
  const activeFrame = cameraPoints.reduce<CameraSensorDataPoint | null>((acc, curr) => {
    if (curr.relative_timestamp_ms <= currentMs) {
      if (!acc || curr.relative_timestamp_ms > acc.relative_timestamp_ms) {
        return curr;
      }
    }
    return acc;
  }, null);

  // Find recent keyboard events up to current replay timestamp
  const recentKbd = keyboardPoints.filter(
    (k) => k.relative_timestamp_ms <= currentMs && currentMs - k.relative_timestamp_ms < 1500
  );

  useEffect(() => {
    let animId: any = null;
    let lastTime = performance.now();

    const step = () => {
      if (isPlaying) {
        const now = performance.now();
        const dt = now - lastTime;
        lastTime = now;

        setCurrentMs((prev) => {
          const next = prev + dt;
          if (next >= maxMs) {
            setIsPlaying(false);
            return maxMs;
          }
          return next;
        });
        animId = requestAnimationFrame(step);
      }
    };

    if (isPlaying) {
      lastTime = performance.now();
      animId = requestAnimationFrame(step);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, maxMs]);

  // Render Skeleton Canvas for active frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (activeFrame && activeFrame.landmarks) {
      const mainColor = activeFrame.hand === 'Right' ? '#38bdf8' : '#a855f7';
      const pts = activeFrame.landmarks.map((lm) => ({
        x: lm.normalized.x * canvas.width,
        y: lm.normalized.y * canvas.height,
      }));

      // Connections
      ctx.strokeStyle = mainColor;
      ctx.lineWidth = 3;

      // Draw dots
      pts.forEach((pt, idx) => {
        const isTip = [4, 8, 12, 16, 20].includes(idx);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isTip ? 6 : 4, 0, 2 * Math.PI);
        ctx.fillStyle = isTip ? '#10b981' : mainColor;
        ctx.fill();
      });
    }
  }, [activeFrame]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="panel-header">
          <div className="panel-title">
            <Play size={18} />
            <span>Synchronized Replay Player — Session {session.session.id}</span>
          </div>
          <button className="btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          {/* Left: Video Landmark Replay Canvas */}
          <div style={{ background: '#000', borderRadius: '8px', position: 'relative', height: '300px' }}>
            <canvas ref={canvasRef} width={380} height={300} style={{ width: '100%', height: '100%' }} />
            <div className="overlay-badge">
              {activeFrame ? `${activeFrame.hand} Hand (Frame #${activeFrame.frame_index})` : 'No frame at timestamp'}
            </div>
          </div>

          {/* Right: Keypress & Intention Log Stream */}
          <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px', height: '300px', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              SYNCHRONIZED KEYBOARD & INTENTION EVENTS
            </div>
            {recentKbd.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No recent keypress at this timestamp.</div>
            ) : (
              recentKbd.map((k) => (
                <div
                  key={k.id}
                  style={{
                    background: 'var(--panel-card)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    borderLeft: `4px solid ${k.type === 'keydown' ? '#10b981' : '#f43f5e'}`
                  }}
                >
                  <strong style={{ color: 'var(--accent-cyan)' }}>{k.type.toUpperCase()}:</strong> key="{k.key}" code="{k.code}" @ {k.relative_timestamp_ms.toFixed(0)}ms
                </div>
              ))
            )}
          </div>
        </div>

        {/* Timeline Scrub Controls */}
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="range"
            min={0}
            max={maxMs}
            value={currentMs}
            onChange={(e) => setCurrentMs(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`btn ${isPlaying ? 'btn-danger' : 'btn-success'}`}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'Pause Replay' : 'Play Replay'}</span>
              </button>

              <button
                className="btn"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentMs(0);
                }}
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>
              {(currentMs / 1000).toFixed(2)}s / {(maxMs / 1000).toFixed(2)}s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
