import { Hono } from 'hono';
import { ingestFile } from '../../core/file-ingestion.js';

const ingestRoutes = new Hono();

// POST /api/v1/ingest/file  (multipart/form-data)
ingestRoutes.post('/file', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return c.json({ success: false, error: 'No file provided' }, 400);
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await ingestFile(buffer, file.name, file.type);
  return c.json({ success: true, filename: file.name, ...result });
});

// POST /api/v1/ingest/text  body: { content, title }
ingestRoutes.post('/text', async (c) => {
  const { content, title } = await c.req.json();
  if (!content || !title) return c.json({ success: false, error: 'content and title required' }, 400);
  const buffer = Buffer.from(content, 'utf-8');
  const result = await ingestFile(buffer, title + '.txt', 'text/plain');
  return c.json({ success: true, ...result });
});

export default ingestRoutes;
