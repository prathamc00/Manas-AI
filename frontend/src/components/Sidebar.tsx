import React from 'react';
import { 
  Home,
  MessageSquare, 
  Heart, 
  Brain, 
  Target, 
  Wind, 
  ShieldAlert, 
  EyeOff, 
  Plus,
  Compass,
  Info,
  X,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import type { Session } from '../types';

interface SidebarProps {
  activeTab: 'home' | 'chat' | 'checkin' | 'memory' | 'goals' | 'grounding' | 'about';
  setActiveTab: (tab: 'home' | 'chat' | 'checkin' | 'memory' | 'goals' | 'grounding' | 'about') => void;
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onOpenSafety: () => void;
  onTriggerDisguise: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onOpenSafety,
  onTriggerDisguise,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat Session', icon: MessageSquare },
    { id: 'checkin', label: 'Daily Check-in', icon: Heart },
    { id: 'memory', label: 'Memory Vault', icon: Brain },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'grounding', label: 'Grounding', icon: Wind },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId as any);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden animate-fade-in"
        />
      )}

      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-50
          ${isCollapsed ? 'md:w-18 w-72' : 'w-72 md:w-60'}
          bg-[#12110E] border-r border-[#262520] flex flex-col h-full text-[#A39D93] select-none text-xs
          transition-all duration-300 ease-in-out shrink-0
          ${isMobileOpen ? 'translate-x-0 animate-drawer shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="p-3.5 border-b border-[#262520] flex items-center justify-between">
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2.5 text-left group overflow-hidden"
          >
            <div className="w-8 h-8 rounded-xl bg-[#D97757] text-[#181714] font-bold text-base flex items-center justify-center shadow-md active:scale-95 transition shrink-0">
              <span className="font-editorial italic font-bold">M</span>
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h1 className="font-editorial text-sm font-semibold text-[#ECE7DF] tracking-tight group-hover:text-[#D97757] transition">MANAS</h1>
                <p className="text-[10px] text-[#736E65]">Mind & Emotion</p>
              </div>
            )}
          </button>

          <div className="flex items-center space-x-1">
            {/* Desktop Collapse Toggle */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                className="hidden md:flex p-1.5 rounded-lg text-[#736E65] hover:text-[#ECE7DF] hover:bg-[#1E1D18] transition"
              >
                {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
            )}

            {/* Quick Disguise Button */}
            {!isCollapsed && (
              <button
                onClick={onTriggerDisguise}
                title="Quick Disguise (Esc)"
                className="p-1.5 rounded-lg text-[#736E65] hover:text-[#ECE7DF] hover:bg-[#1E1D18] transition active:scale-95"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile Close Button */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-[#736E65] hover:text-[#ECE7DF] hover:bg-[#1E1D18] md:hidden transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* New Session Action */}
        <div className="p-2.5">
          <button
            onClick={() => {
              onNewSession();
              if (onCloseMobile) onCloseMobile();
            }}
            title="New Reflection Session"
            className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2' : 'justify-center space-x-2 px-3 py-2'} rounded-xl bg-[#22211C] hover:bg-[#2A2923] active:scale-[0.98] border border-[#33312B] hover:border-[#D97757]/50 text-[#ECE7DF] font-medium transition duration-150 shadow-sm`}
          >
            <Plus className="w-3.5 h-3.5 text-[#D97757] shrink-0" />
            {!isCollapsed && <span>New Session</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="px-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={item.label}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'space-x-2.5 px-3 py-2'} rounded-xl text-xs font-medium transition duration-150 active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#22211C] text-[#ECE7DF] border border-[#33312B] shadow-inner font-semibold'
                    : 'hover:bg-[#1A1915] text-[#A39D93] hover:text-[#ECE7DF]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D97757]' : 'text-[#736E65]'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Recent Sessions List */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto px-2 py-2.5 mt-2 border-t border-[#1F1E19]">
            <div className="flex items-center space-x-1.5 px-2 mb-1.5 text-[10px] uppercase font-semibold tracking-wider text-[#736E65]">
              <Compass className="w-3 h-3 text-[#D97757]" />
              <span>Sessions</span>
            </div>

            <div className="space-y-0.5">
              {sessions.length === 0 ? (
                <p className="text-[11px] text-[#736E65] px-2 py-3 text-center italic">No history</p>
              ) : (
                sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectSession(s.id);
                      setActiveTab('chat');
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs truncate transition duration-150 block active:scale-[0.99] ${
                      activeSessionId === s.id && activeTab === 'chat'
                        ? 'bg-[#22211C] text-[#ECE7DF] font-medium border border-[#33312B]'
                        : 'text-[#A39D93] hover:bg-[#1A1915] hover:text-[#ECE7DF]'
                    }`}
                  >
                    <span className="truncate">{s.title || 'Session'}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Bottom Safety */}
        <div className="p-2.5 border-t border-[#1F1E19] bg-[#0E0D0B] mt-auto">
          <button
            onClick={() => {
              onOpenSafety();
              if (onCloseMobile) onCloseMobile();
            }}
            title="Crisis Support"
            className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2' : 'justify-center space-x-1.5 px-2.5 py-1.5'} rounded-xl bg-[#1A1915] hover:bg-[#22211C] text-[#A39D93] hover:text-[#D97757] border border-[#2B2A24] text-xs transition active:scale-95`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#D97757] shrink-0" />
            {!isCollapsed && <span className="text-[11px]">Crisis Support</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
