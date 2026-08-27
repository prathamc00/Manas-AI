import type { Session, Memory, MoodEntry, Goal, SafetyResources, User, AuthResponse } from '../types';

const TOKEN_KEY = 'manas_auth_token';
const USER_KEY = 'manas_user_cache';
const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '/api';

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
  if (!errData) {
    if (status === 404) return 'The requested API endpoint was not found. Please verify backend routing.';
    if (status === 502 || status === 503 || status === 504) return 'Cannot connect to backend server. Gateway/proxy error.';
    return defaultMsg;
  }
  if (typeof errData === 'string') return errData;
  if (typeof errData.detail === 'string') return errData.detail;
  if (Array.isArray(errData.detail)) {
    return errData.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
  }
  if (errData.message) return errData.message;
  return defaultMsg;
}

async function request(path: string, options: RequestInit = {}): Promise<Response> {
  const url = `${API_BASE_URL}${path}`;

  try {
    const res = await fetch(url, options);
    return res;
  } catch (netErr) {
    throw new Error('Unable to connect to the backend server. Please verify your internet connection and backend status.');
  }
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
    localStorage.removeItem(USER_KEY);
  },

  logout() {
    this.clearToken();
  },

  getCachedUser(): User | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    return this.getMe();
  },

  // Auth Endpoints
  async signup(data: { email: string; password: string; name?: string }): Promise<AuthResponse> {
    const res = await request('/auth/signup', {
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
      if (result.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      }
    }
    return result;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await request('/auth/login', {
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
      if (result.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      }
    }
    return result;
  },

  async getMe(): Promise<User | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const res = await request('/auth/me', {
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        // Token is genuinely invalid or expired
        this.clearToken();
        return null;
      }
      if (res.ok) {
        const user: User = await res.json();
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return user;
      }
      // On non-401 errors (500, network delay), fallback to cached user
      return this.getCachedUser();
    } catch {
      // On network errors, fallback to cached user instead of wiping session
      return this.getCachedUser();
    }
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
    const res = await request('/chat', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  // Sessions
  async getSessions(): Promise<Session[]> {
    const res = await request('/sessions', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return res.json();
  },

  async getSession(sessionId: string): Promise<Session> {
    const res = await request(`/sessions/${sessionId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch session');
    return res.json();
  },

  async createSession(title?: string): Promise<Session> {
    const res = await request('/sessions', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to create session');
    return res.json();
  },

  async updateSession(sessionId: string, title: string): Promise<Session> {
    const res = await request(`/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to update session');
    return res.json();
  },

  async deleteSession(sessionId: string): Promise<void> {
    const res = await request(`/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete session');
  },

  // Memories
  async getMemories(userConfirmedOnly?: boolean): Promise<Memory[]> {
    const path = userConfirmedOnly !== undefined
      ? `/memories?user_confirmed_only=${userConfirmedOnly}`
      : '/memories';
    const res = await request(path, {
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
    const res = await request('/memories', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create memory');
    return res.json();
  },

  async updateMemory(id: string, updates: Partial<Memory>): Promise<Memory> {
    const res = await request(`/memories/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update memory');
    return res.json();
  },

  async confirmMemory(id: string): Promise<Memory> {
    return this.updateMemory(id, { user_confirmed: true });
  },

  async deleteMemory(id: string): Promise<void> {
    const res = await request(`/memories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete memory');
  },

  // Mood
  async getMoodHistory(): Promise<MoodEntry[]> {
    const res = await request('/mood', {
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
    const res = await request('/mood', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to log mood');
    return res.json();
  },

  // Goals
  async getGoals(): Promise<Goal[]> {
    const res = await request('/goals', {
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
    const res = await request('/goals', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create goal');
    return res.json();
  },

  async updateGoal(id: string, updates: Partial<Goal> & { progress_note?: string }): Promise<Goal> {
    const res = await request(`/goals/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update goal');
    return res.json();
  },

  // Safety
  async getSafetyResources(): Promise<SafetyResources> {
    const res = await request('/safety/resources', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch safety resources');
    return res.json();
  }
};
