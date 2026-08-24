import React, { useState } from 'react';
import { Brain, Check, Trash2, Plus, Sparkles } from 'lucide-react';
import type { Memory } from '../../types';

interface MemoryVaultProps {
  memories: Memory[];
  onConfirmMemory: (id: string) => Promise<void>;
  onDeleteMemory: (id: string) => Promise<void>;
  onCreateMemory: (data: { category: string; content: string }) => Promise<void>;
}

export const MemoryVault: React.FC<MemoryVaultProps> = ({
  memories,
  onConfirmMemory,
  onDeleteMemory,
  onCreateMemory,
}) => {
  const [activeTab, setActiveTab] = useState<'confirmed' | 'inferred'>('confirmed');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('preference');
  const [isCreating, setIsCreating] = useState(false);

  const confirmedMemories = memories.filter((m) => m.user_confirmed);
  const inferredMemories = memories.filter((m) => !m.user_confirmed);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    await onCreateMemory({ category: newCategory, content: newContent });
    setNewContent('');
    setIsCreating(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#181714] text-[#ECE7DF] animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#D97757] text-xs font-semibold uppercase tracking-wider">
              <Brain className="w-3.5 h-3.5" />
              <span>Personal Context</span>
            </div>
            <h2 className="font-editorial text-2xl font-semibold text-[#ECE7DF] mt-1">Memory & Continuity</h2>
            <p className="text-xs text-[#A39D93] mt-1 leading-relaxed">
              You maintain total control. Inferred observations require your explicit validation before becoming confirmed memory.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#22211C] hover:bg-[#2B2A24] border border-[#33312B] hover:border-[#D97757]/50 text-xs text-[#ECE7DF] font-medium transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#D97757]" />
            <span>Add Fact</span>
          </button>
        </div>

        {/* Add Memory Form */}
        {isCreating && (
          <form onSubmit={handleCreate} className="p-4 rounded-xl bg-[#22211C] border border-[#33312B] space-y-3 shadow-sm">
            <h3 className="text-xs font-semibold text-[#ECE7DF]">Add Confirmed Preference or Context</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="bg-[#1D1C18] border border-[#33312B] rounded-lg px-3 py-2 text-xs text-[#ECE7DF] outline-none"
              >
                <option value="preference">Preference</option>
                <option value="explicit">Explicit Fact</option>
                <option value="episodic">Key Life Event</option>
                <option value="semantic">Recurring Theme</option>
              </select>
              <input
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="e.g., Prefers direct Socratic inquiry rather than reassurance..."
                className="flex-1 bg-[#1D1C18] border border-[#33312B] rounded-lg px-3 py-2 text-xs text-[#ECE7DF] placeholder-[#736E65] outline-none focus:border-[#D97757]/60"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#D97757] hover:bg-[#E38769] text-[#181714] text-xs font-semibold rounded-lg transition"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 bg-[#1F1E1A] p-1 rounded-xl border border-[#2B2A24] w-fit">
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition duration-150 flex items-center space-x-2 ${
              activeTab === 'confirmed'
                ? 'bg-[#2B2A24] text-[#ECE7DF] shadow-sm'
                : 'text-[#A39D93] hover:text-[#ECE7DF]'
            }`}
          >
            <span>Confirmed Facts ({confirmedMemories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inferred')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition duration-150 flex items-center space-x-2 ${
              activeTab === 'inferred'
                ? 'bg-[#2B2A24] text-[#D97757] shadow-sm'
                : 'text-[#A39D93] hover:text-[#ECE7DF]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#D97757]" />
            <span>Observed Hypotheses ({inferredMemories.length})</span>
          </button>
        </div>

        {/* List */}
        {activeTab === 'confirmed' ? (
          <div className="space-y-2">
            {confirmedMemories.length === 0 ? (
              <p className="text-xs text-[#736E65] p-8 bg-[#22211C] rounded-xl border border-[#33312B] text-center italic">
                No confirmed memories stored yet.
              </p>
            ) : (
              confirmedMemories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-4 rounded-xl bg-[#22211C] border border-[#33312B] hover:border-[#47443C] flex items-center justify-between group transition duration-150"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-[#D97757]">
                        {mem.category}
                      </span>
                      <span className="text-[10px] text-[#736E65]">
                        · {new Date(mem.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-[#ECE7DF] leading-relaxed">{mem.content}</p>
                  </div>

                  <button
                    onClick={() => onDeleteMemory(mem.id)}
                    title="Delete"
                    className="p-1.5 rounded-lg text-[#736E65] hover:text-rose-400 hover:bg-[#2B2A24] transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {inferredMemories.length === 0 ? (
              <p className="text-xs text-[#736E65] p-8 bg-[#22211C] rounded-xl border border-[#33312B] text-center italic">
                No active hypotheses. As you reflect, candidate themes will appear here for validation.
              </p>
            ) : (
              inferredMemories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-4 rounded-xl bg-[#22211C] border border-[#383630] flex items-center justify-between transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-[#A39D93]">
                        Observed Inference
                      </span>
                      <span className="text-[10px] text-[#736E65]">
                        (Confidence: {Math.round(mem.confidence * 100)}%)
                      </span>
                    </div>
                    <p className="text-xs text-[#ECE7DF]">{mem.content}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onConfirmMemory(mem.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#2B2A24] hover:bg-[#33312B] border border-[#383630] text-[#D97757] text-xs font-medium transition flex items-center space-x-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Confirm Fact</span>
                    </button>
                    <button
                      onClick={() => onDeleteMemory(mem.id)}
                      className="p-1.5 rounded-lg text-[#736E65] hover:text-rose-400 hover:bg-[#2B2A24] transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
