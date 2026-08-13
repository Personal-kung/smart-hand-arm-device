import { DatasetSession } from '../types/dataset';

export class ExporterService {
  /**
   * Downloads the complete DatasetSession as a structured JSON file.
   */
  public static exportJSON(datasetSession: DatasetSession, filename?: string): void {
    const defaultFilename = `${datasetSession.session.id || 'glove_session'}.json`;
    const jsonStr = JSON.stringify(datasetSession, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    this.triggerDownload(blob, filename || defaultFilename);
  }

  /**
   * Exports Table 1 (sensor_data) as a CSV file for analytical software (Pandas/Excel).
   */
  public static exportSensorDataCSV(datasetSession: DatasetSession, filename?: string): void {
    const defaultFilename = `${datasetSession.session.id || 'glove_session'}_sensor_data.csv`;
    const rows = datasetSession.sensor_data;

    if (!rows || rows.length === 0) {
      alert('No sensor data available to export to CSV.');
      return;
    }

    const headers = [
      'timestamp',
      'relative_timestamp_ms',
      'source',
      'type',
      'frame_index',
      'hand',
      'confidence_or_key',
      'code_or_metric',
      'details_json'
    ];

    const csvLines: string[] = [headers.join(',')];

    rows.forEach(r => {
      let confOrKey = '';
      let codeOrMetric = '';
      let detailsJson = '';

      if (r.source === 'camera') {
        confOrKey = String(r.confidence || '');
        codeOrMetric = `flexion_idx:${r.derived_geometry?.flexion?.index_pct}%`;
        detailsJson = JSON.stringify({
          wrist: r.landmarks[0]?.wrist_relative,
          index_tip: r.landmarks[8]?.wrist_relative,
          thumb_tip: r.landmarks[4]?.wrist_relative
        });
      } else if (r.source === 'keyboard') {
        confOrKey = r.key;
        codeOrMetric = r.code;
        detailsJson = JSON.stringify(r.modifiers);
      } else {
        confOrKey = String(r.sensor_id || '');
        detailsJson = JSON.stringify(r.raw_value);
      }

      const line = [
        r.timestamp,
        r.relative_timestamp_ms,
        `"${r.source}"`,
        `"${r.type}"`,
        r.frame_index || '',
        `"${('hand' in r && r.hand) ? r.hand : ''}"`,
        `"${confOrKey.replace(/"/g, '""')}"`,
        `"${codeOrMetric.replace(/"/g, '""')}"`,
        `"${detailsJson.replace(/"/g, '""')}"`
      ];

      csvLines.push(line.join(','));
    });

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    this.triggerDownload(blob, filename || defaultFilename);
  }

  /**
   * Reads and parses an uploaded JSON file into a DatasetSession.
   */
  public static async parseSessionJSON(file: File): Promise<DatasetSession> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content) as DatasetSession;
          if (!parsed.session || !parsed.sensor_data) {
            throw new Error('Invalid dataset schema: missing session or sensor_data root objects.');
          }
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsText(file);
    });
  }

  private static triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
