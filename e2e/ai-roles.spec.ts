import type { Page } from '@playwright/test'
import { click } from './support/actions'
import { expect, login, noteVisibleProblems, openTab, settle, test } from './support/fixtures'

const AI_SOURCE_PATH = '/api/v1/ai/access-request-summaries/source'
const AI_CREATE_PATH = '/api/v1/ai/access-request-summaries'

async function dismissPendingPolicies(page: Page) {
  const gateTitle = page.getByRole('heading', { name: 'Xác nhận đã đọc chính sách' })
  while (await gateTitle.isVisible({ timeout: 2500 }).catch(() => false)) {
    const checkbox = page.getByRole('checkbox', { name: /Tôi đã đọc và hiểu/i })
    await checkbox.waitFor({ state: 'visible', timeout: 30_000 })
    await click(checkbox, 'Đánh dấu đã đọc chính sách')
    const confirmButton = page.getByRole('button', { name: 'Tôi đã đọc và hiểu' })
    await click(confirmButton, 'Xác nhận chính sách')
    await page.waitForTimeout(1000)
  }
}

test.describe('Khảo sát và kiểm chứng tính năng AI theo từng Role', () => {
  test('1. Super Admin: Quản trị và kiểm soát tham số vận hành AI', async ({ page, report }) => {
    await login(page, 'super-admin')
    await dismissPendingPolicies(page)
    await openTab(page, /Tham số|Vận hành/i)
    await expect(page.getByText('Đang khởi tạo SaaS-Sentry…')).toBeHidden({ timeout: 60_000 })
    await settle(page)
    await noteVisibleProblems(page, report, 'Super Admin - Tham số vận hành')

    // Xác nhận nhóm tham số Trợ lý AI hiện diện
    const aiSection = page
      .locator('section')
      .filter({ hasText: /Trợ lý AI/i })
      .first()
    await expect(aiSection).toBeVisible()

    // Xác nhận 3 tham số cốt lõi được định nghĩa trong BE và hiển thị trên UI
    const aiEnabled = aiSection.getByText(/Công tắc tổng của các tính năng AI/i)
    const aiSummary = aiSection.getByText(/Tóm tắt hàng chờ duyệt bằng AI/i)
    const aiProvider = aiSection.getByText(/Nguồn trả lời của AI/i)

    await expect(aiEnabled).toBeVisible()
    await expect(aiSummary).toBeVisible()
    await expect(aiProvider).toBeVisible()

    const sectionText = await aiSection.innerText()
    report.add('note', `Super Admin AI parameters: ${sectionText.replace(/\s+/g, ' ').slice(0, 300)}`)
  })

  test('2. Spending Approver: Tóm tắt hàng chờ duyệt chi bằng AI (US-15-05)', async ({ page, report }) => {
    await login(page, 'spending-approver')
    await dismissPendingPolicies(page)

    const sourcePromise = page.waitForResponse((r) => r.url().includes(AI_SOURCE_PATH), { timeout: 60_000 })
    await openTab(page, /Hàng chờ duyệt/i)
    const sourceResponse = await sourcePromise
    expect(sourceResponse.status()).toBe(200)
    const sourceBody = await sourceResponse.json()
    report.add('note', `Spending Approver source: ${JSON.stringify(sourceBody.data)}`)

    const panel = page.getByRole('region', { name: 'Tóm tắt bằng AI' })
    if (await panel.isVisible()) {
      const createPromise = page.waitForResponse(
        (r) => r.url().endsWith(AI_CREATE_PATH) && r.request().method() === 'POST'
      )
      await click(panel.getByRole('button', { name: /Tóm tắt \d+ yêu cầu|Tóm tắt lại/ }), 'Bấm tóm tắt')
      const createResponse = await createPromise
      expect(createResponse.status()).toBe(202)

      // Chờ model hoặc giả lập hoàn tất
      await expect(panel.getByText('Đang tóm tắt, vui lòng đợi…')).toBeHidden({ timeout: 150_000 })
      const outcome = await panel.innerText()
      report.add('note', `Spending Approver AI result: ${outcome.replace(/\s+/g, ' ').slice(0, 300)}`)
    }
  })

  test('3. Manager: Tóm tắt hàng chờ duyệt nhu cầu (US-15-05)', async ({ page, report }) => {
    await login(page, 'manager')
    await dismissPendingPolicies(page)

    const sourcePromise = page.waitForResponse((r) => r.url().includes(AI_SOURCE_PATH), { timeout: 60_000 })
    await openTab(page, /Duyệt nhu cầu/i)
    const sourceResponse = await sourcePromise
    expect(sourceResponse.status()).toBe(200)
    const sourceBody = await sourceResponse.json()
    report.add('note', `Manager source: ${JSON.stringify(sourceBody.data)}`)

    // Nếu có yêu cầu chờ (stepCount > 0), panel xuất hiện
    const panel = page.getByRole('region', { name: 'Tóm tắt bằng AI' })
    const stepCount: number = sourceBody.data?.stepCount ?? 0
    if (stepCount > 0) {
      await expect(panel).toBeVisible()
      const createPromise = page.waitForResponse(
        (r) => r.url().endsWith(AI_CREATE_PATH) && r.request().method() === 'POST'
      )
      await click(panel.getByRole('button', { name: /Tóm tắt \d+ yêu cầu|Tóm tắt lại/ }), 'Bấm tóm tắt')
      expect((await createPromise).status()).toBe(202)
      // Wait for an answer, not for the running note: it may not have rendered yet when the 202 arrives.
      await expect(panel.getByRole('button', { name: 'Tóm tắt lại' })).toBeEnabled({ timeout: 150_000 })
      // The backend drops lines that fail its checks, so a completed summary has at most one line per step.
      const lines = panel.getByRole('listitem')
      await expect(lines.first()).toBeVisible()
      const lineCount = await lines.count()
      expect(lineCount).toBeLessThanOrEqual(stepCount)
      report.add('note', `Manager AI lines: ${lineCount}/${stepCount}`)
      const outcome = await panel.innerText()
      report.add('note', `Manager AI result: ${outcome.replace(/\s+/g, ' ').slice(0, 600)}`)
    } else {
      await expect(panel).toBeHidden()
      report.add('note', 'Manager hàng chờ rỗng -> Khối AI ẩn đúng thiết kế')
    }
  })

  test('4. Finance: Kiểm chứng hiện trạng AI đối với vai Tài chính', async ({ page, report }) => {
    await login(page, 'finance')
    await dismissPendingPolicies(page)
    await settle(page)
    await noteVisibleProblems(page, report, 'Finance - Dashboard')

    // Finance gọi source API qua proxy /backend để kiểm tra hàng chờ Access Request
    const API_BASE = '/backend/api/v1'
    // The session keeps its tokens in localStorage, not in a cookie: send the access token like the app does.
    const sourceResult = await page.evaluate(async (url) => {
      try {
        const tokens = JSON.parse(localStorage.getItem('saas-sentry.auth-tokens') ?? '{}') as { accessToken?: string }
        const res = await fetch(url, { headers: { authorization: `Bearer ${tokens.accessToken ?? ''}` } })
        const data = (await res.json()) as { data?: { stepCount?: number } }
        return { status: res.status, data: data.data }
      } catch (err) {
        return { error: String(err) }
      }
    }, `${API_BASE}/ai/access-request-summaries/source`)

    report.add('note', `Finance gọi ${AI_SOURCE_PATH}: ${JSON.stringify(sourceResult)}`)
    // Finance không phải người duyệt Access Request nên stepCount = 0
    expect(sourceResult).toMatchObject({ status: 200 })
    expect('data' in sourceResult ? (sourceResult.data?.stepCount ?? 0) : -1).toBe(0)

    // Kiểm chứng BE deploy chưa có route US-15-06 (báo cáo chi phí AI qua /backend)
    const costReportAiCheck = await page.evaluate(async (base) => {
      const tokens = JSON.parse(localStorage.getItem('saas-sentry.auth-tokens') ?? '{}') as { accessToken?: string }
      const headers = { authorization: `Bearer ${tokens.accessToken ?? ''}` }
      const endpoints = [`${base}/ai/cost-reports`, `${base}/ai/cost-report-summaries`, `${base}/cost-reports/draft`]
      const results: Record<string, number> = {}
      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, { headers })
          results[endpoint] = res.status
        } catch {
          results[endpoint] = 0
        }
      }
      return results
    }, API_BASE)

    report.add('note', `Kiểm tra endpoint AI Finance: ${JSON.stringify(costReportAiCheck)}`)
    // Xác nhận cả 3 endpoint trên đều trả về 404 (chưa có trên BE production)
    expect(Object.values(costReportAiCheck).every((status) => status === 404 || status === 0)).toBe(true)
  })
})
