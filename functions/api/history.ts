interface Env {
  CHAT_DB?: D1Database;
  ADMIN_PASSCODE?: string;
}

type PagesFunction<Environment = Record<string, unknown>> = (context: {
  env: Environment;
  request: Request;
}) => Response | Promise<Response>;

interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
}

interface D1PreparedStatement {
  bind: (...values: unknown[]) => D1PreparedStatement;
  all: <T = unknown>() => Promise<{ results: T[] }>;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Passcode',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  if (!env.CHAT_DB) {
    return jsonResponse({ error: 'CHAT_DB binding is missing.' }, 500);
  }

  const expectedPasscode = env.ADMIN_PASSCODE || '0000';
  const passcode = request.headers.get('x-admin-passcode') || '';

  if (passcode !== expectedPasscode) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 100, 1), 300);

  const result = await env.CHAT_DB.prepare(
    `SELECT
      id,
      created_at,
      user_name,
      question,
      answer,
      ip_address,
      country,
      city,
      latitude,
      longitude,
      user_agent
    FROM chat_logs
    ORDER BY created_at DESC
    LIMIT ?`
  )
    .bind(limit)
    .all();

  return jsonResponse({ logs: result.results });
};
