import axios from 'axios'

export function getInvalidFields(error: unknown): Set<string> {
  const issues = axios.isAxiosError(error) ? error.response?.data?.error?.details?.issues : undefined
  if (!Array.isArray(issues)) return new Set()
  return new Set(
    issues.flatMap((issue: unknown) => {
      if (!issue || typeof issue !== 'object' || !('path' in issue)) return []
      const path = issue.path
      if (typeof path === 'string') return [path.split('.').at(-1) ?? path]
      if (Array.isArray(path) && typeof path.at(-1) === 'string') return [path.at(-1)]
      return []
    })
  )
}
