// ============================================================================
// CORE TYPES
// ============================================================================

export type NetworkLatencyMode = 'none' | 'lan' | 'wifi' | '5g' | '4g';

export interface NetworkLatencyConfig {
  mode: NetworkLatencyMode;
  label: string;
  latency: number; // in milliseconds
  description: string;
}

export interface BenchmarkConfig {
  serverEndpoint: string;
  model: string;
  numIterations: number;
  warmupIterations: number;
  testPrompts: string[];
  networkLatency: NetworkLatencyMode;
}

export interface InferenceMeasurement {
  latency: number;
  timestamp: number;
  memoryDelta: number;
  responseLength: number;
  success: boolean;
  error?: string;
}

export interface Metrics {
  label: string;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  medianLatency: number;
  p95Latency: number;
  p99Latency: number;
  stdDev: number;
  coldLatency: number;
  warmLatency: number;
  throughput: number;
  avgMemory: number;
  peakMemory: number;
  endToEndLatency: number;
  timeToFirst: number;
  jitter: number;
  rtt: number;
  timestamp: number;
  platform: string;
  browserVersion: string;
  totalIterations: number;
  successRate: string;
}

export interface BenchmarkResults {
  server: Metrics;
  client: Metrics;
  comparison: {
    latencySpeedup: string;
    throughputRatio: string;
    memoryRatio: string;
  };
}

export interface AnalysisInsight {
  metric: string;
  winner: 'Client' | 'Server';
  reason: string;
  impact: string;
}

export interface FutureOutlookItem {
  category: string;
  trend: string;
  details: string;
  timeframe: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface Analysis {
  winner: {
    latency?: 'client' | 'server';
    throughput?: 'client' | 'server';
  };
  insights: AnalysisInsight[];
  futureOutlook: FutureOutlookItem[];
}

export type BenchmarkStatus = 'idle' | 'running' | 'complete' | 'error';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface BenchmarkConfigProps {
  config: BenchmarkConfig;
  setConfig: (config: BenchmarkConfig) => void;
  status: BenchmarkStatus;
}

export interface PerformanceComparisonProps {
  results: BenchmarkResults;
}

export interface AnalysisInsightsProps {
  analysis: Analysis;
}

export interface FutureOutlookProps {
  analysis: Analysis;
}

export interface MetricsTableProps {
  results: BenchmarkResults;
}

export interface MetricRowProps {
  category: string;
  metric: string;
  unit: string;
  serverVal: string;
  clientVal: string;
  interpretation: string;
}

// ============================================================================
// SERVICE TYPES
// ============================================================================

export interface InferenceServiceConfig {
  endpoint: string;
  model: string;
  signal?: AbortSignal;
}

// Import MLCEngineInterface from the package
import type { MLCEngineInterface } from '@mlc-ai/web-llm';

export type MLCEngine = MLCEngineInterface;

export interface WebLLMLoadOptions {
  initProgressCallback?: (info: { text: string }) => void;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ModelMapping = {
  [key: string]: string;
};

export interface CSVExportData {
  results: BenchmarkResults;
  analysis?: Analysis;
}
