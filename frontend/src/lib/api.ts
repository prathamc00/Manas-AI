import type { Session, Memory, MoodEntry, Goal, SafetyResources, User, AuthResponse } from '../types';

const API_BASE = '/api';
const TOKEN_KEY = 'manas_auth_token';

function getAuthHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function parseErrorDetail(errData: any, defaultMsg: string, status?: number): string {
  if (status === 404) {
    return 'Backend server is not reachable or endpoint was not found. Please ensure the backend server is running on port 8000.';
  }
  if (status === 502 || status === 503 || status === 504) {
    return 'Cannot connect to backend server. Please ensure the backend is running on port 8000.';
  }
  if (!errData) return defaultMsg;
  if (typeof errData === 'string') return errData;
  if (typeof errData.detail === 'string') return errData.detail;
  if (Array.isArray(errData.detail)) {
    return errData.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
  }
  if (errData.message) return errData.message;
  return defaultMsg;
}

export const api = {
  // Auth helpers
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Auth Endpoints
  async signup(data: { email: string; password: string; name?: string }): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(parseErrorDetail(err, 'Sign up failed', res.status));
      }
      const result: AuthResponse = await res.json();
      if (result.access_token) {
        localStorage.setItem(TOKEN_KEY, result.access_token);
      }
      return result;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Could not connect to the backend server. Please ensure the backend is running.');
    }
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(parseErrorDetail(err, 'Invalid email or password', res.status));
      }
      const result: AuthResponse = await res.json();
      if (result.access_token) {
        localStorage.setItem(TOKEN_KEY, result.access_token);
      }
      return result;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Could not connect to the backend server. Please ensure the backend is running.');
    }
  },

  async getMe(): Promise<User | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
      return await res.json();
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

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
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  // Sessions
  async getSessions(): Promise<Session[]> {
    const res = await fetch(`${API_BASE}/sessions`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return res.json();
  },

  async getSession(sessionId: string): Promise<Session> {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch session');
    return res.json();
  },

  async createSession(title?: string): Promise<Session> {
    const res = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
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
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create memory');
    return res.json();
  },

  async updateMemory(id: string, updates: Partial<Memory>): Promise<Memory> {
    const res = await fetch(`${API_BASE}/memories/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update memory');
    return res.json();
  },

  async deleteMemory(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/memories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete memory');
  },

  // Mood
  async getMoodHistory(): Promise<MoodEntry[]> {
    const res = await fetch(`${API_BASE}/mood`, {
      headers: getAuthHeaders(),
    });
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
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to log mood');
    return res.json();
  },

  // Goals
  async getGoals(): Promise<Goal[]> {
    const res = await fetch(`${API_BASE}/goals`, {
      headers: getAuthHeaders(),
    });
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
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create goal');
    return res.json();
  },

  async updateGoal(id: string, updates: Partial<Goal> & { progress_note?: string }): Promise<Goal> {
    const res = await fetch(`${API_BASE}/goals/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update goal');
    return res.json();
  },

  // Safety
  async getSafetyResources(): Promise<SafetyResources> {
    const res = await fetch(`${API_BASE}/safety/resources`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch safety resources');
    return res.json();
  }
};
