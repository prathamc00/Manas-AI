import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Search, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Clock, 
  ChevronRight 
} from 'lucide-react';
import type { Session } from '../../types';

interface RecentChatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession?: (id: string) => Promise<void>;
  onRenameSession?: (id: string, newTitle: string) => Promise<void>;
}

function getGroupKey(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0 && now.getDate() === date.getDate()) return 'Today';
  if (diffDays <= 1) return 'Yesterday';
  if (diffDays <= 7) return 'Previous 7 Days';
  if (diffDays <= 30) return 'This Month';
  return 'Older';
}

export const RecentChatsModal: React.FC<RecentChatsModalProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter((s) => {
      const titleMatch = s.title?.toLowerCase().includes(q);
      const messageMatch = s.messages?.some((m) => m.content.toLowerCase().includes(q));
      return titleMatch || messageMatch;
    });
  }, [sessions, searchQuery]);

  // Grouped sessions
  const groupedSessions = useMemo(() => {
    const groups: { [key: string]: Session[] } = {};
    const order = ['Today', 'Yesterday', 'Previous 7 Days', 'This Month', 'Older'];
    
    for (const session of filteredSessions) {
      const key = getGroupKey(session.started_at);
      if (!groups[key]) groups[key] = [];
      groups[key].push(session);
    }

    return order
      .filter((k) => groups[k] && groups[k].length > 0)
      .map((k) => ({ group: k, items: groups[k] }));
  }, [filteredSessions]);

  if (!isOpen) return null;

  const handleStartRename = (session: Session, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title || 'Session');
  };

  const handleSaveRename = async (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (onRenameSession && editTitle.trim()) {
      setIsProcessing(true);
      try {
        await onRenameSession(id, editTitle.trim());
      } finally {
        setIsProcessing(false);
        setEditingId(null);
      }
    } else {
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deletingId !== id) {
      setDeletingId(id);
      return;
    }

    if (onDeleteSession) {
      setIsProcessing(true);
      try {
        await onDeleteSession(id);
      } finally {
        setIsProcessing(false);
        setDeletingId(null);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#161512] border border-[#2B2A24] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-[#ECE7DF]"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#262520] flex items-center justify-between bg-[#1A1915]/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D97757]/15 border border-[#D97757]/30 text-[#D97757] flex items-center justify-center shadow-sm shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-lg sm:text-xl font-semibold text-[#ECE7DF] flex items-center gap-2">
                <span>Recent Conversations</span>
                <span className="text-xs font-sans font-normal text-[#736E65] px-2 py-0.5 rounded-full bg-[#22211C] border border-[#2B2A24]">
                  {sessions.length}
                </span>
              </h2>
              <p className="text-[11px] text-[#A39D93]">
                Browse, search, and jump back into your past therapeutic dialogues.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onNewSession();
                onClose();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#D97757] hover:bg-[#E38769] text-[#181714] font-semibold text-xs transition duration-150 shadow-md active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">New Session</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#736E65] hover:text-[#ECE7DF] hover:bg-[#22211C] transition shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#262520] bg-[#12110E]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#736E65] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations by title or message keywords..."
              className="w-full bg-[#181714] border border-[#2B2A24] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#ECE7DF] placeholder-[#545048] focus:outline-none focus:border-[#D97757]/70 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#736E65] hover:text-[#ECE7DF]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Session List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {groupedSessions.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#22211C] border border-[#33312B] flex items-center justify-center text-[#736E65]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs text-[#ECE7DF] font-medium">
                {searchQuery ? 'No conversations matching your search' : 'No previous conversations yet'}
              </p>
              <p className="text-[11px] text-[#736E65] max-w-xs">
                {searchQuery ? 'Try searching for different keywords.' : 'Start a new reflection dialogue to begin building your conversation history.'}
              </p>
            </div>
          ) : (
            groupedSessions.map(({ group, items }) => (
              <div key={group} className="space-y-2.5">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#736E65] px-1 flex items-center gap-1.5">
                  <span>{group}</span>
                  <div className="h-px bg-[#262520] flex-1" />
                </div>

                <div className="space-y-2">
                  {items.map((session) => {
                    const isActive = session.id === activeSessionId;
                    const messageCount = session.messages?.length || 0;
                    const lastMessage = session.messages && session.messages.length > 0
                      ? session.messages[session.messages.length - 1]
                      : null;
                    const isEditing = editingId === session.id;
                    const isDeletingConfirm = deletingId === session.id;

                    const formattedDate = new Date(session.started_at).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <div
                        key={session.id}
                        onClick={() => {
                          if (!isEditing) {
                            onSelectSession(session.id);
                            onClose();
                          }
                        }}
                        className={`group p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative ${
                          isActive
                            ? 'bg-[#22211C] border-[#D97757]/60 shadow-md'
                            : 'bg-[#181714] border-[#262520] hover:bg-[#1E1D18] hover:border-[#383630]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-3 min-w-0 flex-1">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              isActive
                                ? 'bg-[#D97757] text-[#181714]'
                                : 'bg-[#22211C] text-[#736E65] group-hover:text-[#D97757] border border-[#2B2A24]'
                            }`}>
                              <MessageSquare className="w-4 h-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                              {isEditing ? (
                                <form
                                  onSubmit={(e) => handleSaveRename(session.id, e)}
                                  className="flex items-center space-x-2 my-0.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="text"
                                    autoFocus
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="bg-[#0E0D0B] border border-[#D97757]/70 rounded-lg px-2.5 py-1 text-xs text-[#ECE7DF] focus:outline-none w-full"
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => handleSaveRename(session.id, e)}
                                    disabled={isProcessing}
                                    className="p-1 rounded-lg bg-[#D97757] text-[#181714] hover:bg-[#E38769]"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                                    className="p-1 rounded-lg bg-[#22211C] text-[#736E65] hover:text-[#ECE7DF]"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </form>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-xs sm:text-sm font-semibold text-[#ECE7DF] truncate group-hover:text-[#D97757] transition">
                                    {session.title || 'Untitled Session'}
                                  </h3>
                                  {isActive && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D97757]/20 text-[#D97757] border border-[#D97757]/30 shrink-0">
                                      ACTIVE
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Last message snippet or summary */}
                              {lastMessage && (
                                <p className="text-[11px] text-[#A39D93] mt-1 line-clamp-1">
                                  {lastMessage.role === 'assistant' ? 'MANAS: ' : 'You: '}
                                  {lastMessage.content}
                                </p>
                              )}

                              {/* Metadata footer */}
                              <div className="flex items-center space-x-3 mt-2 text-[10px] text-[#736E65]">
                                <span>{formattedDate}</span>
                                <span>•</span>
                                <span>{messageCount} {messageCount === 1 ? 'message' : 'messages'}</span>
                                {session.summary?.primary_emotion && (
                                  <>
                                    <span>•</span>
                                    <span className="text-[#D97757] font-medium">
                                      {session.summary.primary_emotion}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-1 shrink-0">
                            {onRenameSession && !isEditing && (
                              <button
                                onClick={(e) => handleStartRename(session, e)}
                                title="Rename Conversation"
                                className="p-1.5 rounded-lg text-[#736E65] hover:text-[#ECE7DF] hover:bg-[#2A2923] opacity-80 sm:opacity-0 group-hover:opacity-100 transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {onDeleteSession && (
                              <button
                                onClick={(e) => handleDelete(session.id, e)}
                                title={isDeletingConfirm ? 'Click again to confirm delete' : 'Delete Conversation'}
                                className={`p-1.5 rounded-lg transition ${
                                  isDeletingConfirm
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 opacity-100'
                                    : 'text-[#736E65] hover:text-red-400 hover:bg-[#2A2923] opacity-80 sm:opacity-0 group-hover:opacity-100'
                                }`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <ChevronRight className="w-4 h-4 text-[#736E65] group-hover:text-[#ECE7DF] group-hover:translate-x-0.5 transition hidden sm:block" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
