import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { requestTerm } from '~/entities/request/request-term'
import { useAccessRequestGet } from '~/shared/api/generated/operations/access-requests/access-request-get'
import {
  FinanceButton,
  FinanceEmpty,
  FinancePage,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { RequestBudgetCheck } from './request-budget-check'

/** Read-only detail of one Request Finance oversees, with the budget check the spend decision relied on. */
export function RequestMonitorDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate, i18n } = useTranslation('financeRequests')
  const query = useAccessRequestGet(id)
  const data = query.data?.data
  const request = data && 'request' in data ? data.request : undefined
  const term = requestTerm(request?.termMonths, request?.cost ? request.cost.nextYear !== null : undefined)
  const termText =
    term.kind === 'MONTHS'
      ? translate('detail.months', { count: term.months })
      : term.kind === 'OPEN_ENDED'
        ? translate('longTerm')
        : term.kind === 'ONE_TIME'
          ? translate('oneTime')
          : translate('none')
  const software = request?.plan?.applicationName ?? request?.plan?.planName
  const row = (label: string, value: string | number | null | undefined) => (
    <div className='min-w-0'>
      <dt className='text-xs font-medium text-muted-foreground'>{label}</dt>
      <dd className='mt-1 text-sm wrap-break-word text-foreground'>{value ?? translate('none')}</dd>
    </div>
  )
  return (
    <FinancePage
      title={
        software
          ? `${software}${request?.plan?.planName && request.plan.planName !== software ? ` · ${request.plan.planName}` : ''}`
          : translate('detail.title')
      }
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
            <FinanceStatGrid columns={4}>
              <FinanceStat
                label={translate('stateLabel')}
                value={
                  <FinanceStatus
                    value={request.state}
                    label={translate(`state.${request.state}`, { defaultValue: request.state })}
                  />
                }
              />
              <FinanceStat
                label={translate('type.label')}
                value={translate(`type.${request.type}`, { defaultValue: request.type })}
              />
              <FinanceStat label={translate('detail.term')} value={termText} />
              <FinanceStat
                label={translate('submittedAt')}
                value={new Date(request.submittedAt).toLocaleDateString(i18n.language)}
              />
            </FinanceStatGrid>
            <FinanceSection title={translate('detail.info')}>
              <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-2 lg:grid-cols-3'>
                {row(translate('requester'), request.requester.fullName)}
                {row(
                  translate('beneficiary'),
                  request.lineCount > 1
                    ? translate('groupLines', { count: request.lineCount })
                    : request.beneficiary?.fullName
                )}
                {row(translate('department'), request.department.name)}
                {row(translate('costCenter'), request.costCenter?.code)}
                {row(translate('budgetYear'), request.budgetYear)}
              </dl>
            </FinanceSection>
            {request.businessReason && (
              <FinanceSection title={translate('detail.reason')}>
                <p className='rounded-lg border border-border/70 bg-surface p-4 text-sm wrap-break-word whitespace-pre-wrap'>
                  {request.businessReason}
                </p>
              </FinanceSection>
            )}
            <RequestBudgetCheck requestId={id} />
          </>
        ) : (
          <FinanceEmpty />
        )}
      </FinanceQueryState>
    </FinancePage>
  )
}
