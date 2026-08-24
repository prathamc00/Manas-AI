import React from 'react';
import { CloudSun, CheckSquare, Search, Lock } from 'lucide-react';

interface DisguiseViewProps {
  onUnlock: () => void;
}

export const DisguiseView: React.FC<DisguiseViewProps> = ({ onUnlock }) => {
  return (
    <div className="min-h-screen bg-[#181714] text-[#ECE7DF] p-8 font-sans select-none animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Navbar */}
        <div className="flex items-center justify-between border-b border-[#262520] pb-4">
          <div className="flex items-center space-x-2.5">
            <CloudSun className="w-5 h-5 text-[#D97757]" />
            <h1 className="font-editorial text-sm font-semibold text-[#ECE7DF]">Workspace & Agenda</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-[#22211C] px-3 py-1.5 rounded-lg text-xs text-[#736E65] border border-[#33312B]">
              <Search className="w-3.5 h-3.5" />
              <span>Search documents...</span>
            </div>
            <button
              onClick={onUnlock}
              title="Unlock (Press Esc or Click)"
              className="p-2 rounded-lg bg-[#22211C] hover:bg-[#2B2A24] text-[#A39D93] hover:text-[#ECE7DF] border border-[#33312B] transition"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Weather Card */}
        <div className="p-6 rounded-2xl bg-[#22211C] border border-[#33312B] flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-[#736E65]">Current City Conditions</div>
            <div className="font-editorial text-3xl font-semibold text-[#ECE7DF] mt-1">22°C Clear Sky</div>
            <p className="text-xs text-[#A39D93] mt-1">Humidity 45% · Wind 8 km/h NW · Air Quality Good</p>
          </div>
          <CloudSun className="w-14 h-14 text-[#D97757] opacity-80" />
        </div>

        {/* Action Items list */}
        <div className="space-y-3 pt-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[#736E65]">Current Sprint Backlog</h2>
          <div className="space-y-2">
            {[
              "Review system design specifications and architecture notes",
              "Update dependencies and validation checks in build pipeline",
              "Prepare roadmap overview for Q3 product sync",
              "Document database schema relationships for offline support"
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#22211C] border border-[#33312B] flex items-center space-x-3 text-xs text-[#ECE7DF]">
                <CheckSquare className="w-4 h-4 text-[#D97757]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
