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
  Info, 
  X, 
  PanelLeftClose, 
  PanelLeft,
  LogOut,
  LogIn,
  Clock,
  Trash2,
  Edit3,
  Check
} from 'lucide-react';
import type { Session, User } from '../types';

interface SidebarProps {
  activeTab: 'home' | 'chat' | 'checkin' | 'memory' | 'goals' | 'grounding' | 'about';
  setActiveTab: (tab: 'home' | 'chat' | 'checkin' | 'memory' | 'goals' | 'grounding' | 'about') => void;
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onOpenSafety: () => void;
  onTriggerDisguise: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenRecentChats?: () => void;
  onDeleteSession?: (id: string) => Promise<void>;
  onRenameSession?: (id: string, newTitle: string) => Promise<void>;
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
  currentUser,
  onOpenAuth,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  onOpenRecentChats,
  onDeleteSession,
  onRenameSession,
}) => {
  const [editingSessionId, setEditingSessionId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState<string>('');
  const [deletingSessionId, setDeletingSessionId] = React.useState<string | null>(null);

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

  const handleSaveRename = async (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (onRenameSession && editTitle.trim()) {
      try {
        await onRenameSession(id, editTitle.trim());
      } finally {
        setEditingSessionId(null);
      }
    } else {
      setEditingSessionId(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deletingSessionId !== id) {
      setDeletingSessionId(id);
      return;
    }
    if (onDeleteSession) {
      try {
        await onDeleteSession(id);
      } finally {
        setDeletingSessionId(null);
      }
    }
  };

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0 && now.getDate() === d.getDate()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays <= 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center space-x-1.5 text-[10px] uppercase font-semibold tracking-wider text-[#736E65]">
                <Clock className="w-3 h-3 text-[#D97757]" />
                <span>Recent Chats</span>
              </div>
              {onOpenRecentChats && sessions.length > 0 && (
                <button
                  onClick={onOpenRecentChats}
                  className="text-[10px] text-[#D97757] hover:underline font-medium"
                >
                  View All
                </button>
              )}
            </div>

            <div className="space-y-1">
              {sessions.length === 0 ? (
                <p className="text-[11px] text-[#736E65] px-2 py-3 text-center italic">No conversations yet</p>
              ) : (
                sessions.slice(0, 10).map((s) => {
                  const isActive = activeSessionId === s.id && activeTab === 'chat';
                  const isEditing = editingSessionId === s.id;
                  const isDeleting = deletingSessionId === s.id;

                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        if (!isEditing) {
                          onSelectSession(s.id);
                          setActiveTab('chat');
                          if (onCloseMobile) onCloseMobile();
                        }
                      }}
                      className={`group flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-[#22211C] text-[#ECE7DF] font-medium border border-[#33312B]'
                          : 'text-[#A39D93] hover:bg-[#1A1915] hover:text-[#ECE7DF]'
                      }`}
                    >
                      {isEditing ? (
                        <div className="flex items-center space-x-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            autoFocus
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(s.id, e)}
                            className="bg-[#0E0D0B] border border-[#D97757]/70 rounded px-1.5 py-0.5 text-xs text-[#ECE7DF] focus:outline-none w-full"
                          />
                          <button
                            type="button"
                            onClick={(e) => handleSaveRename(s.id, e)}
                            className="p-1 text-[#D97757] hover:text-[#E38769]"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setEditingSessionId(null); }}
                            className="p-1 text-[#736E65] hover:text-[#ECE7DF]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="truncate flex-1 min-w-0 pr-1">
                            <span className="truncate block text-xs">{s.title || 'Session'}</span>
                            <span className="text-[9px] text-[#736E65] block leading-tight">
                              {formatShortDate(s.started_at)}
                            </span>
                          </div>

                          {/* Hover Actions */}
                          <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition shrink-0">
                            {onRenameSession && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSessionId(s.id);
                                  setEditTitle(s.title || 'Session');
                                }}
                                title="Rename"
                                className="p-1 text-[#736E65] hover:text-[#ECE7DF] rounded hover:bg-[#2A2923]"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            )}

                            {onDeleteSession && (
                              <button
                                onClick={(e) => handleDelete(s.id, e)}
                                title={isDeleting ? 'Click to confirm delete' : 'Delete'}
                                className={`p-1 rounded ${
                                  isDeleting
                                    ? 'bg-red-500/20 text-red-400 opacity-100'
                                    : 'text-[#736E65] hover:text-red-400 hover:bg-[#2A2923]'
                                }`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* User Account / Profile Box */}
        <div className="p-2 border-t border-[#1F1E19] bg-[#12110E]">
          {currentUser ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#1A1915] border border-[#2B2A24]">
              <div className="flex items-center space-x-2 truncate">
                <div className="w-6 h-6 rounded-full bg-[#D97757]/20 text-[#D97757] flex items-center justify-center font-bold text-[10px] shrink-0">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                {!isCollapsed && (
                  <div className="truncate">
                    <p className="text-[11px] font-medium text-[#ECE7DF] truncate">
                      {currentUser.name || currentUser.email || 'My Account'}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={onLogout}
                title="Log Out"
                className="text-[#736E65] hover:text-red-400 p-1 rounded-lg hover:bg-[#22211C] transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              title="Sign In / Register"
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2' : 'justify-center space-x-1.5 px-2.5 py-1.5'} rounded-xl bg-[#D97757]/15 hover:bg-[#D97757]/25 text-[#D97757] border border-[#D97757]/30 text-xs font-medium transition active:scale-95`}
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              {!isCollapsed && <span className="text-[11px]">Sign In / Register</span>}
            </button>
          )}
        </div>

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
