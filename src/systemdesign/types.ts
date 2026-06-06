/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TrackType = 'HLD' | 'LLD';

export interface TradeOff {
  criteria: string;
  factorA: string; // e.g., "Latency"
  factorB: string; // e.g., "Throughput"
  valA: string;
  valB: string;
  preferred: string;
}

export interface Relationship {
  from: string;
  to: string;
  label: string;
}

export interface ComponentBlock {
  name: string;
  role: string;
  description: string;
  tier: 'Client' | 'Load Balancer' | 'Gateway' | 'Service' | 'Cache' | 'Database' | 'Queue';
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface CuratedResource {
  title: string;
  creator: 'Gaurav Sen' | 'ByteByteGo' | 'Hussein Nasser' | 'System Design Primer' | 'Refactoring Guru' | 'Martin Fowler';
  url: string;
  youtubeId?: string;
}

export interface Topic {
  id: string;
  title: string;
  track: TrackType;
  category: string;
  summary: string;
  cheatSheet: string[];
  diagram: string; // Mermaid markup
  components: ComponentBlock[];
  relationships: Relationship[];
  tradeoffs: TradeOff[];
  faqs: FAQ[];
  resources: CuratedResource[];
}

export interface UserProgressDoc {
  topicId: string;
  userId: string;
  status: 'in_progress' | 'completed' | 'not_started';
  updatedAt: any;
}

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt: any;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  topicId: string;
  questions: QuizQuestion[];
}

export interface QuizResultDoc {
  topicId: string;
  userId: string;
  score: number;
  total: number;
  completedAt: any;
}
