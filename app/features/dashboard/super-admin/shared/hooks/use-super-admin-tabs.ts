import { useSearchParams } from 'react-router'
import { isValidSuperAdminTab, type SuperAdminTabKey } from '../../super-admin-nav'

export function useSuperAdminTabs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: SuperAdminTabKey = isValidSuperAdminTab(tabParam) ? tabParam : 'overview'

  const selectTab = (tab: SuperAdminTabKey, extraParams?: Record<string, string>) => {
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
