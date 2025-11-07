export type Theme = 'dystopia' | 'glitch' | 'chrome';

export interface Question {
  id: string;
  type: 'mcq' | 'paragraph';
  text: string;
  options?: string[];
}

export interface Role {
  name: string;
  position: string;
  description: string;
  traits: string[];
}

export interface ApplicationData {
  handle: string;
  answers: {
    question: string;
    answer: string;
  }[];
}

export interface AudioAnalysisResult {
  passes_initiation: boolean;
  justification: string;
}

export interface GeminiRoleResult {
  roleName: string;
  justification: string;
  mission: string;
}

export interface FinalResult extends Role {
    mission: string;
    justification: string;
}

export type AppState = 'home' | 'apply' | 'decryption' | 'challenge' | 'analyzing' | 'result' | 'failed';