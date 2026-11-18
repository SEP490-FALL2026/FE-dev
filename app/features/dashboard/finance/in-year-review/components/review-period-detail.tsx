import { AlertTriangle, ArrowLeft, CalendarClock } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetReviewPeriodGet } from '~/shared/api/generated/operations/budget-review-periods'
import {
  FinanceButton,
  FinanceDetailPage,
  FinanceEmpty,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { formatMoney } from '../../shared/finance-money'
import { ReviewLineCard } from './review-line-card'
import { ReviewSignDialog } from './review-sign-dialog'

const PAGE_SIZE = 50

/** Tinted notice inside the page (not an operation result): warning for figures to watch, info for what comes next. */
function Notice({ tone, children }: { tone: 'warning' | 'info'; children: ReactNode }) {
  const Icon = tone === 'warning' ? AlertTriangle : CalendarClock
  return (
    <p
      role='status'
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm leading-relaxed ${
        tone === 'warning'
          ? 'border-warning/30 bg-warning/10 text-warning-ink'
          : 'border-info/25 bg-info/5 text-info-ink'
      }`}
    >
      <Icon aria-hidden className='mt-0.5 size-4 shrink-0' strokeWidth={1.5} />
      <span>{children}</span>
    </p>
  )
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='min-w-0 space-y-1'>
      <dt className='text-[11px] font-semibold tracking-wider text-muted-foreground uppercase'>{label}</dt>
      <dd className='text-sm text-foreground'>{children}</dd>
    </div>
  )
}

export function ReviewPeriodDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate, i18n } = useTranslation('financeReview')
  const [page, setPage] = useState(1)
  const [signing, setSigning] = useState(false)
  const query = useBudgetReviewPeriodGet(id, { page, pageSize: PAGE_SIZE })
  const result = query.data?.data
  const period = result?.period
  const items = result?.items ?? []
  const pending = items.filter((item) => item.explanationStatus === 'PENDING').length
  const morePages = (result?.pagination.totalPages ?? 1) > 1
  const changedAfterSnapshot = items.some((item) => Number(item.changedAfterSnapshot.amount) !== 0)
  const money = (value: { amount: string; currency: string } | null | undefined) => formatMoney(value, i18n.language)
  const signable = Boolean(period && period.state !== 'SIGNED')

  return (
    <FinanceDetailPage>
      <FinancePage
        title={
          period
            ? translate('periods.detailTitle', { month: period.month, year: period.year })
            : translate('periods.title')
        }
        actions={
          <>
            <FinanceButton variant='ghost' onClick={onBack}>
              <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
              {translate('back')}
            </FinanceButton>
            {signable && (
              <FinanceButton variant='primary' onClick={() => setSigning(true)}>
                {translate('periods.sign')}
              </FinanceButton>
            )}
          </>
        }
      >
        <FinanceQueryState query={query} skeleton='detail'>
          {period && (
            <>
              <dl
                aria-label={translate('ui.periodFacts')}
                className='soft-panel grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4'
              >
                <Fact label={translate('state')}>
                  <FinanceStatus value={period.state} label={translate(`periods.state.${period.state}`)} />
                </Fact>
                <Fact label={translate('periods.period')}>{translate(`periods.kind.${period.kind}`)}</Fact>
                <Fact label={translate('periods.closedBy')}>
                  {period.closedBy
                    ? translate('periods.closedByAt', {
                        name: period.closedBy.fullName,
                        date: period.closedAt.slice(0, 10)
                      })
                    : period.closedAt.slice(0, 10)}
                </Fact>
                <Fact label={translate('periods.signedBy')}>
                  {period.signedBy && period.signedAt
                    ? translate('periods.closedByAt', {
                        name: period.signedBy.fullName,
                        date: period.signedAt.slice(0, 10)
                      })
                    : period.explanationsDueOn
                      ? translate('ui.explanationsDue', { date: period.explanationsDueOn })
                      : translate('periods.notSigned')}
                </Fact>
              </dl>
              {period.company && (
                <FinanceSection title={translate('ui.companyFigures')}>
                  <FinanceStatGrid columns={4}>
                    <FinanceStat label={translate('periods.spent')} value={money(period.company.spent)} emphasis />
                    <FinanceStat
                      label={translate('periods.sharedPoolUnallocated')}
                      value={money(period.company.sharedPoolUnallocated)}
                    />
                    <FinanceStat
                      label={translate('periods.sharedPoolReserve')}
                      value={
                        period.company.sharedPoolReserve ? money(period.company.sharedPoolReserve) : translate('none')
                      }
                    />
                    <FinanceStat
                      label={translate('periods.annualCeiling')}
                      value={period.company.annualCeiling ? money(period.company.annualCeiling) : translate('none')}
                    />
                  </FinanceStatGrid>
                </FinanceSection>
              )}
              {period.company?.sharedPoolOverReserve && (
                <Notice tone='warning'>{translate('periods.overReserve')}</Notice>
              )}
              {period.state === 'AWAITING_EXPLANATIONS' && period.explanationsDueOn && (
                <Notice tone='info'>{translate('periods.awaitingBanner', { date: period.explanationsDueOn })}</Notice>
              )}
              {changedAfterSnapshot && <Notice tone='warning'>{translate('periods.changedBanner')}</Notice>}
              {period.note && (
                <p className='rounded-xl border border-border/70 bg-surface-subtle/60 px-4 py-3 text-sm text-muted-foreground'>
                  <span className='font-medium text-foreground'>{translate('periods.signNote')}:</span> {period.note}
                </p>
              )}
            </>
          )}
          <FinanceSection title={translate('periods.lines')}>
            {items.length === 0 ? (
              <FinanceEmpty message={translate('periods.noLines')} />
            ) : (
              <div className='space-y-3'>
                {items.map((item) => (
                  <ReviewLineCard key={item.id} line={item} dueOn={period?.explanationsDueOn ?? null} />
                ))}
              </div>
            )}
            <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
          </FinanceSection>
        </FinanceQueryState>
        {signing && period && (
          <ReviewSignDialog
            periodId={id}
            kind={period.kind}
            unexplained={pending}
            moreLines={morePages}
            onClose={() => setSigning(false)}
          />
        )}
      </FinancePage>
    </FinanceDetailPage>
  )
}
