import { useState } from 'react'

export function useFinanceList() {
  const [page, setPage] = useState(1)
  const [year, updateYear] = useState('')
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
