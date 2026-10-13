import { GhostSeatDetailPage } from '~/features/manager/ghost-seat-detail/ghost-seat-detail-page'
import type { Route } from './+types/ghost-seat-detail'

export default function GhostSeatDetailRoute({ params }: Route.ComponentProps) {
  return <GhostSeatDetailPage seatId={params.id} />
}
