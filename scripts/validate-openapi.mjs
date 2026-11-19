import { pathToFileURL } from 'node:url'

import { loadEnv } from 'vite'

const HTTP_METHODS = new Set(['delete', 'get', 'head', 'options', 'patch', 'post', 'put', 'trace'])

function referencedComponentName(schema) {
  if (!schema || typeof schema !== 'object') return undefined
  if (typeof schema.$ref === 'string') return schema.$ref.split('/').at(-1)
  if (schema.type === 'array') return referencedComponentName(schema.items)
  return undefined
}

function contentSchemas(container) {
  return Object.values(container?.content ?? {})
    .map((mediaType) => mediaType?.schema)
    .filter(Boolean)
}

export function validateOpenApi(document) {
  const issues = []
  const operationIds = new Set()
  const declaredTags = new Set((document.tags ?? []).map((tag) => tag.name))

  for (const [path, pathItem] of Object.entries(document.paths ?? {})) {
    for (const [method, operation] of Object.entries(pathItem ?? {})) {
      if (!HTTP_METHODS.has(method)) continue
      const location = `${method.toUpperCase()} ${path}`
      const tags = operation.tags ?? []

      if (tags.length !== 1) {
        issues.push(`${location} must declare exactly one tag (found ${tags.length})`)
      } else if (!declaredTags.has(tags[0])) {
        issues.push(`${location} uses undeclared tag "${tags[0]}"`)
      }

      if (!operation.operationId) {
        issues.push(`${location} must declare operationId`)
      } else if (operationIds.has(operation.operationId)) {
        issues.push(`${location} duplicates operationId "${operation.operationId}"`)
      } else {
        operationIds.add(operation.operationId)
      }

      for (const schema of contentSchemas(operation.requestBody)) {
        const name = referencedComponentName(schema)
        if (name && !name.endsWith('Request')) {
          issues.push(`${location} request body component "${name}" must end with Request`)
        }
      }

      for (const [status, response] of Object.entries(operation.responses ?? {})) {
        if (!/^2\d\d$/.test(status)) continue
        for (const schema of contentSchemas(response)) {
          const name = referencedComponentName(schema)
          if (name && !name.endsWith('Response')) {
            issues.push(`${location} success response component "${name}" must end with Response`)
          }
        }
      }
    }
  }

  return issues
}

export function validateOpenApiDocument(document) {
  if (
    !document ||
    typeof document.openapi !== 'string' ||
    !document.info ||
    !document.paths ||
    !Object.keys(document.paths).length
  ) {
    throw new Error('Invalid OpenAPI document: missing version, info or paths')
  }
  const isBackendExport = document.info?.version === '1.0' && !document.tags?.length
  const issues = isBackendExport ? validateBackendExport(document) : validateOpenApi(document)
  if (issues.length > 0) {
    throw new Error(`OpenAPI conventions failed:\n- ${issues.join('\n- ')}`)
  }
}

function validateBackendExport(document) {
  const expected = {
    authLogin: ['post', '/api/v1/auth/login'],
    authRefresh: ['post', '/api/v1/auth/refresh'],
    authLogout: ['post', '/api/v1/auth/logout'],
    authRequestPasswordReset: ['post', '/api/v1/auth/password-reset-requests'],
    authResetPassword: ['post', '/api/v1/auth/password-resets'],
    authRedeemInvitation: ['post', '/api/v1/auth/invitations/redeem'],
    meGet: ['get', '/api/v1/me'],
    meChangePassword: ['post', '/api/v1/me/password']
  }
  return Object.entries(expected).flatMap(([operationId, [method, path]]) =>
    document.paths?.[path]?.[method]?.operationId === operationId
      ? []
      : [`Missing ${operationId} at ${method.toUpperCase()} ${path}`]
  )
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const env = loadEnv('development', process.cwd(), ['VITE_', 'API_PROXY_'])
  const origin =
    process.env.API_PROXY_TARGET ?? env.API_PROXY_TARGET ?? process.env.VITE_API_BASE_URL ?? env.VITE_API_BASE_URL
  const url = new URL('/api/docs-json', origin).href
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) })
  if (!response.ok) throw new Error(`Swagger request failed: HTTP ${response.status}`)
  validateOpenApiDocument(await response.json())
  console.log(`OpenAPI conventions passed: ${url}`)
}
