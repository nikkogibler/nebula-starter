import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [message, setMessage] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Form submitted"); // 👈 Add this line
  if (!prompt) return;

  const { error } = await supabase.from('prompts').insert([{ text: prompt }]);

  if (error) {
    console.error('Supabase insert error:', error);
    setMessage('❌ Something went wrong.');
  } else {
    setMessage('✅ Prompt saved!');
    setPrompt('');
  }
};


  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Nebula 🌌</h1>
        <p className="text-lg text-gray-300 mb-8">
          Explore your saved universe. Use the prompt bar below to generate your custom layout.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Try: Show my saved TikToks from 2022 in a moodboard"
            className="w-full bg-gray-800 text-white rounded-lg p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {message && <p className="text-green-400 mt-4">{message}</p>}
      </div>
    </div>
  );
}
