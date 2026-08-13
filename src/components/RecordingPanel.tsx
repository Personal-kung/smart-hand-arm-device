import React, { useEffect, useState } from 'react';
import { Play, Square, Pause, Plus, Bookmark, Target, Database, FileText } from 'lucide-react';
import { RecorderService } from '../services/recorder';
import { DatasetSession } from '../types/dataset';
import { TimestampService } from '../services/timestamp';

interface RecordingPanelProps {
  recorderService: RecorderService;
  session: DatasetSession;
  isRecording: boolean;
  isPaused: boolean;
  cameraFps: number;
}

export const RecordingPanel: React.FC<RecordingPanelProps> = ({
  recorderService,
  session,
  isRecording,
  isPaused,
  cameraFps,
}) => {
  const [durationSec, setDurationSec] = useState<number>(0);
  const [showIntentionModal, setShowIntentionModal] = useState<boolean>(false);
  const [intendedActionInput, setIntendedActionInput] = useState<string>('index_finger_tap');
  const [expectedOutputInput, setExpectedOutputInput] = useState<string>('KeyA');
  const [notesInput, setNotesInput] = useState<string>('');

  useEffect(() => {
    let interval: any = null;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        const elapsedMs = TimestampService.getRelativeMs();
        setDurationSec(Math.floor(elapsedMs / 1000));
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused]);

  const handleToggleRecording = () => {
    if (isRecording) {
      recorderService.stopRecording();
    } else {
      recorderService.startRecording();
    }
  };

  const handlePauseResume = () => {
    recorderService.pauseRecording();
  };

  const handleNewSession = () => {
    if (confirm('Start a new session? Current unsaved session data will be reset.')) {
      recorderService.resetSession();
      setDurationSec(0);
    }
  };

  const handleMarkEvent = () => {
    const markName = prompt('Enter Event Marker Name:', 'Tap Marker') || 'Manual Event';
    recorderService.markEvent(markName);
  };

  const handleLogIntentionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intendedActionInput.trim()) return;
    recorderService.logHumanIntention(
      intendedActionInput.trim(),
      expectedOutputInput.trim() || undefined,
      notesInput.trim() || undefined
    );
    setShowIntentionModal(false);
    setNotesInput('');
  };

  const sensorCount = session.sensor_data.length;
  const intentionCount = session.human_intended_output.length;
  const trialCount = session.trials.length;

  // Approximate JSON size estimate in KB/MB
  const estimatedBytes = JSON.stringify(session).length;
  const sizeFormatted =
    estimatedBytes > 1024 * 1024
      ? `${(estimatedBytes / (1024 * 1024)).toFixed(2)} MB`
      : `${(estimatedBytes / 1024).toFixed(1)} KB`;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="panel col-span-6">
      <div className="panel-header">
        <div className="panel-title">
          <Database size={18} />
          <span>Recording & Data Engine</span>
        </div>
        <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
          {formatTime(durationSec)}
        </div>
      </div>

      {/* Control Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${isRecording ? 'btn-danger' : 'btn-success'}`}
          onClick={handleToggleRecording}
          style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '0.9rem' }}
        >
          {isRecording ? <Square size={16} /> : <Play size={16} />}
          <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
        </button>

        <button
          className="btn"
          onClick={handlePauseResume}
          disabled={!isRecording}
          title="Pause / Resume Data Recording"
        >
          <Pause size={16} />
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>

        <button className="btn" onClick={handleMarkEvent} title="Insert manual timestamp marker">
          <Bookmark size={16} />
          <span>Mark Event</span>
        </button>

        <button className="btn btn-primary" onClick={() => setShowIntentionModal(true)} title="Log ground truth human intention">
          <Target size={16} />
          <span>Log Intention</span>
        </button>

        <button className="btn" onClick={handleNewSession} title="Clear session buffers and reset">
          <Plus size={16} />
          <span>New Session</span>
        </button>
      </div>

      {/* Live Data Summary Metrics */}
      <div className="metric-grid" style={{ marginTop: '0.5rem' }}>
        <div className="metric-card">
          <span className="metric-label">Table 1: Sensor Data</span>
          <span className="metric-value">{sensorCount} pts</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Table 2: Ground Truth</span>
          <span className="metric-value">{intentionCount} logs</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Structured Trials</span>
          <span className="metric-value">{trialCount} trials</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Est. Dataset Size</span>
          <span className="metric-value">{sizeFormatted}</span>
        </div>
      </div>

      {/* Log Intention Modal Dialog */}
      {showIntentionModal && (
        <div className="modal-backdrop" onClick={() => setShowIntentionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="panel-header" style={{ marginBottom: '1rem' }}>
              <div className="panel-title">
                <Target size={18} />
                <span>Log Ground Truth Human Intention</span>
              </div>
              <button className="btn" onClick={() => setShowIntentionModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleLogIntentionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Intended Action:
                </label>
                <input
                  type="text"
                  className="text-input"
                  value={intendedActionInput}
                  onChange={(e) => setIntendedActionInput(e.target.value)}
                  placeholder="e.g. index_finger_tap, thumb_middle_pinch"
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Expected Key/Output (Optional):
                </label>
                <input
                  type="text"
                  className="text-input"
                  value={expectedOutputInput}
                  onChange={(e) => setExpectedOutputInput(e.target.value)}
                  placeholder="e.g. KeyA, Space"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Notes (Optional):
                </label>
                <input
                  type="text"
                  className="text-input"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g. Light surface touch"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" className="btn" onClick={() => setShowIntentionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Record Intention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
