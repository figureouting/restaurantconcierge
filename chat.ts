import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { searchRestaurants } from '../../lib/google';
import { rankRestaurants } from '../../lib/ranker';
import { bookTable } from '../../lib/opentable';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'No message' });

  // Very simplified intent extraction
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a Dubai restaurant booking concierge.' },
      ...history,
      { role: 'user', content: message }
    ],
    tools: [{
      type: 'function',
      function: {
        name: 'extract',
        parameters: {
          type: 'object',
          properties: {
            party_size: { type: 'integer' },
            cuisine: { type: 'string' },
            dietary: { type: 'string' },
            alcohol: { type: 'boolean' },
            datetime: { type: 'string' },
            location: { type: 'string' }
          },
          required: ['party_size', 'datetime']
        }
      }
    }],
    tool_choice: 'auto'
  });

  const toolCall = completion.choices[0].message.tool_calls?.[0];
  if (!toolCall) return res.json({ reply: completion.choices[0].message.content });

  const args = JSON.parse(toolCall.function.arguments);
  const places = await searchRestaurants(args);
  const ranked = await rankRestaurants(args, places);

  if (args.intent === 'book' && args.place_id) {
    const confirmation = await bookTable(args, args.place_id);
    return res.json({ reply: `Booked! Confirmation: ${confirmation}` });
  }

  const top3 = ranked.slice(0, 3).map(p => `• ${p.name} (${p.rating}★)` ).join('\n');
  res.json({ reply: `Here are some options:\n${top3}` });
}
