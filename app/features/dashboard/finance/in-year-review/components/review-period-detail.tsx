import { ArrowLeft } from 'lucide-react'
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
        <FinanceQueryState query={query}>
          {period && (
            <>
              <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground'>
                <FinanceStatus value={period.state} label={translate(`periods.state.${period.state}`)} />
                <span>{translate(`periods.kind.${period.kind}`)}</span>
                {period.closedBy && (
                  <span>
                    {translate('periods.closedBy')}:{' '}
                    {translate('periods.closedByAt', {
                      name: period.closedBy.fullName,
                      date: period.closedAt.slice(0, 10)
                    })}
                  </span>
                )}
                {period.signedBy && period.signedAt && (
                  <span>
                    {translate('periods.signed', {
                      name: period.signedBy.fullName,
                      date: period.signedAt.slice(0, 10)
                    })}
                  </span>
                )}
                {period.explanationsDueOn && (
                  <span>
                    {translate('periods.dueOn')}: {period.explanationsDueOn}
                  </span>
                )}
              </div>
              {period.company && (
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
              )}
              {period.company?.sharedPoolOverReserve && (
                <p role='status' className='text-sm text-warning-ink'>
                  {translate('periods.overReserve')}
                </p>
              )}
              {period.state === 'AWAITING_EXPLANATIONS' && period.explanationsDueOn && (
                <p role='status' className='text-sm text-muted-foreground'>
                  {translate('periods.awaitingBanner', { date: period.explanationsDueOn })}
                </p>
              )}
              {changedAfterSnapshot && (
                <p role='status' className='text-sm text-warning-ink'>
                  {translate('periods.changedBanner')}
                </p>
              )}
              {period.note && (
                <p className='text-sm text-muted-foreground'>
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
