import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const timeOptions = {
  all: 'All Time',
  '7': 'Past 7 Days',
  '30': 'Past 30 Days',
  '365': 'This Year',
  lastYear: 'Last Year'
};

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [message, setMessage] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    fetchPrompts();
  }, [timeFilter]);

  const fetchPrompts = async () => {
  const now = new Date();
  let fromDate = null;
  let toDate = null;

  if (timeFilter === 'lastYear') {
    fromDate = new Date(now.getFullYear() - 1, 0, 1);
    toDate = new Date(now.getFullYear(), 0, 1);
  } else if (timeFilter === '365') {
    fromDate = new Date(now.getFullYear(), 0, 1);
    toDate = now;
  } else if (timeFilter !== 'all') {
    fromDate = new Date();
    fromDate.setDate(now.getDate() - parseInt(timeFilter));
    toDate = now;
  }

  let query = supabase.from('prompts').select('*');

  if (fromDate && toDate) {
    // 🧠 Only filter if content_date exists
    query = query
      .gte('content_date', fromDate.toISOString())
      .lte('content_date', toDate.toISOString());
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching prompts:', error.message);
  } else {
    setPrompts(data);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔁 handleSubmit triggered");
    if (!prompt) return;

    const lowercase = prompt.toLowerCase();
    let platform = null;
    let content_date = null;

    // Platform detection
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

    // Content date detection
    const now = new Date();
    const year = now.getFullYear();

    if (lowercase.includes('last year')) {
      content_date = new Date(year - 1, 0, 1);
    } else if (lowercase.includes('this year')) {
      content_date = new Date(year, 0, 1);
    } else {
      const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ];

      for (let i = 0; i < months.length; i++) {
        const month = months[i];
        const regex = new RegExp(`${month}\\s+(\\d{4})`, 'i'); // case-insensitive
        const match = prompt.match(regex); // use original prompt for casing

        if (match) {
          const matchedYear = parseInt(match[1]);
          content_date = new Date(matchedYear, i, 1);
          break;
        }
      }
    }

    console.log("Detected content_date:", content_date);

    const { error } = await supabase
      .from('prompts')
      .insert([{ text: prompt, platform, content_date }]);

    if (error) {
      console.error('Supabase insert error:', error);
      setMessage('❌ Something went wrong.');
    } else {
      setMessage('✅ Prompt saved!');
      setPrompt('');
      fetchPrompts();
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
            placeholder="Try: Show my saved TikToks from March 2024"
            className="w-full bg-gray-800 text-white rounded-lg p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {message && <p className="text-green-400 mt-4">{message}</p>}

        <div className="mt-10 text-left">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Your Prompts</h2>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-1 text-sm"
            >
              {Object.entries(timeOptions).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <ul className="space-y-2">
            {prompts.map((p) => (
              <li
                key={p.id}
                className="bg-gray-800 rounded-lg px-4 py-3 text-white text-sm shadow-sm"
              >
                {p.platform && (
                  <span
                    className="inline-block text-white text-xs font-semibold px-2 py-1 rounded-full mr-2"
                    style={{
                      backgroundColor:
                        p.platform === 'TikTok' ? '#8b5cf6' :
                        p.platform === 'Instagram' ? '#ec4899' :
                        p.platform === 'YouTube' ? '#ef4444' :
                        p.platform === 'Reddit' ? '#f97316' :
                        p.platform === 'Pinterest' ? '#f43f5e' :
                        p.platform === 'Facebook' ? '#1d4ed8' :
                        p.platform === 'X' ? '#06b6d4' :
                        '#6b7280'
                    }}
                  >
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
