import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { annualProposals, budgetExceptions } from './annual-budget-data'
import { financeDemoText } from './finance-demo-labels'
import { budgetQuestions, chargeExceptions, internalCosts } from './finance-data'
import { FinancePeriodReportView } from './period-close/views/finance-period-report-view'

afterEach(async () => setAppLanguage('vi', false))

describe('Finance demo label localization', () => {
  it('translates seeded narrative fields used by detail views', async () => {
    await setAppLanguage('en', false)
    const narratives = [
      ...budgetQuestions.flatMap((question) => [question.question, question.answer?.note]),
      ...budgetExceptions.flatMap((exception) => [exception.detail, exception.resolution?.note]),
      ...annualProposals.flatMap((proposal) => [
        proposal.infoRequest?.message,
        ...proposal.lines.flatMap((line) => [line.need, line.hint, line.finance?.reason])
      ]),
      ...chargeExceptions.flatMap((exception) => [...exception.basisTried, exception.itNote]),
      ...internalCosts.map((cost) => cost.description)
    ].filter((value): value is string => Boolean(value))
    const untranslated = narratives.filter((value) =>
      /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/iu.test(financeDemoText(value))
    )
    expect(untranslated).toEqual([])
  })

  it('uses English department names in overview and budget screens', async () => {
    await setAppLanguage('en', false)
    const { unmount } = render(
      <MemoryRouter initialEntries={['/?tab=overview']}>
        <AppProviders>
          <DashboardPage role='finance' />
        </AppProviders>
      </MemoryRouter>
    )
    expect(screen.getAllByText(/Engineering/).length).toBeGreaterThan(0)
    unmount()

    render(
      <MemoryRouter initialEntries={['/?tab=budgets']}>
        <AppProviders>
          <DashboardPage role='finance' />
        </AppProviders>
      </MemoryRouter>
    )
    expect(screen.getAllByText('Engineering').length).toBeGreaterThan(0)
    expect(screen.queryByText('Kỹ thuật')).not.toBeInTheDocument()
  })

  it('updates the generated period narrative when the language changes', async () => {
    await setAppLanguage('en', false)
    render(<FinancePeriodReportView formatCurrency={(value) => String(value)} />)
    fireEvent.click(screen.getByRole('button', { name: 'Generate AI draft' }))
    expect((screen.getByRole('textbox', { name: 'Narrative' }) as HTMLTextAreaElement).value).toContain('Software spending for Q3 2026')

    await setAppLanguage('vi', false)
    expect((screen.getByRole('textbox', { name: 'Phần diễn giải' }) as HTMLTextAreaElement).value).toContain('Chi phí phần mềm quý 3/2026')
  })
})
