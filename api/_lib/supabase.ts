import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable.');
}

if (!supabaseSecretKey) {
  throw new Error('Missing SUPABASE_SECRET_KEY environment variable.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export function json(
  body: unknown,
  status = 200
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    }
  );
}

export function getAdminKey(request: Request) {
  const headerKey = request.headers.get('x-admin-key');

  if (headerKey) {
    return headerKey;
  }

  return '';
}

export function requireAdmin(request: Request) {
  const configuredKey = process.env.AURELLE_ADMIN_KEY;

  if (!configuredKey) {
    throw new Error(
      'Missing AURELLE_ADMIN_KEY environment variable.'
    );
  }

  const suppliedKey = getAdminKey(request);

  if (!suppliedKey || suppliedKey !== configuredKey) {
    return false;
  }

  return true;
}
