import { useState } from 'react'
import { useNavigate } from 'react-router'
import { setAuthSession } from '../auth-session'
import { demoAccounts, type DemoAccount } from '../demo-accounts'
import type { AuthRole } from '../enums'

export function useDemoAuth() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<AuthRole>('employee')

  const loginAsRole = (role: AuthRole) => {
    setSelectedRole(role)
    const matchedAccount = demoAccounts.find((account) => account.role === role) || demoAccounts[0]
    setAuthSession(matchedAccount)
    navigate(`/dashboard/${role}`)
  }

  const loginAsAccount = (account: DemoAccount) => {
    setSelectedRole(account.role as AuthRole)
    setAuthSession(account)
    navigate(`/dashboard/${account.role}`)
  }

  return {
    accounts: demoAccounts,
    loginAsAccount,
    loginAsRole,
    selectedRole,
    setSelectedRole
  }
}
