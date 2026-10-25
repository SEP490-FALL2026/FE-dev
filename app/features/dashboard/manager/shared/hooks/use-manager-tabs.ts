import { useSearchParams } from 'react-router'
import { isValidManagerTab, type ManagerTabKey } from '../../manager-nav'

export function useManagerTabs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: ManagerTabKey = isValidManagerTab(tabParam) ? tabParam : 'overview'

  const selectTab = (tab: ManagerTabKey, extraParams?: Record<string, string>) => {
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
