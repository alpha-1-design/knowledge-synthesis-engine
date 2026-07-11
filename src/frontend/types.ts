export interface KnowledgeNode {
  id: string;
  name: string;
  domain: string;
  description: string;
  sourceId: string;
  sourceUrl: string;
  createdAt: string;
}

export interface KnowledgeLink {
  source: string;
  target: string;
  type: 'synthesis' | 'reference' | 'similarity';
  weight: number;
}

export interface ValidationVote {
  expertDid: string;
  approve: boolean;
  reasoning: string;
  timestamp: string;
}

export interface SynthesisProposal {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  hypothesis: string;
  auditStatus: 'pending' | 'clean' | 'warning' | 'rejected';
  auditReasoning: string;
  trustScore: number;
  createdAt: string;
  validations: ValidationVote[];
}

export interface GraphData {
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
  proposals: SynthesisProposal[];
}

export interface ActivityItem {
  id: number;
  msg: string;
  type: 'info' | 'warn' | 'ai';
  timestamp: string;
}
