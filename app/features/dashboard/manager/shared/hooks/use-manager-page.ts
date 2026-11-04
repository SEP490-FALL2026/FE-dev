import { useSearchParams } from 'react-router'

export function useManagerPage(key = 'page') {
  const [params, setParams] = useSearchParams()
  const candidate = Number(params.get(key) ?? 1)
  const page = Number.isSafeInteger(candidate) && candidate > 0 ? candidate : 1
  return {
    page,
    pageSize: 20,
    onPage: (value: number) =>
      setParams((previous) => {
        const next = new URLSearchParams(previous)
        next.set(key, String(value))
        return next
      })
  }
}
