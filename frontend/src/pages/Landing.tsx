import { ArrowRight, Check, Leaf, LockKeyhole, Menu, MessageCircleHeart, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  BotanicalMark,
  BotanicalHeroIllustration,
  BotanicalMemoryIllustration,
} from "../components/BotanicalIllustrations";

/** MANAS-AI — Botanical / Organic Serif public introduction with smooth scroll animations. */

function Brand() {
  return (
    <span className="brand">
      <BotanicalMark size={36} />
      <b>MANAS</b>
    </span>
  );
}

const easeOrganic = [0.22, 1, 0.36, 1] as const;

export default function Landing() {
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (path: string) => {
    setLocation(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="marketing-page">
      {/* Navigation */}
      <motion.header
        className="marketing-nav"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOrganic }}
      >
        <button className="brand-button" onClick={() => navigate("/")}>
          <Brand />
        </button>
        <nav className="marketing-links">
          <button
            onClick={() => scrollToSection("how")}
            className="text-sm text-[#657065] hover:text-[#a65d4a] transition-colors"
          >
            How MANAS works
          </button>
          <button
            onClick={() => scrollToSection("memory")}
            className="text-sm text-[#657065] hover:text-[#a65d4a] transition-colors"
          >
            Your memory
          </button>
          <button
            onClick={() => scrollToSection("privacy")}
            className="text-sm text-[#657065] hover:text-[#a65d4a] transition-colors"
          >
            Privacy
          </button>
        </nav>
        <div className="marketing-actions">
          <button className="text-link" onClick={() => navigate("/login")}>
            Log in
          </button>
          <button
            className="forest-button nav-cta"
            onClick={() => navigate("/signup")}
          >
            Begin your space <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </div>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={22} strokeWidth={1.5} />
        </button>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="marketing-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="close-menu"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation"
            >
              <X size={24} />
            </button>
            <Brand />
            <nav className="flex flex-col gap-4 mt-6">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToSection("how");
                }}
                className="text-left py-2 text-lg text-[#2d3a31]"
              >
                How MANAS works
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToSection("memory");
                }}
                className="text-left py-2 text-lg text-[#2d3a31]"
              >
                Your memory
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToSection("privacy");
                }}
                className="text-left py-2 text-lg text-[#2d3a31]"
              >
                Privacy
              </button>
            </nav>
            <button className="forest-button mt-6 w-full" onClick={() => navigate("/signup")}>
              Begin your space <ArrowRight size={16} strokeWidth={1.5} />
            </button>
            <button className="text-link mt-3 w-full text-center" onClick={() => navigate("/login")}>
              Already have a space? Log in
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="marketing-hero">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOrganic }}
        >
          <p className="soft-label">
            <span />A private companion for the space inside
          </p>
          <h1>
            A mind that<br />
            <em>makes room.</em>
          </h1>
          <p className="hero-lede">
            MANAS is a reflective AI companion that holds context gently, helps you notice your patterns, and stays beside the pace you set.
          </p>
          <div className="hero-cta-row">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="forest-button"
              onClick={() => navigate("/signup")}
            >
              Create your private space <ArrowRight size={17} strokeWidth={1.5} />
            </motion.button>
            <button
              className="quiet-link"
              onClick={() => scrollToSection("how")}
            >
              See how it feels <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          </div>
          <p className="hero-disclaimer">Not a replacement for clinical or emergency care.</p>
        </motion.div>

        <motion.div
          className="hero-art"
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: easeOrganic }}
        >
          <div className="art-arch">
            <BotanicalHeroIllustration />
          </div>
          <motion.div
            className="art-note"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Sparkles size={16} strokeWidth={1.5} />
            <span>
              <b>A quieter kind of attention</b>
              Come as you are. Leave with a little more room.
            </span>
          </motion.div>
          <i className="art-orbit orbit-a" />
          <i className="art-orbit orbit-b" />
        </motion.div>
      </section>

      {/* Trust Ribbon */}
      <motion.section
        className="trust-ribbon"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
      >
        <span>
          <LockKeyhole size={17} strokeWidth={1.5} />
          YOUR PRIVATE SPACE
        </span>
        <span>YOU DECIDE WHAT IS REMEMBERED</span>
        <span>BUILT FOR REFLECTION, NOT RUSH</span>
      </motion.section>

      {/* Steps Section */}
      <section id="how" className="steps-section">
        <motion.div
          className="section-intro"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: easeOrganic }}
        >
          <p className="soft-label">
            <span />HOW MANAS STAYS WITH YOU
          </p>
          <h2>
            Not another voice<br />
            trying to <em>fix you.</em>
          </h2>
        </motion.div>

        <div className="steps-grid">
          {[
            {
              num: "01",
              icon: MessageCircleHeart,
              title: "Begin where you are.",
              desc: "Say it plainly. MANAS listens for what is underneath before it reaches for a next step.",
              delay: 0.1,
            },
            {
              num: "02",
              icon: Sparkles,
              title: "Notice what returns.",
              desc: "It may spot a thread, a feeling, or a preference. You always decide if it belongs in your context.",
              delay: 0.25,
            },
            {
              num: "03",
              icon: Leaf,
              title: "Move at your own pace.",
              desc: "Come back to a small practice, a grounding minute, or a conversation whenever it feels useful.",
              delay: 0.4,
            },
          ].map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.num}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: step.delay, ease: easeOrganic }}
                whileHover={{ y: idx === 1 ? 28 : -8, transition: { duration: 0.3 } }}
              >
                <span>{step.num}</span>
                <Icon size={25} strokeWidth={1.4} />
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Memory Promise Section */}
      <section id="memory" className="memory-promise">
        <motion.div
          className="memory-promise-art"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: easeOrganic }}
        >
          <BotanicalMemoryIllustration />
        </motion.div>

        <motion.div
          className="memory-promise-copy"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: easeOrganic }}
        >
          <p className="soft-label">
            <span />MEMORY WITH YOUR SAY
          </p>
          <h2>
            Nothing becomes<br />
            <em>yours to carry</em><br />
            without you.
          </h2>
          <p>
            MANAS proposes small memory notes instead of quietly gathering your words. Review them, edit them, keep them—or leave them behind.
          </p>
          <ul>
            {[
              "Only approved context stays with you.",
              "Edit or delete every note at any time.",
              "Your conversations are not sold.",
            ].map((text, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              >
                <Check size={16} strokeWidth={1.5} />
                {text}
              </motion.li>
            ))}
          </ul>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="sage-button"
            onClick={() => navigate("/signup")}
          >
            Build your space <ArrowRight size={16} strokeWidth={1.5} />
          </motion.button>
        </motion.div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="privacy-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: easeOrganic }}
        >
          <p className="soft-label">
            <span />PRIVACY BY DESIGN
          </p>
          <h2>
            Your inner world<br />
            is not a <em>product.</em>
          </h2>
          <p>
            Set down a thought without worrying about who will see it later. Use Quick Exit when you need the screen to look like something else—instantly.
          </p>
          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="forest-button"
              onClick={() => navigate("/signup")}
            >
              Start privately <ArrowRight size={16} strokeWidth={1.5} />
            </motion.button>
            <button className="text-link" onClick={() => navigate("/login")}>
              Log in to your space
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="marketing-footer">
        <Brand />
        <span>© 2026 MANAS</span>
        <span>FOR SLOWER, MORE HONEST CONVERSATIONS.</span>
      </footer>
    </main>
  );
}
