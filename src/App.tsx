import React, { useEffect, useState, useMemo } from 'react';
import { CameraService } from './services/camera';
import { HandTrackerService } from './services/handTracker';
import { KeyboardService } from './services/keyboard';
import { RecorderService } from './services/recorder';
import { HandTrackingResult } from './types/hand';
import { DatasetSession, KeyboardSensorDataPoint } from './types/dataset';

import { Header } from './components/Header';
import { CameraView } from './components/CameraView';
import { HandDataPanel } from './components/HandDataPanel';
import { KeyboardPanel } from './components/KeyboardPanel';
import { RecordingPanel } from './components/RecordingPanel';
import { ExperimentPanel } from './components/ExperimentPanel';
import { DataPanel } from './components/DataPanel';
import { TimelineView } from './components/TimelineView';
import { ReplayModal } from './components/ReplayModal';

export const App: React.FC = () => {
  // Singleton Services
  const cameraService = useMemo(() => new CameraService(), []);
  const handTracker = useMemo(() => new HandTrackerService(), []);
  const keyboardService = useMemo(() => new KeyboardService(), []);
  const recorderService = useMemo(() => new RecorderService(), []);

  // Application State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFps, setCameraFps] = useState<number>(0);
  const [handResults, setHandResults] = useState<HandTrackingResult[]>([]);
  const [latestKeyboardEvent, setLatestKeyboardEvent] = useState<KeyboardSensorDataPoint | null>(null);

  const [session, setSession] = useState<DatasetSession>(recorderService.getSession());
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const [showTimeline, setShowTimeline] = useState<boolean>(true);
  const [showReplayModal, setShowReplayModal] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to recorder state changes
    const unsubscribeRecorder = recorderService.subscribe((updatedSession, recState, pauseState) => {
      setSession(updatedSession);
      setIsRecording(recState);
      setIsPaused(pauseState);
    });

    // Subscribe to keyboard events
    const unsubscribeKeyboard = keyboardService.subscribe((eventPoint) => {
      setLatestKeyboardEvent(eventPoint);
      recorderService.recordKeyboardEvent(eventPoint);
    });

    return () => {
      unsubscribeRecorder();
      unsubscribeKeyboard();
    };
  }, [recorderService, keyboardService]);

  const handleHandResults = (results: HandTrackingResult[], fps: number) => {
    setHandResults(results);
    setCameraFps(fps);
    if (results.length > 0) {
      recorderService.recordCameraFrame(results);
    }
  };

  return (
    <div className="app-container">
      <Header
        session={session}
        isCameraActive={isCameraActive}
        isRecording={isRecording}
        isPaused={isPaused}
        cameraFps={cameraFps}
      />

      <main className="dashboard-grid">
        {/* Row 1: Camera View + Derived Geometry Panel */}
        <CameraView
          cameraService={cameraService}
          handTracker={handTracker}
          onHandResults={handleHandResults}
          onCameraStateChange={setIsCameraActive}
        />

        <HandDataPanel handResults={handResults} />

        {/* Row 2: Physical Keyboard Panel + Recording Engine */}
        <KeyboardPanel
          keyboardService={keyboardService}
          latestEvent={latestKeyboardEvent}
        />

        <RecordingPanel
          recorderService={recorderService}
          session={session}
          isRecording={isRecording}
          isPaused={isPaused}
          cameraFps={cameraFps}
        />

        {/* Row 3: Experiment Runner + Data Panel */}
        <ExperimentPanel recorderService={recorderService} />

        <DataPanel
          recorderService={recorderService}
          session={session}
          onOpenTimeline={() => setShowTimeline(true)}
          onOpenReplay={() => setShowReplayModal(true)}
        />

        {/* Row 4: Multi-Track Timeline Visualizer */}
        {showTimeline && <TimelineView session={session} />}
      </main>

      {/* Replay Modal Dialog */}
      {showReplayModal && (
        <ReplayModal
          session={session}
          onClose={() => setShowReplayModal(false)}
        />
      )}
    </div>
  );
};
