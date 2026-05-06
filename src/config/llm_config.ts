/**
 * KSE Intelligence Configuration
 * Maps specialized tasks to specific LLM models.
 */
export const LLM_CONFIG = {
  // Ingestion & Basic Processing
  INGESTION_MODEL: 'gemini-1.5-flash',
  
  // Logical Audit & Rigorous Reasoning
  AUDIT_MODEL: 'grok-beta',
  
  // Autonomous Scout Analysis
  SCOUT_ANALYSIS_MODEL: 'grok-beta',
  
  // High-Potential Synthesis & Discovery
  SYNTHESIS_MODEL: 'google/gemma-2-9b-it:free',
  DISCOVERY_MODEL: 'google/gemma-2-9b-it:free',
  
  // System Defaults
  DEFAULT_TEMPERATURE: 0.3,
  MAX_RETRIES: 3
};
