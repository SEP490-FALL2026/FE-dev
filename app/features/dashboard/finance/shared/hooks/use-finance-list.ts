import { useState } from 'react'

/** Page state of a Finance list; the year filter starts on the current year so it is never an empty box. */
export function useFinanceList() {
  const [page, setPage] = useState(1)
  const [year, updateYear] = useState(() => String(new Date().getFullYear()))
  return {
    page,
    pageSize: 20,
    setPage,
    year,
    setYear: (value: string) => {
      updateYear(value)
      setPage(1)
    }
  }
}
