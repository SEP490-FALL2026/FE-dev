import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),

  // Employee Portal (/employee/*)
  ...prefix('employee', [
    layout('routes/employee/layout.tsx', [
      route('dashboard', 'routes/employee/dashboard.tsx'),
      route('my-software', 'routes/employee/my-software.tsx'),
      route('my-software/:id', 'routes/employee/software-detail.tsx'),
      route('my-requests', 'routes/employee/my-requests.tsx'),
      route('my-requests/:id', 'routes/employee/request-detail.tsx'),
      route('create-request', 'routes/employee/create-request.tsx'),
      route('create-request/new-software', 'routes/employee/request-new-software.tsx'),
      route('create-request/temporary-renewal', 'routes/employee/temporary-renewal.tsx'),
      route('create-request/return-license', 'routes/employee/return-license.tsx'),
      route('create-request/review', 'routes/employee/review-request.tsx'),
      route('create-request/success', 'routes/employee/submission-success.tsx'),
      route('profile', 'routes/employee/profile.tsx'),
      route('profile/data-export', 'routes/employee/data-export.tsx'),
      route('profile/data-usage', 'routes/employee/data-usage.tsx')
    ])
  ]),

  ...prefix('manager', [
    layout('routes/manager/layout.tsx', [
      route('dashboard', 'routes/manager/dashboard.tsx'),
      route('create-request', 'routes/manager/create-request.tsx'),
      route('access-review', 'routes/manager/access-review.tsx'),
      route('access-review/:id', 'routes/manager/assignment-detail.tsx'),
      route('my-team', 'routes/manager/my-team.tsx'),
      route('my-team/:id', 'routes/manager/employee-detail.tsx'),
      route('team-software', 'routes/manager/team-software.tsx'),
      route('ghost-seat-review', 'routes/manager/ghost-seat-review.tsx'),
      route('ghost-seat-review/:id', 'routes/manager/ghost-seat-detail.tsx'),
      route('team-requests', 'routes/manager/team-requests.tsx'),
      route('team-requests/:id', 'routes/manager/request-approval-detail.tsx')
    ])
  ]),

  route('*', 'routes/not-found.tsx')
] satisfies RouteConfig
