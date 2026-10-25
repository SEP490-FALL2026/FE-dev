import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { initialItDepartments, initialItProvisioningItems } from '../it-admin-data'
import { ItProvisioningView } from './views/it-provisioning-view'

afterEach(async () => setAppLanguage('vi', false))

describe('IT provisioning localization', () => {
  it('translates the department, batch, request and detail views', async () => {
    await setAppLanguage('en', false)
    render(<ItProvisioningView />)

    expect(screen.getByText('Software Engineering')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Open department' })[0])
    expect(screen.getByText('Batch 1 - October 2026')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Open batch' })[0])
    expect(screen.getByText('Senior Backend Engineer')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Details' })[0])
    expect(screen.getByText('Analyze technical architecture documents and generate microservice boilerplate code')).toBeInTheDocument()
    expect(screen.queryByText('Kỹ thuật phần mềm')).not.toBeInTheDocument()
  })

  it('does not show Vietnamese interface copy in seeded request details', async () => {
    await setAppLanguage('en', false)
    const names = new Set([
      ...initialItDepartments.map((department) => department.managerName),
      ...initialItProvisioningItems.flatMap((item) => [item.requesterName, item.beneficiaryName]),
      'Quang Huy'
    ])
    const groups = [
      { department: 0, batch: 0, ids: ['REQ-2026-0917-084', 'REQ-2026-0917-085', 'REQ-MULTI-01', 'REQ-MULTI-02'] },
      { department: 0, batch: 1, ids: ['REQ-ENG-0201', 'REQ-ENG-0202', 'REQ-ENG-0203'] },
      { department: 0, batch: 'unbatched', ids: ['REQ-MULTI-03', 'REQ-ENG-BLOCKED'] },
      { department: 1, batch: 0, ids: ['REQ-DES-0101', 'REQ-DES-0102'] }
    ] as const
    const findings: Record<string, string[]> = {}

    for (const group of groups) {
      const { container, unmount } = render(<ItProvisioningView />)
      fireEvent.click(screen.getAllByRole('button', { name: 'Open department' })[group.department])
      if (group.batch === 'unbatched') fireEvent.click(screen.getByRole('button', { name: 'View this group' }))
      else fireEvent.click(screen.getAllByRole('button', { name: 'Open batch' })[group.batch])

      for (const id of group.ids) {
        const row = screen.getByText(new RegExp(id)).closest('.rounded-xl')
        expect(row).not.toBeNull()
        fireEvent.click(within(row as HTMLElement).getByRole('button', { name: 'Details' }))
        const vietnamese = [...container.querySelectorAll('*')]
          .filter((node) => node.children.length === 0)
          .map((node) => [...names].reduce((text, name) => text.replaceAll(name, ''), node.textContent || ''))
          .filter((text) => /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/iu.test(text))
        if (vietnamese.length) findings[id] = [...new Set(vietnamese)]
        fireEvent.click(screen.getByRole('button', { name: 'Back to requests' }))
      }
      unmount()
    }
    expect(findings).toEqual({})
  })
})
