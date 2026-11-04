import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { DelegatedBodyDto } from '~/shared/api/generated/model/delegated-requests/delegatedBodyDto'
import { accessRequestPreview } from '~/shared/api/generated/operations/access-requests/access-request-preview'
import { ManagerButton, ManagerMoney, ManagerQueryState } from '../../shared/components/manager-api-ui'

export function ManagerDelegatedPreview({
  body,
  blocked,
  busy,
  onConfirm,
  onCancel
}: {
  body: DelegatedBodyDto
  blocked: boolean
  busy: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const { t: translate } = useTranslation('manager')
  const item = body.items[0]
  const previewBody = {
    planId: item.planId,
    termMonths: body.termMonths,
    ...(item.expectedSpendOn ? { expectedSpendOn: item.expectedSpendOn } : {})
  }
  const query = useQuery({
    queryKey: ['manager-delegated-preview', previewBody, body.beneficiaryEmployeeIds],
    queryFn: ({ signal }) => accessRequestPreview(previewBody, undefined, signal),
    retry: false
  })
  const preview = !query.isError ? query.data?.data?.preview : null
  return (
    <div className='space-y-4'>
      <ManagerQueryState query={query} empty={!preview} />
      {preview && (
        <>
          <p className='text-sm text-muted-foreground'>{translate('integration.previewHint')}</p>
          <div className='flex justify-between gap-3 text-sm'>
            <span>{translate('integration.estimatedAmount')}</span>
            <ManagerMoney money={preview.costEstimate?.estimatedCost ?? preview.pricing.amount} />
          </div>
          {!preview.canSubmit && <p className='text-sm text-warning-ink'>{translate('integration.previewBlocked')}</p>}
        </>
      )}
      <div className='flex justify-end gap-3'>
        <ManagerButton disabled={busy} onClick={onCancel}>
          {translate('cancel')}
        </ManagerButton>
        <ManagerButton
          primary
          busy={busy}
          disabled={blocked || !preview?.canSubmit || query.isFetching}
          onClick={onConfirm}
        >
          {translate('confirm')}
        </ManagerButton>
      </div>
    </div>
  )
}
