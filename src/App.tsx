import React, { useState } from 'react';
import { Download, Play, Square } from 'lucide-react';
import type { BenchmarkConfig } from './types';
import { useBenchmark } from './hooks/useBenchmark';
import { exportToCSV } from './utils/csvExporter';
import { BenchmarkConfig as ConfigComponent } from './components/BenchmarkConfig';
import { PerformanceComparison } from './components/PerformanceComparison';
import { MetricsTable } from './components/MetricsTable';
import { NetworkLatencyInfo } from './components/NetworkLatencyInfo';
import ChatPanel from './components/ChatPanel';

const App: React.FC = () => {
  const [config, setConfig] = useState<BenchmarkConfig>({
    serverEndpoint: 'http://localhost:11434/api/generate',
    model: 'llama3.2:1b',
    numIterations: 1,
    warmupIterations: 2,
    networkLatency: 'wifi',
    testPrompts: [
      // 'What is machine learning?',
      // 'Explain quantum computing in simple terms.',
      // 'Write a short poem about technology.',
      // 'List 5 benefits of renewable energy.',
      // 'Describe how a neural network works.',

      // --- Generic reasoning ---
      'What are the key differences between deductive and inductive reasoning?',
      'Explain the concept of cause and effect with a real-world example.',
      'Why is critical thinking important in everyday decision-making?',
      'Describe how analogies help in problem-solving.',
      // --- Advanced statistics ---
      'Explain the difference between correlation and causation with statistical examples.',
      'What is the Central Limit Theorem and why is it important?',
      'Describe how hypothesis testing works, including Type I and Type II errors.',
      'List and explain 3 assumptions behind linear regression models.',
      'How does Bayesian inference differ from frequentist statistics?',
      'Explain p-values and confidence intervals in the context of statistical significance.',
    ],
  });

  const { status, progress, results, analysis, runBenchmark, stopBenchmark } =
    useBenchmark();

  const [showChat, setShowChat] = useState(false);

  const handleExport = (): void => {
    if (results) {
      exportToCSV(results, analysis ?? undefined, config.networkLatency);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          LLM Inference Benchmark
        </h1>
        <p className="text-lg text-gray-600">
          Server vs Client: Same Model, Different Execution Contexts
        </p>
      </div>
      <ConfigComponent config={config} setConfig={setConfig} status={status} />

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowChat((s) => !s)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-lg"
        >
          {showChat ? 'Hide Chat' : 'Open Chat'}
        </button>

        <button
          onClick={() => runBenchmark(config)}
          disabled={status === 'running'}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-lg"
        >
          <Play className="w-5 h-5" />
          Start Benchmark
        </button>

        {status === 'running' && (
          <button
            onClick={stopBenchmark}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-lg"
          >
            <Square className="w-5 h-5" />
            Stop
          </button>
        )}

        {results && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-lg"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        )}
      </div>

      {progress && (
        <div className="mb-6 p-4 bg-white border-l-4 border-blue-500 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-700">{progress}</p>
        </div>
      )}

      {showChat && (
        <div className="mb-6">
          <ChatPanel serverEndpoint={config.serverEndpoint} />
        </div>
      )}

      {results && analysis && (
        <div className="space-y-6">
          <PerformanceComparison results={results} />
          <NetworkLatencyInfo
            results={results}
            networkLatencyMode={config.networkLatency}
          />
          {/*<FutureOutlook analysis={analysis} /> */}
          <MetricsTable results={results} />
        </div>
      )}
    </div>
  );
};

export default App;
