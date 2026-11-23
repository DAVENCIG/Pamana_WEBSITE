import { afterEach, describe, expect, it, vi } from "vitest"
import { onRequestPost } from "./chat"

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("AI chat endpoint", () => {
  it("reports when the server-side API key is not configured", async () => {
    const response = await onRequestPost({
      request: new Request("https://pamana.example/api/chat", {
        method: "POST",
        body: JSON.stringify({ lang: "en", messages: [{ role: "user", content: "Hi" }] }),
      }),
      env: {},
    })

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: "The AI service has not been configured yet.",
    })
  })

  it("rejects cross-origin calls before contacting the provider", async () => {
    const fetch = vi.fn()
    vi.stubGlobal("fetch", fetch)
    const response = await onRequestPost({
      request: new Request("https://pamana.example/api/chat", {
        method: "POST",
        headers: { Origin: "https://attacker.example" },
        body: JSON.stringify({ lang: "en", messages: [{ role: "user", content: "Hi" }] }),
      }),
      env: { OPENAI_API_KEY: "server-secret" },
    })

    expect(response.status).toBe(403)
    expect(fetch).not.toHaveBeenCalled()
  })

  it("uses the server key upstream and returns only the generated reply", async () => {
    const fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        choices: [{ message: { content: "Hello, learner!" } }],
      })),
    )
    vi.stubGlobal("fetch", fetch)
    const response = await onRequestPost({
      request: new Request("https://pamana.example/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: "en", messages: [{ role: "user", content: "Hi" }] }),
      }),
      env: { OPENAI_API_KEY: "server-secret" },
    })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ reply: "Hello, learner!" })
    expect(fetch).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer server-secret" }),
      }),
    )
  })
})
