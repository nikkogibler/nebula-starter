import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [message, setMessage] = useState('');
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false });

    console.log("Fetched prompts:", data);

    if (error) {
      console.error('Error fetching prompts:', error.message);
    } else {
      setPrompts(data);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!prompt) return;

  // 🧠 Detect platform from prompt
  const lowercase = prompt.toLowerCase();
  let platform = null;

  if (lowercase.includes('tiktok')) platform = 'TikTok';
  else if (lowercase.includes('instagram') || lowercase.includes('ig')) platform = 'Instagram';
  else if (lowercase.includes('youtube') || lowercase.includes('yt')) platform = 'YouTube';
  else if (lowercase.includes('reddit')) platform = 'Reddit';
  else if (lowercase.includes('pinterest')) platform = 'Pinterest';
  else if (lowercase.includes('facebook') || lowercase.includes('fb')) platform = 'Facebook';
  else if (
    lowercase.includes('twitter') ||
    lowercase.includes('x.com') ||
    lowercase.includes('x ') ||
    lowercase.includes('on x')
  ) platform = 'X';

    console.log("Detected platform:", platform);

  // 💾 Save to Supabase
  const { error } = await supabase
  .from('prompts')
  .insert([{ text: prompt, platform }]);


  if (error) {
    console.error('Supabase insert error:', error);
    setMessage('❌ Something went wrong.');
  } else {
    setMessage('✅ Prompt saved!');
    setPrompt('');
    fetchPrompts(); // refresh the list
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

        <div className="mt-10 text-left">
          <h2 className="text-2xl font-semibold mb-4">Your Prompts</h2>
          <ul className="space-y-2">
            {prompts.map((p) => (
  <li
    key={p.id}
    className="bg-gray-800 rounded-lg px-4 py-3 text-white text-sm shadow-sm"
  >
    {p.platform && (
      <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full mr-2">
        {p.platform}
      </span>
    )}
    {p.text}
    <span className="block text-xs text-gray-500 mt-1">
      {new Date(p.created_at).toLocaleString()}
    </span>
  </li>
))}

          </ul>
        </div>
      </div>
    </div>
  );
}
