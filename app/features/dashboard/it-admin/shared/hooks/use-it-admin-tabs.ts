import { useSearchParams } from 'react-router'
import { isValidItAdminTab, type ItAdminTabKey } from '../../it-admin-nav'

export function useItAdminTabs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: ItAdminTabKey = isValidItAdminTab(tabParam) ? tabParam : 'overview'

  const selectTab = (tab: ItAdminTabKey, extraParams?: Record<string, string>) => {
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
