import { useState } from 'react'
import { useDashboardFormat } from '../../../dashboard-ui'
import { useTranslation } from 'react-i18next'
import { useOffboardingCaseList } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-list'
import type { OffboardingCaseListParams } from '~/shared/api/generated/model/offboarding-cases/offboardingCaseListParams'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'
import { OffboardingDetails } from '../components/offboarding-details'
import { OffboardingState } from '../enums/offboarding-state'

export function ItOffboardingView({
  onSelectTab,
  initialCaseId
}: {
  onSelectTab: (tab: ItAdminTabKey) => void
  initialCaseId?: string
}) {
  const { t: translate } = useTranslation('itOffboarding')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [state, setState] = useState<OffboardingCaseListParams['state']>()
  const [selected, setSelected] = useState(initialCaseId)
  const query = useOffboardingCaseList({ page, pageSize: 20, state })
  const data = query.data?.data
  if (selected)
    return (
      <OffboardingDetails
        key={selected}
        id={selected}
        onBack={() => setSelected(undefined)}
        onSelectTab={onSelectTab}
      />
    )
  return (
    <div className='space-y-5'>
      <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('title')}</h1>
      <div className='flex flex-wrap gap-2' role='group' aria-label={translate('filter')}>
        {[undefined, ...Object.values(OffboardingState)].map((value) => (
          <button
            key={value ?? 'all'}
            className={itButtonClass}
            aria-pressed={state === value}
            onClick={() => {
              setState(value)
              setPage(1)
            }}
          >
            {value ? translate(`states.${value}`) : translate('all')}
          </button>
        ))}
      </div>
      <ItQueryState query={query}>
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
          {data?.items.map((item) => (
            <button
              key={item.id}
              className='space-y-2 rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:bg-surface-subtle focus-visible:outline-primary'
              onClick={() => setSelected(item.id)}
            >
              <p className='truncate font-semibold' title={item.employee.fullName}>
                {item.employee.fullName}
              </p>
              <p className='text-sm text-muted-foreground'>{item.employee.employeeCode}</p>
              <p className='text-sm'>
                {translate('lastDay')}: {formatDate(item.lastWorkingDay)}
              </p>
              <p className='text-sm'>
                {translate(`states.${item.state}`, { defaultValue: translate('states.UNKNOWN') })} ·{' '}
                {translate('rightsCount', { count: item.heldRights })}
              </p>
              {item.accountLockMissing && <p className='text-sm text-danger'>{translate('lockMissing')}</p>}
              {item.closed && <p className='text-sm'>{translate('closed')}</p>}
            </button>
          ))}
          {!data?.items.length && <ItEmpty />}
        </div>
      </ItQueryState>
      <ItPagination page={page} total={data?.pagination.totalItems ?? 0} pageSize={20} onChange={setPage} />
    </div>
  )
}
