interface Env {
  AI?: {
    run(
      model: string,
      input: {
        messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
        max_tokens: number
        temperature: number
      },
    ): Promise<unknown>
  }
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const MODEL = "@cf/openai/gpt-oss-20b"
const MAX_MESSAGES = 12
const MAX_MESSAGE_LENGTH = 2000
const MAX_TOTAL_LENGTH = 8000

export async function onRequestPost({
  request,
  env,
}: {
  request: Request
  env: Env
}) {
  const origin = request.headers.get("Origin")
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: "Request origin is not allowed." }, 403)
  }

  if (!env.AI) {
    return json({ error: "The AI service has not been configured yet." }, 503)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: "Invalid request body." }, 400)
  }

  if (!isChatRequest(body)) {
    return json({ error: "Please send a valid question." }, 400)
  }

  const systemPrompt =
    body.lang === "tl"
      ? "Ikaw ay Kaibigang PAMANA, isang magalang at masayang Filipino Araling Panlipunan tutor para sa mga estudyanteng baitang 7 hanggang 10. Ipaliwanag nang simple, tiyakin ang katumpakan, at hikayatin ang kritikal na pag-iisip. Huwag gumawa ng mga sagot na tiyak na wala sa ibinigay na konteksto; sa halip, ipaliwanag kung ano ang dapat hanapin sa aralin. Gumamit ng Tagalog at Taglish na natural."
      : "You are PAMANA Buddy, a friendly Araling Panlipunan tutor for Filipino students in Grades 7 to 10. Explain simply, stay accurate, and encourage critical thinking. Do not invent specific facts when they are outside the provided context; suggest what to look for in the lesson instead. Respond in clear English."

  let result: unknown
  try {
    result = await env.AI.run(MODEL, {
      messages: [
        { role: "system", content: systemPrompt },
        ...body.messages,
      ],
      max_tokens: 500,
      temperature: 0.5,
    })
  } catch {
    return json({ error: "The AI service could not be reached. Please try again." }, 502)
  }

  if (
    typeof result !== "object" ||
    result === null ||
    !("response" in result) ||
    typeof result.response !== "string"
  ) {
    return json({ error: "The AI service returned an invalid response." }, 502)
  }

  const reply = result.response.trim()
  if (!reply) {
    return json({ error: "The AI service returned an empty response." }, 502)
  }

  return json({ reply }, 200)
}

function isChatRequest(value: unknown): value is { lang: "tl" | "en"; messages: ChatMessage[] } {
  if (!value || typeof value !== "object") return false
  const body = value as { lang?: unknown; messages?: unknown }
  if ((body.lang !== "tl" && body.lang !== "en") || !Array.isArray(body.messages)) {
    return false
  }
  if (body.messages.length < 1 || body.messages.length > MAX_MESSAGES) return false

  let totalLength = 0
  for (const message of body.messages) {
    if (!message || typeof message !== "object") return false
    const item = message as { role?: unknown; content?: unknown }
    if (
      (item.role !== "user" && item.role !== "assistant") ||
      typeof item.content !== "string" ||
      !item.content.trim() ||
      item.content.length > MAX_MESSAGE_LENGTH
    ) {
      return false
    }
    totalLength += item.content.length
  }

  return totalLength <= MAX_TOTAL_LENGTH &&
    body.messages[body.messages.length - 1]?.role === "user"
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}
