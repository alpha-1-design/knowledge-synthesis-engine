export interface KnowledgeNode {
  id: string;       // Content-Addressable Identifier (CID)
  name: string;
  domain: string;
  description: string;
  sourceId: string; // ArXiv paper ID
  sourceUrl: string;
  createdAt: string;
}

export interface KnowledgeLink {
  source: string;   // CID
  target: string;   // CID
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

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
  proposals: SynthesisProposal[];
}
