# KSE API Specification (v1.0)

Enterprise developers can integrate with the KSE via a RESTful API.

## Authentication
All requests must include the `X-API-KEY` header.

## Endpoints

### 1. `GET /api/v1/synthesis/graph`
Returns the complete 3D topological mesh.
*   **Response:** `{ success: true, data: { nodes: [], links: [] } }`

### 2. `POST /api/v1/scout/trigger`
Initiates an autonomous research cycle.
*   **Body:** `{ seed_query: "string (optional)" }`
*   **Response:** `{ success: true, message: "Scout triggered" }`

### 3. `GET /api/v1/activity`
Returns the real-time intelligence feed (last 50 events).
*   **Response:** `{ success: true, data: [ { timestamp, msg, type } ] }`

### 4. `POST /api/v1/synthesis/:id/validate`
Submit an expert validation vote for a synthesis proposal.
*   **Body:** `{ approve: boolean, reasoning: string, expert_did: string }`

---
*For high-throughput requirements, please contact the Semantic Mesh engineering team regarding WebSocket implementation.*
