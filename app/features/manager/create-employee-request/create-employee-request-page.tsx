import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import { teamMembers } from '~/entities/user/team-members-demo'
import { managerEmployeePreview } from '~/entities/user/manager-employee-preview'
import { useDocumentTitle } from '~/shared/lib/use-document-title'
import { CurrentAssignments } from './components/current-assignments'
import { EmployeePicker } from './components/employee-picker'
import { RequestProgress } from './components/request-progress'
import { RequestSummary } from './components/request-summary'

export function CreateEmployeeRequestPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('createEmployee.documentTitle'))
  const [params, setParams] = useSearchParams()
  const employeeId = params.get('employee') ?? managerEmployeePreview.id
  const employee = teamMembers.find((member) => member.id === employeeId)
  const select = (id: string) => {
    const next = new URLSearchParams(params)
    next.set('employee', id)
    setParams(next, { replace: true })
  }
  return (
    <div className='mx-auto max-w-6xl space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>{t('createEmployee.title')}</h1>
        <p className='mt-1 text-sm text-neutral-500'>{t('createEmployee.subtitle')}</p>
      </div>
      <RequestProgress />
      <div className='grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]'>
        <section className='min-w-0 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8'>
          <h2 className='text-lg font-bold'>{t('createEmployee.selectTitle')}</h2>
          <p className='mt-1 mb-6 text-sm text-neutral-500'>{t('createEmployee.selectHint')}</p>
          <EmployeePicker selected={employee} invalid={!!employeeId && !employee} onSelect={select} />
          <div className='mt-6'>
            <CurrentAssignments employeeId={employee?.id} />
          </div>
          <div className='mt-6 flex gap-3 rounded-lg border border-neutral-200 bg-brand-bg p-4'>
            <Info size={18} aria-hidden='true' className='mt-0.5 shrink-0 text-brand-600' />
            <div>
              <h3 className='text-sm font-medium'>{t('createEmployee.approvalTitle')}</h3>
              <p className='mt-1 text-sm text-neutral-500'>{t('createEmployee.approvalHint')}</p>
            </div>
          </div>
          <div className='mt-8 flex items-center justify-between gap-3 border-t border-neutral-200 pt-6'>
            <Link
              to={employee ? `/manager/my-team/${employee.id}` : '/manager/my-team'}
              className='rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-500 hover:bg-brand-bg'
            >
              {t('createEmployee.cancel')}
            </Link>
            <button
              type='button'
              disabled
              title={t('createEmployee.nextUnavailable')}
              className='rounded-lg bg-brand-500 px-6 py-2 text-sm font-medium text-white disabled:cursor-not-allowed'
            >
              {t('createEmployee.next')}
            </button>
          </div>
          <p className='mt-3 text-xs leading-relaxed text-neutral-500'>{t('createEmployee.nextUnavailable')}</p>
        </section>
        <RequestSummary employee={employee} />
      </div>
      <p className='text-xs leading-relaxed text-neutral-500'>{t('createEmployee.sample')}</p>
    </div>
  )
}
