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
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const timeOptions = {
    all: 'All Time',
    '7': 'Past 7 Days',
    '30': 'Past 30 Days',
    '365': 'This Year',
    lastYear: 'Last Year'
  };

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
    const lowercase = prompt.toLowerCase();
    let platform = null;
    let content_date = null;
    let layout_type = null;

    if (lowercase.includes('tiktok')) platform = 'TikTok';
    else if (lowercase.includes('instagram') || lowercase.includes('ig')) platform = 'Instagram';
    else if (lowercase.includes('youtube') || lowercase.includes('yt')) platform = 'YouTube';
    else if (lowercase.includes('reddit')) platform = 'Reddit';
    else if (lowercase.includes('pinterest')) platform = 'Pinterest';
    else if (lowercase.includes('facebook') || lowercase.includes('fb')) platform = 'Facebook';
    else if (lowercase.includes('twitter') || lowercase.includes('x.com') || lowercase.includes('x ')) platform = 'X';

    if (lowercase.includes('last year')) {
      content_date = new Date(new Date().getFullYear() - 1, 0, 1);
    } else if (lowercase.includes('this year')) {
      content_date = new Date(new Date().getFullYear(), 0, 1);
    } else {
      const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ];
      for (let i = 0; i < months.length; i++) {
        const regex = new RegExp(`${months[i]}\s+(\d{4})`, 'i');
        const match = prompt.match(regex);
        if (match) {
          const matchedYear = parseInt(match[1]);
          content_date = new Date(matchedYear, i, 1);
          break;
        }
      }
    }

    if (lowercase.includes('carousel')) layout_type = 'carousel';
    else if (lowercase.includes('grid')) layout_type = 'grid';
    else if (lowercase.includes('timeline')) layout_type = 'timeline';
    else if (lowercase.includes('moodboard')) layout_type = 'moodboard';
    else if (lowercase.includes('stacked')) layout_type = 'stacked';

    const { error } = await supabase
      .from('prompts')
      .insert([{ text: prompt, platform, content_date, layout_type }]);

    if (error) {
      setMessage('❌ Error saving prompt');
      console.error(error);
    } else {
      setMessage('✅ Prompt saved!');
      setPrompt('');
      fetchPrompts();
    }
  };

  return (
    <div className="absolute inset-0 z-0 bg-nebula opacity-40"></div>
    <canvas
      id="stars"
      className="absolute inset-0 z-0 pointer-events-none"
    />

    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Nebula 🌌</h1>
        <p className="text-gray-400 mb-8">Your visual content memory</p>
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Try: Show my TikToks from March 2024 in a grid"
            className="w-full p-4 rounded bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
          />
        </form>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 text-sm"
          >
            {Object.entries(timeOptions).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search prompts..."
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 text-sm w-full sm:w-1/2"
          />
        </div>
        {message && <p className="text-green-400 mb-4">{message}</p>}
        <ul className="space-y-4 text-left">
          {prompts
            .filter(p => searchTerm === '' || p.text.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((p) => (
              <li key={p.id} className="bg-gray-800 p-4 rounded">
                <div className="text-sm mb-1">
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

{p.layout_type && (
  <span
    className="inline-block text-white text-xs font-semibold px-2 py-1 rounded-full mr-2"
    style={{
      backgroundColor:
        p.layout_type === 'carousel' ? '#f97316' :
        p.layout_type === 'grid' ? '#0ea5e9' :
        p.layout_type === 'timeline' ? '#10b981' :
        p.layout_type === 'moodboard' ? '#eab308' :
        p.layout_type === 'stacked' ? '#a855f7' :
        '#6b7280'
    }}
  >
    {p.layout_type}
  </span>
)}


{p.layout_type && (
  <span
    className="inline-block text-white text-xs font-semibold px-2 py-1 rounded-full mr-2"
    style={{
      backgroundColor:
        p.layout_type === 'carousel' ? '#f97316' :
        p.layout_type === 'grid' ? '#0ea5e9' :
        p.layout_type === 'timeline' ? '#10b981' :
        p.layout_type === 'moodboard' ? '#eab308' :
        p.layout_type === 'stacked' ? '#a855f7' :
        '#6b7280'
    }}
  >
    {p.layout_type}
  </span>
)}

                  {p.text}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(p.created_at).toLocaleString()}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}


  useEffect(() => {
    let animationId;
    let canvas, ctx;
    const stars = [];

    function initStars() {
      if (!canvas) return;
      stars.length = 0;
      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5,
          a: Math.random(),
          s: Math.random() * 0.5 + 0.2
        });
      }
    }

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        star.y += star.s;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255,255,255,${star.a})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    }

    setTimeout(() => {
      canvas = document.getElementById('stars');
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      resize();
      window.addEventListener('resize', resize);
      draw();
    }, 0);

    return (
    <div className="absolute inset-0 z-0 bg-nebula opacity-40"></div>
    <canvas
      id="stars"
      className="absolute inset-0 z-0 pointer-events-none"
    />
) => {
      window.removeEventListener('resize', resize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);
