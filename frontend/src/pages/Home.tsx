import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Brain,
  Check,
  ChevronRight,
  CircleHelp,
  Compass,
  HeartHandshake,
  History,
  Leaf,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircleHeart,
  MoreHorizontal,
  PenLine,
  Plus,
  Send,
  Settings2,
  ShieldAlert,
  Sparkles,
  TimerReset,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { api } from "../lib/api";
import type { Goal, Memory, Message, MoodEntry, Session, User } from "../types";
import {
  BotanicalMark,
  BotanicalHeroIllustration,
  BotanicalMemoryIllustration,
  BotanicalGroundingIllustration,
} from "../components/BotanicalIllustrations";

/** MANAS-AI — Botanical / Organic Serif private companion workspace connected to live FastAPI backend. */

type View = "today" | "talk" | "memory" | "practice" | "ground";
type Mood = "low" | "steady" | "lighter" | "energized";

const navItems: { id: View; label: string; icon: typeof Compass }[] = [
  { id: "today", label: "Today", icon: Compass },
  { id: "talk", label: "Talk with MANAS", icon: MessageCircleHeart },
  { id: "memory", label: "Memory garden", icon: Brain },
  { id: "practice", label: "Growth notes", icon: Leaf },
  { id: "ground", label: "Grounding tools", icon: HeartHandshake },
];

const moods: { id: Mood; num: number; icon: string; label: string; detail: string }[] = [
  { id: "low", num: 1, icon: "◔", label: "Low", detail: "a softer day" },
  { id: "steady", num: 2, icon: "◑", label: "Steady", detail: "holding level" },
  { id: "lighter", num: 3, icon: "◕", label: "Lighter", detail: "more room" },
  { id: "energized", num: 4, icon: "☼", label: "Energized", detail: "energy available" },
];

const approaches = [
  { id: "active_listening", name: "Active Listening", desc: "Reflects feelings and holds space without rushing to fix." },
  { id: "cbt", name: "Socratic CBT", desc: "Examines automatic thoughts and reframes cognitive loops." },
  { id: "act", name: "Acceptance & Commitment", desc: "Fosters psychological flexibility and values-aligned action." },
  { id: "grounding", name: "Somatic Grounding", desc: "Calms acute agitation with body and breath focus." },
  { id: "advice", name: "Practical Guidance", desc: "Offers structured steps when you explicitly ask for advice." },
];

function Mark({ small = false }: { small?: boolean }) {
  return <BotanicalMark size={small ? 28 : 36} className="shrink-0" />;
}

function PillButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`pill-button ${className}`}
    >
      {children}
    </button>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="app-eyebrow">
      <span />
      {children}
    </p>
  );
}

