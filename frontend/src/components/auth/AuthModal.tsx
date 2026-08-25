import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User as UserIcon, Eye, EyeOff, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';
import { Button } from '../ui/button';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
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

        {/* Tab Switcher with sliding Motion pill */}
        <div className="flex bg-[#0E0D0B] p-1 rounded-xl mb-6 border border-[#22211C] relative">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(null); }}
            className={`relative flex-1 py-1.5 text-xs font-medium rounded-lg transition z-10 ${
              !isSignUp 
                ? 'text-[#ECE7DF]' 
                : 'text-[#736E65] hover:text-[#A39D93]'
            }`}
          >
            {!isSignUp && (
              <motion.div
                layoutId="auth-tab-pill-modal"
                className="absolute inset-0 bg-[#22211C] rounded-lg shadow border border-[#33312B] -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(null); }}
            className={`relative flex-1 py-1.5 text-xs font-medium rounded-lg transition z-10 ${
              isSignUp 
                ? 'text-[#ECE7DF]' 
                : 'text-[#736E65] hover:text-[#A39D93]'
            }`}
          >
            {isSignUp && (
              <motion.div
                layoutId="auth-tab-pill-modal"
                className="absolute inset-0 bg-[#22211C] rounded-lg shadow border border-[#33312B] -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2 overflow-hidden"
            >
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
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
              </motion.div>
            )}
          </AnimatePresence>

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

          <Button
            type="submit"
            variant="terracotta"
            size="default"
            isLoading={loading}
            className="w-full mt-2 rounded-xl text-xs font-semibold tracking-wide shadow-lg"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-5 text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-[11px] text-[#736E65] hover:text-[#A39D93]"
          >
            Continue as Guest (Local Offline Mode)
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
