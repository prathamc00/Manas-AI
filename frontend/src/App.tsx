import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/chat/ChatArea';
import { DailyCheckIn } from './components/checkin/DailyCheckIn';
import { MemoryVault } from './components/memory/MemoryVault';
import { GoalTracker } from './components/goals/GoalTracker';
import { GroundingExercise } from './components/exercises/GroundingExercise';
import { EmergencyModal } from './components/safety/EmergencyModal';
import { DisguiseView } from './components/disguise/DisguiseView';
import { api } from './lib/api';
import type { Session, Message, Memory, MoodEntry, Goal, SafetyResources } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'checkin' | 'memory' | 'goals' | 'grounding'>('chat');
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

  // Initial load
  useEffect(() => {
    loadAllData();

    // Listen for Escape key to toggle Quick Disguise
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDisguised((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

      if (fetchedSessions.length > 0 && !activeSessionId) {
        const latest = fetchedSessions[0];
        setActiveSessionId(latest.id);
        setMessages(latest.messages || []);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
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

  return (
    <div className="flex h-screen h-[100dvh] w-screen overflow-hidden bg-[#181714]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onOpenSafety={() => setIsSafetyOpen(true)}
        onTriggerDisguise={() => setIsDisguised(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex overflow-hidden bg-[#181714] relative">
        {activeTab === 'chat' && (
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
        )}

        {activeTab === 'checkin' && (
          <DailyCheckIn
            moodHistory={moodHistory}
            onLogMood={handleLogMood}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
        )}

        {activeTab === 'memory' && (
          <MemoryVault
            memories={memories}
            onConfirmMemory={handleConfirmMemory}
            onDeleteMemory={handleDeleteMemory}
            onCreateMemory={handleCreateMemory}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
        )}

        {activeTab === 'goals' && (
          <GoalTracker
            goals={goals}
            onCreateGoal={handleCreateGoal}
            onUpdateGoal={handleUpdateGoal}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
        )}

        {activeTab === 'grounding' && (
          <GroundingExercise
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
        )}
      </main>

      <EmergencyModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
        resources={safetyResources}
      />
    </div>
  );
}

export default App;
