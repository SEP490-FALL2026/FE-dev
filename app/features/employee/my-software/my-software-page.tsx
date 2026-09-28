import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { SoftwareFilters } from './components/software-filters'
import { SoftwareHeader } from './components/software-header'
import { SoftwarePagination } from './components/software-pagination'
import { SoftwareTable } from './components/software-table'
import { SoftwareTabs } from './components/software-tabs'
import type { SoftwareLicenseItem, SoftwareSortType, SoftwareTabType } from './my-software.types'

// Mock data matching the mockup exactly
const initialSoftwareItems: SoftwareLicenseItem[] = [
  {
    id: '1',
    name: 'Figma',
    vendor: 'Figma, Inc.',
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAY2oGXwrNswloS79c3TYFFMeuKDhIXnXy9TbH6L45gO5C4iqaJbdP4nHMhVyYyp8OUy6N8LnEY5UmvOvFc4oc8c8iJ1rPXe2H5eDHF-Yw0KK19QfjGq13_t9TzQk1BtiFSCTlPZrBYDeqSWBTkpuXfj_xBoL4ZFR4GUDHOowEHTwp5WOvwhu28ur4pcZMxs8fokdIGomLcFSKWSvInOLOQrAXQ5ov7npHE9Sn_C8_Jnf125b28Z19A',
    plan: 'Professional',
    status: 'active',
    assignedDate: 'Jan 15, 2026',
    expirationDate: 'Dec 31, 2026',
    licenseKey: 'FIG-PRO-2026-8819'
  },
  {
    id: '2',
    name: 'GitHub',
    vendor: 'GitHub, Inc.',
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCnpmmCjyTSEXXNq7UWRzodxjG1Px9wi0KT_EUU5HoWjFDkUCFgr2-3yO8nUfZR17g41UKtxHDjZJcuzNH0Ti33hGioyJa6ybmK3rjh9VUAoLac9-ekte9Bqx28CL2dgoNLNuoFbh_oyByyYYbahUkdme-uj_jcFZlDYEkhpSxMWAgcvOHAAhqHGc5Gbi62UkKNP48WY6zhwWbpAJ8XfrIs1EqHDpckcKXzcgujEaomnxygHpklLWM7',
    plan: 'Enterprise',
    status: 'active',
    assignedDate: 'Feb 03, 2026',
    expirationDate: null,
    licenseKey: 'GH-ENT-2026-9041'
  },
  {
    id: '3',
    name: 'Jira',
    vendor: 'Atlassian',
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYweHTA7aXpPqNqwpQNlTa2hrupGMR1dtt44E4zMdhQKNDgCiEnGzhZIzUzLcGJtiVc-RWDLG65bJIE-QPgfUodFy8Xfq6jGgWxu_bfsDwfMjQlacDH-HIYlJFf_8mXcqxkKdl_Z29XfiTwpTtP6IhaixTo6OKGDxvXwnXRhkceXKAoV1loaAjuZLK1KMRyZqhS4hB80G6IS1wUrGilHukmJoPQOkIoiId_paOKiTrxbYVFLBwSlXD',
    plan: 'Standard',
    status: 'active',
    assignedDate: 'Mar 12, 2026',
    expirationDate: null,
    licenseKey: 'ATL-JIRA-STD-5521'
  },
  {
    id: '4',
    name: 'Slack',
    vendor: 'Slack Technologies',
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0e52KaBz-wrj7aVR5RGtohKukMuYMijRura1Z8h2MTZ-032zUhY885RIHJL1sjP3QjFVFOMsK2u9d6idARJL3oPL4__3SoaMuI7KXDzAMDtqke6zS7jzHoXH2s_jBwvPb1ImSXMJ_8VtVvJEj2vc3iwuEMDcG6C141Y_r3Y4648MfpJuCT7tmojFP8oTc1R5QJIWMhxtrSY1ciISw1u4DXtEb1JGNgvfmk0GQUjNFo-uhU7CyO60c',
    plan: 'Pro',
    status: 'active',
    assignedDate: 'Mar 20, 2026',
    expirationDate: null,
    licenseKey: 'SLK-PRO-2026-4439'
  },
  {
    id: '5',
    name: 'Microsoft 365',
    vendor: 'Microsoft',
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDXhxSWl4qJL-6-gyaTbcJeww-yW2wz4JqkdAnpH6XLJhUJKD1WpwOVAbLgRmIs2WGIWBDuMK31GMT1xUo8IRc_5ILHhYFnS1W6U5MBmIrWzYU5nlhd6HqZrXWvalulVD8dLIoq7o3Si6m3prs29wgAmwMmHS8xZ1qGtS2Ciix6tH_ftLdPqcX9LF1TUY8fyML_Q09A79lIVMT0rC3UwznaWmLjrSTk-8sKGlyQit0Q7hiB6wuE0GNa',
    plan: 'Business',
    status: 'active',
    assignedDate: 'Apr 05, 2026',
    expirationDate: null,
    licenseKey: 'MS-365-BIZ-1092'
  },
  {
    id: '6',
    name: 'Zoom',
    vendor: 'Zoom Video Comm.',
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDEtaDbbvQWTCU1sQX9WTrEmuyg6zro-5UosuEjQZ--JsL1udrUmsw_Nms4I7lEh1EVvYLYfnKcjbNDGsbQhugpOCFUHXf91NeRi8QEXwvXIZ2BeS5yZavU3a8zK5gVWusDPZuS_XAStn6-jODJBsWuVGskgza-ECKb9Ot4Bo6jA77XMN_QNW7gQ2rrsopnaR7CKQagRFcYo47xJd-jrmD5sNavW6OULz9tWVG4SmIN8Q6LDIXX5KgO',
    plan: 'Pro',
    status: 'expiringSoon',
    assignedDate: 'Apr 18, 2026',
    expirationDate: 'May 18, 2026',
    licenseKey: 'ZM-PRO-2026-6644'
  }
]

