import { EmployeeDetailPage } from '~/features/manager/employee-detail/employee-detail-page'
import type { Route } from './+types/employee-detail'

export default function EmployeeDetailRoute({ params }: Route.ComponentProps) {
  return <EmployeeDetailPage employeeId={params.id} />
}
