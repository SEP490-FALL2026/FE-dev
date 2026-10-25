import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { IT_ADMIN_TAB_KEYS } from './it-admin-nav'

afterEach(async () => setAppLanguage('vi', false))

it('audits visible IT Admin text in English', async () => {
  await setAppLanguage('en', false)
  const findings: Record<string, string[]> = {}
  const people = [
    'Trần Văn Hùng', 'Lê Thị Mai', 'Phạm Thị Lan', 'Lê Minh Tuấn', 'Đặng Hoàng Nam',
    'Bùi Anh Quân', 'Trần Đình Trọng', 'Nguyễn Minh An', 'Vũ Thị Lan',
    'Nguyễn Văn Hoàng', 'Hoàng Yến Nhi', 'Đỗ Nam Trung', 'Lưu Quang Khải',
    'Đỗ Tuấn Kiệt', 'Phan Minh Đức'
  ]
  for (const tab of IT_ADMIN_TAB_KEYS) {
    const { container, unmount } = render(
      <MemoryRouter initialEntries={[`/?tab=${tab}`]}>
        <AppProviders>
          <DashboardPage role='it-admin' />
        </AppProviders>
      </MemoryRouter>
    )
    const text = [...container.querySelectorAll('main *')]
      .filter((node) => node.children.length === 0)
      .map((node) => node.textContent?.trim())
      .filter((value) => {
        const withoutNames = people.reduce((text, name) => text.replaceAll(name, ''), value || '')
        return /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/iu.test(withoutNames)
      })
    if (text.length) findings[tab] = [...new Set(text)] as string[]
    unmount()
  }
  expect(findings).toEqual({})
})
