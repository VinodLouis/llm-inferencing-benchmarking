import React, { useMemo, useState } from 'react';
import { useChat } from '../hooks/useChat';

type Props = {
  serverEndpoint: string;
};

export const ChatPanel: React.FC<Props> = ({ serverEndpoint }) => {
  const { messages, send, stop, clear, isStreaming } = useChat(serverEndpoint);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[] | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return setFiles(null);
    setFiles(Array.from(list));
  };

  const onSend = async () => {
    if (!input.trim()) return;
    await send(input.trim(), files ?? undefined);
    setInput('');
    setFiles(null);
  };

  const canSend = !!input.trim() && !isStreaming;

  const renderMessage = (m: { id: string; role: string; content: string }) => {
    const cls =
      m.role === 'user'
        ? 'bg-blue-50 text-gray-900'
        : 'bg-gray-50 text-gray-900';
    return (
      <div key={m.id} className={`p-3 rounded-md my-2 ${cls}`}>
        <div className="text-sm whitespace-pre-wrap">{m.content}</div>
      </div>
    );
  };

  const fileList = useMemo(() => {
    if (!files || files.length === 0) return null;
    return (
      <div className="text-sm text-gray-700 mb-2">
        {files.map((f) => (
          <div key={f.name} className="inline-block mr-2">
            {f.name}
          </div>
        ))}
      </div>
    );
  }, [files]);

  return (
    <div className="w-full max-w-3xl p-4 bg-white rounded-lg shadow">
      <div className="mb-3 flex justify-between items-center">
        <h2 className="text-lg font-medium">Chat (local LLM)</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              stop();
            }}
            disabled={!isStreaming}
            className="px-3 py-1 rounded bg-red-100 text-red-700 disabled:opacity-50"
          >
            Stop
          </button>
          <button
            onClick={() => clear()}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="h-64 overflow-auto mb-3 border border-gray-100 p-3 rounded">
        {messages.length === 0 ? (
          <div className="text-sm text-gray-500">
            No messages yet. Ask something!
          </div>
        ) : (
          messages.map(renderMessage)
        )}
      </div>

      {fileList}

      <div className="flex gap-2">
        <input
          type="file"
          multiple
          onChange={onFileChange}
          className="text-sm text-gray-600"
        />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or paste a prompt..."
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          onClick={onSend}
          disabled={!canSend}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
