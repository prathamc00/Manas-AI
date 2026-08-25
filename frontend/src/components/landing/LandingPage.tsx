import React from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  Heart, 
  Target, 
  Wind, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare
} from 'lucide-react';
import ResponsiveHeroBanner from '../ui/responsive-hero-banner';
import { Button } from '../ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onExploreGuest: () => void;
}

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
      {/* ── Hero Banner with nav ── */}
      <ResponsiveHeroBanner
        backgroundImageUrl="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=3840&q=85&fit=crop"
        navLinks={[
          { label: 'Home', href: '#', isActive: true },
          { label: 'Features', href: '#features' },
          { label: 'How It Works', href: '#how' },
          { label: 'Privacy', href: '#privacy' },
        ]}
        ctaButtonText="Get Started"
        badgeLabel="Beta"
        badgeText="Therapeutic AI with Persistent Memory Vault"
        title="Your Mind Deserves"
        titleLine2="A Safe Sanctuary"
        description="MANAS is a compassionate AI companion powered by evidence-based CBT & ACT therapies. Reflect freely, track your emotional patterns, and build lasting resilience — all in complete privacy."
        primaryButtonText="Create Free Account"
        secondaryButtonText="Explore as Guest"
        partnersTitle="Built on industry-leading AI & security infrastructure"
        partners={[
          { name: 'Groq LLM', logoUrl: '', href: '#' },
          { name: 'Supabase', logoUrl: '', href: '#' },
          { name: 'PostgreSQL', logoUrl: '', href: '#' },
          { name: 'FastAPI', logoUrl: '', href: '#' },
          { name: 'Vercel', logoUrl: '', href: '#' },
        ]}
        onGetStarted={onGetStarted}
        onSignIn={onSignIn}
      />

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
            <Button
              variant="terracotta"
              size="lg"
              onClick={onGetStarted}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto rounded-full px-8 uppercase tracking-wider text-xs"
            >
              Create Account
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onExploreGuest}
              className="w-full sm:w-auto rounded-full px-7 text-xs"
            >
              Continue as Guest
            </Button>
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
