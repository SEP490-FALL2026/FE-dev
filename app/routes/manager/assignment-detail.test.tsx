import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { AccessReviewPage } from '~/features/manager/access-review/access-review-page'
import AssignmentDetailRoute from './assignment-detail'

function Location() {
  return (
    <div data-testid='location'>
      {useLocation().pathname}
      {useLocation().search}
    </div>
  )
}

it('navigates from a filtered assignment row, returns to the list and resets drafts for another assignment', async () => {
  await setAppLanguage('en', false)
  render(
    <MemoryRouter initialEntries={['/manager/access-review?risk=low&size=2']}>
      <Routes>
        <Route path='/manager/access-review' element={<AccessReviewPage />} />
        <Route path='/manager/access-review/:id' element={<AssignmentDetailRoute />} />
      </Routes>
      <Location />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('link', { name: 'View Figma for Nguyễn Văn A' }))
  expect(screen.getByRole('heading', { name: 'Assignment Details' })).toBeInTheDocument()
  expect(screen.getByTestId('location')).toHaveTextContent('/manager/access-review/AR-1?risk=low&size=2')
  fireEvent.click(screen.getByRole('radio', { name: 'Reclaim' }))
  fireEvent.change(screen.getByRole('textbox', { name: 'Reason' }), { target: { value: 'Project completed' } })
  fireEvent.click(screen.getByRole('link', { name: 'Back to Access Review' }))
  expect(screen.getByTestId('location')).toHaveTextContent('/manager/access-review?risk=low&size=2')
  fireEvent.click(screen.getByRole('link', { name: 'View Jira for Lê Cường' }))
  expect(screen.getByRole('link', { name: 'Lê Cường' })).toHaveAttribute('href', '/manager/my-team/3')
  expect(screen.getByRole('radio', { name: 'Keep' })).toBeChecked()
  expect(screen.getByRole('textbox', { name: 'Reason' })).toHaveValue('')
  expect(screen.getByRole('button', { name: 'Submit Decision' })).toBeDisabled()
})
