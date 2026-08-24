import React from 'react';
import { 
  ShieldCheck, 
  Brain, 
  Heart, 
  Compass, 
  Menu,
  ArrowLeft
} from 'lucide-react';

interface AboutViewProps {
  onBackToHome: () => void;
  onOpenMobileMenu?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBackToHome, onOpenMobileMenu }) => {
  const principles = [
    {
      num: '1',
      title: 'Listen Before Solving',
      desc: 'Never rush into offering advice or quick fixes. The user often needs emotional containment and validation before problem-solving.'
    },
    {
      num: '2',
      title: 'Understand Before Intervening',
      desc: 'Map the chain of Situation → Automatic Thought → Emotion → Behavior before deciding on a therapeutic approach.'
    },
    {
      num: '3',
      title: 'Remember With Permission',
      desc: 'Inferred observations require your explicit validation. You retain complete authority to view, edit, or delete any stored memory.'
    },
    {
      num: '4',
      title: 'Personalize Over Time',
      desc: 'Past sessions meaningfully inform future conversations, identifying recurring triggers without re-explaining context.'
    },
    {
      num: '5',
      title: 'Don\'t Blindly Agree',
      desc: 'Respectfully challenge unhelpful absolute distortions ("I always fail", "I am worthless") using gentle Socratic inquiry.'
    },
    {
      num: '6',
      title: 'Safety Before Conversation',
      desc: 'Independent safety classification intercepts acute crisis triggers to provide immediate emergency resources.'
    },
    {
      num: '7',
      title: 'Encourage Human Connection',
      desc: 'MANAS never creates artificial emotional dependency. It champions your real-world relationships and professional support.'
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#181714] text-[#ECE7DF] animate-fade-in select-text">
      <div className="max-w-3xl mx-auto space-y-8 pb-12">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-1.5 text-xs text-[#A39D93] hover:text-[#ECE7DF] transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="p-1.5 rounded-lg text-[#A39D93] hover:text-[#ECE7DF] hover:bg-[#22211C] md:hidden transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Hero Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[#D97757] text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Philosophy & Architecture</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-[#ECE7DF] tracking-tight">
            About MANAS
          </h1>
          <blockquote className="font-editorial text-lg italic text-[#D97757] border-l-2 border-[#D97757] pl-4 py-1">
            "A mind that remembers. A companion that understands."
          </blockquote>
          <p className="text-xs text-[#A39D93] leading-relaxed pt-1">
            MANAS was designed to solve the three core failures of generic conversational AI in mental health: repetitive superficial empathy, total amnesia between chats, and premature unsolicited advice.
          </p>
        </div>

        {/* Dual Engine Architecture Explanation */}
        <div className="p-6 rounded-2xl bg-[#22211C] border border-[#33312B] space-y-4 shadow-sm animate-slide-up">
          <h3 className="font-editorial text-lg font-semibold text-[#ECE7DF]">
            The Dual-Engine Distinction
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div className="p-4 rounded-xl bg-[#1D1C18] border border-[#33312B] space-y-2">
              <div className="flex items-center space-x-2 text-[#D97757] font-semibold">
                <Heart className="w-4 h-4" />
                <span>Therapy Engine</span>
              </div>
              <p className="text-[#A39D93] leading-relaxed">
                Determines <em>how to support</em> the emotional moment — choosing between Reflective Listening, Socratic CBT, ACT Values Defusion, or Somatic Grounding.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#1D1C18] border border-[#33312B] space-y-2">
              <div className="flex items-center space-x-2 text-[#D97757] font-semibold">
                <Brain className="w-4 h-4" />
                <span>Advice Engine</span>
              </div>
              <p className="text-[#A39D93] leading-relaxed">
                Determines <em>whether a practical micro-step is appropriate</em>. Strictly withholds advice when the user is venting or in high distress.
              </p>
            </div>
          </div>
        </div>

        {/* The 7 Core Product Principles */}
        <div className="space-y-4">
          <h3 className="font-editorial text-xl font-semibold text-[#ECE7DF]">
            The 7 Guiding Clinical Principles
          </h3>

          <div className="space-y-2.5">
            {principles.map((p) => (
              <div
                key={p.num}
                className="p-4 rounded-xl bg-[#22211C] border border-[#33312B] flex items-start space-x-3.5"
              >
                <span className="w-6 h-6 rounded-full bg-[#1D1C18] border border-[#33312B] text-[#D97757] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {p.num}
                </span>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-[#ECE7DF]">{p.title}</h4>
                  <p className="text-xs text-[#A39D93] leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Ethical Boundaries */}
        <div className="p-6 rounded-2xl bg-[#1D1C18] border border-[#2B2A24] space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#ECE7DF]">
            <ShieldCheck className="w-4 h-4 text-[#D97757]" />
            <span>Ethical Boundaries & Non-Medical Notice</span>
          </div>
          <p className="text-xs text-[#A39D93] leading-relaxed">
            MANAS is an AI reflective companion and does not provide medical diagnoses, psychiatric prescriptions, or emergency crisis intervention. In situations of acute distress or self-harm, MANAS activates its safety escalation protocol to connect you directly with trained human counselors.
          </p>
        </div>
      </div>
    </div>
  );
};
