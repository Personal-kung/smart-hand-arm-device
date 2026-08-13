import React, { useRef } from 'react';
import { Download, FileSpreadsheet, Trash2, Upload, FileCode } from 'lucide-react';
import { ExporterService } from '../services/exporter';
import { RecorderService } from '../services/recorder';
import { DatasetSession } from '../types/dataset';

interface DataPanelProps {
  recorderService: RecorderService;
  session: DatasetSession;
  onOpenTimeline: () => void;
  onOpenReplay: () => void;
}

export const DataPanel: React.FC<DataPanelProps> = ({
  recorderService,
  session,
  onOpenTimeline,
  onOpenReplay
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    ExporterService.exportJSON(session);
  };

  const handleExportCSV = () => {
    ExporterService.exportSensorDataCSV(session);
  };

  const handleClearSession = () => {
    if (confirm('Are you sure you want to clear all recorded data for this session?')) {
      recorderService.resetSession();
    }
  };

  const handleImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const importedSession = await ExporterService.parseSessionJSON(file);
      recorderService.loadSession(importedSession);
      alert(`Session "${importedSession.session.id}" imported successfully! (${importedSession.sensor_data.length} data points)`);
    } catch (err: any) {
      alert(`Failed to import session JSON: ${err.message}`);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cameraFrameCount = session.sensor_data.filter((d) => d.source === 'camera').length;
  const keyboardEventCount = session.sensor_data.filter((d) => d.source === 'keyboard').length;
  const intentionCount = session.human_intended_output.length;

  return (
    <div className="panel col-span-6">
      <div className="panel-header">
        <div className="panel-title">
          <FileCode size={18} />
          <span>Data Export & Session Management</span>
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <span className="metric-label">Camera Frames</span>
          <span className="metric-value">{cameraFrameCount}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Keyboard Events</span>
          <span className="metric-value">{keyboardEventCount}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Ground Truth Logs</span>
          <span className="metric-value">{intentionCount}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Completed Trials</span>
          <span className="metric-value">{session.trials.length}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
        <button className="btn btn-primary" onClick={handleExportJSON} style={{ flex: 1 }}>
          <Download size={16} />
          <span>Export Session JSON</span>
        </button>

        <button className="btn" onClick={handleExportCSV} style={{ flex: 1 }}>
          <FileSpreadsheet size={16} />
          <span>Export Sensor CSV</span>
        </button>

        <button className="btn" onClick={() => fileInputRef.current?.click()} style={{ flex: 1 }}>
          <Upload size={16} />
          <span>Load JSON File</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportFileChange}
          accept=".json"
          style={{ display: 'none' }}
        />

        <button className="btn btn-danger" onClick={handleClearSession}>
          <Trash2 size={16} />
          <span>Clear Data</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button className="btn" onClick={onOpenTimeline} style={{ flex: 1, background: '#1e1b4b', borderColor: '#4338ca' }}>
          <span>View Synchronized Timeline</span>
        </button>
        <button className="btn" onClick={onOpenReplay} style={{ flex: 1, background: '#064e3b', borderColor: '#059669' }}>
          <span>Replay Recorded Session</span>
        </button>
      </div>
    </div>
  );
};