function PageHeading({
  eyebrow,
  title,
  intro,
  action,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="page-heading">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
      {action}
    </header>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();

  // Core Data States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Navigation & UI States
  const [view, setView] = useState<View>("today");
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [approachMenuOpen, setApproachMenuOpen] = useState(false);
  const [selectedApproach, setSelectedApproach] = useState("active_listening");
  const [addMemoryOpen, setAddMemoryOpen] = useState(false);
  const [addGoalOpen, setAddGoalOpen] = useState(false);

  // Form & Interaction States
  const [mood, setMood] = useState<Mood | null>(null);
  const [note, setNote] = useState("");
  const [checkedIn, setCheckedIn] = useState(false);
  const [composer, setComposer] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [newMemoryText, setNewMemoryText] = useState("");
  const [newMemoryCategory, setNewMemoryCategory] = useState("preference");
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalStrategy, setNewGoalStrategy] = useState("");

  // Safety & Tools States
  const [crisisOpen, setCrisisOpen] = useState(false);
  const [disguise, setDisguise] = useState(false);
  const [breathing, setBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [sensoryIndex, setSensoryIndex] = useState(0);

  const threadEndRef = useRef<HTMLDivElement>(null);

  // Initial Data Fetching
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const user = await api.getCurrentUser();
      setCurrentUser(user);

      const [sessList, memList, moodList, goalList] = await Promise.all([
        api.getSessions().catch(() => []),
        api.getMemories().catch(() => []),
        api.getMoodHistory().catch(() => []),
        api.getGoals().catch(() => []),
      ]);

      setSessions(sessList);
      setMemories(memList);
      setMoodHistory(moodList);
      setGoals(goalList);

      if (sessList.length > 0) {
        setActiveSessionId(sessList[0].id);
        const fullSession = await api.getSession(sessList[0].id);
        setMessages(fullSession.messages || []);
      }
    } catch {
      // If auth fails, redirect to landing or login
      setLocation("/login");
    }
  };

  // Keyboard Shortcuts (Escape -> Disguise)
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCrisisOpen(false);
        setDisguise((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  // Breathing Interval
  useEffect(() => {
    if (!breathing) return;
    const interval = window.setInterval(
      () => setBreathPhase((current) => (current + 1) % 4),
      4000
    );
    return () => window.clearInterval(interval);
  }, [breathing]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (view === "talk") {
      threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, view]);

  const go = (next: View) => {
    setView(next);
    setMenuOpen(false);
    setHistoryOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Session Management
  const handleNewSession = async () => {
    try {
      const newSess = await api.createSession();
      setSessions((prev) => [newSess, ...prev]);
      setActiveSessionId(newSess.id);
      setMessages([]);
      go("talk");
      toast.success("Started a new conversation.");
    } catch (err: any) {
      toast.error(err.message || "Could not create session");
    }
  };

  const handleSelectSession = async (sessId: string) => {
    try {
      setActiveSessionId(sessId);
      const full = await api.getSession(sessId);
      setMessages(full.messages || []);
      go("talk");
    } catch (err: any) {
      toast.error("Could not load session history");
    }
  };

  const handleDeleteSession = async (sessId: string) => {
    try {
      await api.deleteSession(sessId);
      const remaining = sessions.filter((s) => s.id !== sessId);
      setSessions(remaining);
      if (activeSessionId === sessId) {
        if (remaining.length > 0) {
          handleSelectSession(remaining[0].id);
        } else {
          setActiveSessionId(null);
          setMessages([]);
        }
      }
      toast.success("Conversation deleted.");
    } catch (err: any) {
      toast.error("Failed to delete session");
    }
  };

  // Mood Check-in
  const holdCheckin = async () => {
    if (!mood) {
      toast("Choose the feeling that is closest to today.");
      return;
    }
    const moodObj = moods.find((m) => m.id === mood);
    const score = moodObj ? moodObj.num : 2;

    try {
      const newEntry = await api.logMood({
        mood: score,
        stress: 5,
        energy: 5,
        notes: note.trim() || undefined,
      });
      setMoodHistory((prev) => [newEntry, ...prev]);
      setCheckedIn(true);
      toast.success("Your check-in is held for today.");
    } catch (err: any) {
      toast.error("Failed to save check-in");
    }
  };

  // Chat Message Submission
  const send = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = composer.trim();
    if (!value || isSending) return;

    // Pre-flight crisis keyword alert check
    if (/kill myself|suicide|self harm|hurt myself|end my life/i.test(value)) {
      setCrisisOpen(true);
    }

    const optimisticMsg: Message = {
      id: "temp-" + Date.now(),
      session_id: activeSessionId || "",
      role: "user",
      content: value,
      reflections: {},
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setComposer("");
    setIsSending(true);

    try {
      const response = await api.sendMessage({
        message: value,
        session_id: activeSessionId || undefined,
        mode: selectedApproach,
      });

      if (!activeSessionId) {
        setActiveSessionId(response.session_id);
      }

      if (response.is_crisis) {
        setCrisisOpen(true);
      }

      // Reload full session messages to get true IDs & timestamps
      const full = await api.getSession(response.session_id);
      setMessages(full.messages || []);

      // Refresh memory vault in background
      const updatedMemories = await api.getMemories().catch(() => []);
      setMemories(updatedMemories);

      // Refresh sessions list
      const updatedSessions = await api.getSessions().catch(() => []);
      setSessions(updatedSessions);
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  // Memory Actions
  const handleConfirmMemory = async (memId: string) => {
    try {
      const updated = await api.confirmMemory(memId);
      setMemories((prev) => prev.map((m) => (m.id === memId ? updated : m)));
      toast.success("Memory confirmed into your garden.");
    } catch (err: any) {
      toast.error("Could not confirm memory");
    }
  };

  const handleDeleteMemory = async (memId: string) => {
    try {
      await api.deleteMemory(memId);
      setMemories((prev) => prev.filter((m) => m.id !== memId));
      toast.success("Memory removed.");
    } catch (err: any) {
      toast.error("Failed to remove memory");
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;
    try {
      const created = await api.createMemory({
        category: newMemoryCategory,
        content: newMemoryText.trim(),
      });
      setMemories((prev) => [created, ...prev]);
      setNewMemoryText("");
      setAddMemoryOpen(false);
      toast.success("Added note to memory garden.");
    } catch (err: any) {
      toast.error("Could not save memory");
    }
  };

  // Goal Actions
  const handleToggleGoal = async (goal: Goal) => {
    const nextStatus = goal.status === "achieved" ? "in_progress" : "achieved";
    try {
      const updated = await api.updateGoal(goal.id, { status: nextStatus });
      setGoals((prev) => prev.map((g) => (g.id === goal.id ? updated : g)));
      toast.success(nextStatus === "achieved" ? "Marked as completed!" : "Goal returned to in-progress.");
    } catch (err: any) {
      toast.error("Failed to update goal");
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    try {
      const created = await api.createGoal({
        title: newGoalTitle.trim(),
        description: "Personal growth practice",
        strategies: newGoalStrategy.trim() ? [newGoalStrategy.trim()] : [],
      });
      setGoals((prev) => [created, ...prev]);
      setNewGoalTitle("");
      setNewGoalStrategy("");
      setAddGoalOpen(false);
      toast.success("New growth note created.");
    } catch (err: any) {
      toast.error("Could not save goal");
    }
  };

  const handleLogout = () => {
    api.logout();
    toast.success("Logged out safely.");
    setLocation("/login");
  };

  // Inferred vs Confirmed Memories
  const inferredMemories = useMemo(() => memories.filter((m) => !m.user_confirmed), [memories]);
  const confirmedMemories = useMemo(() => memories.filter((m) => m.user_confirmed), [memories]);

  // Latest reflection from last assistant message
  const lastAssistantMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return messages[i];
    }
    return null;
  }, [messages]);

  const reflectionSummary = lastAssistantMessage?.reflections?.summary;

  // Render Pulse Heights from 7 day mood history
  const pulseBars = useMemo(() => {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    if (moodHistory.length === 0) {
      return [39, 63, 47, 80, 56, 72, 61].map((h, i) => ({ height: h, label: days[i] }));
    }
    const recent = moodHistory.slice(0, 7).reverse();
    return days.map((dayLabel, index) => {
      const entry = recent[index];
      const h = entry ? Math.min(100, Math.max(25, entry.mood * 25)) : 35;
      return { height: h, label: dayLabel };
    });
  }, [moodHistory]);

  /* ========================================================================== */
  /* TAB: TODAY (HOME DASHBOARD)                                               */
  /* ========================================================================== */
  const today = (
    <motion.div
      className="app-content"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <PageHeading
          eyebrow={new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}
          title={
            <>
              Welcome back,<br />
              <em>{currentUser?.name || "Friend"}.</em>
            </>
          }
          intro="There’s no need to arrive polished. What feels most present right now?"
          action={
            <span className="today-detail">
              A softer place to land<br />
              <b>{sessions.length} recorded dialogue{sessions.length === 1 ? "" : "s"}</b>
            </span>
          }
        />
      </motion.div>

      <motion.section
        className="app-hero"
        initial={{ opacity: 0, scale: 0.97, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="app-hero-copy">
          <Eyebrow>YOUR SPACE, AT YOUR PACE</Eyebrow>
          <h2>
            Let’s make room<br />
            for <em>what’s here.</em>
          </h2>
          <p>
            {reflectionSummary
              ? `Your last reflection: "${reflectionSummary}". We can pick that thread up—or start somewhere new.`
              : "MANAS is here to listen, reflect, and hold your context without judgment."}
          </p>
          <div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <PillButton className="forest-fill" onClick={() => go("talk")}>
                Continue our conversation <ArrowRight size={17} strokeWidth={1.5} />
              </PillButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <PillButton className="sage-outline" onClick={() => go("ground")}>
                <TimerReset size={16} strokeWidth={1.5} /> Ground for a minute
              </PillButton>
            </motion.div>
          </div>
        </div>
        <div className="app-hero-art">
          <BotanicalHeroIllustration />
          <motion.div
            className="hero-art-caption"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Sparkles size={15} strokeWidth={1.5} />
            <span>
              <b>A gentle return</b>
              One small moment is enough.
            </span>
          </motion.div>
        </div>
      </motion.section>

      <section className="today-grid">
        <motion.article
          className="checkin-panel"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="checkin-head">
            <div>
              <Eyebrow>DAILY CHECK-IN</Eyebrow>
              <h2>
                How are you<br />
                arriving today?
              </h2>
            </div>
            <span className="date-marker">
              <b>{new Date().getDate()}</b>
              {new Date().toLocaleString("default", { month: "short" }).toUpperCase()}
            </span>
          </div>
          <div className="mood-grid" role="radiogroup" aria-label="Select your mood">
            {moods.map((item, idx) => (
              <motion.button
                type="button"
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.25 + idx * 0.06 }}
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={mood === item.id ? "active" : ""}
                onClick={() => {
                  setMood(item.id);
                  setCheckedIn(false);
                }}
                aria-pressed={mood === item.id}
              >
                <span>{item.icon}</span>
                <b>{item.label}</b>
                <small>{item.detail}</small>
                {mood === item.id && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Check size={14} strokeWidth={1.5} />
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>
          <label className="note-input">
            <PenLine size={16} strokeWidth={1.5} />
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="A note for yourself, if you want…"
            />
          </label>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <PillButton className="forest-fill full" onClick={holdCheckin}>
              {checkedIn ? (
                <>
                  <Check size={16} /> Held for today
                </>
              ) : (
                <>
                  Hold this check-in <ArrowRight size={16} strokeWidth={1.5} />
                </>
              )}
            </PillButton>
          </motion.div>
        </motion.article>

        <motion.article
          className="pulse-panel"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pulse-head">
            <div>
              <Eyebrow>THE LAST SEVEN DAYS</Eyebrow>
              <h2>
                Your week, in <em>pulse.</em>
              </h2>
            </div>
            <button
              onClick={() => toast.info(`Logged ${moodHistory.length} check-in entries in your personal history.`)}
              aria-label="View mood history"
            >
              <MoreHorizontal size={20} strokeWidth={1.5} />
            </button>
          </div>
          <p>
            Your current emotional baseline is <b>{moodHistory[0]?.mood ? moods.find(m => m.num === moodHistory[0].mood)?.label.toLowerCase() : "steadier"}</b>.
          </p>
          <div className="pulse-chart">
            {pulseBars.map((bar, index) => (
              <span key={index} className={index === pulseBars.length - 1 ? "today-bar" : ""}>
                <motion.i
                  initial={{ height: "0%" }}
                  animate={{ height: `${bar.height}%` }}
                  transition={{ duration: 0.75, delay: 0.3 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "block" }}
                />
                <small>{bar.label}</small>
              </span>
            ))}
          </div>
          <div className="pulse-footer">
            <span>
              <i /> Mood and energy are yours to notice.
            </span>
            <button onClick={() => go("practice")}>
              See your patterns <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </motion.article>
      </section>

      <section className="path-section">
        <motion.div
          className="path-intro"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <Eyebrow>A SMALL WAY FORWARD</Eyebrow>
          <h2>
            Choose a <em>door,</em><br />
            not a destination.
          </h2>
        </motion.div>
        <div className="path-cards">
          {[
            {
              id: "talk",
              icon: MessageCircleHeart,
              label: "CONVERSATION",
              title: "Say what’s on your mind",
              delay: 0.1,
            },
            {
              id: "memory",
              icon: Brain,
              label: "MEMORY GARDEN",
              title: "Review what MANAS holds",
              delay: 0.2,
            },
            {
              id: "practice",
              icon: Leaf,
              label: "GROWTH NOTE",
              title: "Practice one boundary",
              delay: 0.3,
            },
          ].map((door, idx) => {
            const Icon = door.icon;
            return (
              <motion.button
                key={door.id}
                onClick={() => go(door.id as View)}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: door.delay, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{
                  y: idx === 1 ? 14 : -7,
                  boxShadow: "0 22px 38px -20px rgba(45,58,49,.28)",
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={23} strokeWidth={1.5} />
                <span>
                  <small>{door.label}</small>
                  <b>{door.title}</b>
                </span>
                <ArrowRight size={18} strokeWidth={1.5} />
              </motion.button>
            );
          })}
        </div>
      </section>

      <motion.section
        className="grounding-call"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <Eyebrow>SOMATIC TOOLKIT</Eyebrow>
          <h2>
            Before we solve anything,<br />
            <em>let’s arrive.</em>
          </h2>
          <p>One gentle minute can change the temperature of a moment.</p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <PillButton className="forest-fill" onClick={() => go("ground")}>
              Try box breathing <ArrowRight size={16} strokeWidth={1.5} />
            </PillButton>
          </motion.div>
        </div>
        <div className="grounding-art">
          <BotanicalGroundingIllustration />
          <i />
          <i />
        </div>
      </motion.section>
    </motion.div>
  );

  /* ========================================================================== */
  /* TAB: TALK (CHAT)                                                          */
  /* ========================================================================== */
  const talk = (
    <motion.div
      className="app-content"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <PageHeading
        eyebrow="PRIVATE CONVERSATION"
        title={
          <>
            A space to say<br />
            it <em>plainly.</em>
          </>
        }
        intro="MANAS will listen before it offers a next step. You can pause or change direction at any time."
        action={
          <button
            className="session-chip"
            onClick={() => setHistoryOpen(true)}
          >
            <History size={16} strokeWidth={1.5} />
            {sessions.find((s) => s.id === activeSessionId)?.title || "Recent chats"} ({sessions.length})
            <ChevronRight size={15} strokeWidth={1.5} />
          </button>
        }
      />

      <section className="conversation-layout">
        <article className="conversation-panel">
          <div className="conversation-meta">
            <span>
              <i />
              MANAS is present · {approaches.find((a) => a.id === selectedApproach)?.name}
            </span>
            <span className="flex items-center gap-2">
              <button
                onClick={handleNewSession}
                className="text-xs text-forest hover:text-terracotta flex items-center gap-1 font-semibold"
              >
                <Plus size={14} /> New chat
              </button>
            </span>
          </div>

          <div className="conversation-thread">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Mark small />
                <p className="mt-3 text-sm">
                  I’m here. We can take this one piece at a time—there’s no need to have the right words yet.
                </p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isUser = message.role === "user";
                return (
                  <motion.div
                    className={isUser ? "chat-row yours" : "chat-row"}
                    key={message.id || `${message.created_at}-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <span className="chat-avatar">
                      {isUser ? (currentUser?.name?.charAt(0) || "U") : <Mark small />}
                    </span>
                    <div>
                      <p>{message.content}</p>
                      <small>
                        {message.created_at
                          ? new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "Now"}
                      </small>
                    </div>
                  </motion.div>
                );
              })
            )}

            {isSending && (
              <motion.div className="chat-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span className="chat-avatar"><Mark small /></span>
                <div>
                  <p className="italic text-xs text-muted-foreground">Holding space and reflecting...</p>
                </div>
              </motion.div>
            )}

            {reflectionSummary && (
              <div className="reflection-note">
                <Sparkles size={16} strokeWidth={1.5} />
                <span>
                  <b>What I’m hearing</b>
                  {reflectionSummary}
                </span>
              </div>
            )}

            <div ref={threadEndRef} />
          </div>

          <form className="conversation-composer" onSubmit={send}>
            <textarea
              value={composer}
              onChange={(event) => setComposer(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(e as any);
                }
              }}
              placeholder="Say it how it is… (Press Enter to send)"
              aria-label="Message MANAS"
            />
            <div>
              <small>MANAS IS AN AI COMPANION, NOT A CRISIS SERVICE.</small>
              <PillButton
                className="terracotta-fill"
                type="submit"
                disabled={isSending || !composer.trim()}
                aria-label="Send message"
              >
                <Send size={18} strokeWidth={1.5} />
              </PillButton>
            </div>
          </form>
        </article>

        <aside className="conversation-aside">
          <div>
            <Eyebrow>HOW WE’RE TALKING</Eyebrow>
            <h3>
              {approaches.find((a) => a.id === selectedApproach)?.name.split(" ")[0]}<br />
              <em>{approaches.find((a) => a.id === selectedApproach)?.name.split(" ")[1] || "dialogue."}</em>
            </h3>
            <p>{approaches.find((a) => a.id === selectedApproach)?.desc}</p>
            <button
              className="subtle-action"
              onClick={() => setApproachMenuOpen((prev) => !prev)}
            >
              Change approach <ChevronRight size={15} strokeWidth={1.5} />
            </button>

            {approachMenuOpen && (
              <div className="mt-3 p-2 bg-white rounded-xl border border-border space-y-1">
                {approaches.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      setSelectedApproach(app.id);
                      setApproachMenuOpen(false);
                      toast.info(`Switched dialogue style to ${app.name}.`);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs flex justify-between items-center ${
                      selectedApproach === app.id ? "bg-[#ebf0e8] font-bold text-forest" : "hover:bg-muted text-gray-700"
                    }`}
                  >
                    <span>{app.name}</span>
                    {selectedApproach === app.id && <Check size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="aside-ground">
            <TimerReset size={22} strokeWidth={1.5} />
            <h3>Need a reset?</h3>
            <p>A 60-second sensory pause is here when the conversation gets loud.</p>
            <PillButton className="sage-outline full" onClick={() => go("ground")}>
              Start a grounding minute
            </PillButton>
          </div>

          <button className="crisis-link" onClick={() => setCrisisOpen(true)}>
            <ShieldAlert size={17} strokeWidth={1.5} /> Need immediate support?
          </button>
        </aside>
      </section>
    </motion.div>
  );

  /* ========================================================================== */
  /* TAB: MEMORY GARDEN                                                        */
  /* ========================================================================== */
  const memory = (
    <motion.div
      className="app-content"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <PageHeading
        eyebrow="USER-CONFIRMED CONTEXT"
        title={
          <>
            Your memory<br />
            <em>garden.</em>
          </>
        }
        intro="MANAS may notice patterns, but only you decide what stays with you over time."
        action={
          <PillButton className="sage-outline" onClick={() => setAddMemoryOpen(true)}>
            <Plus size={16} strokeWidth={1.5} /> Add a memory
          </PillButton>
        }
      />

      <section className="memory-hero">
        <div className="memory-hero-art">
          <BotanicalMemoryIllustration />
        </div>
        <div>
          <Eyebrow>THE AGREEMENT</Eyebrow>
          <h2>
            Memory should feel like<br />
            <em>a choice, not a guess.</em>
          </h2>
          <p>
            These are not raw chat logs. They’re small, user-reviewed notes that help MANAS meet you with more continuity next time.
          </p>
          <div className="memory-metrics">
            <span>
              <b>{confirmedMemories.length}</b>confirmed notes
            </span>
            <span>
              <b>{inferredMemories.length}</b>waiting for your say
            </span>
            <span>
              <b>00</b>shared externally
            </span>
          </div>
        </div>
      </section>

      {/* Add Memory Modal/Inline */}
      {addMemoryOpen && (
        <form onSubmit={handleAddMemory} className="my-6 p-6 bg-white border border-border rounded-2xl space-y-4">
          <Eyebrow>ADD A CONTEXT NOTE</Eyebrow>
          <input
            value={newMemoryText}
            onChange={(e) => setNewMemoryText(e.target.value)}
            placeholder="e.g. I prefer quiet mornings without early notifications..."
            className="w-full p-3 border border-border rounded-xl text-sm outline-none focus:border-sage"
          />
          <div className="flex gap-4 items-center justify-between">
            <select
              value={newMemoryCategory}
              onChange={(e) => setNewMemoryCategory(e.target.value)}
              className="p-2 border border-border rounded-lg text-xs"
            >
              <option value="preference">Preference</option>
              <option value="explicit">Fact / Context</option>
              <option value="goal">Goal / Intention</option>
              <option value="episodic">Experience</option>
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAddMemoryOpen(false)}
                className="px-4 py-2 text-xs text-gray-500 hover:text-black"
              >
                Cancel
              </button>
              <PillButton className="forest-fill" type="submit">
                Save to garden
              </PillButton>
            </div>
          </div>
        </form>
      )}

      {/* Suggested Inferred Memories */}
      {inferredMemories.length > 0 && (
        <section className="memory-list">
          <div className="list-heading">
            <Eyebrow>SUGGESTED BY MANAS ({inferredMemories.length})</Eyebrow>
            <span>Review when ready</span>
          </div>
          {inferredMemories.map((item) => (
            <article key={item.id}>
              <div>
                <small>{item.category.toUpperCase()} · Inferred ({Math.round((item.confidence || 0.8) * 100)}%)</small>
                <h2>{item.content}</h2>
              </div>
              <div>
                <button className="not-now" onClick={() => handleDeleteMemory(item.id)}>
                  Dismiss
                </button>
                <PillButton
                  className="terracotta-fill"
                  onClick={() => handleConfirmMemory(item.id)}
                >
                  Keep this <ArrowRight size={15} strokeWidth={1.5} />
                </PillButton>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Confirmed Permanent Context */}
      <section className="memory-list">
        <div className="list-heading">
          <Eyebrow>CONFIRMED CONTEXT ({confirmedMemories.length})</Eyebrow>
          <span>Active in dialogue prompt</span>
        </div>
        {confirmedMemories.length === 0 ? (
          <p className="text-sm text-muted-foreground italic py-4">
            No confirmed memories yet. Add your own or confirm notes proposed by MANAS above.
          </p>
        ) : (
          confirmedMemories.map((item) => (
            <article key={item.id} className="accepted">
              <div>
                <small>{item.category.toUpperCase()} · Confirmed</small>
                <h2>{item.content}</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="accepted-label">
                  <Check size={16} strokeWidth={1.5} /> Held
                </span>
                <button
                  onClick={() => handleDeleteMemory(item.id)}
                  className="text-gray-400 hover:text-destructive p-1"
                  title="Remove memory"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="privacy-banner">
        <LockKeyhole size={24} strokeWidth={1.5} />
        <div>
          <b>Your context stays yours.</b>
          <p>Confirmed memories are isolated to your account and can be edited or deleted at any time.</p>
        </div>
      </section>
    </motion.div>
  );

  /* ========================================================================== */
  /* TAB: PRACTICE (GROWTH NOTES & GOALS)                                      */
  /* ========================================================================== */
  const practice = (
    <motion.div
      className="app-content"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <PageHeading
        eyebrow="GROWTH, NOT GRADES"
        title={
          <>
            Small practices.<br />
            <em>Real change.</em>
          </>
        }
        intro="A goal is only useful when it gives you somewhere compassionate to return to."
        action={
          <PillButton className="forest-fill" onClick={() => setAddGoalOpen(true)}>
            <Plus size={16} strokeWidth={1.5} /> Add a growth note
          </PillButton>
        }
      />

      <section className="practice-feature">
        <div>
          <Eyebrow>ACTIVE COMMITMENTS</Eyebrow>
          <h2>
            You have <em>{goals.filter((g) => g.status === "achieved").length} completed</em> and {goals.filter((g) => g.status === "in_progress").length} in rhythm.
          </h2>
          <p>That can be as small as pausing before a reply, closing a laptop, or asking for a little more time.</p>
        </div>
        <div className="practice-orbit">
          <span>
            <b>+{goals.length}</b>
            <small>
              moments of<br />
              self-trust
            </small>
          </span>
        </div>
      </section>

      {addGoalOpen && (
        <form onSubmit={handleAddGoal} className="my-6 p-6 bg-white border border-border rounded-2xl space-y-4">
          <Eyebrow>NEW GROWTH OBJECTIVE</Eyebrow>
          <input
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            placeholder="e.g. End workdays with a real stopping point..."
            className="w-full p-3 border border-border rounded-xl text-sm outline-none focus:border-sage"
          />
          <input
            value={newGoalStrategy}
            onChange={(e) => setNewGoalStrategy(e.target.value)}
            placeholder="Helpful micro-strategy (e.g. Close the loop with 'This can wait until tomorrow')"
            className="w-full p-3 border border-border rounded-xl text-sm outline-none focus:border-sage"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddGoalOpen(false)}
              className="px-4 py-2 text-xs text-gray-500 hover:text-black"
            >
              Cancel
            </button>
            <PillButton className="forest-fill" type="submit">
              Save goal
            </PillButton>
          </div>
        </form>
      )}

      <section className="goal-list">
        <div className="list-heading">
          <Eyebrow>YOUR ACTIVE NOTES</Eyebrow>
          <span>{goals.length} in practice</span>
        </div>
        {goals.length === 0 ? (
          <p className="text-sm text-muted-foreground italic py-4">
            No growth notes yet. Click 'Add a growth note' to begin tracking an intention.
          </p>
        ) : (
          goals.map((goal, index) => {
            const isDone = goal.status === "achieved";
            return (
              <article key={goal.id}>
                <span className="goal-number">0{index + 1}</span>
                <div className="goal-main">
                  <small>GROWTH PRACTICE</small>
                  <h2>{goal.title}</h2>
                  {goal.strategies?.[0] && (
                    <p>
                      <Sparkles size={15} strokeWidth={1.5} />
                      {goal.strategies[0]}
                    </p>
                  )}
                </div>
                <div className="goal-meter">
                  <span>
                    <b>{isDone ? "100%" : "50%"}</b>
                    {isDone ? "completed" : "in rhythm"}
                  </span>
                  <i>
                    <em style={{ width: isDone ? "100%" : "50%" }} />
                  </i>
                </div>
                <PillButton
                  className={isDone ? "sage-outline done" : "terracotta-fill"}
                  onClick={() => handleToggleGoal(goal)}
                >
                  <Check size={15} strokeWidth={1.5} />
                  {isDone ? "Practiced today" : "Mark a practice"}
                </PillButton>
              </article>
            );
          })
        )}
      </section>

      <section className="practice-end">
        <Leaf size={24} strokeWidth={1.5} />
        <p>
          <b>A little context makes a practice more humane.</b>
          Use a conversation to explore what got in the way—or what made one small moment possible.
        </p>
        <button className="subtle-action" onClick={() => go("talk")}>
          Reflect with MANAS <ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </section>
    </motion.div>
  );

  /* ========================================================================== */
  /* TAB: GROUND (SOMATIC & BREATHING)                                         */
  /* ========================================================================== */
  const sensory = [
    { count: "5", sense: "things you can see", body: "Let your eyes travel slowly. Notice five shapes, colours, or tiny details around you." },
    { count: "4", sense: "things you can feel", body: "Notice the chair beneath you, fabric on your skin, and the floor beneath your feet." },
    { count: "3", sense: "things you can hear", body: "Listen for near sounds, then far sounds. You don’t need to name them perfectly." },
    { count: "2", sense: "things you can smell", body: "Take a soft breath in. See if you can notice two scents, even very faint ones." },
    { count: "1", sense: "thing you can taste", body: "Notice one taste in your mouth, or take a sip of water slowly." },
  ];
  const phases = ["Inhale", "Hold", "Exhale", "Rest"];

  const ground = (
    <motion.div
      className="app-content"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <PageHeading
        eyebrow="SOMATIC TOOLKIT"
        title={
          <>
            Come back<br />
            to <em>your body.</em>
          </>
        }
        intro="You do not need to earn a pause. Choose one small practice and let it be enough."
      />

      <section className="tool-grid">
        <article className="breath-card">
          <div>
            <Eyebrow>BOX BREATHING</Eyebrow>
            <h2>
              Four corners.<br />
              <em>One minute.</em>
            </h2>
            <p>Follow the soft pulse as it expands and rests. You can stop whenever you need.</p>
            <div className="phase-indicator">
              {phases.map((item, index) => (
                <span key={item} className={breathPhase === index ? "active" : ""}>
                  {item}
                  <b>4</b>
                </span>
              ))}
            </div>
            <PillButton className="forest-fill" onClick={() => setBreathing((current) => !current)}>
              {breathing ? (
                <>
                  <TimerReset size={16} strokeWidth={1.5} />
                  Pause practice
                </>
              ) : (
                <>
                  <Sparkles size={16} strokeWidth={1.5} />
                  Begin slowly
                </>
              )}
            </PillButton>
          </div>
          <div className={`breath-image ${breathing ? "breathing" : ""}`}>
            <BotanicalGroundingIllustration />
            <i />
            <i />
            <span>
              <b>{phases[breathPhase]}</b>
              for 4
            </span>
          </div>
        </article>

        <article className="sensory-card">
          <div className="sensory-top">
            <Eyebrow>5–4–3–2–1 RESET</Eyebrow>
            <span>Step {sensoryIndex + 1} of 5</span>
          </div>
          <b className="sensory-number">{sensory[sensoryIndex].count}</b>
          <h2>{sensory[sensoryIndex].sense}</h2>
          <p>{sensory[sensoryIndex].body}</p>
          <div className="sensory-steps">
            {sensory.map((item, index) => (
              <button
                key={item.count}
                onClick={() => setSensoryIndex(index)}
                className={index === sensoryIndex ? "active" : index < sensoryIndex ? "complete" : ""}
              >
                {index < sensoryIndex ? <Check size={13} strokeWidth={1.5} /> : item.count}
              </button>
            ))}
          </div>
          <div className="sensory-actions">
            <button
              onClick={() => setSensoryIndex((current) => Math.max(0, current - 1))}
              disabled={sensoryIndex === 0}
            >
              Back
            </button>
            <PillButton
              className="terracotta-fill"
              onClick={() => setSensoryIndex((current) => (current === 4 ? 0 : current + 1))}
            >
              {sensoryIndex === 4 ? "Start again" : "Next thing"}
              <ArrowRight size={15} strokeWidth={1.5} />
            </PillButton>
          </div>
        </article>
      </section>

      <section className="tool-ending">
        <div>
          <Eyebrow>WHEN THINGS FEEL TOO BIG</Eyebrow>
          <h2>
            Reorient before<br />
            you <em>respond.</em>
          </h2>
          <p>
            Grounding is not a solution to what happened. It can offer a little steadiness while you decide what comes next.
          </p>
        </div>
        <button className="crisis-link" onClick={() => setCrisisOpen(true)}>
          <ShieldAlert size={18} strokeWidth={1.5} /> Find immediate support
        </button>
      </section>
    </motion.div>
  );

  const content: Record<View, React.ReactNode> = { today, talk, memory, practice, ground };

  /* ========================================================================== */
  /* PRIVACY DISGUISE MODE                                                     */
  /* ========================================================================== */
  if (disguise) {
    return (
      <div className="privacy-disguise">
        <header>
          <div>
            <b>Operations Forecast</b>
            <span>Sheet</span>
          </div>
          <button onClick={() => setDisguise(false)}>Return to MANAS</button>
        </header>
        <nav>File &nbsp; Edit &nbsp; View &nbsp; Insert &nbsp; Format &nbsp; Data &nbsp; Tools &nbsp; Extensions &nbsp; Help</nav>
        <main>
          <div className="formula-line">fx &nbsp; =SUM(E3:E22)</div>
          <table>
            <thead>
              <tr>
                <th />
                {["A", "B", "C", "D", "E", "F"].map((letter) => (
                  <th key={letter}>{letter}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 24 }, (_, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{index === 0 ? "Workstream" : index % 5 === 0 ? "Forecast" : ""}</td>
                  <td>{index === 0 ? "Owner" : index % 3 === 0 ? "Operations" : ""}</td>
                  <td>{index === 0 ? "Status" : index % 6 === 0 ? "On track" : ""}</td>
                  <td>{index === 0 ? "August" : index % 4 === 0 ? "12,400" : ""}</td>
                  <td>{index === 0 ? "September" : index % 7 === 0 ? "14,000" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
        <footer>Privacy disguise active · Select “Return to MANAS” to unlock</footer>
      </div>
    );
  }

  /* ========================================================================== */
  /* MAIN COMPANION SHELL                                                      */
  /* ========================================================================== */
  return (
    <div className="companion-app">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <button className="app-brand" onClick={() => go("today")}>
          <Mark />
          <span>
            MANAS
            <small>PRIVATE COMPANION</small>
          </span>
        </button>

        <PillButton className="sidebar-new" onClick={handleNewSession}>
          <Plus size={18} strokeWidth={1.5} /> New conversation
        </PillButton>

        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={view === item.id ? "active" : ""}
                key={item.id}
                onClick={() => go(item.id)}
              >
                <Icon size={19} strokeWidth={1.5} />
                <span>{item.label}</span>
                {item.id === "memory" && inferredMemories.length > 0 && <i>{inferredMemories.length}</i>}
              </button>
            );
          })}
        </nav>

        <div className="recent-chats">
          <Eyebrow>RECENTLY OPENED</Eyebrow>
          {sessions.slice(0, 3).map((sess) => (
            <button
              key={sess.id}
              onClick={() => handleSelectSession(sess.id)}
              className={sess.id === activeSessionId && view === "talk" ? "font-bold text-forest" : ""}
            >
              {sess.title || "Untitled dialogue"}
              <small>
                {new Date(sess.started_at).toLocaleDateString([], { month: "short", day: "numeric" })}
              </small>
            </button>
          ))}
          <button className="history-button" onClick={() => setHistoryOpen(true)}>
            <History size={15} strokeWidth={1.5} />
            View all history ({sessions.length})
          </button>
        </div>

        <div className="app-sidebar-footer">
          <button className="quick-exit" onClick={() => setDisguise(true)}>
            <span>
              <LockKeyhole size={16} strokeWidth={1.5} />
              Quick exit
            </span>
            <kbd>Esc</kbd>
          </button>

          <div className="profile-row justify-between">
            <div className="flex items-center gap-2">
              <b>{currentUser?.name?.charAt(0) || "A"}</b>
              <span>
                {currentUser?.name || "Alex Morgan"}
                <small>Private space</small>
              </span>
            </div>
            <button onClick={handleLogout} title="Log out" className="text-gray-400 hover:text-destructive">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="app-mobile-header">
        <button className="app-brand" onClick={() => go("today")}>
          <Mark small />
          <span>MANAS</span>
        </button>
        <button onClick={() => setMenuOpen((current) => !current)} aria-label="Open menu">
          <Menu size={22} strokeWidth={1.5} />
        </button>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="app-mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {navItems.map((item) => (
              <button key={item.id} onClick={() => go(item.id)}>
                {item.label}
              </button>
            ))}
            <button onClick={() => setDisguise(true)}>Quick exit (Esc)</button>
            <button onClick={handleLogout} className="text-destructive">Log out</button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="app-main">
        <header className="app-topbar">
          <span>MANAS / {navItems.find((item) => item.id === view)?.label.toUpperCase()}</span>
          <div>
            <button
              onClick={() => toast.info(reflectionSummary ? `Latest reflection: "${reflectionSummary}"` : "No new reflections right now.")}
              aria-label="Notifications"
            >
              <Bell size={18} strokeWidth={1.5} />
              {reflectionSummary && <i />}
            </button>
            <button
              onClick={() => toast.info("Use the sidebar to move through your private space.")}
              aria-label="Help"
            >
              <CircleHelp size={18} strokeWidth={1.5} />
            </button>
            <span>
              <LockKeyhole size={14} strokeWidth={1.5} /> Private space
            </span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {content[view]}
          </motion.div>
        </AnimatePresence>

        <footer className="app-footer">
          MANAS IS AN AI COMPANION, NOT A CLINICAL OR EMERGENCY SERVICE.
        </footer>
      </main>

      {/* Recent Chats / History Drawer Modal */}
      <AnimatePresence>
        {historyOpen && (
          <motion.div
            className="support-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.section
              className="support-modal botanical max-h-[85vh] overflow-y-auto"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <button
                className="close-support"
                onClick={() => setHistoryOpen(false)}
                aria-label="Close history dialog"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              <div className="support-mark">
                <History size={24} strokeWidth={1.5} />
              </div>
              <Eyebrow>CONVERSATION HISTORY</Eyebrow>
              <h2>
                Your past <em>dialogues.</em>
              </h2>
              <p>Pick up a previous thread or review what you discussed.</p>

              <div className="support-options mt-6 space-y-2">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3 bg-[#faf8f5] border border-[#e8e3dc] rounded-xl flex items-center justify-between gap-4"
                  >
                    <button
                      onClick={() => {
                        handleSelectSession(sess.id);
                        setHistoryOpen(false);
                      }}
                      className="text-left flex-1"
                    >
                      <b className="block text-sm text-forest font-semibold">
                        {sess.title || "Untitled reflection"}
                      </b>
                      <span className="text-xs text-muted-foreground">
                        {new Date(sess.started_at).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })} · {sess.messages?.length || 0} messages
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteSession(sess.id)}
                      className="text-gray-400 hover:text-destructive p-2"
                      title="Delete conversation"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safety / Crisis Escalation Modal */}
      <AnimatePresence>
        {crisisOpen && (
          <motion.div
            className="support-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.section
              className="support-modal botanical"
              role="dialog"
              aria-modal="true"
              aria-labelledby="support-title"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                className="close-support"
                onClick={() => setCrisisOpen(false)}
                aria-label="Close support dialog"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              <div className="support-mark">
                <ShieldAlert size={24} strokeWidth={1.5} />
              </div>
              <Eyebrow>IMMEDIATE SUPPORT</Eyebrow>
              <h2 id="support-title">
                You deserve support<br />
                that can be with you <em>right now.</em>
              </h2>
              <p>
                MANAS is not an emergency service. If you may act on thoughts of hurting yourself or someone else, call your local emergency number now or contact a crisis line.
              </p>

              <div className="support-options">
                <a href="tel:112">
                  <b>India emergency</b>
                  <span>112</span>
                </a>
                <a href="tel:18005990019">
                  <b>KIRAN mental-health helpline</b>
                  <span>1800-599-0019</span>
                </a>
                <a href="tel:14416">
                  <b>Tele-MANAS national helpline</b>
                  <span>14416</span>
                </a>
                <a href="tel:988">
                  <b>United States crisis support</b>
                  <span>Call or text 988</span>
                </a>
              </div>

              <div className="support-actions">
                <button className="subtle-action" onClick={() => setCrisisOpen(false)}>
                  I’m safe for this moment
                </button>
                <button className="subtle-action" onClick={() => setDisguise(true)}>
                  <LockKeyhole size={15} strokeWidth={1.5} />
                  Quick exit
                </button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
