import { ForbiddenPage } from '~/features/auth/views/forbidden-page'
import { getCurrentUserRole } from '~/features/auth/auth-session'

export default function ForbiddenRoute() {
  const currentRole = getCurrentUserRole()
  return <ForbiddenPage currentUserRole={currentRole} />
}
