import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('login', 'routes/login.tsx'),
  route('logout', 'routes/logout.tsx'),
  route('forgot-password', 'routes/forgot-password.tsx'),
  route('reset-password', 'routes/reset-password.tsx'),
  route('activate-account', 'routes/activate-account.tsx'),
  route('change-password', 'routes/change-password.tsx'),
  route('forbidden', 'routes/forbidden.tsx'),

  // Role-specific protected routes with strict RBAC:
  route('dashboard/super-admin', 'routes/dashboard.super-admin.tsx'),
  route('dashboard/super-admin/personnel/:formMode', 'routes/dashboard.super-admin.personnel.tsx'),
  route('dashboard/it-admin', 'routes/dashboard.it-admin.tsx'),
  route('dashboard/manager', 'routes/dashboard.manager.tsx'),
  route('dashboard/finance', 'routes/dashboard.finance.tsx'),
  route('dashboard/spending-approver', 'routes/dashboard.spending-approver.tsx'),
  route('dashboard/employee', 'routes/dashboard.employee.tsx'),

  // Parameterized fallback route:
  route('dashboard/:role', 'routes/dashboard.tsx'),
  route('*', 'routes/not-found.tsx')
] satisfies RouteConfig
