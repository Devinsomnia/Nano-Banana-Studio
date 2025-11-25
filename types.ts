export interface GeneratedImage {
  id: string;
  data: string; // Base64 data URI
  prompt: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text?: string;
  image?: string;
  timestamp: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  EDITING = 'EDITING',
  ERROR = 'ERROR',
}