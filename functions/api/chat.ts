interface Env {
  OPENAI_API_KEY: string;
}

type PagesFunction<Environment = Record<string, unknown>> = (context: {
  env: Environment;
  request: Request;
}) => Response | Promise<Response>;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const systemPrompt = `You are a concise portfolio assistant for Nontawat MaTong.

Use this context when answering:
- Role: Web Programmer.
- Background: Computer Engineering graduate with software engineering, database, and system design foundations.
- Experience: Works at IT-CAT Co., Ltd. in Chiang Mai, Thailand.
- Work: Develops and maintains enterprise web applications with ASP.NET and ASP.NET Core.
- Backend: C#, REST API.
- Frontend: React (basic to intermediate).
- Database: SQL Server, PostgreSQL, stored procedures, query optimization.
- Interests: AI, business, maintainable systems, calm environments, nature, mountains, music.
- Contact email: james.60912@gmail.com.
- GitHub: https://github.com/Terminal-cmd99.
- Instagram: https://www.instagram.com/terminal.bat/.
- Facebook exists but is password-protected on the site.

Behavior rules:
- Answer in the same language as the user when possible.
- Keep responses helpful, friendly, and short.
- If the user asks something not present in context, say you are not sure instead of inventing details.
- Focus on portfolio, skills, experience, interests, and contact topics.`;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

function extractText(output: unknown): string {
  if (typeof output === 'string' && output.trim()) {
    return output.trim();
  }

  if (!Array.isArray(output)) {
    return '';
  }

  const texts: string[] = [];

  for (const item of output) {
    if (!item || typeof item !== 'object' || !('content' in item)) {
      continue;
    }

    const content = item.content;
    if (!Array.isArray(content)) {
      continue;
    }

    for (const part of content) {
      if (!part || typeof part !== 'object') {
        continue;
      }

      if ('text' in part && typeof part.text === 'string') {
        texts.push(part.text);
      }
    }
  }

  return texts.join('\n').trim();
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!env.OPENAI_API_KEY) {
    return jsonResponse({ error: 'Missing OPENAI_API_KEY secret.' }, 500);
  }

  let payload: { messages?: ChatMessage[] };

  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }

  const messages = Array.isArray(payload.messages)
    ? payload.messages
        .filter(
          (message): message is ChatMessage =>
            !!message &&
            (message.role === 'user' || message.role === 'assistant') &&
            typeof message.content === 'string' &&
            message.content.trim().length > 0
        )
        .slice(-12)
    : [];

  if (messages.length === 0) {
    return jsonResponse({ error: 'At least one message is required.' }, 400);
  }

  const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-5.4-nano',
      max_output_tokens: 250,
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: systemPrompt }],
        },
        ...messages.map((message) => ({
          role: message.role,
          content: [
            {
              type: message.role === 'assistant' ? 'output_text' : 'input_text',
              text: message.content.slice(0, 800),
            },
          ],
        })),
      ],
    }),
  });

  if (!openAIResponse.ok) {
    const errorText = await openAIResponse.text();
    return jsonResponse({ error: `OpenAI request failed: ${errorText}` }, 502);
  }

  const result = (await openAIResponse.json()) as {
    output_text?: string;
    output?: unknown;
  };

  const reply = result.output_text?.trim() || extractText(result.output);

  if (!reply) {
    return jsonResponse({ error: 'Model returned an empty response.' }, 502);
  }

  return jsonResponse({ reply });
};
