import { useEffect, useState } from 'react'

export function useCatalogSearch() {
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (draft.trim() === search) return
    const timer = window.setTimeout(() => {
      setSearch(draft.trim())
      setPage(1)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [draft, search])
  return { draft, setDraft, search, page, setPage, open, setOpen, current: draft.trim() === search }
}
