import React, { useState } from 'react';
import { Heart, Sparkles, Check, Calendar, Menu } from 'lucide-react';
import type { MoodEntry } from '../../types';

interface DailyCheckInProps {
  moodHistory: MoodEntry[];
  onLogMood: (data: { mood: number; stress: number; energy: number; notes?: string }) => Promise<void>;
  onOpenMobileMenu?: () => void;
}

export const DailyCheckIn: React.FC<DailyCheckInProps> = ({ moodHistory, onLogMood, onOpenMobileMenu }) => {
  const [selectedMood, setSelectedMood] = useState<number>(3);
  const [stress, setStress] = useState<number>(4);
  const [energy, setEnergy] = useState<number>(6);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  const moodOptions = [
    { value: 1, label: 'Low', desc: 'Heavy, overwhelmed, or depleted' },
    { value: 2, label: 'Neutral', desc: 'Managing, calm but flat' },
    { value: 3, label: 'Grounded', desc: 'Clear, balanced, present' },
    { value: 4, label: 'Energized', desc: 'Vibrant, open, resourceful' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onLogMood({ mood: selectedMood, stress, energy, notes });
      setSubmittedSuccess(true);
      setNotes('');
      setTimeout(() => setSubmittedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#181714] text-[#ECE7DF] animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#D97757] text-xs font-semibold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5" />
              <span>Emotional Reflection</span>
            </div>
            <h2 className="font-editorial text-xl md:text-2xl font-semibold text-[#ECE7DF] mt-1">
              How is your inner landscape today?
            </h2>
            <p className="text-xs text-[#A39D93] mt-1 leading-relaxed">
              Taking a short pause to name what you are carrying creates longitudinal awareness without pressure to fix.
            </p>
          </div>

          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="p-1.5 rounded-lg text-[#A39D93] hover:text-[#ECE7DF] hover:bg-[#22211C] md:hidden transition shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Check-in Card */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 rounded-2xl bg-[#22211C] border border-[#33312B] space-y-5 md:space-y-6 shadow-sm animate-slide-up">
          {/* Mood Selector Grid */}
          <div>
            <label className="block text-xs font-semibold text-[#ECE7DF] mb-2.5">Overall State</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {moodOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedMood(opt.value)}
                  className={`p-3 md:p-3.5 rounded-xl border text-left transition duration-200 flex flex-col justify-between space-y-2 active:scale-95 ${
                    selectedMood === opt.value
                      ? 'bg-[#2B2A24] border-[#D97757] text-[#ECE7DF] shadow-sm'
                      : 'bg-[#1D1C18] border-[#33312B] hover:border-[#47443C] text-[#A39D93]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{opt.label}</span>
                    {selectedMood === opt.value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
                    )}
                  </div>
                  <span className="text-[10px] text-[#736E65] leading-snug">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Stress */}
            <div className="bg-[#1D1C18] p-3.5 md:p-4 rounded-xl border border-[#33312B] space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#ECE7DF]">Perceived Stress</span>
                <span className="text-[#D97757] font-semibold">{stress}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => setStress(Number(e.target.value))}
                className="w-full accent-[#D97757] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#736E65]">
                <span>Low Tension</span>
                <span>High Strain</span>
              </div>
            </div>

            {/* Energy */}
            <div className="bg-[#1D1C18] p-3.5 md:p-4 rounded-xl border border-[#33312B] space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#ECE7DF]">Energy Level</span>
                <span className="text-[#D97757] font-semibold">{energy}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full accent-[#D97757] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#736E65]">
                <span>Depleted</span>
                <span>Restored</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#ECE7DF]">
              Context / Key Driver (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What is influencing your energy or stress level today?"
              className="w-full bg-[#1D1C18] border border-[#33312B] focus:border-[#D97757]/70 rounded-xl p-3 text-xs text-[#ECE7DF] placeholder-[#736E65] outline-none transition resize-none leading-relaxed"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#D97757] hover:bg-[#E38769] active:scale-[0.99] text-[#181714] text-xs font-semibold shadow-md transition duration-200 flex items-center justify-center space-x-2"
          >
            {submittedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Check-in Logged</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Today\'s Reflection'}</span>
              </>
            )}
          </button>
        </form>

        {/* History */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#A39D93]">
            <Calendar className="w-3.5 h-3.5 text-[#D97757]" />
            <span>Recent Reflections</span>
          </div>

          {moodHistory.length === 0 ? (
            <p className="text-xs text-[#736E65] p-6 bg-[#22211C] rounded-xl border border-[#33312B] text-center italic">
              No entries logged yet.
            </p>
          ) : (
            <div className="space-y-2">
              {moodHistory.map((entry) => {
                const opt = moodOptions.find((m) => m.value === entry.mood) || moodOptions[1];
                return (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-xl bg-[#22211C] border border-[#33312B] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-[#ECE7DF] flex items-center space-x-2">
                        <span>{opt.label}</span>
                        <span className="text-[10px] text-[#736E65]">
                          · {new Date(entry.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      {entry.notes && <p className="text-[11px] text-[#A39D93]">{entry.notes}</p>}
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-[#A39D93]">
                      <span>Stress: <strong className="text-[#ECE7DF]">{entry.stress}/10</strong></span>
                      <span>Energy: <strong className="text-[#ECE7DF]">{entry.energy}/10</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
