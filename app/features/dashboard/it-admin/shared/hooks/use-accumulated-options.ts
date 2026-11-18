import { useState } from 'react'
import type { SearchableOption } from '~/shared/ui/searchable-select'

/**
 * Keeps every page loaded so far for a picker with "load more". Pages reset when `resetKey` (search text, parent
 * filter) changes. `items` must be the query's own array so its identity is stable between renders.
 */
export function useAccumulatedOptions<Item>({
  page,
  items,
  toOption,
  resetKey,
  onReset
}: {
  page: number
  items: readonly Item[] | undefined
  toOption: (item: Item) => SearchableOption | null
  resetKey: string
  onReset: () => void
}) {
  const [store, setStore] = useState<{ key: string; pages: Record<number, readonly Item[]> }>({
    key: resetKey,
    pages: {}
  })
  if (store.key !== resetKey) {
    setStore({ key: resetKey, pages: {} })
    if (page !== 1) onReset()
  } else if (items && store.pages[page] !== items) {
    setStore({ key: resetKey, pages: { ...store.pages, [page]: items } })
  }
  const seen = new Set<string>()
  const options: SearchableOption[] = []
  for (const key of Object.keys(store.pages)
    .map(Number)
    .sort((left, right) => left - right)) {
    for (const item of store.pages[key] ?? []) {
      const option = toOption(item)
      if (option && !seen.has(option.value)) {
        seen.add(option.value)
        options.push(option)
      }
    }
  }
  return options
}
