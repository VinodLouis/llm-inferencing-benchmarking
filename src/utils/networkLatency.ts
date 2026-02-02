import type { NetworkLatencyMode, NetworkLatencyConfig } from '../types';

// Network latency configurations based on real-world scenarios
export const NETWORK_LATENCY_CONFIGS: Record<
  NetworkLatencyMode,
  NetworkLatencyConfig
> = {
  none: {
    mode: 'none',
    label: 'Localhost (No Delay)',
    latency: 0,
    description: 'Direct connection - server on same machine',
  },
  lan: {
    mode: 'lan',
    label: 'Lab LAN',
    latency: 2.5,
    description: 'Local Area Network - server in same building',
  },
  wifi: {
    mode: 'wifi',
    label: 'Home WiFi',
    latency: 15,
    description: 'Home WiFi - typical residential connection',
  },
  '5g': {
    mode: '5g',
    label: '5G Mobile',
    latency: 30,
    description: '5G cellular network',
  },
  '4g': {
    mode: '4g',
    label: '4G Mobile',
    latency: 60,
    description: '4G/LTE cellular network',
  },
};

/**
 * Simulates network latency by delaying execution
 * @param latencyMs - Latency in milliseconds
 */
export const simulateNetworkLatency = async (
  latencyMs: number,
): Promise<void> => {
  if (latencyMs <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, latencyMs));
};

/**
 * Gets the latency configuration for a given mode
 * @param mode - Network latency mode
 */
export const getLatencyConfig = (
  mode: NetworkLatencyMode,
): NetworkLatencyConfig => {
  return NETWORK_LATENCY_CONFIGS[mode];
};

/**
 * Calculates total simulated latency for a round trip
 * @param mode - Network latency mode
 * @returns Total latency in milliseconds (round trip = 2x one-way)
 */
export const getRoundTripLatency = (mode: NetworkLatencyMode): number => {
  return NETWORK_LATENCY_CONFIGS[mode].latency * 2;
};
