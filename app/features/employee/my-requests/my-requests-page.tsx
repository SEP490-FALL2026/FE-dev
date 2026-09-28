import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { RequestsFilters } from './components/requests-filters'
import { RequestsHeader } from './components/requests-header'
import { RequestsPagination } from './components/requests-pagination'
import { RequestsTable } from './components/requests-table'
import type { SoftwareRequestItem } from './my-requests.types'

const initialRequests: SoftwareRequestItem[] = [
  {
    id: 'REQ-1024',
    softwareName: 'Figma Professional',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCIboIXI-gG0fx8dKX3wQk1JnZs6Ol3QYmLtUuGw35FoRq-g1LVNTbzw9Jhab_4EC0Ef9OYAFVdBjS679hrsKI6oN5R3nn77gGmeqvGqketDal8SK9aZlpOGCEG6Nx8jryXovIZySPD1MHeC5_OkFO7q51btUAhMNgN40cbMOhVibViTzMHmTn2uB7e965kNEAsbPNRrSJ6jgIyHnvbFwtZwdCgov_Rg-iIFdBevk8-HiUObG1HWoED',
    requestType: 'newSoftware',
    submittedDate: 'Aug 23, 2026',
    submittedTime: '09:15 AM',
    currentStep: {
      nameKey: 'myRequests.steps.managerApproval',
      descriptionKey: 'myRequests.steps.managerWaiting',
      iconType: 'user',
      status: 'pending'
    },
    status: 'pending',
    highlight: true
  },
  {
    id: 'REQ-1021',
    softwareName: 'GitHub Enterprise',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1ydXuIC1_o37YIMstUwxm93oKWWzgssVp-Rw2QVpdZagn1RQGc6a4k3IsoJZaSotj9Xp7NFOBzssLzWBbvgWY-9vDCWJampP4Nz8sw6naQwGm2T7ehwVhMs4yuqhB0DBexwrsXAcd5NgXqKQQQdPAih_jdL-3OrrLgnyLpCLO5fdixK7rv2JDb60XafHMH7o0FhqQTT1Snv7e6PGEEMNPhMmfW3BWeCFf_MDrB7CcxYbKcxgucqwA',
    requestType: 'changePlan',
    submittedDate: 'Aug 20, 2026',
    submittedTime: '02:30 PM',
    currentStep: {
      nameKey: 'myRequests.steps.itProcessing',
      descriptionKey: 'myRequests.steps.itProvisioning',
      iconType: 'gear',
      status: 'approved'
    },
    status: 'approved'
  },
  {
    id: 'REQ-1018',
    softwareName: 'Jira Standard',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBvkzsLQh7SrjtUAWqh9LIANq1bM3S4q_gk0EnXzNPG_WZ1dfGX21HCoRt77DF11OHfHJKdiGhW4Fp-SvXVwB2OTTYiwTsxyl6f8yATYKrmHzea7TAlbLB8sIecvKOHZRpROv_LS67H6x7XAyRWKxqCdJkLxRg1GV3ebKPZCsHr1tPed-6TOMap6dpqlsKA8oIj-oEIh1yRKTznOcUPT3rPqO9UMdNBCizKkWji8Fi-hlXw00IH46H2',
    requestType: 'renewal',
    submittedDate: 'Aug 18, 2026',
    submittedTime: '11:05 AM',
    currentStep: {
      nameKey: 'myRequests.steps.completed',
      descriptionKey: 'myRequests.steps.accessExtended',
      iconType: 'check',
      status: 'completed'
    },
    status: 'completed'
  },
  {
    id: 'REQ-1015',
    softwareName: 'Slack Pro',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2EUYpbGlZKfOfnGcbGPXTFZvdfVMXVufvvKVv68eGB3jhctf2ht8lifH1Fh49REP6V72X2BC6kohvo-S2Pkh3_DlCihhGieVMSWI0dO20lmM3B7U3YVCvhTBmceO7f2dWNxDYMe9CMIWySfklHCpORIOksGfChZBZSmUkcF7DCe1FrNi4YeqboLR7u0J2rWknQ31e40gaOVfZL5v5yyL5ogkJFS1yWp8hus_0gMohfRPGS5Cy6tlS',
    requestType: 'newSoftware',
    submittedDate: 'Aug 15, 2026',
    submittedTime: '04:45 PM',
    currentStep: {
      nameKey: 'myRequests.steps.managerApproval',
      descriptionKey: 'myRequests.steps.managerRejected',
      iconType: 'xmark',
      status: 'rejected'
    },
    status: 'rejected'
  },
  {
    id: 'REQ-1012',
    softwareName: 'Microsoft 365',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBndrgWPYSyMLysSysuVv_l2VlR2rHmf6aXXgggDzALlN1uA9oSIPWl0fh5nYr5v45vb9vH9b3JHM43ggfyEPKZTLNE7CIWvZBoB49kOvBbK0jNKynDlEc8F5_cbiSURLRqRy_z9cyJ7Fn4nTRA_C77lB3xUyFXLEYW8lEkimnQB5sE92Fz-4RhGMKxj-xMDwR2kS5R2qWYzu28NAWtAmzzc_H79x2kvpk3-Y6EG8MLCbNKalSs34ZE',
    requestType: 'renewal',
    submittedDate: 'Aug 10, 2026',
    submittedTime: '10:20 AM',
    currentStep: {
      nameKey: 'myRequests.steps.cancelled',
      descriptionKey: 'myRequests.steps.cancelledByYou',
      iconType: 'xmark',
      status: 'cancelled'
    },
    status: 'cancelled'
  },
  {
    id: 'REQ-1008',
    softwareName: 'Zoom Pro',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDOFhb5O-FUyh3X8oUVgFj1FIbPcW8-zgNkPvEwp08yVjotOFAI-_aWU6521lt57b8qzR7CJ8XFMlkQXku5SqNb2tfyOO8aG9I_c4Zio54pZPk07KXbmdKakXGQHXWes23wRe1RnIBI18UGNMAk06KvLbCLxYHJfXw1FBp-GY1NncAxgfqRL76A215wMUvaXI-WB9Cs0xC-NP7h0GaUvoJ0udGffnZlZTq2zQiaNVlBgm6dQuf5ygGI',
    requestType: 'newSoftware',
    submittedDate: 'Aug 05, 2026',
    submittedTime: '09:30 AM',
    currentStep: {
      nameKey: 'myRequests.steps.completed',
      descriptionKey: 'myRequests.steps.accessGranted',
      iconType: 'check',
      status: 'completed'
    },
    status: 'completed'
  },
  // Additional 6 requests for page 2
  {
    id: 'REQ-1005',
    softwareName: 'Notion Team',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAY2oGXwrNswloS79c3TYFFMeuKDhIXnXy9TbH6L45gO5C4iqaJbdP4nHMhVyYyp8OUy6N8LnEY5UmvOvFc4oc8c8iJ1rPXe2H5eDHF-Yw0KK19QfjGq13_t9TzQk1BtiFSCTlPZrBYDeqSWBTkpuXfj_xBoL4ZFR4GUDHOowEHTwp5WOvwhu28ur4pcZMxs8fokdIGomLcFSKWSvInOLOQrAXQ5ov7npHE9Sn_C8_Jnf125b28Z19A',
    requestType: 'newSoftware',
    submittedDate: 'Jul 28, 2026',
    submittedTime: '03:15 PM',
    currentStep: {
      nameKey: 'myRequests.steps.completed',
      descriptionKey: 'myRequests.steps.accessGranted',
      iconType: 'check',
      status: 'completed'
    },
    status: 'completed'
  },
  {
    id: 'REQ-1001',
    softwareName: 'Linear Standard',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1ydXuIC1_o37YIMstUwxm93oKWWzgssVp-Rw2QVpdZagn1RQGc6a4k3IsoJZaSotj9Xp7NFOBzssLzWBbvgWY-9vDCWJampP4Nz8sw6naQwGm2T7ehwVhMs4yuqhB0DBexwrsXAcd5NgXqKQQQdPAih_jdL-3OrrLgnyLpCLO5fdixK7rv2JDb60XafHMH7o0FhqQTT1Snv7e6PGEEMNPhMmfW3BWeCFf_MDrB7CcxYbKcxgucqwA',
    requestType: 'newSoftware',
    submittedDate: 'Jul 15, 2026',
    submittedTime: '10:00 AM',
    currentStep: {
      nameKey: 'myRequests.steps.completed',
      descriptionKey: 'myRequests.steps.accessGranted',
      iconType: 'check',
      status: 'completed'
    },
    status: 'completed'
  },
  {
    id: 'REQ-0998',
    softwareName: 'Docker Business',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYweHTA7aXpPqNqwpQNlTa2hrupGMR1dtt44E4zMdhQKNDgCiEnGzhZIzUzLcGJtiVc-RWDLG65bJIE-QPgfUodFy8Xfq6jGgWxu_bfsDwfMjQlacDH-HIYlJFf_8mXcqxkKdl_Z29XfiTwpTtP6IhaixTo6OKGDxvXwnXRhkceXKAoV1loaAjuZLK1KMRyZqhS4hB80G6IS1wUrGilHukmJoPQOkIoiId_paOKiTrxbYVFLBwSlXD',
    requestType: 'changePlan',
    submittedDate: 'Jun 22, 2026',
    submittedTime: '11:45 AM',
    currentStep: {
      nameKey: 'myRequests.steps.completed',
      descriptionKey: 'myRequests.steps.accessGranted',
      iconType: 'check',
      status: 'completed'
    },
    status: 'completed'
  },
  {
    id: 'REQ-0992',
    softwareName: 'Postman Enterprise',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2EUYpbGlZKfOfnGcbGPXTFZvdfVMXVufvvKVv68eGB3jhctf2ht8lifH1Fh49REP6V72X2BC6kohvo-S2Pkh3_DlCihhGieVMSWI0dO20lmM3B7U3YVCvhTBmceO7f2dWNxDYMe9CMIWySfklHCpORIOksGfChZBZSmUkcF7DCe1FrNi4YeqboLR7u0J2rWknQ31e40gaOVfZL5v5yyL5ogkJFS1yWp8hus_0gMohfRPGS5Cy6tlS',
    requestType: 'newSoftware',
    submittedDate: 'Jun 05, 2026',
    submittedTime: '01:30 PM',
    currentStep: {
      nameKey: 'myRequests.steps.cancelled',
      descriptionKey: 'myRequests.steps.cancelledByYou',
      iconType: 'xmark',
      status: 'cancelled'
    },
    status: 'cancelled'
  },
  {
    id: 'REQ-0985',
    softwareName: 'Datadog Pro',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBndrgWPYSyMLysSysuVv_l2VlR2rHmf6aXXgggDzALlN1uA9oSIPWl0fh5nYr5v45vb9vH9b3JHM43ggfyEPKZTLNE7CIWvZBoB49kOvBbK0jNKynDlEc8F5_cbiSURLRqRy_z9cyJ7Fn4nTRA_C77lB3xUyFXLEYW8lEkimnQB5sE92Fz-4RhGMKxj-xMDwR2kS5R2qWYzu28NAWtAmzzc_H79x2kvpk3-Y6EG8MLCbNKalSs34ZE',
    requestType: 'renewal',
    submittedDate: 'May 19, 2026',
    submittedTime: '08:50 AM',
    currentStep: {
      nameKey: 'myRequests.steps.completed',
      descriptionKey: 'myRequests.steps.accessExtended',
      iconType: 'check',
      status: 'completed'
    },
    status: 'completed'
  },
  {
    id: 'REQ-0979',
    softwareName: 'Grammarly Business',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDOFhb5O-FUyh3X8oUVgFj1FIbPcW8-zgNkPvEwp08yVjotOFAI-_aWU6521lt57b8qzR7CJ8XFMlkQXku5SqNb2tfyOO8aG9I_c4Zio54pZPk07KXbmdKakXGQHXWes23wRe1RnIBI18UGNMAk06KvLbCLxYHJfXw1FBp-GY1NncAxgfqRL76A215wMUvaXI-WB9Cs0xC-NP7h0GaUvoJ0udGffnZlZTq2zQiaNVlBgm6dQuf5ygGI',
    requestType: 'newSoftware',
    submittedDate: 'May 02, 2026',
    submittedTime: '04:10 PM',
    currentStep: {
      nameKey: 'myRequests.steps.completed',
      descriptionKey: 'myRequests.steps.accessGranted',
      iconType: 'check',
      status: 'completed'
    },
    status: 'completed'
  }
]

