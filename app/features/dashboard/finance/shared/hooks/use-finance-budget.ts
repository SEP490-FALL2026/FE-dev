import { useMemo, useState } from 'react'
import { costCenters, type CostCenter } from '../../finance-data'
import { fiscalPeriods, type FiscalPeriod } from '../../annual-budget-data'

export function useFinanceBudget() {
  const [selectedYear, setSelectedYear] = useState<number>(2026)
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>('ALL')

  const filteredCostCenters = useMemo(() => {
    if (selectedCostCenter === 'ALL') return costCenters
    return costCenters.filter((cc: CostCenter) => cc.code === selectedCostCenter)
  }, [selectedCostCenter])

  const currentPeriod = useMemo(() => {
    return fiscalPeriods.find((fp: FiscalPeriod) => fp.year === selectedYear) ?? fiscalPeriods[0]
  }, [selectedYear])

  return {
    costCenters: filteredCostCenters,
    currentPeriod,
    fiscalPeriods,
    selectedCostCenter,
    selectedYear,
    setSelectedCostCenter,
    setSelectedYear
  }
}
