import { useEffect, useState } from 'react'

/** Debounce server searches while keeping the input responsive. Query owns request cancellation. */
export function useFinanceSearch() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])
  return { search, setSearch, debouncedSearch }
}
