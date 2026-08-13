/**
 * Timestamp Synchronization Service
 * 
 * Provides a unified high-resolution clock reference based on performance.now() (monotonic browser timestamp).
 * All camera frame observations, keyboard events, and human intention logs share this reference timeline.
 */

export class TimestampService {
  private static sessionStartPerfTime: number = performance.now();
  private static sessionStartIsoTime: string = new Date().toISOString();

  /**
   * Resets the session base timestamp to current time.
   */
  public static resetSessionStart(): { perfTime: number; isoTime: string } {
    this.sessionStartPerfTime = performance.now();
    this.sessionStartIsoTime = new Date().toISOString();
    return {
      perfTime: this.sessionStartPerfTime,
      isoTime: this.sessionStartIsoTime
    };
  }

  /**
   * Gets current high-resolution monotonic timestamp in milliseconds.
   */
  public static now(): number {
    return performance.now();
  }

  /**
   * Gets relative timestamp in milliseconds since session start.
   */
  public static getRelativeMs(perfTime: number = performance.now()): number {
    return Math.max(0, parseFloat((perfTime - this.sessionStartPerfTime).toFixed(3)));
  }

  /**
   * Gets current base session start ISO string.
   */
  public static getSessionStartIso(): string {
    return this.sessionStartIsoTime;
  }

  /**
   * Gets base session start performance timestamp.
   */
  public static getSessionStartPerf(): number {
    return this.sessionStartPerfTime;
  }
}
