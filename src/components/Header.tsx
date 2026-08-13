import React from 'react';
import { Activity, Video, Keyboard, Database } from 'lucide-react';
import { DatasetSession } from '../types/dataset';

interface HeaderProps {
  session: DatasetSession;
  isCameraActive: boolean;
  isRecording: boolean;
  isPaused: boolean;
  cameraFps: number;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  isCameraActive,
  isRecording,
  isPaused,
  cameraFps,
}) => {
  return (
    <header className="app-header">
      <div className="brand-title">
        <span className="brand-logo">🖐️</span>
        <div>
          <h1 className="brand-name">GLOVE KEYBOARD RESEARCH WORKBENCH</h1>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="brand-badge">Prototype 0</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Schema v{session.schema_version} | Session: <strong style={{ color: 'var(--accent-cyan)' }}>{session.session.id}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="header-status">
        <div className="status-indicator">
          <Video size={16} color={isCameraActive ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
          <span>Camera: {isCameraActive ? `${cameraFps} FPS` : 'Off'}</span>
          <span className={`dot ${isCameraActive ? 'dot-green' : 'dot-red'}`} />
        </div>

        <div className="status-indicator">
          <Keyboard size={16} color="var(--accent-cyan)" />
          <span>Physical Keyboard: Active</span>
          <span className="dot dot-green" />
        </div>

        <div className="status-indicator">
          <Database size={16} color={isRecording ? 'var(--accent-rose)' : 'var(--text-muted)'} />
          <span>
            Recording: {isRecording ? (isPaused ? 'PAUSED' : 'ACTIVE') : 'IDLE'}
          </span>
          <span className={`dot ${isRecording ? (isPaused ? 'dot-amber' : 'dot-red') : 'dot-amber'}`} />
        </div>
      </div>
    </header>
  );
};
