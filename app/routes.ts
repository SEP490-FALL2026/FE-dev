import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  layout('routes/app-layout-route.tsx', [
    index('routes/home-redirect-route.tsx'),
    route('approvals/dashboard', 'routes/approvals-dashboard-route.tsx'),
    route('approvals/queue', 'routes/approvals-queue-route.tsx'),
    route('approvals/reports', 'routes/approvals-reports-route.tsx'),
    route('approvals/expense/:id', 'routes/approvals-expense-route.tsx'),
    route('approvals/renewal/:id', 'routes/approvals-renewal-route.tsx'),
    route('finance/dashboard', 'routes/finance-dashboard-route.tsx'),
    route('finance/software-directory', 'routes/finance-directory-route.tsx'),
    route('finance/budget-snapshot', 'routes/finance-snapshot-route.tsx'),
    route('finance/renewals', 'routes/finance-renewals-route.tsx'),
    route('finance/commitments', 'routes/finance-commitments-route.tsx'),
    route('finance/shadow-it', 'routes/finance-shadow-it-route.tsx')
  ]),
  route('*', 'routes/not-found.tsx')
] satisfies RouteConfig
