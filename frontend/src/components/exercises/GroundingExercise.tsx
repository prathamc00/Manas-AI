import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw, Check, Eye, Menu } from 'lucide-react';

interface GroundingExerciseProps {
  onOpenMobileMenu?: () => void;
}

export const GroundingExercise: React.FC<GroundingExerciseProps> = ({ onOpenMobileMenu }) => {
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(4);

  const phases = [
    { name: 'Inhale Slowly', duration: 4, instruction: 'Breathe in softly through the nose, filling your belly.' },
    { name: 'Hold Gently', duration: 4, instruction: 'Hold the breath effortlessly without tension.' },
    { name: 'Exhale Completely', duration: 4, instruction: 'Release all air gently through open lips.' },
    { name: 'Rest in Stillness', duration: 4, instruction: 'Pause softly in natural silence.' },
  ];

  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setPhaseIndex((p) => (p + 1) % phases.length);
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  // 5-4-3-2-1 Sensory Grounding State
  const [checkedSensory, setCheckedSensory] = useState<{ [key: string]: boolean }>({});
  const sensoryItems = [
    { id: '5_see', label: '5 things you can SEE in your surroundings' },
    { id: '4_feel', label: '4 things you can physically FEEL (feet on ground, fabric on skin)' },
    { id: '3_hear', label: '3 distinct sounds you can HEAR in the room or background' },
    { id: '2_smell', label: '2 aromas or scents you can notice' },
    { id: '1_taste', label: '1 taste in your mouth (or take a mindful sip of water)' },
  ];

  const toggleSensory = (id: string) => {
    setCheckedSensory((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#181714] text-[#ECE7DF] animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#D97757] text-xs font-semibold uppercase tracking-wider">
              <Wind className="w-3.5 h-3.5" />
              <span>Physiological Grounding</span>
            </div>
            <h2 className="font-editorial text-xl md:text-2xl font-semibold text-[#ECE7DF] mt-1">
              Nervous System Regulation
            </h2>
            <p className="text-xs text-[#A39D93] mt-1 leading-relaxed">
              When emotional arousal is high, paced breathing and sensory anchoring reset the autonomic nervous system.
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

        {/* Box Breathing Card */}
        <div className="p-6 md:p-8 rounded-2xl bg-[#22211C] border border-[#33312B] flex flex-col items-center justify-center space-y-6 shadow-sm animate-slide-up">
          <div className="text-center space-y-1">
            <h3 className="font-editorial text-lg md:text-xl font-semibold text-[#ECE7DF]">
              {phases[phaseIndex].name}
            </h3>
            <p className="text-xs text-[#D97757] font-medium">{phases[phaseIndex].instruction}</p>
          </div>

          {/* Multi-layered Animated Breathing Orb */}
          <div className="relative w-44 h-44 md:w-52 md:h-52 flex items-center justify-center my-3">
            {/* Outer expanding ring when active */}
            {isBreathingActive && (
              <div className="absolute inset-0 rounded-full border border-[#D97757]/30 animate-ring-pulse" />
            )}

            <div
              className={`w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-[#D97757]/30 to-[#E07A5F]/20 border border-[#D97757]/60 flex items-center justify-center transition-all duration-1000 ${
                isBreathingActive ? 'animate-breathe-warm' : 'scale-90 opacity-70'
              }`}
            >
              <div className="text-center">
                <span className="font-editorial text-4xl md:text-5xl font-bold text-[#ECE7DF]">{countdown}</span>
                <span className="block text-[9px] text-[#D97757] font-semibold uppercase tracking-widest mt-0.5">
                  Seconds
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="px-6 py-2.5 rounded-xl bg-[#D97757] hover:bg-[#E38769] active:scale-95 text-[#181714] text-xs font-semibold shadow-md transition duration-200 flex items-center space-x-2"
            >
              {isBreathingActive ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Begin Box Breathing</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsBreathingActive(false);
                setPhaseIndex(0);
                setCountdown(4);
              }}
              className="p-2.5 rounded-xl bg-[#1D1C18] hover:bg-[#2B2A24] active:scale-95 border border-[#33312B] text-[#A39D93] hover:text-[#ECE7DF] transition"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5-4-3-2-1 Sensory Anchor Checklist */}
        <div className="p-4 md:p-6 rounded-2xl bg-[#22211C] border border-[#33312B] space-y-3 shadow-sm animate-slide-up">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#ECE7DF]">
            <Eye className="w-3.5 h-3.5 text-[#D97757]" />
            <span>5-4-3-2-1 Sensory Grounding Anchor</span>
          </div>
          <p className="text-xs text-[#A39D93]">
            Anchor your attention in the physical present by noticing each item:
          </p>

          <div className="space-y-2 pt-1">
            {sensoryItems.map((item) => {
              const isDone = !!checkedSensory[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => toggleSensory(item.id)}
                  className={`w-full text-left p-3 md:p-3.5 rounded-xl border transition duration-150 flex items-center space-x-3 active:scale-[0.99] ${
                    isDone
                      ? 'bg-[#1D1C18] border-[#33312B] text-[#736E65]'
                      : 'bg-[#1D1C18] border-[#33312B] hover:border-[#47443C] text-[#ECE7DF]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                    isDone ? 'bg-[#D97757] border-[#D97757] text-[#181714]' : 'border-[#47443C]'
                  }`}>
                    {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={`text-xs ${isDone ? 'line-through text-[#736E65]' : ''}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
