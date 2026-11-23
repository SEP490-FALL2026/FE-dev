import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'
import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { DashboardPage } from '../dashboard-page'
import { IT_ADMIN_TAB_KEYS } from './it-admin-nav'
const server = setupServer(
  http.get('*/api/v1/*', () => HttpResponse.json({ error: { code: 'AUTHORIZATION.FORBIDDEN' } }, { status: 403 }))
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(async () => {
  await setAppLanguage('vi', false)
})
it('translates every IT Admin screen including unavailable and forbidden states', async () => {
  await setAppLanguage('en', false)
  for (const tab of IT_ADMIN_TAB_KEYS) {
    const view = render(
      <MemoryRouter initialEntries={['/?tab=' + tab]}>
        <AppProviders>
          <DashboardPage role='it-admin' />
        </AppProviders>
      </MemoryRouter>
    )
    await waitFor(() => expect(view.container.textContent).not.toContain('Loading data'))
    const visibleText = view.container.querySelector('main')?.textContent ?? ''
    expect(visibleText).not.toMatch(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/iu)
    expect(visibleText).not.toMatch(/(?:itAdmin|itCatalog|itProvisioning|itOffboarding|itIssues|itNewSoftware):/)
    view.unmount()
  }
})
