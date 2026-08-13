import React, { useState } from 'react';
import { Clock, ZoomIn, ZoomOut } from 'lucide-react';
import { DatasetSession } from '../types/dataset';

interface TimelineViewProps {
  session: DatasetSession;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ session }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [scrubTimeMs, setScrubTimeMs] = useState<number>(0);

  const sensorData = session.sensor_data || [];
  const intentions = session.human_intended_output || [];
  const trials = session.trials || [];

  // Determine total timeline duration
  let maxTimeMs = 1000;
  if (sensorData.length > 0) {
    maxTimeMs = Math.max(maxTimeMs, sensorData[sensorData.length - 1].relative_timestamp_ms);
  }
  if (intentions.length > 0) {
    maxTimeMs = Math.max(maxTimeMs, intentions[intentions.length - 1].relative_timestamp_ms);
  }

  const cameraPoints = sensorData.filter((d) => d.source === 'camera');
  const keyboardPoints = sensorData.filter((d) => d.source === 'keyboard');

  const getPosPct = (ms: number) => {
    if (maxTimeMs <= 0) return 0;
    return Math.min(100, Math.max(0, (ms / maxTimeMs) * 100));
  };

  return (
    <div className="panel col-span-12">
      <div className="panel-header">
        <div className="panel-title">
          <Clock size={18} />
          <span>Synchronized Multi-Track Timeline Visualizer</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Duration: {(maxTimeMs / 1000).toFixed(2)}s | Scrub: {(scrubTimeMs / 1000).toFixed(2)}s
          </span>
          <button className="btn" onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}>
            <ZoomIn size={14} />
          </button>
          <button className="btn" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.5))}>
            <ZoomOut size={14} />
          </button>
        </div>
      </div>

      {/* Scrub bar */}
      <div style={{ padding: '0 8px' }}>
        <input
          type="range"
          min={0}
          max={maxTimeMs}
          value={scrubTimeMs}
          onChange={(e) => setScrubTimeMs(parseFloat(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>

      <div className="timeline-track-container" style={{ transform: `scaleX(${zoomLevel})`, transformOrigin: 'left center' }}>
        {/* Track 1: Camera Frames */}
        <div className="timeline-track">
          <div className="track-label">CAMERA</div>
          <div className="track-content">
            {cameraPoints.map((pt, idx) => (
              <div
                key={pt.id || idx}
                className="timeline-dot"
                style={{ left: `${getPosPct(pt.relative_timestamp_ms)}%`, background: 'var(--accent-cyan)' }}
                title={`Cam Frame #${pt.frame_index} @ ${pt.relative_timestamp_ms.toFixed(1)}ms`}
              />
            ))}
          </div>
        </div>

        {/* Track 2: Keyboard Events */}
        <div className="timeline-track">
          <div className="track-label">KEYBOARD</div>
          <div className="track-content">
            {keyboardPoints.map((pt: any, idx) => (
              <div
                key={pt.id || idx}
                className="timeline-dot"
                style={{
                  left: `${getPosPct(pt.relative_timestamp_ms)}%`,
                  background: pt.type === 'keydown' ? '#10b981' : '#f43f5e',
                  width: '8px',
                  height: '8px'
                }}
                title={`Key ${pt.type.toUpperCase()}: ${pt.key} (${pt.code}) @ ${pt.relative_timestamp_ms.toFixed(1)}ms`}
              />
            ))}
          </div>
        </div>

        {/* Track 3: Human Intended Output */}
        <div className="timeline-track">
          <div className="track-label">INTENTION</div>
          <div className="track-content">
            {intentions.map((intent, idx) => (
              <div
                key={intent.id || idx}
                className="timeline-dot"
                style={{
                  left: `${getPosPct(intent.relative_timestamp_ms)}%`,
                  background: '#f59e0b',
                  width: '10px',
                  height: '10px'
                }}
                title={`Intention: ${intent.intended_action} @ ${intent.relative_timestamp_ms.toFixed(1)}ms`}
              />
            ))}
          </div>
        </div>

        {/* Track 4: Trials Intervals */}
        <div className="timeline-track">
          <div className="track-label">TRIALS</div>
          <div className="track-content">
            {trials.map((trial) => {
              const startPct = getPosPct(trial.start_relative_ms);
              const endPct = trial.end_relative_ms ? getPosPct(trial.end_relative_ms) : getPosPct(maxTimeMs);
              const widthPct = Math.max(1, endPct - startPct);

              return (
                <div
                  key={trial.trial_id}
                  className="timeline-block"
                  style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                  title={`Trial #${trial.trial_number}: ${trial.name}`}
                >
                  Trial #{trial.trial_number} ({trial.intended_action})
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
