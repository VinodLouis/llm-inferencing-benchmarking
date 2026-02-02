import React from 'react';
import { Wifi, Signal, Smartphone, Network } from 'lucide-react';
import type { BenchmarkResults } from '../types';
import { NETWORK_LATENCY_CONFIGS } from '../utils/networkLatency';

interface NetworkLatencyInfoProps {
  results: BenchmarkResults;
  networkLatencyMode: string;
}

export const NetworkLatencyInfo: React.FC<NetworkLatencyInfoProps> = ({
  results,
  networkLatencyMode,
}) => {
  const latencyConfig =
    NETWORK_LATENCY_CONFIGS[
      networkLatencyMode as keyof typeof NETWORK_LATENCY_CONFIGS
    ];
  const simulatedLatency = latencyConfig?.latency * 2 || 0; // Round trip

  const getIcon = () => {
    switch (networkLatencyMode) {
      case 'lan':
        return <Network className="w-5 h-5" />;
      case 'wifi':
        return <Wifi className="w-5 h-5" />;
      case '5g':
      case '4g':
        return <Smartphone className="w-5 h-5" />;
      default:
        return <Signal className="w-5 h-5" />;
    }
  };

  if (networkLatencyMode === 'none') {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg shadow-md p-6 border-2 border-orange-200">
      <div className="flex items-start gap-3">
        <div className="text-orange-600">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Network Latency Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Simulated Network</p>
              <p className="text-2xl font-bold text-orange-600">
                {latencyConfig?.label}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {simulatedLatency}ms round-trip delay
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Server Total Latency</p>
              <p className="text-2xl font-bold text-blue-600">
                {results.server.avgLatency.toFixed(2)}ms
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Inference + Network ({simulatedLatency}ms)
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Client Total Latency</p>
              <p className="text-2xl font-bold text-green-600">
                {results.client.avgLatency.toFixed(2)}ms
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Pure inference (no network delay)
              </p>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">
              💡 Key Insight:
            </h4>
            <p className="text-sm text-gray-700">
              The server latency includes <strong>{simulatedLatency}ms</strong>{' '}
              of simulated network delay ({latencyConfig?.description}), while
              client-side inference has <strong>zero network overhead</strong>.
              This demonstrates how network conditions significantly impact
              server-based inference, making client-side inference more
              attractive for latency-sensitive applications.
            </p>
          </div>

          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-900">
              <strong>Research Note:</strong> In real-world scenarios, network
              latency varies based on distance, connection quality, and
              infrastructure. These simulated values represent typical
              conditions but actual latency may vary ±20-50%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
