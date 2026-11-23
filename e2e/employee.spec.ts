import { click, type } from './support/actions'
import { expect, login, noteVisibleProblems, openTab, settle, test } from './support/fixtures'

const REQUEST_TYPES = [
  'Cấp quyền theo nhóm',
  'Đề xuất phần mềm mới',
  'Gia hạn quyền',
  'Hoàn trả quyền',
  'Cấp quyền cá nhân'
]

test.describe('nhân viên', () => {
  test('quyền sử dụng và yêu cầu của tôi hiển thị danh sách hoặc trạng thái rỗng', async ({ page, report }) => {
    await login(page, 'employee')
    await openTab(page, 'Quyền sử dụng')
    await noteVisibleProblems(page, report, 'Quyền sử dụng')
    await openTab(page, 'Yêu cầu của tôi')
    await noteVisibleProblems(page, report, 'Yêu cầu của tôi')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('tạo yêu cầu cá nhân: chọn phần mềm, gói, nhập lý do rồi xem trước (không gửi)', async ({ page, report }) => {
    await login(page, 'employee')
    await openTab(page, 'Tạo yêu cầu')
    await expect(page.getByRole('heading', { name: 'Cấp quyền cá nhân', level: 2 })).toBeVisible()

    await click(page.getByRole('button', { name: 'Toàn bộ danh mục' }), 'Nguồn: Toàn bộ danh mục')
    await settle(page)
    await click(page.getByRole('combobox', { name: /^Phần mềm/ }), 'Ô chọn Phần mềm')
    const software = page.getByRole('option').first()
    await expect(software, 'danh mục phần mềm có ít nhất một mục').toBeVisible({ timeout: 20_000 })
    report.add('note', `Chọn phần mềm: ${(await software.innerText()).trim().split('\n')[0]}`)
    await click(software, 'Chọn phần mềm đầu tiên')
    await settle(page)

    await click(page.getByRole('combobox', { name: /^Gói phần mềm/ }), 'Ô chọn Gói phần mềm')
    const plan = page.getByRole('option').first()
    await expect(plan, 'phần mềm đã chọn có ít nhất một gói').toBeVisible({ timeout: 20_000 })
    await click(plan, 'Chọn gói đầu tiên')
    await settle(page)

    await type(
      page.getByRole('textbox', { name: 'Lý do nghiệp vụ' }),
      'Kiểm thử tự động: cần phần mềm cho dự án quý này',
      'Lý do nghiệp vụ'
    )

    const preview = page.getByRole('button', { name: 'Xem trước' })
    await expect(preview).toBeEnabled()
    await click(preview, 'Xem trước')
    await settle(page)
    await noteVisibleProblems(page, report, 'Xem trước yêu cầu')
    // Stops here on purpose: sending or saving a draft writes to the shared backend.
  })

  test('mỗi loại yêu cầu mở được form riêng', async ({ page, report }) => {
    await login(page, 'employee')
    await openTab(page, 'Tạo yêu cầu')
    for (const kind of REQUEST_TYPES) {
      await click(page.getByRole('button', { name: kind, exact: true }), `Loại yêu cầu: ${kind}`)
      await settle(page)
      await expect(page.getByRole('heading', { name: kind, level: 2 })).toBeVisible()
      await noteVisibleProblems(page, report, `Form "${kind}"`)
    }
  })
})
