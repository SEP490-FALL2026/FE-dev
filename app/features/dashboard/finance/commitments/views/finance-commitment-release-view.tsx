import { ArrowLeft } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'
import {
  FinanceButton,
  FinanceEmpty,
  FinanceField,
  FinancePage,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { getFinanceError } from '../../shared/finance-errors'
import { formatMoney } from '../../shared/finance-money'
import type { FinanceTabKey } from '../../enums'
import { useCommitmentReleases, useFinanceCommitments, useReleaseCommitment } from '../hooks/use-finance-commitments'

interface CommitmentReleaseViewProps {
  itemId?: string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}

/** Release of the held remainder of one commitment, on its own screen with the releases made before. */
export function FinanceCommitmentReleaseView({ itemId, onSelectTab }: CommitmentReleaseViewProps) {
  const { t: translate, i18n } = useTranslation('finance')
  const { t: translateSettings } = useTranslation('financeSettings')
  const [searchParams] = useSearchParams()
  const requestId = searchParams.get('request') ?? undefined
  const [reason, setReason] = useState('')
  const list = useFinanceCommitments({ requestId, pageSize: 100 })
  const releases = useCommitmentReleases(itemId)
  const mutation = useReleaseCommitment(itemId ?? '')
  const commitment = list.data?.items.find((item) => item.id === itemId)
  const releasable = Boolean(commitment && commitment.state !== 'RELEASED' && Number(commitment.held.amount) > 0)
  const back = () => onSelectTab('commitments')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!releasable || !reason.trim() || mutation.isPending) return
    mutation.mutate(reason.trim(), {
      onSuccess: () => {
        toast.success(translate('commitmentRelease.success'), { id: 'finance-commitment-release' })
        back()
      },
      onError: (error: unknown) => {
        const failure = getFinanceError(error)
        toast.error(translate(`errors.${failure.ambiguous ? 'ambiguous' : failure.key}`), {
          id: 'finance-commitment-release'
        })
      }
    })
  }

  return (
    <FinancePage
      title={translate('releaseRemainder')}
      actions={
        <FinanceButton variant='ghost' onClick={back}>
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('commitmentRelease.back')}
        </FinanceButton>
      }
    >
      <FinanceQueryState query={list}>
        {commitment ? (
          <>
            <FinanceStatGrid columns={4}>
              <FinanceStat label={translateSettings('department')} value={commitment.costCenter.name} />
              <FinanceStat
                label={translate('commitmentRelease.amount')}
                value={formatMoney(commitment.amount, i18n.language)}
              />
              <FinanceStat
                label={translate('commitmentRelease.released')}
                value={formatMoney(commitment.released, i18n.language)}
              />
              <FinanceStat emphasis label={translate('held')} value={formatMoney(commitment.held, i18n.language)} />
            </FinanceStatGrid>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <FinanceStatus value={commitment.state} />
              <span>{commitment.request?.software.name}</span>
            </div>
            <FinanceSection title={translate('releaseRemainder')}>
              {releasable ? (
                <form className='space-y-4' onSubmit={submit}>
                  <FinanceField required label={translate('commitmentRelease.reasonLabel')}>
                    <textarea
                      required
                      rows={4}
                      maxLength={1000}
                      className={`${financeInputClass} resize-none`}
                      placeholder={translate('commitmentRelease.reasonPlaceholder')}
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                    />
                  </FinanceField>
                  <div className='flex gap-3'>
                    <FinanceButton
                      variant='primary'
                      type='submit'
                      pending={mutation.isPending}
                      disabled={!reason.trim()}
                    >
                      {translate('releaseRemainder')}
                    </FinanceButton>
                    <FinanceButton variant='ghost' onClick={back}>
                      {translate('commitmentRelease.cancel')}
                    </FinanceButton>
                  </div>
                </form>
              ) : (
                <p role='status' className='text-sm text-muted-foreground'>
                  {translate('commitmentRelease.nothingToRelease')}
                </p>
              )}
            </FinanceSection>
          </>
        ) : (
          <FinanceEmpty message={translate('commitmentRelease.notFound')} />
        )}
      </FinanceQueryState>

      <FinanceSection title={translate('commitmentRelease.history')}>
        <FinanceQueryState query={releases}>
          <FinanceTable
            items={releases.data ?? []}
            rowKey={(release) => release.id}
            columns={[
              {
                key: 'amount',
                label: translate('commitmentRelease.amount'),
                numeric: true,
                render: (release) => formatMoney(release.amount, i18n.language)
              },
              {
                key: 'reason',
                label: translate('commitmentRelease.reasonLabel'),
                render: (release) =>
                  release.reasonText ??
                  translate(`commitmentRelease.reasons.${release.reason}`, { defaultValue: release.reason })
              },
              {
                key: 'by',
                label: translate('commitmentRelease.by'),
                render: (release) => release.releasedBy?.fullName ?? translate('commitmentRelease.system')
              },
              {
                key: 'at',
                label: translate('commitmentRelease.at'),
                numeric: true,
                render: (release) => new Date(release.releasedAt).toLocaleString(i18n.language)
              }
            ]}
          />
        </FinanceQueryState>
      </FinanceSection>
    </FinancePage>
  )
}
