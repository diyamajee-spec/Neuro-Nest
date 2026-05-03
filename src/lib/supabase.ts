import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type NodeStatus = 'locked' | 'in-progress' | 'mastered';

export interface LearningNode {
  id: string;
  label: string;
  description: string;
  status: NodeStatus;
  level: number;
  position: { x: number; y: number };
}

export interface LearningEdge {
  id: string;
  source: string;
  target: string;
}

export interface LearningTree {
  nodes: LearningNode[];
  edges: LearningEdge[];
}
