import React from 'react';
import { X, ShieldAlert, Phone, ExternalLink, HeartHandshake } from 'lucide-react';
import type { SafetyResources } from '../../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources?: SafetyResources | null;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  resources,
}) => {
  if (!isOpen) return null;

  const helplines = resources?.helplines || [
    { country: 'India (Tele-MANAS)', number: '14416', available: '24/7 Free & Confidential' },
    { country: 'India Emergency Service', number: '112', available: 'National Emergency' },
    { country: 'USA & Canada Lifeline', number: '988', available: '24/7 Call or Text' },
    { country: 'UK (Samaritans)', number: '116 123', available: '24/7 Free' },
    { country: 'International Helplines', url: 'https://findahelpline.com', available: 'Free Worldwide Directory' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#22211C] border border-[#383630] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-[#ECE7DF] space-y-5 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#2B2A24] border border-[#383630] text-[#D97757]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-semibold text-[#ECE7DF]">Crisis & Safety Support</h3>
              <p className="text-xs text-[#D97757] font-medium">You do not have to carry this alone</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#736E65] hover:text-[#ECE7DF] hover:bg-[#2B2A24] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-xs text-[#A39D93] leading-relaxed bg-[#1D1C18] p-3.5 rounded-xl border border-[#33312B]">
          MANAS is an AI companion and cannot replace human clinical care. If you are experiencing acute crisis or need immediate support, please contact a free, confidential helpline right now:
        </p>

        {/* Helplines Directory */}
        <div className="space-y-2">
          {helplines.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#1D1C18] border border-[#33312B] flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-[#ECE7DF]">{item.country}</div>
                <div className="text-[10px] text-[#736E65]">{item.available}</div>
              </div>

              {item.number ? (
                <a
                  href={`tel:${item.number}`}
                  className="px-3 py-1.5 rounded-lg bg-[#2B2A24] hover:bg-[#33312B] border border-[#383630] text-[#D97757] text-xs font-semibold transition flex items-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{item.number}</span>
                </a>
              ) : (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#2B2A24] hover:bg-[#33312B] border border-[#383630] text-[#D97757] text-xs font-semibold transition flex items-center space-x-1.5"
                >
                  <span>Directory</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Grounding note */}
        <div className="p-3 bg-[#1D1C18] border border-[#33312B] rounded-xl flex items-center space-x-3 text-xs text-[#D97757]">
          <HeartHandshake className="w-4 h-4 shrink-0 text-[#D97757]" />
          <span className="text-[#A39D93]">Take a slow, deep breath. People who care and understand are available 24/7.</span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#2B2A24] hover:bg-[#33312B] text-[#ECE7DF] text-xs font-semibold transition"
        >
          Return to Conversation
        </button>
      </div>
    </div>
  );
};
