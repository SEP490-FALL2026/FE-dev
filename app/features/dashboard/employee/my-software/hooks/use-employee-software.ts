import { useMemo, useState } from 'react'
import { employeeSoftwareItems } from '../../employee-data'

export function useEmployeeSoftware(pageSize = 4) {
  const [softwarePage, setSoftwarePage] = useState(1)
  const softwarePageCount = Math.ceil(employeeSoftwareItems.length / pageSize)

  const visibleSoftware = useMemo(() => {
    return employeeSoftwareItems.slice((softwarePage - 1) * pageSize, softwarePage * pageSize)
  }, [softwarePage, pageSize])

  const upcomingExpiring = useMemo(() => {
    return employeeSoftwareItems.filter((item) => item.status === 'expiringSoon')
  }, [])

  const usageChartItems = useMemo(() => {
    return [...employeeSoftwareItems].sort((a, b) => b.usage - a.usage)
  }, [])

  const averageUsage = useMemo(() => {
    return employeeSoftwareItems.length
      ? Math.round(employeeSoftwareItems.reduce((total, item) => total + item.usage, 0) / employeeSoftwareItems.length)
      : 0
  }, [])

  return {
    averageUsage,
    employeeSoftwareCount: employeeSoftwareItems.length,
    setSoftwarePage,
    softwarePage,
    softwarePageCount,
    upcomingExpiring,
    usageChartItems,
    visibleSoftware
  }
}
