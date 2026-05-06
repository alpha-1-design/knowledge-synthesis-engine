import { Context, Next } from 'hono';

/**
 * Enterprise Security Middleware
 * Protects endpoints from unauthorized access using an API Key.
 */
export const authMiddleware = async (c: Context, next: Next) => {
  const apiKey = c.req.header('X-API-KEY');
  const serverKey = process.env.ADMIN_API_KEY;

  if (!serverKey) {
    console.warn('⚠️ SECURITY WARNING: No ADMIN_API_KEY set. Server is running in UNPROTECTED mode.');
    await next();
    return;
  }

  if (apiKey !== serverKey) {
    return c.json({
      success: false,
      error: 'Unauthorized: Invalid or missing API Key',
    }, 401);
  }

  await next();
};
