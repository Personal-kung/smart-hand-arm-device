import React from 'react';
import { Activity, Compass, Move, Ruler } from 'lucide-react';
import { HandTrackingResult } from '../types/hand';

interface HandDataPanelProps {
  handResults: HandTrackingResult[];
}

export const HandDataPanel: React.FC<HandDataPanelProps> = ({ handResults }) => {
  if (handResults.length === 0) {
    return (
      <div className="panel col-span-5">
        <div className="panel-header">
          <div className="panel-title">
            <Activity size={18} />
            <span>Derived Hand Geometry</span>
          </div>
        </div>
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Move size={36} style={{ marginBottom: '8px', opacity: 0.3 }} />
          <div>No hand detected in camera frame</div>
          <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
            Position hand in front of webcam to view live joint angles & distances
          </div>
        </div>
      </div>
    );
  }

  // Display primary hand (e.g. Right hand or first detected hand)
  const activeHand = handResults[0];
  const geo = activeHand.derived_geometry;

  return (
    <div className="panel col-span-5" style={{ overflowY: 'auto', maxHeight: '580px' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Activity size={18} />
          <span>Derived Hand Geometry ({activeHand.handedness} Hand)</span>
        </div>
        <span className="brand-badge" style={{ fontSize: '0.7rem' }}>
          Wrist Origin (0,0,0)
        </span>
      </div>

      {/* 1. Finger Flexion Estimates */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
          FINGER FLEXION ESTIMATES (%)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { name: 'Thumb', pct: geo.flexion.thumb_pct },
            { name: 'Index', pct: geo.flexion.index_pct },
            { name: 'Middle', pct: geo.flexion.middle_pct },
            { name: 'Ring', pct: geo.flexion.ring_pct },
            { name: 'Little', pct: geo.flexion.little_pct },
          ].map((f) => (
            <div key={f.name} style={{ fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{f.name} Finger</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{f.pct}%</span>
              </div>
              <div className="flexion-bar-bg">
                <div className="flexion-bar-fill" style={{ width: `${f.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Joint Angles (Degrees) */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', margin: '10px 0 6px 0' }}>
          JOINT FLEXION ANGLES (DEGREES)
        </div>
        <div className="metric-grid">
          <div className="metric-card">
            <span className="metric-label">Index MCP / PIP / DIP</span>
            <span className="metric-value" style={{ fontSize: '0.85rem' }}>
              {geo.joint_angles.index.mcp_deg}° / {geo.joint_angles.index.pip_deg}° / {geo.joint_angles.index.dip_deg}°
            </span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Middle MCP / PIP / DIP</span>
            <span className="metric-value" style={{ fontSize: '0.85rem' }}>
              {geo.joint_angles.middle.mcp_deg}° / {geo.joint_angles.middle.pip_deg}° / {geo.joint_angles.middle.dip_deg}°
            </span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Ring MCP / PIP / DIP</span>
            <span className="metric-value" style={{ fontSize: '0.85rem' }}>
              {geo.joint_angles.ring.mcp_deg}° / {geo.joint_angles.ring.pip_deg}° / {geo.joint_angles.ring.dip_deg}°
            </span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Little MCP / PIP / DIP</span>
            <span className="metric-value" style={{ fontSize: '0.85rem' }}>
              {geo.joint_angles.little.mcp_deg}° / {geo.joint_angles.little.pip_deg}° / {geo.joint_angles.little.dip_deg}°
            </span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Thumb CMC / MCP / IP</span>
            <span className="metric-value" style={{ fontSize: '0.85rem' }}>
              {geo.joint_angles.thumb.cmc_deg}° / {geo.joint_angles.thumb.mcp_deg}° / {geo.joint_angles.thumb.ip_deg}°
            </span>
          </div>
        </div>
      </div>

      {/* 3. Thumb-to-Finger Tip Distances */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', margin: '10px 0 6px 0' }}>
          THUMB TIP TO FINGERTIP DISTANCES
        </div>
        <div className="metric-grid">
          <div className="metric-card">
            <span className="metric-label">Thumb → Index</span>
            <span className="metric-value">{geo.fingertip_distances.thumb_to_index}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Thumb → Middle</span>
            <span className="metric-value">{geo.fingertip_distances.thumb_to_middle}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Thumb → Ring</span>
            <span className="metric-value">{geo.fingertip_distances.thumb_to_ring}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Thumb → Little</span>
            <span className="metric-value">{geo.fingertip_distances.thumb_to_little}</span>
          </div>
        </div>
      </div>

      {/* 4. Hand Orientation & Palm Metrics */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', margin: '10px 0 6px 0' }}>
          HAND ORIENTATION & PALM DIMENSIONS
        </div>
        <div className="metric-grid">
          <div className="metric-card">
            <span className="metric-label">Pitch / Yaw / Roll</span>
            <span className="metric-value" style={{ fontSize: '0.85rem' }}>
              {geo.orientation.pitch_deg}° / {geo.orientation.yaw_deg}° / {geo.orientation.roll_deg}°
            </span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Palm Width / Length</span>
            <span className="metric-value" style={{ fontSize: '0.85rem' }}>
              {geo.palm_dimensions.width} / {geo.palm_dimensions.length}
            </span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Index Tip Speed</span>
            <span className="metric-value" style={{ fontSize: '0.85rem' }}>
              {geo.kinematics.speed.index || 0} unit/s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
