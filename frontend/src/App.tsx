import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/home/HomeView';
import { AboutView } from './components/about/AboutView';
import { ChatArea } from './components/chat/ChatArea';
import { DailyCheckIn } from './components/checkin/DailyCheckIn';
import { MemoryVault } from './components/memory/MemoryVault';
import { GoalTracker } from './components/goals/GoalTracker';
import { GroundingExercise } from './components/exercises/GroundingExercise';
import { EmergencyModal } from './components/safety/EmergencyModal';
import { DisguiseView } from './components/disguise/DisguiseView';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { api } from './lib/api';
import type { Session, Message, Memory, MoodEntry, Goal, SafetyResources, User } from './types';

const pageVariants = {
  initial: { opacity: 0, scale: 0.99 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: 'easeOut' as const } },
  exit: { opacity: 0, scale: 0.99, transition: { duration: 0.2 } },
};

const tabVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export function App() {
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'app'>('landing');
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'checkin' | 'memory' | 'goals' | 'grounding' | 'about'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState<boolean>(false);
  const [safetyResources, setSafetyResources] = useState<SafetyResources | null>(null);
  const [isDisguised, setIsDisguised] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    checkUserAndLoadData();

    // Listen for Escape key to toggle Quick Disguise
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDisguised((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const checkUserAndLoadData = async () => {
    try {
      const user = await api.getMe();
      if (user) {
        setCurrentUser(user);
        setViewState('app');
      } else {
        // No user — always go to landing for fresh visitors
        setViewState('landing');
      }
    } catch {
      setCurrentUser(null);
      setViewState('landing');
    } finally {
      setIsInitializing(false);
    }
    await loadAllData();
  };

  const loadAllData = async () => {
    try {
      const [fetchedSessions, fetchedMemories, fetchedMoods, fetchedGoals] = await Promise.all([
        api.getSessions(),
        api.getMemories(),
        api.getMoodHistory(),
        api.getGoals(),
      ]);
      setSessions(fetchedSessions);
      setMemories(fetchedMemories);
      setMoodHistory(fetchedMoods);
      setGoals(fetchedGoals);

      if (fetchedSessions.length > 0) {
        const latest = fetchedSessions[0];
        setActiveSessionId(latest.id);
        setMessages(latest.messages || []);
      } else {
        setActiveSessionId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleAuthSuccess = async (user: User) => {
    setCurrentUser(user);
    setViewState('app');
    setIsAuthModalOpen(false);
    await loadAllData();
  };

  const handleLogout = async () => {
    api.logout();
    setCurrentUser(null);
    setViewState('landing');
    await loadAllData();
  };

  const handleSelectSession = async (id: string) => {
    setActiveSessionId(id);
    try {
      const session = await api.getSession(id);
      setMessages(session.messages || []);
    } catch (err) {
      console.error('Error loading session:', err);
    }
  };

  const handleNewSession = async () => {
    try {
      const newSession = await api.createSession();
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      setMessages([]);
      setActiveTab('chat');
    } catch (err) {
      console.error('Error creating session:', err);
    }
  };

  const handleSendMessage = async (text: string, mode: string) => {
    setIsLoading(true);
    try {
      const response = await api.sendMessage({
        message: text,
        session_id: activeSessionId || undefined,
        mode,
      });

      // Update active session id if newly created
      if (!activeSessionId) {
        setActiveSessionId(response.session_id);
      }

      // If crisis triggered, pop emergency modal
      if (response.is_crisis) {
        setSafetyResources(response.crisis_resources);
        setIsSafetyOpen(true);
      }

      // Reload active session messages & memories
      const updatedSession = await api.getSession(response.session_id);
      setMessages(updatedSession.messages || []);
      
      const updatedSessions = await api.getSessions();
      setSessions(updatedSessions);

      const updatedMemories = await api.getMemories();
      setMemories(updatedMemories);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogMood = async (data: { mood: number; stress: number; energy: number; notes?: string }) => {
    const newEntry = await api.logMood(data);
    setMoodHistory((prev) => [newEntry, ...prev]);
  };

  const handleConfirmMemory = async (id: string) => {
    const updated = await api.updateMemory(id, { user_confirmed: true });
    setMemories((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  const handleDeleteMemory = async (id: string) => {
    await api.deleteMemory(id);
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const handleCreateMemory = async (data: { category: string; content: string }) => {
    const created = await api.createMemory({
      ...data,
      is_inferred: false,
      user_confirmed: true,
    });
    setMemories((prev) => [created, ...prev]);
  };

  const handleCreateGoal = async (data: { title: string; description?: string; strategies?: string[] }) => {
    const created = await api.createGoal(data);
    setGoals((prev) => [created, ...prev]);
  };

  const handleUpdateGoal = async (id: string, updates: Partial<Goal> & { progress_note?: string }) => {
    const updated = await api.updateGoal(id, updates);
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
  };

  if (isDisguised) {
    return <DisguiseView onUnlock={() => setIsDisguised(false)} />;
  }

  // While checking stored token, show a minimal splash loader
  if (isInitializing) {
    return (
      <div className="min-h-screen w-full bg-[#12110E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D97757] flex items-center justify-center shadow-lg shadow-[#D97757]/30 animate-pulse">
            <span className="font-serif text-2xl italic font-bold text-white">M</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#736E65] animate-ping" />
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {/* View 1: Marketing / Product Homepage with features and overview */}
      {viewState === 'landing' && !currentUser && (
        <motion.div
          key="landing-page"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full min-h-screen"
        >
          <LandingPage
            onGetStarted={() => {
              setAuthMode('signup');
              setViewState('auth');
            }}
            onSignIn={() => {
              setAuthMode('signin');
              setViewState('auth');
            }}
            onExploreGuest={() => {
              setViewState('app');
            }}
          />
        </motion.div>
      )}

      {/* View 2: Dedicated Auth (Sign Up / Sign In) Page */}
      {viewState === 'auth' && !currentUser && (
        <motion.div
          key="auth-page"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full min-h-screen"
        >
          <AuthPage
            initialMode={authMode}
            onBack={() => setViewState('landing')}
            onSuccess={handleAuthSuccess}
            onGuestMode={() => setViewState('app')}
          />
        </motion.div>
      )}

      {/* View 3: Full Application Sanctuary */}
      {(viewState === 'app' || currentUser) && (
        <motion.div
          key="app-workspace"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex h-screen h-[100dvh] w-screen overflow-hidden bg-[#181714]"
        >
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
            onOpenSafety={() => setIsSafetyOpen(true)}
            onTriggerDisguise={() => setIsDisguised(true)}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          />

          <main className="flex-1 flex overflow-hidden bg-[#181714] relative">
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div
                  key="tab-home"
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex-1 flex overflow-hidden w-full"
                >
                  <HomeView
                    sessions={sessions}
                    memories={memories}
                    moodHistory={moodHistory}
                    goals={goals}
                    onStartSession={() => {
                      handleNewSession();
                    }}
                    onNavigate={(tab) => setActiveTab(tab)}
                    onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
                  />
                </motion.div>
              )}

              {activeTab === 'about' && (
                <motion.div
                  key="tab-about"
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex-1 flex overflow-hidden w-full"
                >
                  <AboutView
                    onBackToHome={() => setActiveTab('home')}
                    onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
                  />
                </motion.div>
              )}

              {activeTab === 'chat' && (
                <motion.div
                  key="tab-chat"
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex-1 flex overflow-hidden w-full"
                >
                  <ChatArea
                    messages={messages}
                    isLoading={isLoading}
                    onSendMessage={handleSendMessage}
                    onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
                  />
                </motion.div>
              )}

              {activeTab === 'checkin' && (
                <motion.div
                  key="tab-checkin"
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex-1 flex overflow-hidden w-full"
                >
                  <DailyCheckIn
                    moodHistory={moodHistory}
                    onLogMood={handleLogMood}
                    onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
                  />
                </motion.div>
              )}

              {activeTab === 'memory' && (
                <motion.div
                  key="tab-memory"
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex-1 flex overflow-hidden w-full"
                >
                  <MemoryVault
                    memories={memories}
                    onConfirmMemory={handleConfirmMemory}
                    onDeleteMemory={handleDeleteMemory}
                    onCreateMemory={handleCreateMemory}
                    onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
                  />
                </motion.div>
              )}

              {activeTab === 'goals' && (
                <motion.div
                  key="tab-goals"
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex-1 flex overflow-hidden w-full"
                >
                  <GoalTracker
                    goals={goals}
                    onCreateGoal={handleCreateGoal}
                    onUpdateGoal={handleUpdateGoal}
                    onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
                  />
                </motion.div>
              )}

              {activeTab === 'grounding' && (
                <motion.div
                  key="tab-grounding"
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex-1 flex overflow-hidden w-full"
                >
                  <GroundingExercise
                    onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <EmergencyModal
            isOpen={isSafetyOpen}
            onClose={() => setIsSafetyOpen(false)}
            resources={safetyResources}
          />

          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={handleAuthSuccess}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
