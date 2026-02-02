import type { BenchmarkResults, Analysis } from '../types';

export const exportToCSV = (
  results: BenchmarkResults,
  analysis?: Analysis,
  networkLatencyMode?: string,
): void => {
  const headers = [
    'Metric Category',
    'Metric',
    'Unit',
    'Server',
    'Client',
    'Interpretation',
  ];

  const rows = [
    // Add network latency info if applicable
    ...(networkLatencyMode && networkLatencyMode !== 'none'
      ? [
          [
            'Network',
            'Latency Mode',
            'string',
            networkLatencyMode,
            'N/A',
            'Simulated network conditions',
          ],
        ]
      : []),
    [
      'Accuracy',
      'Precision',
      '0-1',
      results.server.precision.toFixed(3),
      results.client.precision.toFixed(3),
      '% of positive predictions correct',
    ],
    [
      'Accuracy',
      'Recall',
      '0-1',
      results.server.recall.toFixed(3),
      results.client.recall.toFixed(3),
      '% of positive samples found',
    ],
    [
      'Accuracy',
      'F1-Score',
      '0-1',
      results.server.f1Score.toFixed(3),
      results.client.f1Score.toFixed(3),
      'Balanced precision & recall',
    ],
    [
      'Accuracy',
      'ROC-AUC',
      '0-1',
      results.server.rocAuc.toFixed(3),
      results.client.rocAuc.toFixed(3),
      'Ranking quality',
    ],
    [
      'Efficiency',
      'Avg latency',
      'ms',
      results.server.avgLatency.toFixed(2),
      results.client.avgLatency.toFixed(2),
      'Mean inference time',
    ],
    [
      'Efficiency',
      'Min latency',
      'ms',
      results.server.minLatency.toFixed(2),
      results.client.minLatency.toFixed(2),
      'Minimum latency',
    ],
    [
      'Efficiency',
      'Max latency',
      'ms',
      results.server.maxLatency.toFixed(2),
      results.client.maxLatency.toFixed(2),
      'Maximum latency',
    ],
    [
      'Efficiency',
      'Median latency',
      'ms',
      results.server.medianLatency.toFixed(2),
      results.client.medianLatency.toFixed(2),
      '50th percentile',
    ],
    [
      'Efficiency',
      'P95 latency',
      'ms',
      results.server.p95Latency.toFixed(2),
      results.client.p95Latency.toFixed(2),
      '95th percentile',
    ],
    [
      'Efficiency',
      'P99 latency',
      'ms',
      results.server.p99Latency.toFixed(2),
      results.client.p99Latency.toFixed(2),
      '99th percentile',
    ],
    [
      'Efficiency',
      'Std dev',
      'ms',
      results.server.stdDev.toFixed(2),
      results.client.stdDev.toFixed(2),
      'Latency variability',
    ],
    [
      'Efficiency',
      'Cold latency',
      'ms',
      results.server.coldLatency.toFixed(2),
      results.client.coldLatency.toFixed(2),
      'First inference',
    ],
    [
      'Efficiency',
      'Warm latency',
      'ms',
      results.server.warmLatency.toFixed(2),
      results.client.warmLatency.toFixed(2),
      'Steady state',
    ],
    [
      'Efficiency',
      'Throughput',
      'samples/s',
      results.server.throughput.toFixed(2),
      results.client.throughput.toFixed(2),
      'Capacity',
    ],
    [
      'Efficiency',
      'Avg memory',
      'MB',
      results.server.avgMemory.toFixed(2),
      results.client.avgMemory.toFixed(2),
      'Memory footprint',
    ],
    [
      'Efficiency',
      'Peak memory',
      'MB',
      results.server.peakMemory.toFixed(2),
      results.client.peakMemory.toFixed(2),
      'Peak memory usage',
    ],
    [
      'UX',
      'End-to-end latency',
      'ms',
      results.server.endToEndLatency.toFixed(2),
      results.client.endToEndLatency.toFixed(2),
      'User-perceived total time',
    ],
    [
      'UX',
      'Time-to-first',
      'ms',
      results.server.timeToFirst.toFixed(2),
      results.client.timeToFirst.toFixed(2),
      'Cold-start perception',
    ],
    [
      'UX',
      'Jitter',
      'ms',
      results.server.jitter.toFixed(2),
      results.client.jitter.toFixed(2),
      'Latency variability',
    ],
    [
      'Network',
      'RTT',
      'ms',
      results.server.rtt.toFixed(2),
      results.client.rtt.toFixed(2),
      'Round-trip time (server only)',
    ],
    [
      'Metadata',
      'Platform',
      'string',
      results.server.platform,
      results.client.platform,
      'OS/hardware',
    ],
    [
      'Metadata',
      'Success Rate',
      '%',
      results.server.successRate,
      results.client.successRate,
      'Successful inferences',
    ],
  ];

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `llm_benchmark_${new Date()
    .toLocaleString()
    .split(',')
    .map((e) => e.trim())
    .join('_')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
