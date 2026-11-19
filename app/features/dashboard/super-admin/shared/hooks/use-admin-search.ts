import { useEffect, useState } from 'react'

/** Avoid a request for every keystroke while retaining Query's cancellation and parameterized cache. */
export function useAdminSearch(value: string) {
  const [search, setSearch] = useState(value)
  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(value.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [value])
  return search
}
