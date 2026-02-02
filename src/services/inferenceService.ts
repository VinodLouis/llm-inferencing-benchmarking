import type {
  InferenceMeasurement,
  MLCEngine,
  NetworkLatencyMode,
} from '../types';
import type { ChatCompletion } from '@mlc-ai/web-llm';
import {
  simulateNetworkLatency,
  getLatencyConfig,
} from '@utils/networkLatency';

// ============================================================================
// SERVER INFERENCE SERVICE
// ============================================================================

export const serverInference = async (
  endpoint: string,
  model: string,
  prompt: string,
  networkLatencyMode: NetworkLatencyMode = 'none',
  signal?: AbortSignal,
): Promise<InferenceMeasurement> => {
  const startTime = performance.now();
  const startMemory = performance.memory?.usedJSHeapSize ?? 0;

  // Get network latency configuration
  const latencyConfig = getLatencyConfig(networkLatencyMode);
  const simulatedLatency = latencyConfig.latency;

  try {
    // Simulate network latency for request (one-way)
    await simulateNetworkLatency(simulatedLatency);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    // Simulate network latency for response (one-way)
    await simulateNetworkLatency(simulatedLatency);

    const endTime = performance.now();
    const endMemory = performance.memory?.usedJSHeapSize ?? 0;

    return {
      latency: endTime - startTime,
      timestamp: Date.now(),
      memoryDelta: endMemory - startMemory,
      responseLength: (data.response as string | undefined)?.length ?? 0,
      success: true,
    };
  } catch (error) {
    return {
      latency: performance.now() - startTime,
      timestamp: Date.now(),
      memoryDelta: 0,
      responseLength: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// ============================================================================
// CLIENT INFERENCE SERVICE
// ============================================================================

export const clientInference = async (
  engine: MLCEngine,
  prompt: string,
): Promise<InferenceMeasurement> => {
  const startTime = performance.now();
  const startMemory = performance.memory?.usedJSHeapSize ?? 0;

  try {
    const reply = (await engine.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    })) as ChatCompletion;

    const endTime = performance.now();
    const endMemory = performance.memory?.usedJSHeapSize ?? 0;
    //console.log('Client reply:', reply);
    return {
      latency: endTime - startTime,
      timestamp: Date.now(),
      memoryDelta: endMemory - startMemory,
      responseLength: reply.choices[0]?.message?.content?.length ?? 0,
      success: true,
    };
  } catch (error) {
    return {
      latency: performance.now() - startTime,
      timestamp: Date.now(),
      memoryDelta: 0,
      responseLength: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
