import { afterEach, describe, expect, it, vi } from 'vitest'

describe('browser API base URL', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('requires VITE_API_BASE_URL instead of silently choosing a backend', async () => {
    vi.stubEnv('VITE_API_BASE_URL', undefined)
    vi.resetModules()

    await expect(import('./env')).rejects.toThrow('VITE_API_BASE_URL must not be empty')
  })

  it.each([true, false])('uses the configured backend URL with DEV=%s', async (development) => {
    vi.stubEnv('DEV', development)
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com/')
    vi.resetModules()

    const { env } = await import('./env')

    expect(env.API_BASE_URL).toBe('https://api.example.com')
  })
})
