import { useState, useRef, useCallback } from 'react';
import { CreateMLCEngine } from '@mlc-ai/web-llm';
import type {
  BenchmarkConfig,
  BenchmarkStatus,
  BenchmarkResults,
  Analysis,
  MLCEngine,
  InferenceMeasurement,
} from '../types';
import { serverInference, clientInference } from '@services/inferenceService';
import { calculateMetrics } from '@utils/metricsCalculator';
import { analyzeResults } from '@services/analysisService';

interface UseBenchmarkReturn {
  status: BenchmarkStatus;
  progress: string;
  results: BenchmarkResults | null;
  analysis: Analysis | null;
  runBenchmark: (config: BenchmarkConfig) => Promise<void>;
  stopBenchmark: () => void;
  engineRef: React.MutableRefObject<MLCEngine | null>;
}

export const useBenchmark = (): UseBenchmarkReturn => {
  const [status, setStatus] = useState<BenchmarkStatus>('idle');
  const [progress, setProgress] = useState<string>('');
  const [results, setResults] = useState<BenchmarkResults | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const engineRef = useRef<MLCEngine | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadWebLLM = useCallback(async (model: string): Promise<boolean> => {
    try {
      setProgress('Loading WebLLM library...');

      const modelMapping: Record<string, string> = {
        'llama3.2:1b': 'Llama-3.2-1B-Instruct-q4f32_1-MLC',
        'llama3.2:3b': 'Llama-3.2-3B-Instruct-q4f32_1-MLC',
        'phi3.5': 'Phi-3.5-mini-instruct-q4f16_1-MLC',
      };

      const webLLMModel =
        modelMapping[model] || 'Llama-3.2-1B-Instruct-q4f32_1-MLC';

      setProgress(`Initializing ${webLLMModel}...`);
      engineRef.current = await CreateMLCEngine(webLLMModel, {
        initProgressCallback: (info) => {
          setProgress(`Loading: ${info.text}`);
        },
        //runtime: 'wasm',
      });

      setProgress('Client model loaded successfully');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setProgress(`Error loading WebLLM: ${message}`);
      return false;
    }
  }, []);

  const runBenchmark = useCallback(
    async (config: BenchmarkConfig): Promise<void> => {
      abortControllerRef.current = new AbortController();
      setStatus('running');
      setResults(null);
      setAnalysis(null);
      setProgress('');

      const serverMeasurements: InferenceMeasurement[] = [];
      const clientMeasurements: InferenceMeasurement[] = [];

      try {
        const clientLoaded = await loadWebLLM(config.model);
        if (!clientLoaded) {
          setStatus('error');
          return;
        }

        const totalTests = config.numIterations * config.testPrompts.length;
        let completed = 0;

        // Server benchmarks
        setProgress('Running server benchmarks...');
        for (let i = 0; i < config.numIterations; i++) {
          for (const prompt of config.testPrompts) {
            const result = await serverInference(
              config.serverEndpoint,
              config.model,
              prompt,
              config.networkLatency,
              abortControllerRef.current.signal,
            );
            // if (i >= config.warmupIterations) {
            serverMeasurements.push(result);
            //}
            completed++;
            setProgress(`Server: ${completed}/${totalTests} tests complete`);
          }
        }

        // Client benchmarks
        setProgress('Running client benchmarks...');
        completed = 0;
        if (engineRef.current) {
          for (let i = 0; i < config.numIterations; i++) {
            for (const prompt of config.testPrompts) {
              const result = await clientInference(engineRef.current, prompt);
              //if (i >= config.warmupIterations) {
              clientMeasurements.push(result);
              //}
              completed++;
              setProgress(`Client: ${completed}/${totalTests} tests complete`);
            }
          }
        }

        const serverMetrics = calculateMetrics(serverMeasurements, 'Server');
        const clientMetrics = calculateMetrics(clientMeasurements, 'Client');

        const benchmarkResults: BenchmarkResults = {
          server: serverMetrics,
          client: clientMetrics,
          comparison: {
            latencySpeedup: (
              clientMetrics.avgLatency / serverMetrics.avgLatency
            ).toFixed(2),
            throughputRatio: (
              clientMetrics.throughput / serverMetrics.throughput
            ).toFixed(2),
            memoryRatio: (
              clientMetrics.avgMemory / serverMetrics.avgMemory
            ).toFixed(2),
          },
        };

        setResults(benchmarkResults);
        setAnalysis(analyzeResults(serverMetrics, clientMetrics));
        setStatus('complete');
        setProgress('Benchmark complete!');
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          setProgress('Benchmark cancelled');
        } else {
          const message =
            error instanceof Error ? error.message : 'Unknown error';
          setProgress(`Error: ${message}`);
        }
        setStatus('error');
      }
    },
    [loadWebLLM],
  );

  const stopBenchmark = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus('idle');
    setProgress('Stopped');
  }, []);

  return {
    status,
    progress,
    results,
    analysis,
    runBenchmark,
    stopBenchmark,
    engineRef,
  };
};
