import { click, type } from './support/actions'
import { expect, login, test } from './support/fixtures'

test.describe('đăng nhập và phân quyền', () => {
  test('sai mật khẩu hiện thông báo lỗi và không vào dashboard', async ({ page }) => {
    await page.goto('/login')
    await type(page.locator('#login-email'), 'cuong.le@saoviet.example', 'Email')
    await type(page.locator('#login-password'), 'Sai-mat-khau-1!', 'Mật khẩu')
    await click(page.locator('form button[type="submit"]'), 'Đăng nhập')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.locator('[data-sonner-toast], [role="alert"]').first()).toBeVisible({ timeout: 15_000 })
  })

  test('employee gõ URL của finance thì bị chặn 403', async ({ page }) => {
    await login(page, 'employee')
    await page.goto('/dashboard/finance')
    await expect(page).toHaveURL(/\/dashboard\/finance|\/forbidden/)
    await expect(page.locator('#dashboard-sidebar')).toHaveCount(0)
    await expect(page.getByText(/403|không có quyền|Forbidden/i).first()).toBeVisible()
  })

  test('đăng xuất đưa về trang đăng nhập', async ({ page }) => {
    await login(page, 'manager')
    await page.goto('/logout')
    await expect(page).toHaveURL(/\/login|\/$/, { timeout: 20_000 })
    await page.goto('/dashboard/manager')
    await expect(page).toHaveURL(/\/login/)
  })
})
