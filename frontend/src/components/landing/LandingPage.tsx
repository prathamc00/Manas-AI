import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Brain, 
  Heart, 
  Target, 
  Wind, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  EyeOff, 
  MessageSquare, 
  UserCheck
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onExploreGuest: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
  onExploreGuest,
}) => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Multi-Strategy Therapeutic Routing',
      tag: 'Clinical CBT & ACT',
      desc: 'Dynamically shifts between Socratic CBT thought reframing, Acceptance and Commitment Therapy (ACT), Somatic Grounding, and pure Active Listening without giving unsolicited advice.',
      badgeColor: 'text-[#D97757] bg-[#D97757]/10 border-[#D97757]/20',
    },
    {
      icon: Brain,
      title: 'Dual-Tier Memory Vault',
      tag: 'Context Preservation',
      desc: 'Separates unconfirmed AI inferences from user-confirmed memory facts. Retain recurring themes across conversations while maintaining 100% control over stored data.',
      badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    },
    {
      icon: Heart,
      title: 'Daily Emotional & Mood Tracking',
      tag: 'Longitudinal Trends',
      desc: 'Log mood fluctuations, stress ratings, and energy levels over time to uncover psychological triggers and longitudinal emotional progress.',
      badgeColor: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    },
    {
      icon: Target,
      title: 'Therapeutic Goals & Action Plans',
      tag: 'Personal Growth',
      desc: 'Break psychological obstacles into bite-sized actionable strategies with structured progress notes and milestone achievement tracking.',
      badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    },
    {
      icon: Wind,
      title: 'Somatic Grounding & Box Breathing',
      tag: 'Nervous System Reset',
      desc: 'Interactive 4-second autonomic nervous system visualizer and 5-4-3-2-1 sensory grounding anchors for moments of acute stress or anxiety.',
      badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    },
    {
      icon: ShieldCheck,
      title: 'Pre-Flight Safety & Crisis Guard',
      tag: 'Independent Protection',
      desc: 'A dedicated, independent classification layer screens for acute distress and self-harm, providing instant localized emergency helplines.',
      badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Reflect Freely Without Judgment',
      desc: 'Share whatever is on your mind. MANAS contains your emotions with deep empathy before attempting any problem-solving.',
    },
    {
      step: '02',
      title: 'Identify Thought Patterns & Distortions',
      desc: 'Gentle Socratic inquiries help you examine cognitive distortions (all-or-nothing thinking, catastrophizing) with kindness.',
    },
    {
      step: '03',
      title: 'Build Long-Term Emotional Resilience',
      desc: 'Your confirmed insights, emotional check-ins, and goals are securely preserved to guide your ongoing personal journey.',
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#12110E] text-[#ECE7DF] flex flex-col selection:bg-[#D97757]/30 selection:text-white font-sans scroll-smooth">
      {/* Navigation Bar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="sticky top-0 z-40 bg-[#12110E]/90 backdrop-blur-md border-b border-[#22211C]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#D97757] text-[#181714] font-bold text-lg flex items-center justify-center shadow-md">
              <span className="font-editorial italic font-bold">M</span>
            </div>
            <div>
              <span className="font-editorial text-lg font-bold text-[#ECE7DF] tracking-tight">MANAS</span>
              <span className="hidden sm:inline-block text-[10px] text-[#736E65] ml-2 font-mono uppercase tracking-wider">AI Companion</span>
            </div>
          </motion.div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onExploreGuest}
              className="text-xs font-medium text-[#A39D93] hover:text-[#ECE7DF] px-3 py-1.5 rounded-lg hover:bg-[#1A1915] transition"
            >
              Guest Mode
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSignIn}
              className="text-xs font-medium text-[#ECE7DF] hover:text-white px-3.5 py-1.5 rounded-xl border border-[#2B2A24] hover:border-[#3D3A32] bg-[#1A1915] transition"
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(217, 119, 87, 0.35)' }}
              whileTap={{ scale: 0.96 }}
              onClick={onGetStarted}
              className="text-xs font-semibold text-white bg-[#D97757] hover:bg-[#C86646] px-4 py-1.5 rounded-xl transition shadow-md shadow-[#D97757]/15 flex items-center space-x-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-6xl mx-auto text-center space-y-8 overflow-hidden">
        {/* Animated Glow backdrop */}
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#D97757]/20 blur-[140px] rounded-full pointer-events-none -z-10" 
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1F1E19] border border-[#33312B] text-[#D97757] text-xs font-medium shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineered AI Mental-Health & Therapeutic Companion</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants} className="space-y-4 max-w-3xl mx-auto">
            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.15] text-[#ECE7DF]">
              A mind that remembers. <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#D97757]">A companion that understands.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#A39D93] max-w-2xl mx-auto leading-relaxed">
              MANAS combines clinical psychological reasoning (Socratic CBT & ACT) with persistent contextual memory and total privacy — empowering you to unpack thought distortions and build lasting emotional resilience.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(217, 119, 87, 0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#D97757] hover:bg-[#C86646] text-white font-semibold text-sm transition shadow-lg shadow-[#D97757]/20 flex items-center justify-center space-x-2"
            >
              <span>Create Your Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#22211C' }}
              whileTap={{ scale: 0.97 }}
              onClick={onExploreGuest}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1A1915] text-[#ECE7DF] border border-[#2B2A24] text-sm font-medium transition"
            >
              Try Instant Guest Demo
            </motion.button>
          </motion.div>

          {/* Privacy & Trust micro-indicators */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-[#736E65]">
            <div className="flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Encrypted & Private</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <EyeOff className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Instant Disguise Mode (`Esc`)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#D97757]" />
              <span>User-Controlled Memory</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Interactive Preview Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          whileHover={{ y: -4 }}
          className="mt-12 max-w-3xl mx-auto bg-[#181714] border border-[#2B2A24] rounded-2xl p-5 sm:p-7 shadow-2xl text-left space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#22211C] pb-3">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-[#ECE7DF]">Live Therapeutic Session Preview</span>
            </div>
            <span className="text-[11px] text-[#736E65] font-mono">Strategy: Socratic CBT</span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-3 rounded-xl bg-[#22211C]/60 border border-[#2E2C26] text-[#ECE7DF] max-w-[85%]"
            >
              <span className="text-[10px] uppercase tracking-wider text-[#736E65] block mb-1 font-semibold">You</span>
              "I feel like I ruined the whole presentation today because I stumbled over one slide. Everyone probably thinks I'm incompetent."
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="p-4 rounded-xl bg-[#1D1C17] border border-[#33312B] text-[#ECE7DF] space-y-2.5 shadow-inner"
            >
              <div className="flex items-center space-x-2 text-[#D97757] text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>What I'm Hearing</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#D97757]/15 text-[#D97757] border border-[#D97757]/30 font-medium">
                  Catastrophizing & All-or-Nothing
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                  High Self-Critique
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#D1CCC4] leading-relaxed">
                It takes courage to deliver a presentation, and it makes complete sense that you noticed that stumble when you care so deeply about doing well. Let's look at this together: if a close colleague gave that exact presentation, would you judge their entire competence by that single moment?
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid with Scroll Animations */}
      <section className="px-4 sm:px-6 py-20 bg-[#161512] border-t border-b border-[#22211C]">
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 max-w-2xl mx-auto"
          >
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#ECE7DF]">
              Engineered for Real Psychological Growth
            </h2>
            <p className="text-xs sm:text-sm text-[#A39D93]">
              Unlike generic chatbots that regurgitate surface-level tips, MANAS operates on structured therapeutic reasoning designed to help you self-regulate.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  whileHover={{ 
                    y: -6, 
                    scale: 1.015,
                    boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.6)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 rounded-2xl bg-[#1A1915] border border-[#262520] hover:border-[#38362E] transition-colors duration-200 flex flex-col justify-between space-y-4 group cursor-default"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#22211C] flex items-center justify-center text-[#D97757] border border-[#2E2C26] group-hover:scale-110 transition duration-200">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="font-editorial text-lg font-semibold text-[#ECE7DF] group-hover:text-white transition">{item.title}</h3>
                    <p className="text-xs text-[#A39D93] leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Scroll Timeline */}
      <section className="px-4 sm:px-6 py-20 max-w-6xl mx-auto space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3 max-w-xl mx-auto"
        >
          <span className="text-xs uppercase font-bold tracking-widest text-[#D97757]">Simple, Safe & Private</span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#ECE7DF]">
            How Your Sessions Unfold
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-[#181714] border border-[#262520] hover:border-[#38362E] space-y-3 relative transition"
            >
              <span className="font-mono text-2xl font-bold text-[#D97757]/40 block">{s.step}</span>
              <h3 className="font-editorial text-lg font-semibold text-[#ECE7DF]">{s.title}</h3>
              <p className="text-xs text-[#A39D93] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 sm:px-6 py-16 bg-gradient-to-b from-[#181714] to-[#12110E] border-t border-[#22211C]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-[#1D1C18] border border-[#33312B] shadow-2xl space-y-6"
        >
          <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#ECE7DF]">
            Begin Your Sanctuary Today
          </h2>
          <p className="text-xs sm:text-sm text-[#A39D93] max-w-lg mx-auto">
            Take a deep breath. Explore your recurring themes with compassionate cognitive inquiry and structured therapeutic tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(217, 119, 87, 0.4)' }}
              whileTap={{ scale: 0.96 }}
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#D97757] hover:bg-[#C86646] text-white font-semibold text-xs uppercase tracking-wider transition shadow-lg shadow-[#D97757]/20 flex items-center justify-center space-x-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onExploreGuest}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#161512] hover:bg-[#201F1A] text-[#ECE7DF] border border-[#2B2A24] text-xs font-medium transition"
            >
              Continue as Guest
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-8 border-t border-[#1F1E19] text-center text-xs text-[#736E65] space-y-2">
        <p>© 2026 MANAS AI. Engineered for mental-health reflection and emotional resilience.</p>
        <p className="text-[11px] text-[#545048] max-w-xl mx-auto">
          Disclaimer: MANAS is an AI therapeutic companion designed for psychological reflection and personal growth. It does not replace professional psychotherapy or medical diagnosis. In an acute emergency, please contact your local emergency services.
        </p>
      </footer>
    </div>
  );
};
