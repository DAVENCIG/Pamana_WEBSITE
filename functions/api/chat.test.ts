import { describe, expect, it, vi } from "vitest"
import { onRequestPost } from "./chat"

describe("AI chat endpoint", () => {
  it("reports when the Workers AI binding is not configured", async () => {
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
    const run = vi.fn()
    const response = await onRequestPost({
      request: new Request("https://pamana.example/api/chat", {
        method: "POST",
        headers: { Origin: "https://attacker.example" },
        body: JSON.stringify({ lang: "en", messages: [{ role: "user", content: "Hi" }] }),
      }),
      env: { AI: { run } },
    })

    expect(response.status).toBe(403)
    expect(run).not.toHaveBeenCalled()
  })

  it("calls Workers AI and returns only the generated reply", async () => {
    const run = vi.fn().mockResolvedValue({ response: "Hello, learner!" })
    const response = await onRequestPost({
      request: new Request("https://pamana.example/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: "en", messages: [{ role: "user", content: "Hi" }] }),
      }),
      env: { AI: { run } },
    })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ reply: "Hello, learner!" })
    expect(run).toHaveBeenCalledWith(
      "@cf/openai/gpt-oss-20b",
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({ role: "system" }),
          { role: "user", content: "Hi" },
        ]),
        max_tokens: 500,
        temperature: 0.5,
      }),
    )
  })

  it("returns a generic error when Workers AI fails", async () => {
    const run = vi.fn().mockRejectedValue(new Error("provider details"))
    const response = await onRequestPost({
      request: new Request("https://pamana.example/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: "en", messages: [{ role: "user", content: "Hi" }] }),
      }),
      env: { AI: { run } },
    })

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      error: "The AI service could not be reached. Please try again.",
    })
  })
})
