import { defineConfig } from 'orval'
import { loadEnv } from 'vite'

const { VITE_API_BASE_URL, API_PROXY_TARGET } = loadEnv('development', process.cwd(), ['VITE_', 'API_PROXY_'])

export default defineConfig({
  api: {
    input: {
      target: process.env.ORVAL_OPENAPI_SOURCE ?? new URL('/api/docs-json', API_PROXY_TARGET ?? VITE_API_BASE_URL).href,
      filters: {
        tags: [
          'auth',
          'me',
          'dashboards',
          'need-decisions',
          'audit',
          'employees',
          'departments',
          'app-users',
          'onboarding',
          'super-admin-watch',
          'department-transfers',
          'long-leaves',
          'offboarding-cases',
          'personnel-notices',
          'operating-parameters',
          'employee-imports',
          'currencies',
          'controlled-waits',
          'step-congestion',
          'applications',
          'functional-groups',
          'plans',
          'vendors',
          'subscriptions',
          'subscription-renewals',
          'plan-terms',
          'contracts',
          'documents',
          'license-assignments',
          'service-account-duties',
          'seat-baseline',
          'seat-baseline-imports',
          'provisioning-tasks',
          'grant-queue',
          'license-keys',
          'handover-duties',
          'assignment-expiry',
          'saas-issues',
          'access-requests',
          'group-requests',
          'transfer-reviews',
          'cost-centers',
          'budget-proposals',
          'budget-versions',
          'budgets',
          'budget-commitments',
          'finance-reviews',
          'budget-information',
          'exchange-rates',
          'spend-approvals',
          'spend-submission',
          'notifications',
          'requestable-software',
          'return-requests',
          'devices',
          'device-credentials',
          'monitoring-notices',
          'my-devices',
          'collector-allowlist',
          'ai-usage',
          'ai-tool-status',
          'intake-rejections',
          'ai-assist'
        ]
      }
    },
    output: {
      baseUrl: {
        runtime: 'env.API_BASE_URL',
        imports: [
          {
            name: 'env',
            importPath: '~/shared/config/env'
          }
        ]
      },
      clean: true,
      client: 'react-query',
      formatter: 'prettier',
      httpClient: 'axios',
      mode: 'tags-operations',
      indexFiles: true,
      override: {
        mutator: {
          path: './app/shared/api/mutator/custom-axios.ts',
          name: 'customAxios'
        }
      },
      schemas: {
        path: './app/shared/api/generated/model',
        splitByTags: true
      },
      target: './app/shared/api/generated/operations'
    }
  }
})
