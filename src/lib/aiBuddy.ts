export interface AiMessage {
  role: "user" | "assistant"
  content: string
}

export async function askAi(messages: AiMessage[], lang: "tl" | "en") {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, lang }),
  })

  const data = await response.json().catch(() => null) as {
    reply?: string
    error?: string
  } | null

  if (!response.ok) {
    throw new Error(data?.error || (lang === "tl"
      ? "Hindi makausap ang AI sa ngayon."
      : "The AI is unavailable right now."))
  }
  if (!data?.reply) {
    throw new Error(lang === "tl"
      ? "Walang sagot na natanggap mula sa AI."
      : "No response was received from the AI.")
  }

  return data.reply
}

/** Removes the API key used by older builds that stored it in browser storage. */
export function clearLegacyAiConfig() {
  try {
    localStorage.removeItem("pamana-ai-config-v1")
  } catch (error) {
    console.warn("Could not remove the legacy AI key from local storage.", error)
  }
}
