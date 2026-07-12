import { Hono } from 'hono';
import { getAIConfig, saveAIConfig } from '../../core/config-store.js';
import { testOllamaConnection } from '../../core/ollama.js';

const configRoutes = new Hono();

// GET /api/v1/config
configRoutes.get('/', (c) => c.json({ success: true, data: getAIConfig() }));

// POST /api/v1/config
configRoutes.post('/', async (c) => {
  const body = await c.req.json();
  saveAIConfig({ ...getAIConfig(), ...body });
  return c.json({ success: true });
});

// POST /api/v1/config/test-ollama
configRoutes.post('/test-ollama', async (c) => {
  const { endpoint } = await c.req.json().catch(() => ({}));
  const config = getAIConfig();
  const result = await testOllamaConnection(endpoint || config.ollamaEndpoint);
  return c.json({ success: true, data: result });
});

export default configRoutes;
