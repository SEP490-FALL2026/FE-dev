import { useState } from 'react'
/** Freeze the opening server snapshot; preserve dirty inputs across background refreshes. */
export function useCatalogEditorSnapshot<T>(query: { data?: { data: T }; isFetching: boolean; isError: boolean }) {
  const [snapshot, setSnapshot] = useState<T>()
  const [dirty, setDirty] = useState(false)
  const current = query.data?.data
  const version = JSON.stringify(snapshot)
  const latestVersion = JSON.stringify(current)
  const changed = snapshot !== undefined && version !== latestVersion
  if (!query.isFetching && !query.isError && current && (!snapshot || (!dirty && changed))) setSnapshot(current)
  return {
    snapshot,
    dirty,
    version,
    changed: dirty && changed,
    blocked: query.isFetching || query.isError || changed,
    markDirty: () => setDirty(true),
    reload: () => {
      if (!query.isFetching && !query.isError) {
        setSnapshot(current)
        setDirty(false)
      }
    }
  }
}
