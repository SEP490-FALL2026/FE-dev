import { click } from './support/actions'
import type { Page } from '@playwright/test'
import { expect, login, noteVisibleProblems, openTab, settle, test } from './support/fixtures'

const AI_PATH = '/api/v1/ai/access-request-summaries'

test.describe('trưởng phòng', () => {
  test('dashboard tải được và hiển thị menu', async ({ page, report }) => {
    await login(page, 'manager')
    await settle(page)
    await noteVisibleProblems(page, report, 'Dashboard trưởng phòng')
    await expect(page.locator('#dashboard-sidebar ul button').first()).toBeVisible()
    await expect(page.locator('main').getByRole('heading').first()).toBeVisible()
  })
})

async function dismissPendingPolicies(page: Page) {
  const gateTitle = page.getByRole('heading', { name: 'Xác nhận đã đọc chính sách' })
  while (await gateTitle.isVisible({ timeout: 3000 }).catch(() => false)) {
    const checkbox = page.getByRole('checkbox', { name: /Tôi đã đọc và hiểu/i })
    await checkbox.waitFor({ state: 'visible', timeout: 30_000 })
    await click(checkbox, 'Đánh dấu đã đọc chính sách')
    const confirmButton = page.getByRole('button', { name: 'Tôi đã đọc và hiểu' })
    await click(confirmButton, 'Xác nhận chính sách')
    await page.waitForTimeout(1000)
  }
}

test.describe('trưởng phòng - tóm tắt AI', () => {
  test('tóm tắt hàng chờ duyệt nhu cầu bằng AI: bấm hỏi, chờ kết quả, mở từng yêu cầu', async ({ page, report }) => {
    await login(page, 'manager')
    await dismissPendingPolicies(page)

    const sourceResponse = page.waitForResponse((response) => response.url().includes(`${AI_PATH}/source`), {
      timeout: 90_000
    })
    await openTab(page, /Duyệt nhu cầu|Yêu cầu/i)
    const source = await sourceResponse
    report.add('note', `GET ai/access-request-summaries/source -> ${source.status()}`)

    const panel = page.getByRole('region', { name: 'Tóm tắt bằng AI' })
    if (!(await panel.isVisible())) {
      report.add('note', `Khối "Tóm tắt bằng AI" ẩn (source ${source.status()}): không có gì để hỏi`)
      test.info().annotations.push({ type: 'ai', description: `panel hidden, source ${source.status()}` })
      return
    }

    const created = page.waitForResponse(
      (response) => response.url().endsWith(AI_PATH) && response.request().method() === 'POST'
    )
    await click(panel.getByRole('button', { name: /Tóm tắt \d+ yêu cầu|Tóm tắt lại/ }), 'Tóm tắt N yêu cầu')
    const createResponse = await created
    report.add('note', `POST ai/access-request-summaries -> ${createResponse.status()}`)

    if (createResponse.ok()) {
      await expect(panel.getByText('Đang tóm tắt, vui lòng đợi…')).toBeHidden({ timeout: 150_000 })
    }

    const outcome = await panel.innerText()
    report.add('note', `Kết quả hiển thị: ${outcome.replace(/\s+/g, ' ').slice(0, 300)}`)
    await noteVisibleProblems(page, report, 'AI summary manager')
    expect(outcome, 'the panel never stays on the spinner text').not.toContain('Đang tóm tắt')

    const openButtons = panel.getByRole('button', { name: 'Mở' })
    if (await openButtons.count()) {
      await click(openButtons.first(), 'Mở yêu cầu đầu tiên trong bản tóm tắt')
      await settle(page)
      await expect(page).toHaveURL(/tab=request-approval/)
    }
  })
})