const ITEMS_PER_PAGE = 6

export function MyRequestsPage() {
  const navigate = useNavigate()
  const [requests] = useState<SoftwareRequestItem[]>(initialRequests)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setTypeFilter('all')
    setCurrentPage(1)
  }

  // Filter requests based on query, status, and type
  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchId = item.id.toLowerCase().includes(q)
        const matchSoftware = item.softwareName.toLowerCase().includes(q)
        if (!matchId && !matchSoftware) return false
      }

      // Status
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false
      }

      // Type
      if (typeFilter !== 'all' && item.requestType !== typeFilter) {
        return false
      }

      return true
    })
  }, [requests, searchQuery, statusFilter, typeFilter])

  // Paginated items
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredRequests, currentPage])

  const handleCreateRequest = () => {
    navigate('/employee/create-request')
  }

  return (
    <div className='mx-auto max-w-6xl space-y-6'>
      {/* Page Header */}
      <RequestsHeader onCreateRequest={handleCreateRequest} />

      {/* Filters */}
      <RequestsFilters
        onClearFilters={handleClearFilters}
        onSearchChange={(val) => {
          setSearchQuery(val)
          setCurrentPage(1)
        }}
        onStatusFilterChange={(val) => {
          setStatusFilter(val)
          setCurrentPage(1)
        }}
        onTypeFilterChange={(val) => {
          setTypeFilter(val)
          setCurrentPage(1)
        }}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
      />

      {/* Data Table */}
      <div className='overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs'>
        <RequestsTable items={paginatedRequests} />

        {/* Pagination inside table container matching mockup */}
        <RequestsPagination
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          totalItems={filteredRequests.length}
        />
      </div>
    </div>
  )
}
