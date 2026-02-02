import React from 'react';
import type { BenchmarkConfigProps } from '../types';
import { NETWORK_LATENCY_CONFIGS } from '@utils/networkLatency';

export const BenchmarkConfig: React.FC<BenchmarkConfigProps> = ({
  config,
  setConfig,
  status,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Server Endpoint (Ollama)
          </label>
          <input
            type="text"
            value={config.serverEndpoint}
            onChange={(e) =>
              setConfig({ ...config, serverEndpoint: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={status === 'running'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model (Server & Client)
          </label>
          <select
            value={config.model}
            onChange={(e) => setConfig({ ...config, model: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={status === 'running'}
          >
            <option value="llama3.2:1b">Llama 3.2 1B (Small)</option>
            <option value="llama3.2:3b">Llama 3.2 3B (Larger)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Network Latency Simulation
          </label>
          <select
            value={config.networkLatency}
            onChange={(e) =>
              setConfig({ ...config, networkLatency: e.target.value as any })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={status === 'running'}
          >
            {Object.values(NETWORK_LATENCY_CONFIGS).map((latency) => (
              <option key={latency.mode} value={latency.mode}>
                {latency.label} ({latency.latency}ms)
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {NETWORK_LATENCY_CONFIGS[config.networkLatency].description}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Iterations {/*  (warmup: {config.warmupIterations}) */}
          </label>
          <input
            type="number"
            value={config.numIterations}
            onChange={(e) =>
              setConfig({
                ...config,
                numIterations: parseInt(e.target.value, 10),
              })
            }
            min="3"
            max="50"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={status === 'running'}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Prompts: {config.testPrompts.length}
          </label>
          <div className="text-sm text-gray-600 mt-2">
            Diverse prompts testing different response types. Network latency
            adds{' '}
            <strong>
              {NETWORK_LATENCY_CONFIGS[config.networkLatency].latency * 2}ms
            </strong>{' '}
            round-trip delay to server requests.
          </div>
        </div>
      </div>
    </div>
  );
};
