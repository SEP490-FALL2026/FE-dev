import { useQuery } from '@tanstack/react-query'
import {
  deviceRegistrationList,
  getDeviceRegistrationListQueryKey
} from '~/shared/api/generated/operations/devices/device-registration-list'

export function useDeviceHolders(id: string, enabled: boolean) {
  return useQuery({
    queryKey: [...getDeviceRegistrationListQueryKey(id), 'usage-holders'],
    enabled,
    queryFn: async ({ signal }) => {
      const holders: Record<string, string> = {}
      let page = 1
      let totalPages = 1
      while (page <= totalPages) {
        const result = await deviceRegistrationList(id, { page, pageSize: 100 }, undefined, signal)
        if (!result.data) throw new Error('Missing registration page')
        for (const item of result.data.items) {
          if (item.holder) holders[item.id] = `${item.holder.fullName} (${item.holder.employeeCode})`
        }
        totalPages = result.data.pagination.totalPages
        page++
      }
      return holders
    }
  })
}
