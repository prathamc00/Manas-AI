import React from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Heart, 
  Brain, 
  Target, 
  Wind, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Menu
} from 'lucide-react';
import type { Session, Memory, MoodEntry, Goal } from '../../types';

interface HomeViewProps {
  sessions: Session[];
  memories: Memory[];
  moodHistory: MoodEntry[];
  goals: Goal[];
  onStartSession: () => void;
  onNavigate: (tab: 'chat' | 'checkin' | 'memory' | 'goals' | 'grounding' | 'about') => void;
  onOpenMobileMenu?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  sessions,
  memories,
  moodHistory,
  goals,
  onStartSession,
  onNavigate,
  onOpenMobileMenu,
}) => {
  const latestMood = moodHistory[0];
  const confirmedCount = memories.filter((m) => m.user_confirmed).length;
  const activeGoalsCount = goals.filter((g) => g.status === 'in_progress').length;

  const moodEmojis: { [key: number]: string } = {
    1: '😔 Low',
    2: '😐 Neutral',
    3: '🙂 Grounded',
    4: '😊 Energized',
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#181714] text-[#ECE7DF] animate-fade-in select-text">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header / Greeting */}
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[#D97757] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Reflection Sanctuary</span>
            </div>
            <h1 className="font-editorial text-2xl md:text-3xl font-semibold text-[#ECE7DF] tracking-tight">
              Welcome back. Take a breath.
            </h1>
            <p className="text-xs text-[#A39D93] max-w-xl leading-relaxed">
              MANAS is your private therapeutic companion — a mind that remembers your recurring themes, challenges unhelpful thought patterns with kindness, and preserves your context across sessions.
            </p>
          </div>

          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="p-2 rounded-xl bg-[#22211C] border border-[#33312B] text-[#A39D93] md:hidden active:scale-95 shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Hero Card: Start Session Banner */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#22211C] to-[#1D1C18] border border-[#33312B] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden animate-slide-up">
          <div className="space-y-2 max-w-lg z-10">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-[#D97757]/15 text-[#D97757] border border-[#D97757]/30">
              Live Session
            </span>
            <h2 className="font-editorial text-xl md:text-2xl font-semibold text-[#ECE7DF]">
              Ready to explore what's on your mind?
            </h2>
            <p className="text-xs text-[#A39D93] leading-relaxed">
              Start an unstructured reflection, examine a cognitive distortion using Socratic CBT, or simply vent without unsolicited advice.
            </p>
          </div>

          <button
            onClick={onStartSession}
            className="px-6 py-3 rounded-xl bg-[#D97757] hover:bg-[#E38769] active:scale-95 text-[#181714] font-semibold text-xs transition duration-200 shadow-md flex items-center space-x-2 shrink-0 z-10"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Begin Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Background subtle watermark */}
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-5 pointer-events-none">
            <span className="font-editorial text-9xl italic font-bold">M</span>
          </div>
        </div>

        {/* Longitudinal Snapshot Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 animate-slide-up">
          <div className="p-4 rounded-xl bg-[#22211C] border border-[#33312B] space-y-1">
            <div className="flex items-center space-x-1.5 text-[11px] text-[#736E65]">
              <Clock className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Total Sessions</span>
            </div>
            <div className="font-editorial text-2xl font-bold text-[#ECE7DF]">{sessions.length}</div>
            <p className="text-[10px] text-[#A39D93]">Sessions completed</p>
          </div>

          <div className="p-4 rounded-xl bg-[#22211C] border border-[#33312B] space-y-1">
            <div className="flex items-center space-x-1.5 text-[11px] text-[#736E65]">
              <Heart className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Current Mood</span>
            </div>
            <div className="text-sm font-semibold text-[#ECE7DF] truncate">
              {latestMood ? moodEmojis[latestMood.mood] || 'Neutral' : 'Not logged'}
            </div>
            <p className="text-[10px] text-[#A39D93]">
              {latestMood ? `Stress: ${latestMood.stress}/10` : 'Tap to check in'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#22211C] border border-[#33312B] space-y-1">
            <div className="flex items-center space-x-1.5 text-[11px] text-[#736E65]">
              <Brain className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Memory Facts</span>
            </div>
            <div className="font-editorial text-2xl font-bold text-[#ECE7DF]">{confirmedCount}</div>
            <p className="text-[10px] text-[#A39D93]">Confirmed insights</p>
          </div>

          <div className="p-4 rounded-xl bg-[#22211C] border border-[#33312B] space-y-1">
            <div className="flex items-center space-x-1.5 text-[11px] text-[#736E65]">
              <Target className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Active Goals</span>
            </div>
            <div className="font-editorial text-2xl font-bold text-[#ECE7DF]">{activeGoalsCount}</div>
            <p className="text-[10px] text-[#A39D93]">Habits in progress</p>
          </div>
        </div>

        {/* Quick Launch Features */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#736E65] px-1">
            Therapeutic Toolkit
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('grounding')}
              className="p-5 rounded-2xl bg-[#22211C] hover:bg-[#2B2A24] active:scale-[0.99] border border-[#33312B] hover:border-[#D97757]/40 text-left transition duration-200 group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-[#1D1C18] border border-[#33312B] text-[#D97757]">
                  <Wind className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#736E65] group-hover:text-[#D97757] transition" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#ECE7DF] group-hover:text-[#D97757] transition">
                  Box Breathing & 5-4-3-2-1
                </h4>
                <p className="text-[11px] text-[#A39D93] mt-1 leading-snug">
                  4-second autonomic nervous system reset with visual pulsing orb.
                </p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('checkin')}
              className="p-5 rounded-2xl bg-[#22211C] hover:bg-[#2B2A24] active:scale-[0.99] border border-[#33312B] hover:border-[#D97757]/40 text-left transition duration-200 group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-[#1D1C18] border border-[#33312B] text-[#D97757]">
                  <Heart className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#736E65] group-hover:text-[#D97757] transition" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#ECE7DF] group-hover:text-[#D97757] transition">
                  Daily Emotional Check-in
                </h4>
                <p className="text-[11px] text-[#A39D93] mt-1 leading-snug">
                  Track stress, mood fluctuations, and longitudinal patterns.
                </p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('memory')}
              className="p-5 rounded-2xl bg-[#22211C] hover:bg-[#2B2A24] active:scale-[0.99] border border-[#33312B] hover:border-[#D97757]/40 text-left transition duration-200 group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-[#1D1C18] border border-[#33312B] text-[#D97757]">
                  <Brain className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#736E65] group-hover:text-[#D97757] transition" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#ECE7DF] group-hover:text-[#D97757] transition">
                  Memory & Context Vault
                </h4>
                <p className="text-[11px] text-[#A39D93] mt-1 leading-snug">
                  Inspect what MANAS has inferred and confirm or delete personal facts.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Privacy & Principles Callout */}
        <div className="p-5 rounded-2xl bg-[#1D1C18] border border-[#2B2A24] flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-[#D97757] shrink-0" />
            <div className="text-xs text-[#A39D93]">
              <strong className="text-[#ECE7DF]">100% Private & User-Owned:</strong> Your conversations, memories, and reflections stay on your machine.
            </div>
          </div>

          <button
            onClick={() => onNavigate('about')}
            className="text-xs text-[#D97757] hover:underline shrink-0 font-medium"
          >
            Learn about MANAS →
          </button>
        </div>
      </div>
    </div>
  );
};
