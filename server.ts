import 'dotenv/config';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Hono } from 'hono';
import synthesisRoutes from './src/api/routes/synthesis';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

// --- Intelligence Feed Buffer ---
const activityBuffer: any[] = [];
const addActivity = (msg: string, type: 'info' | 'warn' | 'ai' = 'info') => {
  activityBuffer.unshift({ id: Date.now(), msg, type, timestamp: new Date().toISOString() });
  if (activityBuffer.length > 50) activityBuffer.pop();
};

app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
}));

import { authMiddleware } from './src/api/middleware/auth';

// 1. Serve Static Frontend
app.use('/assets/*', serveStatic({ root: './dist/frontend' }));
app.get('/favicon.ico', serveStatic({ path: './dist/frontend/favicon.ico' }));

// 2. Apply security to research routes
app.use('/api/*', authMiddleware);

app.get('/api/v1/activity', (c) => c.json({
  success: true,
  data: activityBuffer,
}));

// 3. Health Check
app.get('/health', (c) => c.json({
  status: 'healthy',
  service: 'Knowledge Synthesis Engine',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
}));

// 4. Serve the UI as the main entry point
app.get('/', serveStatic({ path: './dist/frontend/index.html' }));

import { scout } from './src/core/scout';

app.post('/api/v1/scout/trigger', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const seedQuery = body.seed_query;
  
  addActivity(`Scout cycle initiated: ${seedQuery || 'Global Discovery'}`, 'ai');
  
  // Trigger the scout cycle in the background
  scout.runScoutCycle(seedQuery, (update: string) => addActivity(update, 'ai'));
  
  return c.json({
    success: true,
    message: seedQuery 
      ? `Autonomous Scout cycle triggered with focus: ${seedQuery}`
      : 'Autonomous Scout cycle triggered in background.',
    timestamp: new Date().toISOString(),
  });
});

app.route('/api/v1/synthesis', synthesisRoutes);

app.notFound((c) => c.json({
  success: false,
  error: 'Endpoint not found',
}, 404));

app.onError((c, err) => {
  console.error('Server error:', err);
  return c.json({
    success: false,
    error: err.message || 'Internal server error',
  }, 500);
});

const port = parseInt(process.env.PORT || '3000');

console.log(`🚀 Knowledge Synthesis Engine starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`✅ Server running at http://localhost:${port}`);
console.log(`   Health: http://localhost:${port}/health`);
