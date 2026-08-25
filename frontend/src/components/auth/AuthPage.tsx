import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, User as UserIcon, Eye, EyeOff, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import type { User } from '../../types';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
  onBack: () => void;
  onSuccess: (user: User) => void;
  onGuestMode: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signup',
  onBack,
  onSuccess,
  onGuestMode,
}) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(initialMode === 'signup');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        const res = await api.signup({
          email: email.trim(),
          password,
          name: name.trim() || undefined,
        });
        onSuccess(res.user);
      } else {
        const res = await api.login({
          email: email.trim(),
          password,
        });
        onSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12110E] text-[#ECE7DF] flex flex-col justify-between p-4 sm:p-6 select-text">
      {/* Top Header / Back Link */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs text-[#A39D93] hover:text-[#ECE7DF] p-2 rounded-xl hover:bg-[#1A1915] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#D97757] text-[#181714] font-bold text-sm flex items-center justify-center shadow-md">
            <span className="font-editorial italic font-bold">M</span>
          </div>
          <span className="font-editorial text-sm font-semibold text-[#ECE7DF]">MANAS</span>
        </div>
      </header>

      {/* Main Auth Container */}
      <main className="max-w-md w-full mx-auto my-8 bg-[#181714] border border-[#2B2A24] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-slide-up">
        {/* Title & Tagline */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#D97757]/15 text-[#D97757] border border-[#D97757]/30 mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#ECE7DF]">
            {isSignUp ? 'Create your private account' : 'Welcome back to your sanctuary'}
          </h1>
          <p className="text-xs text-[#A39D93] max-w-sm mx-auto">
            {isSignUp 
              ? 'Save your reflection sessions, long-term memory vault, and growth goals securely.' 
              : 'Sign in to access your saved session history and personal insights.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0E0D0B] p-1 rounded-xl border border-[#22211C]">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              !isSignUp 
                ? 'bg-[#22211C] text-[#ECE7DF] shadow' 
                : 'text-[#736E65] hover:text-[#A39D93]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              isSignUp 
                ? 'bg-[#22211C] text-[#ECE7DF] shadow' 
                : 'text-[#736E65] hover:text-[#A39D93]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider text-[#A39D93] font-semibold">
                Your Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#736E65] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya"
                  className="w-full bg-[#0E0D0B] border border-[#2B2A24] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#ECE7DF] placeholder-[#545048] focus:outline-none focus:border-[#D97757]/70 transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider text-[#A39D93] font-semibold">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#736E65] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#0E0D0B] border border-[#2B2A24] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#ECE7DF] placeholder-[#545048] focus:outline-none focus:border-[#D97757]/70 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider text-[#A39D93] font-semibold">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#736E65] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0E0D0B] border border-[#2B2A24] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#ECE7DF] placeholder-[#545048] focus:outline-none focus:border-[#D97757]/70 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#736E65] hover:text-[#ECE7DF]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-[#D97757] hover:bg-[#C86646] text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow-lg shadow-[#D97757]/20 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSignUp ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider & Guest Option */}
        <div className="pt-2 border-t border-[#22211C] text-center space-y-3">
          <button
            type="button"
            onClick={onGuestMode}
            className="text-xs text-[#A39D93] hover:text-[#ECE7DF] transition block w-full py-2 rounded-xl hover:bg-[#201F1A] border border-transparent hover:border-[#2B2A24]"
          >
            Skip for now & explore as Guest
          </button>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#545048] text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D97757]" />
          <span>Your conversations are private and encrypted.</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center py-2 text-[11px] text-[#545048]">
        © 2026 MANAS AI. All rights reserved.
      </footer>
    </div>
  );
};
