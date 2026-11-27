import { isAxiosError } from 'axios'
import { ArrowLeft, EyeOff, FileSearch } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAccessRequestGet } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { useBudgetCheckGet } from '~/shared/api/generated/operations/budget-checks/budget-check-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { formatMoney } from '../../shared/approvals-money'
import { useRequestTermText } from '../../shared/hooks/use-request-term-text'
import { requestTerm } from '~/entities/request/request-term'
import { RequestProgressPanel } from '~/entities/request/components/request-progress-panel'
import { RequestHistoryDisclosure } from '~/entities/request/components/request-history-disclosure'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import {
  ApprovalsButton,
  ApprovalsEmpty,
  ApprovalsPage,
  ApprovalsSection,
  ApprovalsStat,
  ApprovalsStatGrid,
  ApprovalsStatus
} from '../../shared/components/approvals-ui'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Read-only detail of one Request that opened the spend step (the server refuses one still at the need step). */
export function ApprovalMonitorDetail({ requestId, onBack }: { requestId?: string; onBack: () => void }) {
  const { t: translate } = useTranslation('approvalsSpend')
  return (
    <ApprovalsPage
      icon={FileSearch}
      title={translate('monitor.detailTitle')}
      actions={
        <ApprovalsButton variant='ghost' onClick={onBack}>
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('monitor.backToList')}
        </ApprovalsButton>
      }
    >
      {requestId && UUID_PATTERN.test(requestId) ? <MonitorDetailContent requestId={requestId} /> : <ApprovalsEmpty />}
    </ApprovalsPage>
  )
}

function MonitorDetailContent({ requestId }: { requestId: string }) {
  const { t: translate, i18n } = useTranslation('approvalsSpend')
  const { formatDate } = useDashboardFormat()
  const termText = useRequestTermText()
  const query = useAccessRequestGet(requestId)
  // The result of the budget check says whether the request is within the base or uses the reserve; a request not yet submitted has none.
  const budgetCheck = useBudgetCheckGet(requestId, { query: { retry: false } })
  const checkOutcome = budgetCheck.data?.data?.budgetCheck?.outcome
  const data = query.data?.data
  const request = data && 'request' in data ? data.request : undefined
  const status = isAxiosError(query.error) ? query.error.response?.status : undefined
  if (query.isError && (status === 403 || status === 404))
    return (
      <ApprovalsEmpty
        icon={EyeOff}
        message={translate('monitor.notReadable')}
        description={translate('layout.notReadableHint')}
      />
    )
  const money = (value: { amount: string; currency: string } | null | undefined) =>
    value ? formatMoney(value, i18n.language) : translate('unavailable')
  return (
    <ApprovalsQueryState query={query}>
      {request && (
        <div className='space-y-6'>
          <RequestProgressPanel id={requestId} state={request.state} />
          <ApprovalsStatGrid>
            <ApprovalsStat label={translate('monitor.state')} value={<ApprovalsStatus value={request.state} />} />
            <ApprovalsStat
              label={translate('monitor.stage')}
              value={request.spend ? translate(`monitor.stages.${request.spend.stage}`) : '—'}
            />
            <ApprovalsStat
              label={translate('monitor.budgetCheck')}
              value={checkOutcome ? <ApprovalsStatus value={checkOutcome} /> : '—'}
            />
            <ApprovalsStat label={translate('totalPayable')} value={money(request.cost?.currentYear.amount)} emphasis />
            <ApprovalsStat label={translate('budgetYear')} value={request.budgetYear ?? translate('unavailable')} />
            <ApprovalsStat label={translate('monitor.submittedAt')} value={formatDate(request.submittedAt)} />
          </ApprovalsStatGrid>
          <ApprovalsSection title={translate('requestInfo')}>
            <dl className='grid gap-4 rounded-xl border border-border/70 bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] sm:grid-cols-2 lg:grid-cols-3'>
              {[
                { label: translate('monitor.type'), value: translate(`monitor.types.${request.type}`) },
                { label: translate('requester'), value: request.requester.fullName },
                { label: translate('beneficiary'), value: request.beneficiary?.fullName ?? translate('unavailable') },
                { label: translate('monitor.department'), value: request.department.name },
                { label: translate('costCenter'), value: request.costCenter?.code ?? translate('unavailable') },
                {
                  label: translate('term'),
                  value: termText(
                    requestTerm(request.termMonths, request.cost ? request.cost.nextYear !== null : undefined)
                  )
                }
              ].map((fact) => (
                <div key={fact.label} className='space-y-1'>
                  <dt className='text-xs text-muted-foreground'>{fact.label}</dt>
                  <dd className='text-sm break-words'>{fact.value}</dd>
                </div>
              ))}
              <div className='space-y-1 sm:col-span-2 lg:col-span-3'>
                <dt className='text-xs text-muted-foreground'>{translate('monitor.businessReason')}</dt>
                <dd className='text-sm whitespace-pre-wrap'>{request.businessReason}</dd>
              </div>
            </dl>
            <RequestHistoryDisclosure key={requestId} id={requestId} />
          </ApprovalsSection>
          {request.spend?.refusalReason && (
            <ApprovalsSection title={translate('monitor.refusalReason')}>
              <p className='rounded-xl border border-danger/25 bg-danger/5 p-4 text-sm whitespace-pre-wrap'>
                {request.spend.refusalReason}
              </p>
            </ApprovalsSection>
          )}
        </div>
      )}
    </ApprovalsQueryState>
  )
}
