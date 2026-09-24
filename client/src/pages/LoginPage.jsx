import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { LogIn, Sparkles, ArrowRight } from 'lucide-react';

export const LoginPage = ({ setActiveTab }) => {
  const { loginUser } = useUser();
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginInput.trim() || !password.trim()) {
      setErrorMsg('Please enter both Username/Email and Password.');
      return;
    }

    setSubmitting(true);
    const result = await loginUser(loginInput.trim(), password.trim());
    setSubmitting(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('dashboard');
      }
      window.scrollTo(0, 0);
    } else {
      setErrorMsg(result.error || 'Invalid username or password.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3.5 py-1 rounded-full border border-pink-500/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Community Portal
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Welcome Back 💃
        </h1>
        <p className="text-xs text-purple-200/70">
          Sign in to your GarbaSaathi account to check requests & celebrate Navratri.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold text-center">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Clean Login Card */}
      <form onSubmit={handleSubmit} className="bg-[#180930]/90 border border-purple-800/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        <div>
          <label className="block text-xs font-bold text-purple-200 mb-1.5">
            Username or Email
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="Enter your username or email"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-3 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-purple-200 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-3 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-white rounded-2xl font-extrabold text-sm transition shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <LogIn className="w-4 h-4" />
          <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
        </button>

        <div className="text-center pt-2 border-t border-purple-900/50">
          <p className="text-xs text-purple-300/70">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => { setActiveTab('register'); window.scrollTo(0,0); }}
              className="text-pink-400 font-bold hover:underline"
            >
              Register Here
            </button>
          </p>
        </div>

      </form>
    </div>
  );
};
