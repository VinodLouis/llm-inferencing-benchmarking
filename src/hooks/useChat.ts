import { useCallback, useRef, useState } from 'react';
import { CreateMLCEngine } from '@mlc-ai/web-llm';
import type { MLCEngine } from '../types';
import type { ChatCompletion } from '@mlc-ai/web-llm';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export const useChat = (endpoint: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const engineRef = useRef<MLCEngine | null>(null);

  const append = useCallback((m: ChatMessage) => {
    setMessages((s) => [...s, m]);
  }, []);

  const clear = useCallback(() => setMessages([]), []);

  const stop = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setIsStreaming(false);
  }, []);

  const send = useCallback(
    async (userText: string, files?: File[]) => {
      const userMsg: ChatMessage = {
        id: String(Date.now()) + '-u',
        role: 'user',
        content: userText,
      };
      append(userMsg);

      const assistantMsg: ChatMessage = {
        id: String(Date.now()) + '-a',
        role: 'assistant',
        content: '',
      };
      append(assistantMsg);

      const form = new FormData();
      form.append('prompt', userText);
      files?.forEach((f) => form.append('files', f));

      const controller = new AbortController();
      controllerRef.current = controller;

      setIsStreaming(true);

      try {
        // Prepare prompt including file contents (text files inline, others as base64)
        let combinedPrompt = userText;
        if (files && files.length > 0) {
          for (const f of files) {
            try {
              if (
                f.type.startsWith('text/') ||
                f.name.endsWith('.txt') ||
                f.name.endsWith('.json') ||
                f.name.endsWith('.md')
              ) {
                const text = await f.text();
                combinedPrompt += `\n\n===FILE: ${f.name} (text)===\n${text}\n===END FILE===`;
              } else {
                const buf = await f.arrayBuffer();
                const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
                combinedPrompt += `\n\n===FILE: ${f.name} (base64)===\n${b64}\n===END FILE===`;
              }
            } catch (readErr) {
              combinedPrompt += `\n\n===FILE: ${f.name} (error reading file)===\n${String(readErr)}\n===END FILE===`;
            }
          }
        }

        // Lazily initialize engine if not present
        if (!engineRef.current) {
          // default model mapping used in other hooks
          const webLLMModel = 'Llama-3.2-1B-Instruct-q4f32_1-MLC';
          engineRef.current = await CreateMLCEngine(webLLMModel, {});
        }

        const engine = engineRef.current as MLCEngine;

        // Call local webllm for completion (non-streaming)
        const reply = (await engine.chat.completions.create({
          messages: [{ role: 'user', content: combinedPrompt }],
          max_tokens: 1000,
        })) as ChatCompletion;

        const text = reply.choices?.[0]?.message?.content ?? '';

        setMessages((s) =>
          s.map((m) =>
            m.id === assistantMsg.id ? { ...m, content: text } : m,
          ),
        );
      } catch (err) {
        if ((err as any).name === 'AbortError') {
          setMessages((s) =>
            s.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: m.content + ' [stopped]' }
                : m,
            ),
          );
        } else {
          setMessages((s) =>
            s.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: m.content + ' [error] ' + String(err) }
                : m,
            ),
          );
        }
      } finally {
        setIsStreaming(false);
        controllerRef.current = null;
      }
    },
    [append, endpoint],
  );

  return {
    messages,
    send,
    stop,
    clear,
    isStreaming,
  } as const;
};
