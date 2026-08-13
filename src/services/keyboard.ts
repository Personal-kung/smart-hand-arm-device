import { KeyboardSensorDataPoint } from '../types/dataset';
import { TimestampService } from './timestamp';

export type KeyboardEventCallback = (eventPoint: KeyboardSensorDataPoint) => void;

export class KeyboardService {
  private isCapturing = false;
  private eventListeners: KeyboardEventCallback[] = [];
  private eventHistory: KeyboardSensorDataPoint[] = [];
  private maxHistoryLength = 50;

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.isCapturing) return;

    // Prevent default browser hotkeys if needed when focused on capture zone
    const targetElement = e.target as HTMLElement;
    if (targetElement && (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      // Don't intercept text editing inputs unless explicitly capture zone
    }

    const timestamp = TimestampService.now();
    const eventPoint: KeyboardSensorDataPoint = {
      id: `kbd_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp,
      relative_timestamp_ms: TimestampService.getRelativeMs(timestamp),
      source: 'keyboard',
      type: 'keydown',
      key: e.key,
      code: e.code,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey,
        capsLock: e.getModifierState ? e.getModifierState('CapsLock') : false
      },
      repeat: e.repeat
    };

    this.addEventToHistory(eventPoint);
    this.notifyListeners(eventPoint);
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (!this.isCapturing) return;

    const timestamp = TimestampService.now();
    const eventPoint: KeyboardSensorDataPoint = {
      id: `kbd_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp,
      relative_timestamp_ms: TimestampService.getRelativeMs(timestamp),
      source: 'keyboard',
      type: 'keyup',
      key: e.key,
      code: e.code,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey,
        capsLock: e.getModifierState ? e.getModifierState('CapsLock') : false
      },
      repeat: e.repeat
    };

    this.addEventToHistory(eventPoint);
    this.notifyListeners(eventPoint);
  };

  public startCapture(): void {
    if (this.isCapturing) return;
    this.isCapturing = true;
    window.addEventListener('keydown', this.handleKeyDown, true);
    window.addEventListener('keyup', this.handleKeyUp, true);
  }

  public stopCapture(): void {
    if (!this.isCapturing) return;
    this.isCapturing = false;
    window.removeEventListener('keydown', this.handleKeyDown, true);
    window.removeEventListener('keyup', this.handleKeyUp, true);
  }

  public isCaptureActive(): boolean {
    return this.isCapturing;
  }

  public subscribe(callback: KeyboardEventCallback): () => void {
    this.eventListeners.push(callback);
    return () => {
      this.eventListeners = this.eventListeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners(eventPoint: KeyboardSensorDataPoint): void {
    this.eventListeners.forEach(listener => listener(eventPoint));
  }

  private addEventToHistory(eventPoint: KeyboardSensorDataPoint): void {
    this.eventHistory.unshift(eventPoint);
    if (this.eventHistory.length > this.maxHistoryLength) {
      this.eventHistory.pop();
    }
  }

  public getHistory(): KeyboardSensorDataPoint[] {
    return this.eventHistory;
  }

  public clearHistory(): void {
    this.eventHistory = [];
  }
}
