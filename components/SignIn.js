
import { supabase } from '../lib/supabaseClient';

export default function SignIn() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        padding: '12px 20px',
        fontSize: '16px',
        background: 'white',
        color: 'black',
        borderRadius: '8px',
        marginTop: '40px',
        cursor: 'pointer'
      }}
    >
      Sign in with Google
    </button>
  );
}
