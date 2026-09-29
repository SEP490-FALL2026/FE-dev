import { redirect } from 'react-router'

export function clientLoader() {
  return redirect('/approvals/queue')
}

export default function HomeRedirectRoute() {
  return null
}
