import React from 'react';
import { 
  MessageSquare, 
  Heart, 
  Brain, 
  Target, 
  Wind, 
  ShieldAlert, 
  EyeOff, 
  Plus,
  Compass
} from 'lucide-react';
import type { Session } from '../types';

interface SidebarProps {
  activeTab: 'chat' | 'checkin' | 'memory' | 'goals' | 'grounding';
  setActiveTab: (tab: 'chat' | 'checkin' | 'memory' | 'goals' | 'grounding') => void;
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onOpenSafety: () => void;
  onTriggerDisguise: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onOpenSafety,
  onTriggerDisguise
}) => {
  return (
    <aside className="w-68 bg-[#13120F] border-r border-[#262520] flex flex-col h-screen text-[#A39D93] select-none text-xs transition-all duration-300">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#262520] flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#D97757] text-[#181714] font-bold text-base flex items-center justify-center shadow-sm">
            <span className="font-editorial italic">M</span>
          </div>
          <div>
            <h1 className="font-editorial text-sm font-semibold text-[#ECE7DF] tracking-tight">MANAS</h1>
            <p className="text-[10px] text-[#A39D93]">Therapeutic Companion</p>
          </div>
        </div>

        {/* Quick Disguise Button */}
        <button
          onClick={onTriggerDisguise}
          title="Quick-Exit Disguise (Esc)"
          className="p-1.5 rounded-lg bg-[#22211C] hover:bg-[#2B2A24] text-[#A39D93] hover:text-[#ECE7DF] border border-[#33312B] transition"
        >
          <EyeOff className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* New Session Action */}
      <div className="p-3">
        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-[#22211C] hover:bg-[#2B2A24] border border-[#33312B] hover:border-[#D97757]/50 text-[#ECE7DF] font-medium transition duration-200 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-[#D97757]" />
          <span>New Reflection</span>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="px-3 py-1 space-y-0.5">
        {[
          { id: 'chat', label: 'Active Session', icon: MessageSquare },
          { id: 'checkin', label: 'Daily Check-in', icon: Heart },
          { id: 'memory', label: 'Memory Vault', icon: Brain },
          { id: 'goals', label: 'Growth Goals', icon: Target },
          { id: 'grounding', label: 'Somatic Grounding', icon: Wind },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition duration-150 ${
                isActive
                  ? 'bg-[#22211C] text-[#ECE7DF] border border-[#33312B] shadow-inner'
                  : 'hover:bg-[#1A1915] text-[#A39D93] hover:text-[#ECE7DF]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D97757]' : 'text-[#736E65]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Past Sessions List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 mt-2 border-t border-[#22211C]">
        <div className="flex items-center space-x-1.5 px-2 mb-2 text-[10px] uppercase font-semibold tracking-wider text-[#736E65]">
          <Compass className="w-3 h-3" />
          <span>Recent Sessions</span>
        </div>

        <div className="space-y-0.5">
          {sessions.length === 0 ? (
            <p className="text-[11px] text-[#736E65] px-2 py-4 text-center italic">No past sessions</p>
          ) : (
            sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  onSelectSession(s.id);
                  setActiveTab('chat');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs truncate transition duration-150 block ${
                  activeSessionId === s.id && activeTab === 'chat'
                    ? 'bg-[#22211C] text-[#ECE7DF] font-medium'
                    : 'text-[#A39D93] hover:bg-[#1A1915] hover:text-[#ECE7DF]'
                }`}
              >
                <span className="truncate">{s.title || 'Reflection Session'}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Footer / Safety Resource */}
      <div className="p-3 border-t border-[#22211C] bg-[#100F0D]">
        <button
          onClick={onOpenSafety}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-[#22211C] hover:bg-[#2B2A24] text-[#A39D93] hover:text-[#D97757] border border-[#33312B] text-xs font-medium transition"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#D97757]" />
          <span>Crisis Support</span>
        </button>
      </div>
    </aside>
  );
};
