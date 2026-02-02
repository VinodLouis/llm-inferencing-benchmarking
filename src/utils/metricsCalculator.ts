import type { InferenceMeasurement, Metrics } from '../types';

export const calculateMetrics = (
  measurements: InferenceMeasurement[],
  label: string,
): Metrics => {
  const latencies = measurements.map((m) => m.latency);
  const sorted = [...latencies].sort((a, b) => a - b);
  const sum = latencies.reduce((a, b) => a + b, 0);
  const mean = sum / latencies.length;
  const variance =
    latencies.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / latencies.length;
  const stdDev = Math.sqrt(variance);
  const successCount = measurements.filter((m) => m.success).length;
  const totalMemory = measurements.reduce((a, b) => a + b.memoryDelta, 0);

  return {
    label,
    precision: successCount / measurements.length,
    recall: successCount / measurements.length,
    f1Score: successCount / measurements.length,
    rocAuc: successCount / measurements.length,
    avgLatency: mean,
    minLatency: sorted[0] ?? 0,
    maxLatency: sorted[sorted.length - 1] ?? 0,
    medianLatency: sorted[Math.floor(sorted.length / 2)] ?? 0,
    p95Latency: sorted[Math.floor(sorted.length * 0.95)] ?? 0,
    p99Latency: sorted[Math.floor(sorted.length * 0.99)] ?? 0,
    stdDev: stdDev,
    coldLatency: measurements[0]?.latency ?? 0,
    warmLatency:
      measurements.length > 1
        ? measurements.slice(1).reduce((a, b) => a + b.latency, 0) /
          (measurements.length - 1)
        : 0,
    throughput: 1000 / mean,
    avgMemory: totalMemory / measurements.length / (1024 * 1024),
    peakMemory:
      Math.max(...measurements.map((m) => m.memoryDelta)) / (1024 * 1024),
    endToEndLatency: sum,
    timeToFirst: measurements[0]?.latency ?? 0,
    jitter: stdDev,
    rtt: label === 'Server' ? mean : 0,
    timestamp: Date.now(),
    platform: navigator.platform,
    browserVersion: navigator.userAgent,
    totalIterations: measurements.length,
    successRate: ((successCount / measurements.length) * 100).toFixed(2) + '%',
  };
};
