export interface KnowledgeNode {
  id: string;             // CID (sha256 hex, 16 chars)
  name: string;
  domain: string;
  description: string;
  sourceId?: string;      // ArXiv paper ID (optional)
  sourceUrl?: string;     // ArXiv URL (optional)
  fileSourceId?: string;  // ID of FileSource if ingested from file
  paperAbstract?: string; // Full abstract for expansion view
  tags?: string[];
  createdAt: string;
  pinned?: boolean;       // Graph: node is pinned in place
}

export interface KnowledgeLink {
  source: string;
  target: string;
  type: 'synthesis' | 'reference' | 'similarity' | 'file-bridge';
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

export interface FileSource {
  id: string;
  filename: string;
  mimeType: string;
  ingestedAt: string;
  nodeCount: number;
  characterCount: number;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
  proposals: SynthesisProposal[];
  fileSources: FileSource[];
}

export type AIProvider = 'gemini' | 'openrouter' | 'grok' | 'ollama';

export interface AIConfig {
  extractionProvider: 'gemini' | 'ollama';
  synthesisProvider: 'openrouter' | 'ollama';
  auditProvider: 'grok' | 'ollama';
  ollamaEndpoint: string;         // e.g. "http://localhost:11434"
  ollamaExtractionModel: string;  // e.g. "llama3.2"
  ollamaSynthesisModel: string;
  ollamaAuditModel: string;
}

export interface GraphData {
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
  proposals: SynthesisProposal[];
  fileSources?: FileSource[];
}

export interface ActivityItem {
  id: number;
  msg: string;
  type: 'info' | 'warn' | 'ai';
  timestamp: string;
}
