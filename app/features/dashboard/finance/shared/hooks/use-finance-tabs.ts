import { useSearchParams } from 'react-router'
import { isValidFinanceTab, type FinanceTabKey } from '../../finance-nav'

export function useFinanceTabs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: FinanceTabKey = isValidFinanceTab(tabParam) ? tabParam : 'overview'

  const selectTab = (tab: FinanceTabKey, extraParams?: Record<string, string>) => {
    const nextParams = new URLSearchParams()
    if (tab !== 'overview') {
      nextParams.set('tab', tab)
    }
    if (extraParams) {
      Object.entries(extraParams).forEach(([k, v]) => nextParams.set(k, v))
    }
    setSearchParams(nextParams)
  }

  return { activeTab, selectTab }
}
