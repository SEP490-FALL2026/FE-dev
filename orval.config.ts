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
          'audit',
          'employees',
          'departments',
          'projects',
          'app-users',
          'approval-roles',
          'super-admin-transfers',
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
          'access-requests',
          'group-requests',
          'return-requests',
          'saas-issues',
          'notifications',
          'handover-duties',
          'assignment-expiry'
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
