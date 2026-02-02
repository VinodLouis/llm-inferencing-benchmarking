import React from 'react';
import type { MetricsTableProps, MetricRowProps } from '../types';

const MetricRow: React.FC<MetricRowProps> = ({
  category,
  metric,
  unit,
  serverVal,
  clientVal,
  interpretation,
}) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50">
    <td className="px-4 py-2 text-sm text-gray-600">{category}</td>
    <td className="px-4 py-2 text-sm font-medium">{metric}</td>
    <td className="px-4 py-2 text-sm text-gray-500">{unit}</td>
    <td className="px-4 py-2 text-sm text-right font-mono">{serverVal}</td>
    <td className="px-4 py-2 text-sm text-right font-mono">{clientVal}</td>
    <td className="px-4 py-2 text-sm text-gray-600">{interpretation}</td>
  </tr>
);

export const MetricsTable: React.FC<MetricsTableProps> = ({ results }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        📊 Detailed Metrics
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Metric
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Unit
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Server
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Client
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Interpretation
              </th>
            </tr>
          </thead>
          <tbody>
            <MetricRow
              category="Accuracy"
              metric="Precision"
              unit="0-1"
              serverVal={results.server.precision.toFixed(3)}
              clientVal={results.client.precision.toFixed(3)}
              interpretation="% of positive predictions correct"
            />
            <MetricRow
              category="Accuracy"
              metric="Recall"
              unit="0-1"
              serverVal={results.server.recall.toFixed(3)}
              clientVal={results.client.recall.toFixed(3)}
              interpretation="% of positive samples found"
            />
            <MetricRow
              category="Accuracy"
              metric="F1-Score"
              unit="0-1"
              serverVal={results.server.f1Score.toFixed(3)}
              clientVal={results.client.f1Score.toFixed(3)}
              interpretation="Balanced precision & recall"
            />
            <MetricRow
              category="Accuracy"
              metric="ROC-AUC"
              unit="0-1"
              serverVal={results.server.rocAuc.toFixed(3)}
              clientVal={results.client.rocAuc.toFixed(3)}
              interpretation="Ranking quality"
            />
            <MetricRow
              category="Efficiency"
              metric="Avg latency"
              unit="ms"
              serverVal={results.server.avgLatency.toFixed(2)}
              clientVal={results.client.avgLatency.toFixed(2)}
              interpretation="Mean inference time"
            />
            <MetricRow
              category="Efficiency"
              metric="Min latency"
              unit="ms"
              serverVal={results.server.minLatency.toFixed(2)}
              clientVal={results.client.minLatency.toFixed(2)}
              interpretation="Minimum latency"
            />
            <MetricRow
              category="Efficiency"
              metric="Max latency"
              unit="ms"
              serverVal={results.server.maxLatency.toFixed(2)}
              clientVal={results.client.maxLatency.toFixed(2)}
              interpretation="Maximum latency"
            />
            <MetricRow
              category="Efficiency"
              metric="Median latency"
              unit="ms"
              serverVal={results.server.medianLatency.toFixed(2)}
              clientVal={results.client.medianLatency.toFixed(2)}
              interpretation="50th percentile"
            />
            <MetricRow
              category="Efficiency"
              metric="P95 latency"
              unit="ms"
              serverVal={results.server.p95Latency.toFixed(2)}
              clientVal={results.client.p95Latency.toFixed(2)}
              interpretation="95th percentile"
            />
            <MetricRow
              category="Efficiency"
              metric="P99 latency"
              unit="ms"
              serverVal={results.server.p99Latency.toFixed(2)}
              clientVal={results.client.p99Latency.toFixed(2)}
              interpretation="99th percentile"
            />
            <MetricRow
              category="Efficiency"
              metric="Std dev"
              unit="ms"
              serverVal={results.server.stdDev.toFixed(2)}
              clientVal={results.client.stdDev.toFixed(2)}
              interpretation="Latency variability"
            />
            <MetricRow
              category="Efficiency"
              metric="Cold latency"
              unit="ms"
              serverVal={results.server.coldLatency.toFixed(2)}
              clientVal={results.client.coldLatency.toFixed(2)}
              interpretation="First inference"
            />
            <MetricRow
              category="Efficiency"
              metric="Warm latency"
              unit="ms"
              serverVal={results.server.warmLatency.toFixed(2)}
              clientVal={results.client.warmLatency.toFixed(2)}
              interpretation="Steady state"
            />
            <MetricRow
              category="Efficiency"
              metric="Throughput"
              unit="samples/s"
              serverVal={results.server.throughput.toFixed(2)}
              clientVal={results.client.throughput.toFixed(2)}
              interpretation="Capacity"
            />
            <MetricRow
              category="Efficiency"
              metric="Avg memory"
              unit="MB"
              serverVal={results.server.avgMemory.toFixed(2)}
              clientVal={results.client.avgMemory.toFixed(2)}
              interpretation="Memory footprint"
            />
            <MetricRow
              category="Efficiency"
              metric="Peak memory"
              unit="MB"
              serverVal={results.server.peakMemory.toFixed(2)}
              clientVal={results.client.peakMemory.toFixed(2)}
              interpretation="Peak memory usage"
            />
            <MetricRow
              category="UX"
              metric="End-to-end latency"
              unit="ms"
              serverVal={results.server.endToEndLatency.toFixed(2)}
              clientVal={results.client.endToEndLatency.toFixed(2)}
              interpretation="User-perceived total time"
            />
            <MetricRow
              category="UX"
              metric="Time-to-first"
              unit="ms"
              serverVal={results.server.timeToFirst.toFixed(2)}
              clientVal={results.client.timeToFirst.toFixed(2)}
              interpretation="Cold-start perception"
            />
            <MetricRow
              category="UX"
              metric="Jitter"
              unit="ms"
              serverVal={results.server.jitter.toFixed(2)}
              clientVal={results.client.jitter.toFixed(2)}
              interpretation="Latency variability"
            />
            <MetricRow
              category="Network"
              metric="RTT"
              unit="ms"
              serverVal={results.server.rtt.toFixed(2)}
              clientVal={results.client.rtt.toFixed(2)}
              interpretation="Round-trip time (server only)"
            />
            <MetricRow
              category="Metadata"
              metric="Platform"
              unit="string"
              serverVal={results.server.platform}
              clientVal={results.client.platform}
              interpretation="OS/hardware"
            />
            <MetricRow
              category="Metadata"
              metric="Success Rate"
              unit="%"
              serverVal={results.server.successRate}
              clientVal={results.client.successRate}
              interpretation="Successful inferences"
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};
