import React, { useState } from 'react';
import { PlayCircle, CheckCircle, ChevronRight, RefreshCw, Sparkles } from 'lucide-react';
import { EXPERIMENT_PRESETS, ExperimentPreset } from '../types/experiment';
import { RecorderService } from '../services/recorder';
import { Trial } from '../types/dataset';

interface ExperimentPanelProps {
  recorderService: RecorderService;
}

export const ExperimentPanel: React.FC<ExperimentPanelProps> = ({ recorderService }) => {
  const [selectedPreset, setSelectedPreset] = useState<ExperimentPreset>(EXPERIMENT_PRESETS[0]);
  const [repetitions, setRepetitions] = useState<number>(selectedPreset.defaultRepetitions);
  const [participantId, setParticipantId] = useState<string>('P001');
  const [handTested, setHandTested] = useState<'right' | 'left' | 'both'>('right');

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [currentRepetition, setCurrentRepetition] = useState<number>(1);
  const [isRunningExperiment, setIsRunningExperiment] = useState<boolean>(false);
  const [currentTrial, setCurrentTrial] = useState<Trial | null>(null);

  const handleStartExperiment = () => {
    setIsRunningExperiment(true);
    setActiveStepIndex(0);
    setCurrentRepetition(1);

    // Update session metadata
    recorderService.updateSessionMetadata({
      experiment_name: selectedPreset.name,
      participant_id: participantId,
      hand_tested: handTested
    });

    // Ensure recorder is active
    if (!recorderService.getIsRecording()) {
      recorderService.startRecording();
    }

    startStep(0, 1);
  };

  const startStep = (stepIdx: number, rep: number) => {
    const step = selectedPreset.steps[stepIdx];
    const trialName = `${selectedPreset.name} (Rep ${rep}/${repetitions} - Step ${step.stepNumber})`;
    const trial = recorderService.startNewTrial(
      trialName,
      step.instructions,
      step.intendedAction,
      step.expectedOutput
    );
    setCurrentTrial(trial);
  };

  const handleNextStep = () => {
    // Complete active trial
    recorderService.endCurrentTrial();

    if (activeStepIndex < selectedPreset.steps.length - 1) {
      // Next step in same repetition
      const nextStep = activeStepIndex + 1;
      setActiveStepIndex(nextStep);
      startStep(nextStep, currentRepetition);
    } else {
      // Completed all steps in this repetition
      if (currentRepetition < repetitions) {
        const nextRep = currentRepetition + 1;
        setCurrentRepetition(nextRep);
        setActiveStepIndex(0);
        startStep(0, nextRep);
      } else {
        // Experiment Completed!
        setIsRunningExperiment(false);
        setCurrentTrial(null);
        alert(`Experiment "${selectedPreset.name}" completed successfully! (${repetitions} repetitions recorded)`);
      }
    }
  };

  const handleStopExperiment = () => {
    if (confirm('Cancel current experiment runner?')) {
      recorderService.endCurrentTrial('Experiment manually cancelled');
      setIsRunningExperiment(false);
      setCurrentTrial(null);
    }
  };

  return (
    <div className="panel col-span-6">
      <div className="panel-header">
        <div className="panel-title">
          <Sparkles size={18} />
          <span>Structured Experiment Protocol Runner</span>
        </div>
        {isRunningExperiment && (
          <span className="brand-badge" style={{ background: '#059669', color: '#fff' }}>
            Rep {currentRepetition} of {repetitions}
          </span>
        )}
      </div>

      {!isRunningExperiment ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Experiment Protocol Preset:
            </label>
            <select
              className="select-input"
              value={selectedPreset.id}
              onChange={(e) => {
                const preset = EXPERIMENT_PRESETS.find((p) => p.id === e.target.value) || EXPERIMENT_PRESETS[0];
                setSelectedPreset(preset);
                setRepetitions(preset.defaultRepetitions);
              }}
              style={{ width: '100%' }}
            >
              {EXPERIMENT_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.description}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Participant ID:
              </label>
              <input
                type="text"
                className="text-input"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Hand Tested:
              </label>
              <select
                className="select-input"
                value={handTested}
                onChange={(e) => setHandTested(e.target.value as any)}
                style={{ width: '100%' }}
              >
                <option value="right">Right Hand</option>
                <option value="left">Left Hand</option>
                <option value="both">Both Hands</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Repetitions:
              </label>
              <input
                type="number"
                min={1}
                max={100}
                className="text-input"
                value={repetitions}
                onChange={(e) => setRepetitions(parseInt(e.target.value) || 1)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleStartExperiment} style={{ marginTop: '6px' }}>
            <PlayCircle size={16} />
            <span>Launch Structured Experiment</span>
          </button>
        </div>
      ) : (
        /* Active Experiment Trial Prompt Display */
        <div
          style={{
            background: 'var(--panel-card)',
            border: '1px solid var(--accent-cyan)',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              TRIAL PROMPT #{currentTrial?.trial_number} ({selectedPreset.name})
            </div>
            <button className="btn btn-danger" onClick={handleStopExperiment} style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
              Cancel
            </button>
          </div>

          <div
            style={{
              background: '#090d16',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#ffffff',
              textAlign: 'center',
              borderLeft: '4px solid var(--accent-emerald)'
            }}
          >
            "{selectedPreset.steps[activeStepIndex]?.instructions}"
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Action: <strong style={{ color: 'var(--accent-cyan)' }}>{selectedPreset.steps[activeStepIndex]?.intendedAction}</strong></span>
            {selectedPreset.steps[activeStepIndex]?.expectedOutput && (
              <span>Target Key: <strong style={{ color: 'var(--accent-emerald)' }}>{selectedPreset.steps[activeStepIndex]?.expectedOutput}</strong></span>
            )}
          </div>

          <button
            className="btn btn-success"
            onClick={handleNextStep}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '4px' }}
          >
            <span>Complete Trial & Advance</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
