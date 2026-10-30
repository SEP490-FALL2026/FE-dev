import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useOnboardingChecklistGet } from '~/shared/api/generated/operations/onboarding/onboarding-checklist-get'
import { useSuperAdminWatchGet } from '~/shared/api/generated/operations/super-admin-watch/super-admin-watch-get'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { adminButtonClass } from '../../shared/components/admin-form'
import type { SuperAdminSelectTab } from '../../super-admin-nav'
import { SetupSummary } from '../components/setup-summary'
import { AdminHealthCard } from '../components/admin-health-card'
import { DepartmentAttention } from '../components/department-attention'
import { SetupChecklist } from '../components/setup-checklist'
import '../overview.css'

export function SuperAdminOverviewView({ onSelectTab }: { onSelectTab: SuperAdminSelectTab }) {
  const { t: translate } = useTranslation('admin')
  const checklist = useOnboardingChecklistGet()
  const watch = useSuperAdminWatchGet()
  const steps = checklist.data?.data?.steps ?? []
  const refreshing = checklist.isFetching || watch.isFetching
  return (
    <div className='space-y-6'>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <p className='mb-2 text-[11px] font-medium uppercase tracking-widest text-primary-ink'>
            {translate('overview.redesign.eyebrow')}
          </p>
          <h1 className='text-2xl font-semibold leading-tight tracking-tight [text-wrap:balance]'>
            {translate('overview.title')}
          </h1>
          <p className='mt-2 max-w-2xl text-sm text-muted-foreground'>{translate('overview.redesign.subtitle')}</p>
        </div>
        <button
          type='button'
          className={adminButtonClass}
          disabled={refreshing}
          aria-busy={refreshing}
          onClick={() => {
            void Promise.all([checklist.refetch(), watch.refetch()])
          }}
        >
          <RefreshCw aria-hidden strokeWidth={1.5} className={`size-4 ${refreshing ? 'animate-spin' : ''}`} />
          {translate('overview.redesign.refresh')}
        </button>
      </header>
      <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
        <AdminQueryState query={checklist}>
          <SetupSummary steps={steps} />
        </AdminQueryState>
        <AdminQueryState query={watch}>
          <AdminHealthCard data={watch.data?.data} />
        </AdminQueryState>
      </div>
      {checklist.isSuccess && (
        <div className='grid items-start gap-4 2xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,1fr)]'>
          <DepartmentAttention steps={steps} onSelectTab={onSelectTab} />
          <SetupChecklist steps={steps} onSelectTab={onSelectTab} />
        </div>
      )}
    </div>
  )
}
