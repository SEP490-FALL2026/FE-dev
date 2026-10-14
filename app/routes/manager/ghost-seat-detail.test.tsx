import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, expect, it } from 'vitest'
import { createRoutesStub, useParams } from 'react-router'
import { ghostSeats } from '~/entities/license/ghost-seats-demo'
import { GhostSeatDetailPage } from '~/features/manager/ghost-seat-detail/ghost-seat-detail-page'
import { ManagerLayout } from '~/features/manager/layout/manager-layout'
import { setAppLanguage } from '~/shared/i18n/i18n'
import GhostSeatReviewRoute from './ghost-seat-review'

function Detail() {
  return <GhostSeatDetailPage seatId={useParams().id ?? ''} />
}
beforeEach(async () => {
  await setAppLanguage('en', false)
})

it.each(ghostSeats)(
  'opens the correct $application employee from the review list and returns to its search',
  async (seat) => {
    const Stub = createRoutesStub([
      {
        path: '/manager',
        Component: ManagerLayout,
        children: [
          { path: 'ghost-seat-review', Component: GhostSeatReviewRoute },
          { path: 'ghost-seat-review/:id', Component: Detail }
        ]
      }
    ])
    render(<Stub initialEntries={[`/manager/ghost-seat-review?search=${seat.email}`]} />)
    fireEvent.click(screen.getByRole('link', { name: `View ${seat.application} for ${seat.employee}` }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Ghost Seat Detail' })).toBeInTheDocument()
    const summary = screen.getByRole('region', { name: 'Application and employee summary' })
    expect(summary).toHaveTextContent(seat.employee)
    expect(summary).toHaveTextContent(seat.email)
    expect(summary).toHaveTextContent(seat.application)
    const nav = screen.getByRole('navigation', { name: 'Manager navigation' })
    expect(within(nav).getByRole('link', { name: 'Ghost Seat Review' })).toHaveAttribute('aria-current', 'page')
    expect(within(screen.getByRole('banner')).getByText('Ghost Seat Detail')).toHaveAttribute('aria-current', 'page')
    fireEvent.click(screen.getByRole('link', { name: 'Back to Ghost Seat Review' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Ghost Seat Review' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toHaveValue(seat.email)
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(2)
  }
)
