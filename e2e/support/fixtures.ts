/* eslint-disable react-hooks/rules-of-hooks -- Playwright fixtures call `use`, which is not a React hook. */
import { appendFileSync, mkdirSync } from 'node:fs'
import { test as base, expect, type Page } from '@playwright/test'
import { click, think, type } from './actions'
import { credentialsFor, type E2eRole } from './accounts'
import { installVisibleCursor } from './cursor'

export type FindingKind = 'http-5xx' | 'http-4xx' | 'console-error' | 'page-error' | 'ui-alert' | 'note'

export interface Finding {
  kind: FindingKind
  detail: string
  url: string
}

export interface Report {
  add: (kind: FindingKind, detail: string) => void
  all: () => readonly Finding[]
}

const FINDINGS_FILE = 'test-results/findings.ndjson'
const API_PATH = /\/(backend|api\/v1)\//

async function errorCodeOf(response: { json: () => Promise<unknown> }) {
  try {
    const body = (await response.json()) as { error?: { code?: string } }
    return body?.error?.code ?? ''
  } catch {
    return ''
  }
}

/**
 * `page` here already shows a cursor and records every API 4xx/5xx, console error and uncaught exception. Server
 * errors (5xx) and uncaught exceptions fail the test after it finishes; 4xx responses and alerts are only listed in
 * test-results/findings.md, because many of them are the documented answers of the contract (for example AI.DISABLED).
 */
export const test = base.extend<{ report: Report }>({
  context: async ({ context }, use) => {
    await installVisibleCursor(context)
    await use(context)
  },
  report: async ({ page }, use, testInfo) => {
    const findings: Finding[] = []
    const add = (kind: FindingKind, detail: string) => findings.push({ kind, detail, url: page.url() })

    page.on('console', (message) => {
      if (message.type() === 'error') add('console-error', message.text().slice(0, 300))
    })
    page.on('pageerror', (error) => add('page-error', error.message.slice(0, 300)))
    page.on('response', async (response) => {
      const status = response.status()
      if (status < 400 || !API_PATH.test(response.url())) return
      const code = await errorCodeOf(response)
      const path = new URL(response.url()).pathname.replace(/^\/backend/, '')
      add(status >= 500 ? 'http-5xx' : 'http-4xx', `${response.request().method()} ${path} -> ${status} ${code}`.trim())
    })

    await use({ add, all: () => findings })

    mkdirSync('test-results', { recursive: true })
    for (const finding of findings) {
      appendFileSync(
        FINDINGS_FILE,
        `${JSON.stringify({ test: testInfo.titlePath.slice(1).join(' > '), ...finding })}\n`
      )
    }
    await testInfo.attach('findings.json', { body: JSON.stringify(findings, null, 2), contentType: 'application/json' })
    const blocking = findings.filter((finding) => finding.kind === 'http-5xx' || finding.kind === 'page-error')
    expect(blocking, 'server errors or uncaught exceptions during the flow').toEqual([])
  }
})

export { expect }

/** Signs in through the real login form and waits for the role dashboard. Skips the test when credentials are missing. */
export async function login(page: Page, role: E2eRole) {
  const credentials = credentialsFor(role)
  test.skip(!credentials, `Set the ${role} credentials in .env.e2e (see e2e/README.md)`)
  if (!credentials) return
  await test.step(`login as ${role}`, async () => {
    await page.goto('/login')
    await type(page.locator('#login-email'), credentials.email, 'Email')
    await type(page.locator('#login-password'), credentials.password, 'Mật khẩu')
    await click(page.locator('form button[type="submit"]'), 'Đăng nhập')
    // Fail fast with the toast text when the server rejects the credentials, instead of waiting for the dashboard.
    const rejected = page.locator('[data-sonner-toast][data-type="error"]').first()
    await Promise.race([
      page.waitForURL(new RegExp(`/dashboard/${role}`), { timeout: 60_000 }),
      rejected.waitFor({ timeout: 60_000 }).then(async () => {
        throw new Error(`Đăng nhập ${role} (${credentials.email}) bị từ chối: ${(await rejected.innerText()).trim()}`)
      })
    ])
    await expect(page.locator('#dashboard-sidebar')).toBeVisible()
    await think(page)
  })
}

/** Opens one sidebar entry by its visible label and waits until the page has settled. */
export async function openTab(page: Page, label: string | RegExp) {
  await click(page.locator('#dashboard-sidebar ul button').filter({ hasText: label }).first(), `menu "${label}"`)
  await settle(page)
}

export async function settle(page: Page) {
  await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => undefined) // polling can keep it busy
}

/** Records what the page shows to a user as a problem: alerts and the React Router error screen. */
export async function noteVisibleProblems(page: Page, report: Report, where: string) {
  const crashed = await page.getByText(/Unexpected Application Error|Application Error/i).count()
  if (crashed) report.add('ui-alert', `${where}: màn hình lỗi ứng dụng`)
  const alerts = await page.locator('main [role="alert"]:visible').allInnerTexts()
  for (const text of alerts) report.add('ui-alert', `${where}: ${text.trim().replace(/\s+/g, ' ').slice(0, 200)}`)
}

/** Clicks each visible sidebar entry once, in order, so a broken tab shows up as a finding. Groups expand as they are clicked. */
export async function sweepSidebar(page: Page, report: Report) {
  const visibleButtons = page.locator('#dashboard-sidebar ul button:visible')
  const visited: string[] = []
  const firstLine = async (index: number) =>
    (await visibleButtons.nth(index).innerText()).trim().split('\n')[0]?.trim() ?? ''
  for (let guard = 0; guard < 40; guard += 1) {
    let next = ''
    for (let index = 0, total = await visibleButtons.count(); index < total; index += 1) {
      const label = await firstLine(index)
      if (label && !visited.includes(label)) {
        next = label
        break
      }
    }
    if (!next) break
    visited.push(next)
    await click(page.locator('#dashboard-sidebar ul button:visible', { hasText: next }).first(), `menu "${next}"`)
    await settle(page)
    await expect(page.locator('main')).toBeVisible()
    await noteVisibleProblems(page, report, `menu "${next}"`)
  }
  expect(visited.length, 'sidebar entries').toBeGreaterThan(0)
  return visited
}
