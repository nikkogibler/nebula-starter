import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    const { error } = await supabase.from('prompts').insert([{ text: prompt }]);

    if (error) {
      console.error('Error saving prompt:', error);
      setMessage('❌ Something went wrong.');
    } else {
      setMessage('✅ Prompt saved!');
      setPrompt
