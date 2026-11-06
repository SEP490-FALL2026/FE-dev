import { AlertTriangle, ReceiptText, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetCommitmentList } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import {
  FinanceButton,
  FinanceDrawer,
  FinanceEmpty,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { formatMoney } from '../../shared/finance-money'
import { CommitmentState } from '../enums/commitment-state'
import type { Commitment } from '../hooks/use-commitment-actions'
import { CommitmentInvoices } from './commitment-invoices'
import { CommitmentReleases } from './commitment-releases'
import { InvoiceFormDrawer } from './invoice-form-drawer'
import { ReleaseDrawer } from './release-drawer'

/** The API has no single-commitment read; a request has few commitments, so they are read by request and matched by id. */
const commitmentsOfRequestPageSize = 100

export function CommitmentDetail({
  id,
  requestId,
  onClose,
  backLabel
}: {
  id: string
  requestId: string | null
  onClose: () => void
  backLabel?: string
}) {
  const { t: translate } = useTranslation('financeSpend')
  const commitments = useBudgetCommitmentList(
    { requestId: requestId ?? undefined, pageSize: commitmentsOfRequestPageSize },
    { query: { enabled: Boolean(requestId) } }
  )
  const commitment = commitments.data?.data?.items.find((item) => item.id === id)
  const title = commitment?.request
    ? `${commitment.request.software.name} · ${commitment.costCenter.name}`
    : translate('commitments.detail.fallbackTitle')
  return (
    <FinanceDrawer title={title} onClose={onClose} backLabel={backLabel}>
      {!requestId ? (
        <FinanceEmpty message={translate('commitments.detail.missingRequest')} />
      ) : (
        <FinanceQueryState query={commitments}>
          {commitment ? (
            <CommitmentContent commitment={commitment} />
          ) : (
            <FinanceEmpty message={translate('commitments.detail.notFound')} />
          )}
        </FinanceQueryState>
      )}
    </FinanceDrawer>
  )
}

function CommitmentContent({ commitment }: { commitment: Commitment }) {
  const { t: translate, i18n } = useTranslation('financeSpend')
  const { formatDateTime } = useWorkspaceFormat()
  const [form, setForm] = useState<'invoice' | 'release' | null>(null)
  const money = (value: { amount: string; currency: string }) => formatMoney(value, i18n.language)
  // Unknown states block both actions; a released commitment takes no invoice (INVOICE.COMMITMENT_RELEASED).
  const canRecord = commitment.state === CommitmentState.HELD || commitment.state === CommitmentState.EXPENSED
  const canRelease = commitment.state === CommitmentState.HELD
  const request = commitment.request
  const noValue = translate('noValue')
  const requestFacts: [string, string][] = [
    [translate('commitments.columns.software'), request?.software.name ?? translate('commitments.requestUnavailable')],
    [translate('commitments.detail.plan'), request ? (request.plan?.name ?? translate('commitments.noPlan')) : noValue],
    [
      translate('commitments.detail.requester'),
      request ? `${request.requester.fullName} · ${request.requester.employeeCode}` : noValue
    ],
    [translate('commitments.detail.beneficiaries'), request ? String(request.beneficiaryCount) : noValue],
    [
      translate('commitments.detail.spendApprovedAt'),
      request?.spendApprovedAt ? formatDateTime(request.spendApprovedAt) : noValue
    ],
    [translate('commitments.detail.costCenter'), `${commitment.costCenter.code} · ${commitment.costCenter.name}`],
    [translate('commitments.detail.year'), String(commitment.year)]
  ]
  return (
    <>
      <FinanceSection
        title={translate('commitments.detail.figures')}
        actions={
          canRelease && (
            <FinanceButton onClick={() => setForm('release')}>
              <Undo2 aria-hidden className='size-4' strokeWidth={1.5} />
              {translate('commitments.release.action')}
            </FinanceButton>
          )
        }
      >
        <div className='flex flex-wrap items-center gap-3'>
          <FinanceStatus value={commitment.state} />
          {commitment.hasDiscrepancy && (
            <p role='note' className='inline-flex items-center gap-1.5 text-sm text-danger-ink'>
              <AlertTriangle aria-hidden className='size-4 shrink-0' strokeWidth={1.5} />
              {translate('commitments.detail.discrepancyNote')}
            </p>
          )}
        </div>
        <FinanceStatGrid columns={4}>
          <FinanceStat label={translate('commitments.columns.amount')} value={money(commitment.amount)} />
          <FinanceStat label={translate('commitments.columns.held')} value={money(commitment.held)} emphasis />
          <FinanceStat label={translate('commitments.columns.invoiced')} value={money(commitment.invoiced)} />
          <FinanceStat label={translate('commitments.columns.released')} value={money(commitment.released)} />
        </FinanceStatGrid>
      </FinanceSection>
      <FinanceSection title={translate('commitments.detail.request')}>
        <dl className='grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2'>
          {requestFacts.map(([label, value]) => (
            <div key={label} className='min-w-0 space-y-0.5'>
              <dt className='text-muted-foreground'>{label}</dt>
              <dd className='truncate' title={value}>
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </FinanceSection>
      <CommitmentInvoices
        commitmentId={commitment.id}
        action={
          canRecord && (
            <FinanceButton variant='primary' onClick={() => setForm('invoice')}>
              <ReceiptText aria-hidden className='size-4' strokeWidth={1.5} />
              {translate('commitments.record.action')}
            </FinanceButton>
          )
        }
      />
      <CommitmentReleases commitmentId={commitment.id} />
      {form === 'invoice' && <InvoiceFormDrawer commitment={commitment} onClose={() => setForm(null)} />}
      {form === 'release' && <ReleaseDrawer commitment={commitment} onClose={() => setForm(null)} />}
    </>
  )
}
