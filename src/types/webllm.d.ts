// Type declarations for @mlc-ai/web-llm
// This provides TypeScript support for the WebLLM library

declare module '@mlc-ai/web-llm' {
  export interface InitProgressReport {
    progress: number;
    timeElapsed: number;
    text: string;
  }

  export interface ChatCompletionMessageParam {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }

  export interface ChatCompletionRequest {
    messages: ChatCompletionMessageParam[];
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    stream?: boolean;
  }

  export interface ChatCompletionChunk {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
      index: number;
      delta: {
        role?: string;
        content?: string;
      };
      finish_reason: string | null;
    }>;
  }

  export interface ChatCompletion {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }>;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }

  export interface MLCEngineInterface {
    chat: {
      completions: {
        create(
          request: ChatCompletionRequest,
        ): Promise<ChatCompletion | AsyncIterable<ChatCompletionChunk>>;
      };
    };
    reload(modelId: string, chatOpts?: ChatOptions): Promise<void>;
    unload(): Promise<void>;
    resetChat(): Promise<void>;
    runtimeStatsText(): Promise<string>;
    interruptGenerate(): void;
    getMessage(): Promise<string>;
  }

  export interface ChatOptions {
    context_window_size?: number;
    sliding_window_size?: number;
    attention_sink_size?: number;
    max_batch_size?: number;
    max_num_sequence?: number;
  }

  export interface EngineConfig {
    initProgressCallback?: (report: InitProgressReport) => void;
    logLevel?: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'SILENT';
    runtime?: 'wasm' | 'webgpu';
  }

  export interface AppConfig {
    model_list: Array<{
      model_id: string;
      model_url: string;
      model_lib_url?: string;
      required_features?: string[];
      buffer_size_required_bytes?: number;
      low_resource_required?: boolean;
    }>;
  }

  export function CreateMLCEngine(
    modelId: string,
    engineConfig?: EngineConfig,
    appConfig?: AppConfig,
  ): Promise<MLCEngineInterface>;

  export function hasModelInCache(modelId: string): Promise<boolean>;

  export function deleteModelFromCache(modelId: string): Promise<void>;

  export function deleteModelAllInfoInCache(modelId: string): Promise<void>;

  export const prebuiltAppConfig: AppConfig;
}
