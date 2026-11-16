import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAccessRequestGet } from '~/shared/api/generated/operations/access-requests/access-request-get'
import {
  FinanceButton,
  FinanceEmpty,
  FinancePage,
  FinanceQueryState,
  FinanceSection
} from '../../shared/components/finance-ui'
import { RequestBudgetCheck } from './request-budget-check'

/** Read-only detail of one Request Finance oversees, with the budget check the spend decision relied on. */
export function RequestMonitorDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate } = useTranslation('financeRequests')
  const query = useAccessRequestGet(id)
  const data = query.data?.data
  const request = data && 'request' in data ? data.request : undefined
  const row = (label: string, value: string | number | null | undefined) => (
    <div className='min-w-0'>
      <dt className='text-xs font-medium text-muted-foreground'>{label}</dt>
      <dd className='mt-1 break-words'>{value ?? translate('none')}</dd>
    </div>
  )
  return (
    <FinancePage
      title={translate('detail.title')}
      actions={
        <FinanceButton variant='ghost' onClick={onBack}>
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('back')}
        </FinanceButton>
      }
    >
      <FinanceQueryState query={query}>
        {request ? (
          <>
            <FinanceSection title={translate('detail.summary')}>
              <dl className='grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3'>
                {row(translate('software'), request.plan?.applicationName ?? request.plan?.planName)}
                {row(translate('plan'), request.plan?.planName)}
                {row(translate('type.label'), translate(`type.${request.type}`, { defaultValue: request.type }))}
                {row(translate('stateLabel'), translate(`state.${request.state}`, { defaultValue: request.state }))}
                {row(translate('department'), request.department.name)}
                {row(translate('costCenter'), request.costCenter?.code)}
                {row(translate('requester'), request.requester.fullName)}
                {row(translate('beneficiary'), request.beneficiary?.fullName)}
                {row(translate('termMonths'), request.termMonths ?? translate('longTerm'))}
                {row(translate('budgetYear'), request.budgetYear)}
                {row(translate('submittedAt'), new Date(request.submittedAt).toLocaleString())}
              </dl>
              <p className='mt-4 text-sm break-words'>{request.businessReason}</p>
            </FinanceSection>
            <RequestBudgetCheck requestId={id} />
          </>
        ) : (
          <FinanceEmpty />
        )}
      </FinanceQueryState>
    </FinancePage>
  )
}
