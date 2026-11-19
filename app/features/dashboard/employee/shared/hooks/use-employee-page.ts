import { useSearchParams } from 'react-router'

export function useEmployeePage(key = 'page') {
  const [searchParams, setSearchParams] = useSearchParams()
  const value = Number(searchParams.get(key))
  const page = Number.isSafeInteger(value) && value > 0 ? value : 1
  const onPage = (next: number) =>
    setSearchParams((previous) => {
      const updated = new URLSearchParams(previous)
      updated.set(key, String(next))
      return updated
    })
  return { page, pageSize: 20, onPage }
}
