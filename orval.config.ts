import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: {
      target: './openapi/openapi.yaml'
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
      mock: {
        indexMockFiles: true,
        path: './app/shared/api/generated/mocks',
        generators: [
          {
            type: 'faker',
            arrayItems: true,
            schemas: true,
            useExamples: true
          },
          {
            type: 'msw',
            delay: 150
          }
        ]
      },
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
