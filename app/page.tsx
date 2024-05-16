'use client';

import { type CoreMessage } from 'ai';
import { useState, useEffect } from 'react';
import { continueConversation } from './actions';
import { readStreamableValue } from 'ai/rsc';

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  function submitMessages() {
    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: 'user' },
    ];
    setMessages(newMessages);
    setInput('');
    setIsFetching(true);
  }
  useEffect(() => {
    if (!isFetching) return;
    async function startConversation() {
      const result = await continueConversation(messages);
      for await (const content of readStreamableValue(result)) {
        setMessages([
          ...messages,
          {
            role: 'assistant',
            content: content as string,
          },
        ]);
      }
      setIsFetching(false);
    }
    startConversation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content as string}
        </div>
      ))}

      <form
        action={submitMessages}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl dark:text-black"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}