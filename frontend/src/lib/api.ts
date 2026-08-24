import type { Session, Memory, MoodEntry, Goal, SafetyResources } from '../types';

const API_BASE = '/api';

export const api = {
  // Chat
  async sendMessage(params: {
    message: string;
    session_id?: string;
    mode?: string;
  }): Promise<{
    session_id: string;
    message_id: string;
    content: string;
    reflections: any;
    safety_status: string;
    is_crisis: boolean;
    crisis_resources?: any;
    created_at: string;
  }> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  // Sessions
  async getSessions(): Promise<Session[]> {
    const res = await fetch(`${API_BASE}/sessions`);
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return res.json();
  },

  async getSession(sessionId: string): Promise<Session> {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}`);
    if (!res.ok) throw new Error('Failed to fetch session');
    return res.json();
  },

  async createSession(title?: string): Promise<Session> {
    const res = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to create session');
    return res.json();
  },

  // Memories
  async getMemories(userConfirmedOnly?: boolean): Promise<Memory[]> {
    const url = userConfirmedOnly !== undefined
      ? `${API_BASE}/memories?user_confirmed_only=${userConfirmedOnly}`
      : `${API_BASE}/memories`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch memories');
    return res.json();
  },

  async createMemory(data: {
    category: string;
    content: string;
    is_inferred?: boolean;
    user_confirmed?: boolean;
  }): Promise<Memory> {
    const res = await fetch(`${API_BASE}/memories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create memory');
    return res.json();
  },

  async updateMemory(id: string, updates: Partial<Memory>): Promise<Memory> {
    const res = await fetch(`${API_BASE}/memories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update memory');
    return res.json();
  },

  async deleteMemory(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/memories/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete memory');
  },

  // Mood
  async getMoodHistory(): Promise<MoodEntry[]> {
    const res = await fetch(`${API_BASE}/mood`);
    if (!res.ok) throw new Error('Failed to fetch mood history');
    return res.json();
  },

  async logMood(data: {
    mood: number;
    stress: number;
    energy: number;
    notes?: string;
  }): Promise<MoodEntry> {
    const res = await fetch(`${API_BASE}/mood`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to log mood');
    return res.json();
  },

  // Goals
  async getGoals(): Promise<Goal[]> {
    const res = await fetch(`${API_BASE}/goals`);
    if (!res.ok) throw new Error('Failed to fetch goals');
    return res.json();
  },

  async createGoal(data: {
    title: string;
    description?: string;
    strategies?: string[];
  }): Promise<Goal> {
    const res = await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create goal');
    return res.json();
  },

  async updateGoal(id: string, updates: Partial<Goal> & { progress_note?: string }): Promise<Goal> {
    const res = await fetch(`${API_BASE}/goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update goal');
    return res.json();
  },

  // Safety
  async getSafetyResources(): Promise<SafetyResources> {
    const res = await fetch(`${API_BASE}/safety/resources`);
    if (!res.ok) throw new Error('Failed to fetch safety resources');
    return res.json();
  }
};
