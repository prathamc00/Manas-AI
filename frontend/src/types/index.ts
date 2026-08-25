export interface ReflectionSummary {
  summary?: string;
  primary_emotion?: string;
  emotion_intensity?: number;
  strategy_used?: string;
  is_advice_provided?: boolean;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  reflections: ReflectionSummary;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  title: string;
  started_at: string;
  ended_at?: string | null;
  summary: Record<string, any>;
  safety_status: string;
  messages: Message[];
}

export interface Memory {
  id: string;
  user_id: string;
  category: 'explicit' | 'episodic' | 'semantic' | 'preference' | 'goal';
  content: string;
  confidence: number;
  is_inferred: boolean;
  user_confirmed: boolean;
  source_session?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: number; // 1 to 4
  stress: number; // 1 to 10
  energy: number; // 1 to 10
  notes?: string | null;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  status: 'in_progress' | 'achieved' | 'paused' | 'archived';
  strategies: string[];
  progress_notes: Array<{ note: string; timestamp: string }>;
  created_at: string;
  updated_at: string;
}

export interface SafetyResources {
  helplines: Array<{
    country: string;
    number?: string;
    url?: string;
    available: string;
  }>;
  safety_action: string;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  preferences?: Record<string, any>;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

