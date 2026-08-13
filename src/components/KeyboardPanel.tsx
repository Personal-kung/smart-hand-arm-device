import React, { useEffect, useState } from 'react';
import { Keyboard, Lock, Zap } from 'lucide-react';
import { KeyboardService } from '../services/keyboard';
import { KeyboardSensorDataPoint } from '../types/dataset';

interface KeyboardPanelProps {
  keyboardService: KeyboardService;
  latestEvent: KeyboardSensorDataPoint | null;
}

// Physical keyboard layout rows for visual rendering
const KEYBOARD_ROWS = [
  ['Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
  ['ControlLeft', 'AltLeft', 'MetaLeft', 'Space', 'MetaRight', 'AltRight', 'ControlRight']
];

const KEY_LABELS: Record<string, string> = {
  Backquote: '`', Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4', Digit5: '5',
  Digit6: '6', Digit7: '7', Digit8: '8', Digit9: '9', Digit0: '0', Minus: '-', Equal: '=',
  KeyQ: 'Q', KeyW: 'W', KeyE: 'E', KeyR: 'R', KeyT: 'T', KeyY: 'Y', KeyU: 'U', KeyI: 'I', KeyO: 'O', KeyP: 'P',
  BracketLeft: '[', BracketRight: ']', Backslash: '\\',
  KeyA: 'A', KeyS: 'S', KeyD: 'D', KeyF: 'F', KeyG: 'G', KeyH: 'H', KeyJ: 'J', KeyK: 'K', KeyL: 'L',
  Semicolon: ';', Quote: "'", Enter: '↵ Enter', CapsLock: 'Caps',
  KeyZ: 'Z', KeyX: 'X', KeyC: 'C', KeyV: 'V', KeyB: 'B', KeyN: 'N', KeyM: 'M',
  Comma: ',', Period: '.', Slash: '/', ShiftLeft: '⇧ Shift', ShiftRight: '⇧ Shift',
  ControlLeft: 'Ctrl', ControlRight: 'Ctrl', AltLeft: 'Alt', AltRight: 'Alt',
  MetaLeft: 'Cmd/Win', MetaRight: 'Cmd/Win', Space: 'Spacebar', Escape: 'Esc'
};

export const KeyboardPanel: React.FC<KeyboardPanelProps> = ({
  keyboardService,
  latestEvent
}) => {
  const [activeCodes, setActiveCodes] = useState<Set<string>>(new Set());
  const [isCapturing, setIsCapturing] = useState<boolean>(keyboardService.isCaptureActive());
  const [history, setHistory] = useState<KeyboardSensorDataPoint[]>([]);

  useEffect(() => {
    // Start keyboard capture on mount
    keyboardService.startCapture();
    setIsCapturing(true);

    const unsubscribe = keyboardService.subscribe((eventPoint) => {
      setHistory([...keyboardService.getHistory()]);

      setActiveCodes((prev) => {
        const next = new Set(prev);
        if (eventPoint.type === 'keydown') {
          next.add(eventPoint.code);
        } else {
          next.delete(eventPoint.code);
        }
        return next;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleCapture = () => {
    if (isCapturing) {
      keyboardService.stopCapture();
      setIsCapturing(false);
    } else {
      keyboardService.startCapture();
      setIsCapturing(true);
    }
  };

  return (
    <div className="panel col-span-6">
      <div className="panel-header">
        <div className="panel-title">
          <Keyboard size={18} />
          <span>Physical Keyboard Event Capture</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className={`btn ${isCapturing ? 'btn-success' : 'btn-warning'}`}
            onClick={toggleCapture}
          >
            <Zap size={14} />
            <span>{isCapturing ? 'Capture Active' : 'Capture Paused'}</span>
          </button>
        </div>
      </div>

      {/* Latest Event Visualizer Box */}
      <div
        style={{
          background: 'var(--panel-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {latestEvent ? (
          <>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                LATEST EVENT: <strong style={{ color: latestEvent.type === 'keydown' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{latestEvent.type.toUpperCase()}</strong>
              </div>
              <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                event.key = "{latestEvent.key}" <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>| code = "{latestEvent.code}"</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {latestEvent.modifiers.shift && <span className="brand-badge" style={{ background: '#3b82f6', color: '#fff' }}>SHIFT</span>}
              {latestEvent.modifiers.ctrl && <span className="brand-badge" style={{ background: '#10b981', color: '#fff' }}>CTRL</span>}
              {latestEvent.modifiers.alt && <span className="brand-badge" style={{ background: '#f59e0b', color: '#fff' }}>ALT</span>}
              {latestEvent.modifiers.meta && <span className="brand-badge" style={{ background: '#a855f7', color: '#fff' }}>META</span>}
              {latestEvent.modifiers.capsLock && <span className="brand-badge" style={{ background: '#ef4444', color: '#fff' }}>CAPS</span>}
              {latestEvent.repeat && <span className="brand-badge" style={{ background: '#64748b', color: '#fff' }}>REPEAT</span>}
            </div>
          </>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No keyboard event detected yet. Press any key on your keyboard...
          </div>
        )}
      </div>

      {/* Visual QWERTY Keyboard */}
      <div className="virtual-keyboard">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="kbd-row">
            {row.map((code) => {
              const label = KEY_LABELS[code] || code;
              const isActive = activeCodes.has(code);
              let extraClass = '';
              if (code === 'Space') extraClass = 'key-space';
              if (['Backspace', 'Enter', 'ShiftLeft', 'ShiftRight', 'CapsLock'].includes(code)) extraClass = 'key-wide';
              if (['Tab', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight'].includes(code)) extraClass = 'key-extra-wide';

              return (
                <div key={code} className={`key-cap ${extraClass} ${isActive ? 'active' : ''}`}>
                  {label}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
