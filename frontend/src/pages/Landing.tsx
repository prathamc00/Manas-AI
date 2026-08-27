import { ArrowRight, Check, Leaf, LockKeyhole, Menu, MessageCircleHeart, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  BotanicalMark,
  BotanicalHeroIllustration,
  BotanicalMemoryIllustration,
} from "../components/BotanicalIllustrations";

/** MANAS-AI — Botanical / Organic Serif public introduction. */

function Brand() {
  return (
    <span className="brand">
      <BotanicalMark size={36} />
      <b>MANAS</b>
    </span>
  );
}

export default function Landing() {
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = (path: string) => {
    setLocation(path);
    window.scrollTo(0, 0);
  };

  return (
    <main className="marketing-page">
      <header className="marketing-nav">
        <button className="brand-button" onClick={() => navigate("/")}>
          <Brand />
        </button>
        <nav className="marketing-links">
          <a href="#how">How MANAS works</a>
          <a href="#memory">Your memory</a>
          <a href="#privacy">Privacy</a>
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
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="marketing-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="close-menu"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation"
            >
              <X size={24} />
            </button>
            <Brand />
            <nav>
              <a href="#how" onClick={() => setMenuOpen(false)}>
                How MANAS works
              </a>
              <a href="#memory" onClick={() => setMenuOpen(false)}>
                Your memory
              </a>
              <a href="#privacy" onClick={() => setMenuOpen(false)}>
                Privacy
              </a>
            </nav>
            <button className="forest-button" onClick={() => navigate("/signup")}>
              Begin your space <ArrowRight size={16} strokeWidth={1.5} />
            </button>
            <button className="text-link" onClick={() => navigate("/login")}>
              Already have a space? Log in
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="marketing-hero">
        <div className="hero-copy">
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
            <button className="forest-button" onClick={() => navigate("/signup")}>
              Create your private space <ArrowRight size={17} strokeWidth={1.5} />
            </button>
            <button
              className="quiet-link"
              onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
            >
              See how it feels <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          </div>
          <p className="hero-disclaimer">Not a replacement for clinical or emergency care.</p>
        </div>

        <motion.div
          className="hero-art"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="art-arch">
            <BotanicalHeroIllustration />
          </div>
          <div className="art-note">
            <Sparkles size={16} strokeWidth={1.5} />
            <span>
              <b>A quieter kind of attention</b>
              Come as you are. Leave with a little more room.
            </span>
          </div>
          <i className="art-orbit orbit-a" />
          <i className="art-orbit orbit-b" />
        </motion.div>
      </section>

      <section className="trust-ribbon">
        <span>
          <LockKeyhole size={17} strokeWidth={1.5} />
          YOUR PRIVATE SPACE
        </span>
        <span>YOU DECIDE WHAT IS REMEMBERED</span>
        <span>BUILT FOR REFLECTION, NOT RUSH</span>
      </section>

      <section id="how" className="steps-section">
        <div className="section-intro">
          <p className="soft-label">
            <span />HOW MANAS STAYS WITH YOU
          </p>
          <h2>
            Not another voice<br />
            trying to <em>fix you.</em>
          </h2>
        </div>
        <div className="steps-grid">
          <article>
            <span>01</span>
            <MessageCircleHeart size={25} strokeWidth={1.4} />
            <h3>Begin where you are.</h3>
            <p>Say it plainly. MANAS listens for what is underneath before it reaches for a next step.</p>
          </article>
          <article>
            <span>02</span>
            <Sparkles size={25} strokeWidth={1.4} />
            <h3>Notice what returns.</h3>
            <p>It may spot a thread, a feeling, or a preference. You always decide if it belongs in your context.</p>
          </article>
          <article>
            <span>03</span>
            <Leaf size={25} strokeWidth={1.4} />
            <h3>Move at your own pace.</h3>
            <p>Come back to a small practice, a grounding minute, or a conversation whenever it feels useful.</p>
          </article>
        </div>
      </section>

      <section id="memory" className="memory-promise">
        <div className="memory-promise-art">
          <BotanicalMemoryIllustration />
        </div>
        <div className="memory-promise-copy">
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
            <li>
              <Check size={16} strokeWidth={1.5} />
              Only approved context stays with you.
            </li>
            <li>
              <Check size={16} strokeWidth={1.5} />
              Edit or delete every note at any time.
            </li>
            <li>
              <Check size={16} strokeWidth={1.5} />
              Your conversations are not sold.
            </li>
          </ul>
          <button className="sage-button" onClick={() => navigate("/signup")}>
            Build your space <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </section>

      <section id="privacy" className="privacy-section">
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
          <button className="forest-button" onClick={() => navigate("/signup")}>
            Start privately <ArrowRight size={16} strokeWidth={1.5} />
          </button>
          <button className="text-link" onClick={() => navigate("/login")}>
            Log in to your space
          </button>
        </div>
      </section>

      <footer className="marketing-footer">
        <Brand />
        <span>© 2026 MANAS</span>
        <span>FOR SLOWER, MORE HONEST CONVERSATIONS.</span>
      </footer>
    </main>
  );
}
