import { useSearchParams } from 'react-router'
import { isValidApprovalTab, type ApprovalTabKey } from '../../approvals-nav'

export function useApprovalsTabs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: ApprovalTabKey = isValidApprovalTab(tabParam) ? tabParam : 'overview'

  const selectTab = (tab: ApprovalTabKey, extraParams?: Record<string, string>) => {
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
