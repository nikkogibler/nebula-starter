import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { detectLayoutType } from '../utils/detectLayoutType';
import LayoutPreview from '../components/LayoutPreview';

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
  const [searchTerm, setSearchTerm] = useState('');

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

    if (!prompt) return;

    const lowercase = prompt.toLowerCase();
    let platform = null;
    let content_date = null;

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

    const layout_type = detectLayoutType(prompt);

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
        const regex = new RegExp(`${month}\\s+(\\d{4})`, 'i');
        const match = prompt.match(regex);

        if (match) {
          const matchedYear = parseInt(match[1]);
          content_date = new Date(matchedYear, i, 1);
          break;
        }
      }
    }

    const { error } = await supabase
      .from('prompts')
      .insert([{ text: prompt, platform, content_date, layout_type }]);

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
      <h1 className="text-3xl font-bold mb-6">Nebula Prompt App</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Type a prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
        >
          Submit
        </button>
      </form>

      {message && <p className="text-green-400 mb-4">{message}</p>}

      {prompts.map((prompt) => (
        <div key={prompt.id} className="mb-6 border-b border-white/10 pb-4">
          <p className="text-white text-lg font-medium mb-2">{prompt.text}</p>

          {prompt.layout_type && (
            <>
              <p className="text-purple-300 text-sm mb-2">
                Layout Type: {prompt.layout_type}
              </p>
              <LayoutPreview layout_type={prompt.layout_type} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
