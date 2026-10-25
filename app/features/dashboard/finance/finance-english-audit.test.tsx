import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { FINANCE_TAB_KEYS } from './finance-nav'

afterEach(async () => setAppLanguage('vi', false))

it('audits visible Finance text in English', async () => {
  await setAppLanguage('en', false)
  const findings: Record<string, string[]> = {}
  const people = [
    'Lê Hoàng Anh', 'Lê Thu Hà', 'Đặng Thanh Hà', 'Trịnh Quốc Bảo', 'Hoàng Gia Linh',
    'Nguyễn Minh Khôi', 'Võ Thanh Nhàn', 'Phan Minh Quân', 'Trần Vũ Bảo',
    'Lý Thu Trang', 'Phạm Hoàng Nam', 'Ngọc Lan'
  ]
  for (const tab of FINANCE_TAB_KEYS) {
    const { container, unmount } = render(
      <MemoryRouter initialEntries={[`/?tab=${tab}`]}>
        <AppProviders>
          <DashboardPage role='finance' />
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
