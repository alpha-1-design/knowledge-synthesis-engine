# KSE API Specification (v1.0)

All requests must include the `X-API-KEY` header matching the `ADMIN_API_KEY` environment variable.

---

## Graph Endpoints

### `GET /api/v1/synthesis/graph`
Returns the complete knowledge graph including nodes, links, synthesis proposals, and file sources.

**Response**
```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "cid:abc123",
        "label": "Neuroplasticity",
        "domain": "Neuroscience",
        "description": "...",
        "paperTitle": "...",
        "paperUrl": "...",
        "paperAbstract": "...",
        "tags": ["cognition", "plasticity"],
        "pinned": false,
        "fileSourceId": null
      }
    ],
    "links": [
      { "source": "cid:abc123", "target": "cid:def456", "weight": 0.82 }
    ],
    "proposals": [...],
    "fileSources": [...]
  }
}
```

---

### `GET /api/v1/graph/node/:id/expand`
Expands a node by fetching related concepts not yet in the graph.

**Response**
```json
{
  "success": true,
  "data": {
    "newNodes": [...],
    "newLinks": [...]
  }
}
```

---

### `POST /api/v1/graph/merge`
Merges two nodes into one. All edges from the source node are relinked to the target node; the source is deleted.

**Body**
```json
{ "sourceId": "cid:abc123", "targetId": "cid:def456" }
```

**Response**
```json
{ "success": true, "survivingId": "cid:def456" }
```

---

### `DELETE /api/v1/graph/node/:id`
Deletes a node and all its associated edges.

**Response**
```json
{ "success": true }
```

---

## Ingestion Endpoints

### `POST /api/v1/scout/trigger`
Initiates an autonomous ArXiv research cycle. The engine queries ArXiv, extracts concepts from paper abstracts, finds cross-domain bridges, and adds everything to the graph.

**Body** *(all optional)*
```json
{ "seed_query": "non-invasive brain-computer interfaces" }
```

**Response**
```json
{ "success": true, "message": "Scout cycle triggered" }
```

---

### `POST /api/v1/ingest/file`
Uploads a file for ingestion. Accepts PDF, DOCX, TXT, and MD. Maximum size: **50 MB**.

**Content-Type:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file` | File | The document to ingest |

**Response**
```json
{
  "success": true,
  "data": {
    "fileSourceId": "fs:xyz789",
    "nodesAdded": 12,
    "linksAdded": 8,
    "proposalsAdded": 3
  }
}
```

---

### `POST /api/v1/ingest/text`
Ingests raw text content directly.

**Body**
```json
{
  "title": "My Research Notes",
  "content": "Full text content here..."
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "nodesAdded": 7,
    "linksAdded": 4,
    "proposalsAdded": 2
  }
}
```

---

## Synthesis & Activity

### `GET /api/v1/activity`
Returns the last 50 real-time activity log events.

**Response**
```json
{
  "success": true,
  "data": [
    { "timestamp": "2026-07-12T10:23:45Z", "msg": "Scout cycle complete. 14 nodes added.", "type": "SYS" }
  ]
}
```

---

### `POST /api/v1/synthesis/:id/validate`
Submit an expert validation vote for a synthesis proposal.

**Body**
```json
{
  "approve": true,
  "reasoning": "The structural isomorphism between X and Y is well-supported by...",
  "expert_did": "did:kse:expert:0xabc"
}
```

**Response**
```json
{ "success": true, "newTrustScore": 0.91 }
```

---

## AI Configuration

### `GET /api/v1/config`
Returns the current AI provider configuration.

**Response**
```json
{
  "success": true,
  "data": {
    "extractionProvider": "gemini",
    "synthesisProvider": "openrouter",
    "auditProvider": "grok",
    "ollamaEndpoint": "http://localhost:11434",
    "ollamaModel": "llama3.1"
  }
}
```

---

### `POST /api/v1/config`
Saves the AI provider configuration. Changes take effect immediately on the next ingestion or synthesis cycle.

**Body**
```json
{
  "extractionProvider": "ollama",
  "synthesisProvider": "ollama",
  "auditProvider": "grok",
  "ollamaEndpoint": "http://localhost:11434",
  "ollamaModel": "mistral"
}
```

Valid provider values: `"gemini"` · `"openrouter"` · `"grok"` · `"ollama"`

**Response**
```json
{ "success": true }
```

---

### `POST /api/v1/config/test-ollama`
Tests connectivity to an Ollama (or compatible) endpoint and returns available models.

**Body**
```json
{ "endpoint": "http://localhost:11434", "model": "llama3.1" }
```

**Response**
```json
{
  "success": true,
  "models": ["llama3.1", "mistral", "phi3"]
}
```
