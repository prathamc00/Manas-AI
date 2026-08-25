import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight, Play, Menu, X, Sparkles } from 'lucide-react';
import { Button } from './button';

interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

interface Partner {
  name: string;
  logoUrl?: string;
  href?: string;
}

interface ResponsiveHeroBannerProps {
  logoText?: string;
  backgroundImageUrl?: string;
  navLinks?: NavLink[];
  ctaButtonText?: string;
  ctaButtonHref?: string;
  badgeText?: string;
  badgeLabel?: string;
  title?: string;
  titleLine2?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  partnersTitle?: string;
  partners?: Partner[];
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
  logoText = 'MANAS',
  backgroundImageUrl = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=3840&q=85&fit=crop',
  navLinks = [
    { label: 'Overview', href: '#', isActive: true },
    { label: 'Clinical Model', href: '#features' },
    { label: 'How It Works', href: '#how' },
    { label: 'Privacy & Safety', href: '#privacy' },
  ],
  ctaButtonText = 'Get Started',
  badgeLabel = 'Therapeutic AI',
  badgeText = 'Evidence-based CBT & ACT with Memory Vault',
  title = 'Your Mind Deserves',
  titleLine2 = 'A Safe Sanctuary',
  description =
    'MANAS is a compassionate AI companion engineered with clinical psychological reasoning. Reflect freely, examine thought distortions with kindness, and build emotional resilience in complete privacy.',
  primaryButtonText = 'Create Free Account',
  secondaryButtonText = 'Sign In',
  partnersTitle = 'Built on robust AI & security architecture',
  partners = [
    { name: 'Groq LLM' },
    { name: 'Supabase PostgreSQL' },
    { name: 'FastAPI Backend' },
    { name: 'Vercel Edge' },
    { name: 'End-to-End Encrypted' },
  ],
  onGetStarted,
  onSignIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="w-full relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#12110E] text-[#ECE7DF] pb-12">
      {/* Background image & gradient overlays */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={backgroundImageUrl}
          alt=""
          className="w-full h-full object-cover object-center opacity-40 filter brightness-90 contrast-110 scale-105"
        />
        {/* Multi-tier gradient overlay for readability and smooth blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#12110E]/90 via-[#12110E]/75 to-[#12110E]" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#12110E]/40 to-[#12110E]/90" />
      </div>

      {/* Top Header / Navigation */}
      <header className="w-full z-20 pt-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer select-none">
            <div className="w-9 h-9 rounded-xl bg-[#D97757] text-[#181714] font-bold text-lg flex items-center justify-center shadow-lg shadow-[#D97757]/20 border border-[#D97757]/40">
              <span className="font-serif italic font-bold">M</span>
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-[#ECE7DF] tracking-tight">
                {logoText}
              </span>
              <span className="hidden sm:inline-block text-[10px] text-[#A39D93] ml-2 font-mono uppercase tracking-wider">
                AI Sanctuary
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 ring-1 ring-white/10 backdrop-blur-md">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    link.isActive
                      ? 'text-white bg-white/10 shadow-sm'
                      : 'text-[#A39D93] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSignIn}
                className="text-xs text-[#ECE7DF]"
              >
                Sign In
              </Button>
              <Button
                variant="terracotta"
                size="sm"
                onClick={onGetStarted}
                rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                className="rounded-full px-4"
              >
                {ctaButtonText}
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="terracotta"
              size="sm"
              onClick={onGetStarted}
              className="text-xs rounded-full"
            >
              Start
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 ring-1 ring-white/10 text-[#ECE7DF] hover:bg-white/10 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 max-w-6xl mx-auto rounded-2xl bg-[#181714]/95 border border-[#2B2A24] p-4 space-y-3 backdrop-blur-xl shadow-2xl animate-fade-slide-in-1">
            <div className="space-y-1">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-medium text-[#A39D93] hover:text-white hover:bg-[#22211C] rounded-lg transition"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="pt-2 border-t border-[#262520] flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignIn?.();
                }}
                className="w-full justify-center"
              >
                Sign In
              </Button>
              <Button
                variant="terracotta"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted?.();
                }}
                className="w-full justify-center"
              >
                {primaryButtonText}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Hero Content */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 md:pt-16 pb-8 text-center space-y-6 sm:space-y-8 z-10">
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs animate-fade-slide-in-1 shadow-inner">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#181714] bg-[#D97757] px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-[#181714]" />
            {badgeLabel}
          </span>
          <span className="text-[#ECE7DF] font-medium text-[11px] sm:text-xs">
            {badgeText}
          </span>
        </div>

        {/* Title */}
        <div className="space-y-2 animate-fade-slide-in-2">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.12]">
            {title}
            <br />
            <span className="italic font-normal text-[#D97757]">{titleLine2}</span>
          </h1>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm md:text-base text-[#A39D93] max-w-2xl mx-auto leading-relaxed animate-fade-slide-in-3 font-sans">
          {description}
        </p>

        {/* Action Buttons using standardized Button component */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 animate-fade-slide-in-4">
          <Button
            variant="terracotta"
            size="lg"
            onClick={onGetStarted}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto rounded-full px-7 shadow-xl shadow-[#D97757]/20"
          >
            {primaryButtonText}
          </Button>

          <Button
            variant="glass"
            size="lg"
            onClick={onSignIn}
            className="w-full sm:w-auto rounded-full px-6"
          >
            {secondaryButtonText}
          </Button>
        </div>

        {/* Partners & Infrastructure Badges */}
        <div className="pt-8 sm:pt-10 max-w-3xl mx-auto space-y-3 animate-fade-slide-in-4">
          <p className="text-[11px] uppercase tracking-widest text-[#736E65] font-semibold">
            {partnersTitle}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
            {partners.map((partner, index) => (
              <span
                key={index}
                className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-[#A39D93] hover:text-[#ECE7DF] hover:border-white/20 transition backdrop-blur-sm cursor-default"
              >
                {partner.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom subtle gradient divider */}
      <div className="w-full h-8 bg-gradient-to-t from-[#161512] to-transparent pointer-events-none" />
    </section>
  );
};

export default ResponsiveHeroBanner;
