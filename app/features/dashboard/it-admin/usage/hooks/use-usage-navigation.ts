import { useSearchParams } from 'react-router'

export function useUsageNavigation() {
  const [params, setParams] = useSearchParams()
  const update = (values: Record<string, string | undefined>) => {
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      Object.entries(values).forEach(([key, value]) => {
        if (value) next.set(key, value)
        else next.delete(key)
      })
      return next
    })
  }
  const page = (key: string) => {
    const value = Number(params.get(key))
    return Number.isSafeInteger(value) && value > 0 ? value : 1
  }
  return { params, update, page }
}
