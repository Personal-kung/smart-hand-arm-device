export interface CameraDevice {
  deviceId: string;
  label: string;
}

export class CameraService {
  private mediaStream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;

  public async getAvailableCameras(): Promise<CameraDevice[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices
        .filter(device => device.kind === 'videoinput')
        .map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${index + 1}`
        }));
    } catch (err) {
      console.warn('Failed to enumerate video devices:', err);
      return [];
    }
  }

  public async startCamera(
    videoElement: HTMLVideoElement,
    deviceId?: string
  ): Promise<MediaStream> {
    this.stopCamera();
    this.videoElement = videoElement;

    const constraints: MediaStreamConstraints = {
      video: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 60, max: 60 }
      },
      audio: false
    };

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.srcObject = this.mediaStream;
      
      await new Promise<void>((resolve) => {
        if (!this.videoElement) return resolve();
        this.videoElement.onloadedmetadata = () => {
          this.videoElement?.play().then(() => resolve());
        };
      });

      return this.mediaStream;
    } catch (err) {
      console.error('Camera access denied or failed:', err);
      throw err;
    }
  }

  public stopCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }
  }

  public isStreaming(): boolean {
    return !!this.mediaStream && this.mediaStream.active;
  }
}
