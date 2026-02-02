import React from 'react';
import { Zap, TrendingUp, Globe } from 'lucide-react';
import type { PerformanceComparisonProps } from '../types';

export const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({
  results,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Performance Comparison</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5" />
            <p className="text-sm font-medium">Latency Speedup</p>
          </div>
          <p className="text-3xl font-bold">
            {results.comparison.latencySpeedup}x
          </p>
          <p className="text-xs mt-1 opacity-90">
            {parseFloat(results.comparison.latencySpeedup) > 1
              ? 'Server faster'
              : 'Client faster'}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <p className="text-sm font-medium">Throughput Ratio</p>
          </div>
          <p className="text-3xl font-bold">
            {results.comparison.throughputRatio}x
          </p>
          <p className="text-xs mt-1 opacity-90">
            {parseFloat(results.comparison.throughputRatio) > 1
              ? 'client handles more samples per second'
              : 'Server handles more samples per second'}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5" />
            <p className="text-sm font-medium">Memory Ratio</p>
          </div>
          <p className="text-3xl font-bold">
            {Math.abs(parseFloat(results.comparison.memoryRatio))}x
          </p>
          <p className="text-xs mt-1 opacity-90">
            {Math.abs(parseFloat(results.comparison.memoryRatio)) > 1
              ? 'Browser computation uses more memory'
              : 'No Browser memory overhead'}
          </p>
          <p className="text-xs mt-1 opacity-90">
            <small>
              {results.client.avgMemory < 0 ? 'Memory released' : 'Memory used'}
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};
