import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';
import type { User } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

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
        onClose();
      } else {
        const res = await api.login({
          email: email.trim(),
          password,
        });
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#161512] border border-[#2B2A24] rounded-2xl p-6 md:p-8 shadow-2xl text-[#ECE7DF]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#736E65] hover:text-[#ECE7DF] p-1.5 rounded-lg hover:bg-[#22211C] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#D97757]/10 text-[#D97757] mb-3 border border-[#D97757]/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-semibold text-[#ECE7DF]">
            {isSignUp ? 'Create your sanctuary' : 'Welcome back to MANAS'}
          </h2>
          <p className="text-xs text-[#A39D93] mt-1.5">
            {isSignUp 
              ? 'Securely store and remember your reflections, moods, and memory vault across devices.' 
              : 'Sign in to access your private session history and growth tracker.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0E0D0B] p-1 rounded-xl mb-6 border border-[#22211C]">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
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
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
              isSignUp 
                ? 'bg-[#22211C] text-[#ECE7DF] shadow' 
                : 'text-[#736E65] hover:text-[#A39D93]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A39D93] font-medium mb-1.5">
                Your Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#736E65] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full bg-[#0E0D0B] border border-[#2B2A24] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#ECE7DF] placeholder-[#545048] focus:outline-none focus:border-[#D97757]/70 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A39D93] font-medium mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#736E65] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#0E0D0B] border border-[#2B2A24] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#ECE7DF] placeholder-[#545048] focus:outline-none focus:border-[#D97757]/70 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A39D93] font-medium mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#736E65] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0E0D0B] border border-[#2B2A24] rounded-xl pl-9 pr-10 py-2.5 text-xs text-[#ECE7DF] placeholder-[#545048] focus:outline-none focus:border-[#D97757]/70 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736E65] hover:text-[#ECE7DF]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-[#D97757] hover:bg-[#C86646] text-white py-2.5 rounded-xl text-xs font-semibold tracking-wide transition shadow-lg active:scale-[0.99] disabled:opacity-50"
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

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-[#736E65] hover:text-[#A39D93] transition underline underline-offset-4"
          >
            Continue as Guest (Local Offline Mode)
          </button>
        </div>
      </div>
    </div>
  );
};
