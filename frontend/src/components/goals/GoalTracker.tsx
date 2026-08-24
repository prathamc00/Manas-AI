import React, { useState } from 'react';
import { Target, Plus, CheckCircle2, Circle } from 'lucide-react';
import type { Goal } from '../../types';

interface GoalTrackerProps {
  goals: Goal[];
  onCreateGoal: (data: { title: string; description?: string; strategies?: string[] }) => Promise<void>;
  onUpdateGoal: (id: string, updates: Partial<Goal> & { progress_note?: string }) => Promise<void>;
}

export const GoalTracker: React.FC<GoalTrackerProps> = ({
  goals,
  onCreateGoal,
  onUpdateGoal,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [strategyInput, setStrategyInput] = useState('');
  const [activeNoteGoalId, setActiveNoteGoalId] = useState<string | null>(null);
  const [progressNoteText, setProgressNoteText] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const strategies = strategyInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    await onCreateGoal({ title: newTitle, description: newDescription, strategies });
    setNewTitle('');
    setNewDescription('');
    setStrategyInput('');
    setIsCreating(false);
  };

  const handleAddNote = async (goalId: string) => {
    if (!progressNoteText.trim()) return;
    await onUpdateGoal(goalId, { progress_note: progressNoteText });
    setProgressNoteText('');
    setActiveNoteGoalId(null);
  };

  const toggleStatus = async (goal: Goal) => {
    const nextStatus = goal.status === 'achieved' ? 'in_progress' : 'achieved';
    await onUpdateGoal(goal.id, { status: nextStatus });
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#181714] text-[#ECE7DF] animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#D97757] text-xs font-semibold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              <span>Behavioral Intentions</span>
            </div>
            <h2 className="font-editorial text-2xl font-semibold text-[#ECE7DF] mt-1">Growth Commitments</h2>
            <p className="text-xs text-[#A39D93] mt-1 leading-relaxed">
              Focus on low-friction micro-habits and self-compassionate consistency.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#22211C] hover:bg-[#2B2A24] border border-[#33312B] hover:border-[#D97757]/50 text-xs text-[#ECE7DF] font-medium transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#D97757]" />
            <span>New Intention</span>
          </button>
        </div>

        {/* Create Form */}
        {isCreating && (
          <form onSubmit={handleCreate} className="p-5 rounded-2xl bg-[#22211C] border border-[#33312B] space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold text-[#ECE7DF]">Set a New Growth Goal</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Intention (e.g., Take a 3-minute pause before opening emails)"
                className="w-full bg-[#1D1C18] border border-[#33312B] rounded-xl px-4 py-2.5 text-xs text-[#ECE7DF] placeholder-[#736E65] outline-none focus:border-[#D97757]/60"
              />
              <textarea
                rows={2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Why is this meaningful for your wellbeing?"
                className="w-full bg-[#1D1C18] border border-[#33312B] rounded-xl p-3 text-xs text-[#ECE7DF] placeholder-[#736E65] outline-none focus:border-[#D97757]/60 resize-none leading-relaxed"
              />
              <input
                type="text"
                value={strategyInput}
                onChange={(e) => setStrategyInput(e.target.value)}
                placeholder="Micro-strategies (e.g. Box breathing, Walk outside)"
                className="w-full bg-[#1D1C18] border border-[#33312B] rounded-xl px-4 py-2 text-xs text-[#ECE7DF] placeholder-[#736E65] outline-none"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 text-xs text-[#A39D93] hover:text-[#ECE7DF]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#D97757] hover:bg-[#E38769] text-[#181714] text-xs font-semibold rounded-xl transition"
              >
                Create Intention
              </button>
            </div>
          </form>
        )}

        {/* Goals List */}
        <div className="space-y-3">
          {goals.length === 0 ? (
            <p className="text-xs text-[#736E65] p-8 bg-[#22211C] rounded-xl border border-[#33312B] text-center italic">
              No intentions created yet. Add a small habit above.
            </p>
          ) : (
            goals.map((goal) => {
              const isAchieved = goal.status === 'achieved';
              return (
                <div
                  key={goal.id}
                  className={`p-5 rounded-2xl bg-[#22211C] border transition duration-150 space-y-3 ${
                    isAchieved ? 'border-[#33312B] opacity-75' : 'border-[#383630]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleStatus(goal)}
                        className="mt-0.5 text-[#D97757] hover:opacity-80 transition"
                      >
                        {isAchieved ? <CheckCircle2 className="w-5 h-5 text-[#D97757]" /> : <Circle className="w-5 h-5 text-[#736E65]" />}
                      </button>
                      <div className="space-y-0.5">
                        <h4 className={`text-sm font-semibold ${isAchieved ? 'line-through text-[#736E65]' : 'text-[#ECE7DF]'}`}>
                          {goal.title}
                        </h4>
                        {goal.description && (
                          <p className="text-xs text-[#A39D93] leading-relaxed">{goal.description}</p>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-md bg-[#1D1C18] text-[#A39D93] border border-[#33312B]">
                      {goal.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Strategies */}
                  {goal.strategies && goal.strategies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pl-8">
                      {goal.strategies.map((strat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#1D1C18] border border-[#33312B] text-[11px] text-[#D97757]"
                        >
                          • {strat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Progress Notes */}
                  {goal.progress_notes && goal.progress_notes.length > 0 && (
                    <div className="pl-8 pt-1 space-y-1.5">
                      {goal.progress_notes.map((pn, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-[#1D1C18] border border-[#33312B] text-xs text-[#ECE7DF]">
                          {pn.note}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Note Add */}
                  <div className="pl-8 pt-1">
                    {activeNoteGoalId === goal.id ? (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={progressNoteText}
                          onChange={(e) => setProgressNoteText(e.target.value)}
                          placeholder="Log a small win or reflection..."
                          className="flex-1 bg-[#1D1C18] border border-[#33312B] rounded-lg px-3 py-1.5 text-xs text-[#ECE7DF] outline-none"
                        />
                        <button
                          onClick={() => handleAddNote(goal.id)}
                          className="px-3 py-1.5 bg-[#D97757] hover:bg-[#E38769] text-[#181714] text-xs font-semibold rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setActiveNoteGoalId(null)}
                          className="px-2 py-1.5 text-xs text-[#736E65]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveNoteGoalId(goal.id)}
                        className="text-[11px] text-[#D97757] hover:underline flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Log progress reflection</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
