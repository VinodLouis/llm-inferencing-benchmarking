import type { Metrics, Analysis } from '../types';

export const analyzeResults = (
  serverMetrics: Metrics,
  clientMetrics: Metrics,
): Analysis => {
  const analysis: Analysis = {
    winner: {},
    insights: [],
    futureOutlook: [],
  };

  // Latency Analysis
  if (clientMetrics.avgLatency < serverMetrics.avgLatency) {
    analysis.winner.latency = 'client';
    analysis.insights.push({
      metric: 'Latency',
      winner: 'Client',
      reason: `Client is ${(serverMetrics.avgLatency / clientMetrics.avgLatency).toFixed(2)}x faster. No network overhead means instant local inference.`,
      impact: 'Critical for real-time applications',
    });
  } else {
    analysis.winner.latency = 'server';
    analysis.insights.push({
      metric: 'Latency',
      winner: 'Server',
      reason: `Server is ${(clientMetrics.avgLatency / serverMetrics.avgLatency).toFixed(2)}x faster. Optimized hardware and batching provide better performance.`,
      impact: 'Better for batch processing',
    });
  }

  // Throughput Analysis
  if (clientMetrics.throughput > serverMetrics.throughput) {
    analysis.winner.throughput = 'client';
    analysis.insights.push({
      metric: 'Throughput',
      winner: 'Client',
      reason: `Client achieves ${clientMetrics.throughput.toFixed(2)} samples/s vs server's ${serverMetrics.throughput.toFixed(2)} samples/s. Eliminates network bottleneck.`,
      impact: 'Scales with number of users',
    });
  } else {
    analysis.winner.throughput = 'server';
    analysis.insights.push({
      metric: 'Throughput',
      winner: 'Server',
      reason: `Server achieves higher throughput due to optimized hardware and request batching capabilities.`,
      impact: 'Better for high-volume scenarios',
    });
  }

  // Consistency Analysis
  const clientConsistency = clientMetrics.stdDev / clientMetrics.avgLatency;
  const serverConsistency = serverMetrics.stdDev / serverMetrics.avgLatency;

  if (clientConsistency < serverConsistency) {
    analysis.insights.push({
      metric: 'Consistency',
      winner: 'Client',
      reason: `Client has ${((1 - clientConsistency / serverConsistency) * 100).toFixed(1)}% less variability. Local execution eliminates network jitter.`,
      impact: 'More predictable user experience',
    });
  } else {
    analysis.insights.push({
      metric: 'Consistency',
      winner: 'Server',
      reason: `Server shows more consistent performance despite network variability, indicating robust infrastructure.`,
      impact: 'Reliable for enterprise applications',
    });
  }

  // Cold Start Analysis
  const clientColdStartOverhead =
    ((clientMetrics.coldLatency - clientMetrics.warmLatency) /
      clientMetrics.warmLatency) *
    100;
  const serverColdStartOverhead =
    ((serverMetrics.coldLatency - serverMetrics.warmLatency) /
      serverMetrics.warmLatency) *
    100;

  analysis.insights.push({
    metric: 'Cold Start',
    winner:
      clientColdStartOverhead < serverColdStartOverhead ? 'Client' : 'Server',
    reason: `Client cold start overhead: ${clientColdStartOverhead.toFixed(1)}% vs Server: ${serverColdStartOverhead.toFixed(1)}%. ${
      clientColdStartOverhead < serverColdStartOverhead
        ? 'Client model is already loaded in memory.'
        : 'Server maintains warm model instances.'
    }`,
    impact: 'Important for first interaction experience',
  });

  // Memory Analysis
  analysis.insights.push({
    metric: 'Memory Efficiency',
    winner:
      clientMetrics.avgMemory < serverMetrics.avgMemory ? 'Client' : 'Server',
    reason: `${clientMetrics.avgMemory < serverMetrics.avgMemory ? 'Client' : 'Server'} uses less memory per inference (${Math.min(clientMetrics.avgMemory, serverMetrics.avgMemory).toFixed(2)} MB). However, server memory amortizes across all users.`,
    impact: 'Server memory amortizes across all users',
  });

  // Future Outlook
  analysis.futureOutlook = [
    {
      category: 'Technology Trajectory',
      trend: 'Convergence',
      details:
        'WebGPU and WebAssembly are enabling near-native performance in browsers. The gap between client and server inference is shrinking rapidly.',
      timeframe: '2025-2027',
      impact: 'High',
    },
    {
      category: 'Model Optimization',
      trend: 'Quantization & Compression',
      details:
        '4-bit and even 2-bit quantized models are becoming viable for web deployment. Models like Llama 3.2 1B can run efficiently on mid-range devices.',
      timeframe: 'Current',
      impact: 'High',
    },
    {
      category: 'Privacy & Compliance',
      trend: 'Client-Side Preference',
      details:
        'GDPR, CCPA, and AI regulations are pushing toward local inference. Healthcare, finance, and legal sectors increasingly require on-device processing.',
      timeframe: '2024-2026',
      impact: 'Critical',
    },
    {
      category: 'Hybrid Architectures',
      trend: 'Best of Both Worlds',
      details:
        'Smart routing: simple queries on-device, complex ones to cloud. Progressive loading: start on device, escalate to cloud if needed.',
      timeframe: '2025-2028',
      impact: 'High',
    },
    {
      category: 'Edge Computing',
      trend: 'Distributed Intelligence',
      details:
        'CDN-hosted models at edge nodes combine low latency of local with power of server. 5G enables new hybrid topologies.',
      timeframe: '2026-2030',
      impact: 'Medium',
    },
    {
      category: 'Browser Capabilities',
      trend: 'Rapid Evolution',
      details:
        'WebNN (Web Neural Network API) standardization will provide optimized ML primitives. Native browser AI capabilities incoming.',
      timeframe: '2025-2027',
      impact: 'High',
    },
  ];

  return analysis;
};
