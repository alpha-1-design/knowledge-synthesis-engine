# Knowledge Synthesis Engine (KSE) - Researcher's Protocol

Welcome to the KSE. This guide outlines the scientific workflow for using this engine to discover latent connections in scientific data.

## 1. Deployment (The "One-Command" Setup)

For institutional deployment, use Docker to ensure a consistent research environment:

```bash
docker-compose up -d
```
Access the Command Center at `http://localhost:3000`.

## 2. Research Methodology

### Phase A: Grounding (The Seed)
Don't let the engine wander. Use the **Research Focus** input to provide a "Seed Query" (e.g., "Non-invasive brain-computer interfaces").
*   **Action:** Enter your topic and click **Trigger Autonomous Scout**.
*   **Result:** The engine fetches ArXiv papers, extracts core concepts, and anchors them into the 3D Knowledge Graph.

### Phase B: Visualization (Topological Analysis)
Open the 3D Universe. Look for:
*   **Clusters:** High-density areas represent well-established research.
*   **Isolated Nodes:** These are niche concepts that may hold the key to a breakthrough.
*   **Domain Gaps:** Visually identify where two colored domains (e.g., Physics and Biology) are close in 3D space but have no connecting links.

### Phase C: Synthesis (Hypothesis Generation)
The engine automatically identifies "Synthesis Opportunities."
*   **Proposals:** Review the "Pending Proposals" sidebar. These are AI-generated hypotheses suggesting how a concept from one paper could solve a problem in another.
*   **Validation:** Use the **Approve/Reject** buttons. Your feedback weights the "Trust Score" of these connections, refining the global mesh.

### Phase D: The Logical Audit
Every synthesis is audited by xAI's Grok.
*   **Audit Report:** Click "View Full Synthesis" on a node to see the audit trail.
*   **Hallucination Check:** If the audit status is "Warning," the engine has detected a potential logical leap not grounded in the source papers.

## 3. Data Integrity & Provenance
Every node in the graph is mapped to a **Content-Addressable Identifier (CID)**. This ensures that the knowledge is immutable and traceable back to the specific ArXiv paper it originated from.

---
**Protocol Version:** 1.0.2
**Security:** Verified by Semantic Mesh Protocol