export function MySoftwarePage() {
  const navigate = useNavigate()
  const [items] = useState<SoftwareLicenseItem[]>(initialSoftwareItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<SoftwareTabType>('all')
  const [sortBy, setSortBy] = useState<SoftwareSortType>('assignedDate')
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate tab badge counts
  const counts = useMemo<Record<SoftwareTabType, number>>(() => {
    return {
      all: items.length,
      active: items.filter((i) => i.status === 'active').length,
      expiringSoon: items.filter((i) => i.status === 'expiringSoon').length,
      pending: items.filter((i) => i.status === 'pending').length,
      returned: items.filter((i) => i.status === 'returned').length
    }
  }, [items])

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchName = item.name.toLowerCase().includes(q)
          const matchVendor = item.vendor.toLowerCase().includes(q)
          if (!matchName && !matchVendor) return false
        }

        // Dropdown status filter
        if (statusFilter !== 'all' && item.status !== statusFilter) {
          return false
        }

        // Tab filter
        if (activeTab !== 'all' && item.status !== activeTab) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name)
        }
        if (sortBy === 'expiration') {
          return (a.expirationDate ?? '9999').localeCompare(b.expirationDate ?? '9999')
        }
        return a.assignedDate.localeCompare(b.assignedDate)
      })
  }, [items, searchQuery, statusFilter, activeTab, sortBy])

  const handleRequestSoftware = () => {
    navigate('/employee/create-request')
  }

  return (
    <div className='mx-auto max-w-6xl space-y-6'>
      {/* Page Header */}
      <SoftwareHeader onRequestSoftware={handleRequestSoftware} />

      {/* Filters & Search */}
      <SoftwareFilters
        onSearchChange={setSearchQuery}
        onSortByChange={setSortBy}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        sortBy={sortBy}
        statusFilter={statusFilter}
      />

      {/* Tabs */}
      <SoftwareTabs activeTab={activeTab} counts={counts} onTabChange={setActiveTab} />

      {/* Data Table */}
      <SoftwareTable items={filteredItems} onSelect={(item) => navigate(`/employee/my-software/${item.id}`)} />

      {/* Pagination */}
      <SoftwarePagination
        currentPage={currentPage}
        itemsPerPage={10}
        onPageChange={setCurrentPage}
        totalItems={filteredItems.length}
      />
    </div>
  )
}
