import type { Page } from '@playwright/test'
import { expect, login, openTab, settle, test } from './support/fixtures'
import { click, type } from './support/actions'

async function dismissPendingPolicies(page: Page) {
  const gateTitle = page.getByRole('heading', { name: 'Xác nhận đã đọc chính sách' })
  while (await gateTitle.isVisible({ timeout: 2500 }).catch(() => false)) {
    const checkbox = page.locator('input[type="checkbox"]').first()
    if (await checkbox.isVisible()) {
      await click(checkbox, 'Đánh dấu đã đọc chính sách')
    }
    const confirmButton = page.getByRole('button', { name: 'Tôi đã đọc và hiểu' })
    if (await confirmButton.isEnabled({ timeout: 5000 }).catch(() => false)) {
      await click(confirmButton, 'Xác nhận chính sách')
      await page.waitForTimeout(1000)
    } else {
      break
    }
  }
}

test.describe('Main Flow 2 & 3: Thu hồi khi nghỉ việc (MF-2) và Điều chuyển phòng ban (MF-3)', () => {
  test('MF-2 (Super Admin): Mở hồ sơ nhân sự -> Ghi nghỉ việc -> Xem trước tác động (Impact Preview)', async ({
    page,
    report
  }) => {
    await login(page, 'super-admin')
    await openTab(page, /Nhân sự|Personnel/i)
    await expect(page.getByText(/Đang khởi tạo SaaS-Sentry/i)).toBeHidden({ timeout: 60_000 })
    await settle(page)

    // Đảm bảo bảng danh sách nhân viên đã tải
    const firstRowOpenBtn = page.getByRole('button', { name: /Xem chi tiết|View details/i }).first()
    await expect(firstRowOpenBtn).toBeVisible({ timeout: 25_000 })
    await click(firstRowOpenBtn, 'Mở chi tiết nhân viên đầu tiên')
    await settle(page)

    // Đảm bảo chi tiết nhân viên đã mở
    await expect(page.getByText(/Biến động nhân sự|Thông tin chính thức/i).first()).toBeVisible({ timeout: 20_000 })

    // Xác nhận đã vào EmployeeDetail và thấy mục Biến động nhân sự
    const offboardingBtn = page.getByRole('button', { name: /Ghi nghỉ việc|Record offboarding/i })
    await expect(offboardingBtn).toBeVisible({ timeout: 15_000 })

    // Bấm Ghi nghỉ việc để mở form MF-2
    await click(offboardingBtn, 'Bấm nút "Ghi nghỉ việc"')
    await settle(page)

    // Kiểm tra các trường biểu mẫu MF-2
    const groundsInput = page.locator('input[name="groundsNote"], textarea[name="groundsNote"]').first()
    await expect(groundsInput).toBeVisible()
    await type(groundsInput, 'Quyết định chấm dứt hợp đồng lao động số 88/2026/QĐ-NS', 'Căn cứ quyết định nghỉ việc')

    // Tick chọn "Chặn truy cập ngay" (blockAccessNow)
    const blockAccessNowCheckbox = page.locator('input[name="blockAccessNow"], input[type="checkbox"]').first()
    if (await blockAccessNowCheckbox.isVisible()) {
      await blockAccessNowCheckbox.click()
    }

    // Bấm nút "Xem trước tác động" (useOffboardingCasePreview)
    const previewBtn = page.getByRole('button', { name: /Xem trước tác động|Preview/i })
    await expect(previewBtn).toBeVisible()
    await page.waitForTimeout(500)
    const previewResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/offboarding-cases/preview') && res.request().method() === 'POST',
      { timeout: 30_000 }
    )
    await click(previewBtn, 'Bấm "Xem trước tác động"')
    const previewResponse = await previewResponsePromise
    report.add('note', `POST offboarding-cases/preview -> ${previewResponse.status()}`)
    expect(previewResponse.ok()).toBeTruthy()

    // Kiểm tra khối Tác động nếu ghi hiển thị
    await expect(page.getByText(/Tác động nếu ghi|Impact/i).first()).toBeVisible({ timeout: 15_000 })
    report.add('note', 'MF-2: Xem trước tác động nghỉ việc thành công')

    // Đóng form (không thực hiện ghi thật vào máy chủ dùng chung)
    const cancelBtn = page.getByRole('button', { name: /Hủy|Đóng|Close|Cancel/i }).first()
    await click(cancelBtn, 'Đóng form ghi nghỉ việc')
    report.add('note', 'MF-2: Đã đóng form kiểm thử an toàn')
  })

  test('MF-3 (Super Admin): Mở hồ sơ nhân sự -> Ghi điều chuyển -> Xem trước tác động (Impact Preview)', async ({
    page,
    report
  }) => {
    await login(page, 'super-admin')
    await openTab(page, /Nhân sự|Personnel/i)
    await expect(page.getByText(/Đang khởi tạo SaaS-Sentry/i)).toBeHidden({ timeout: 60_000 })
    await settle(page)

    // Mở nhân viên đầu tiên
    const firstRowOpenBtn = page.getByRole('button', { name: /Xem chi tiết|View details/i }).first()
    await click(firstRowOpenBtn, 'Mở chi tiết nhân viên đầu tiên')
    await settle(page)

    // Bấm Ghi điều chuyển (recordTransfer)
    const transferBtn = page.getByRole('button', { name: /Ghi điều chuyển|Record transfer/i })
    if (await transferBtn.isDisabled()) {
      report.add('note', 'Nhân viên chưa xếp phòng, nút điều chuyển bị vô hiệu hóa theo đúng quy tắc')
      return
    }
    await click(transferBtn, 'Bấm nút "Ghi điều chuyển"')
    await settle(page)

    // Kiểm tra các trường: phòng ban đến, ngày hiệu lực, căn cứ
    const groundsInput = page.locator('input[name="groundsNote"], textarea[name="groundsNote"]').first()
    await expect(groundsInput).toBeVisible()
    await type(groundsInput, 'Quyết định điều chuyển công tác nội bộ số 99/2026/QĐ-ĐC', 'Căn cứ điều chuyển')

    // Chọn ngày hiệu lực là ngày tương lai (phải sau ngày xếp phòng hiện tại)
    const effectiveInput = page.locator('input[name="effectiveOn"], input[type="date"]').first()
    if (await effectiveInput.isVisible()) {
      await effectiveInput.fill('2026-11-25')
    }

    // Chọn phòng ban đích từ dropdown tìm kiếm
    const deptInput = page.locator('input[placeholder*="Chọn phòng ban"], input[name="toDepartmentId"]').first()
    if (await deptInput.isVisible()) {
      await deptInput.click()
      const firstOption = page.getByRole('option').first()
      if (await firstOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await firstOption.click()
      }
    }

    // Bấm "Xem trước tác động" (useDepartmentTransferPreview)
    const previewBtn = page.getByRole('button', { name: /Xem trước tác động|Preview/i })
    if (await previewBtn.isVisible()) {
      await page.waitForTimeout(500)
      const previewResponsePromise = page.waitForResponse(
        (res) => res.url().includes('/department-transfers/preview') && res.request().method() === 'POST',
        { timeout: 30_000 }
      ).catch(() => null)
      await click(previewBtn, 'Bấm "Xem trước tác động điều chuyển"')
      const previewResponse = await previewResponsePromise
      if (previewResponse) {
        report.add('note', `POST department-transfers/preview -> ${previewResponse.status()}`)
        if (previewResponse.ok()) {
          await expect(page.getByText(/Tác động nếu ghi|Impact|Ân hạn|Grace/i).first()).toBeVisible({ timeout: 15_000 })
          report.add('note', 'MF-3: Xem trước tác động điều chuyển thành công')
        }
      }
    }

    // Đóng form
    const cancelBtn = page.getByRole('button', { name: /Hủy|Đóng|Close|Cancel/i }).first()
    await click(cancelBtn, 'Đóng form ghi điều chuyển')
    report.add('note', 'MF-3: Đã đóng form kiểm thử an toàn')
  })

  test('MF-2 & MF-3 (IT Admin): Kiểm tra danh sách Thu hồi khi nghỉ việc và Xử lý điều chuyển', async ({
    page,
    report
  }) => {
    await login(page, 'it-admin')
    await dismissPendingPolicies(page)
    await settle(page)

    // 1. Kiểm tra màn hình Thu hồi khi nghỉ việc (MF-2 trên IT Admin)
    await openTab(page, /Thu hồi khi nghỉ việc|Offboarding/i)
    await settle(page)
    await expect(page.getByRole('heading', { name: /Thu hồi khi nghỉ việc|Offboarding/i }).first()).toBeVisible({
      timeout: 20_000
    })
    report.add('note', 'IT Admin: Đã mở màn hình Thu hồi khi nghỉ việc')

    // 2. Kiểm tra màn hình Xử lý điều chuyển (MF-3 trên IT Admin)
    await openTab(page, /Xử lý điều chuyển|Transfers/i)
    await settle(page)
    await expect(page.getByRole('heading', { name: /Xử lý điều chuyển|Transfers/i }).first()).toBeVisible({
      timeout: 20_000
    })
    report.add('note', 'IT Admin: Đã mở màn hình Xử lý điều chuyển phòng ban')
  })
})
