import { click } from './support/actions'
import { expect, login, noteVisibleProblems, openTab, settle, test } from './support/fixtures'

const AI_PATH = '/api/v1/ai/access-request-summaries'

test.describe('người duyệt chi', () => {
  test('tóm tắt hàng chờ bằng AI: bấm hỏi, chờ kết quả, mở từng yêu cầu', async ({ page, report }) => {
    await login(page, 'spending-approver')

    const sourceResponse = page.waitForResponse((response) => response.url().includes(`${AI_PATH}/source`), {
      timeout: 90_000 // the first visit makes the dev server compile the queue chunk
    })
    await openTab(page, 'Hàng chờ duyệt')
    const source = await sourceResponse
    report.add('note', `GET ai/access-request-summaries/source -> ${source.status()}`)

    const panel = page.getByRole('region', { name: 'Tóm tắt bằng AI' })
    if (!(await panel.isVisible())) {
      // Hidden by design when the feature is off (403 AI.DISABLED / AI.NO_ASSIGNED_STEPS) or the queue is empty.
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
      // The invocation is polled every 2 s while PENDING/RUNNING. A cold model start can take a while.
      await expect(panel.getByText('Đang tóm tắt, vui lòng đợi…')).toBeHidden({ timeout: 150_000 })
    }

    const outcome = await panel.innerText()
    report.add('note', `Kết quả hiển thị: ${outcome.replace(/\s+/g, ' ').slice(0, 300)}`)
    await noteVisibleProblems(page, report, 'AI summary')
    expect(outcome, 'the panel never stays on the spinner text').not.toContain('Đang tóm tắt')

    const openButtons = panel.getByRole('button', { name: 'Mở' })
    if (await openButtons.count()) {
      await click(openButtons.first(), 'Mở yêu cầu đầu tiên trong bản tóm tắt')
      await settle(page)
      await expect(page).toHaveURL(/tab=request/)
    }
  })

  test('mở hàng chờ, chuyển sang đợt đề nghị chi và quay lại', async ({ page, report }) => {
    await login(page, 'spending-approver')
    await openTab(page, 'Hàng chờ duyệt')
    await noteVisibleProblems(page, report, 'Hàng chờ duyệt')
    await click(page.getByRole('button', { name: /Đợt/ }).first(), 'Chuyển sang danh sách đợt')
    await settle(page)
    await noteVisibleProblems(page, report, 'Danh sách đợt')
  })
})

test('người duyệt chi: mở chi tiết yêu cầu đầu tiên trong hàng chờ rồi quay lại', async ({ page, report }) => {
  await login(page, 'spending-approver')
  await openTab(page, 'Hàng chờ duyệt')
  const rows = page.getByRole('button', { name: 'Xem chi tiết' })
  if (!(await rows.count())) {
    report.add('note', 'Hàng chờ trống: không có yêu cầu để mở')
    return
  }
  await click(rows.first(), 'Xem chi tiết yêu cầu đầu tiên')
  await settle(page)
  await expect(page).toHaveURL(/tab=request/)
  await noteVisibleProblems(page, report, 'Chi tiết yêu cầu chờ duyệt chi')
  // Approve / reject / return are not clicked: they change the shared backend.
})
