interface Page<Item> {
  data?: { items: Item[]; pagination: { totalPages: number } } | null
}

/** Upper bound for lists the API cannot filter by the field a screen needs; beyond it the result is flagged as truncated. */
const maxPages = 10

/**
 * Reads every page of a list (100 per page) for screens that must filter by a field the API does not filter on,
 * such as the cost center of a budget version.
 */
export async function readAllPages<Item>(
  readPage: (page: number) => Promise<Page<Item>>
): Promise<{ items: Item[]; truncated: boolean }> {
  const items: Item[] = []
  for (let page = 1; page <= maxPages; page += 1) {
    const response = await readPage(page)
    items.push(...(response.data?.items ?? []))
    if (page >= (response.data?.pagination.totalPages ?? 1)) return { items, truncated: false }
  }
  return { items, truncated: true }
}

export const allPagesSize = 100
