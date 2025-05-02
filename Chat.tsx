import { useState } from 'react';
import axios from 'axios';

type Message = { role: 'user' | 'assistant'; content: string };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  async function send() {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const { data } = await axios.post('/api/chat', { message: input, history: messages });
    setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
  }

  return (
    <div className="w-full max-w-md">
      <div className="border rounded p-2 h-96 overflow-y-auto mb-2">
        {messages.map((m, i) => (
          <p key={i} className={m.role === 'user' ? 'text-blue-600' : 'text-green-700'}>
            <strong>{m.role === 'user' ? 'You' : 'Bot'}:</strong> {m.content}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask for a restaurant..."
        />
        <button onClick={send} className="bg-blue-500 text-white px-3 rounded">Send</button>
      </div>
    </div>
  );
}
