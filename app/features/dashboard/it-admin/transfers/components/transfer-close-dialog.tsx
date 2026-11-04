import { useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useDepartmentTransferClose } from '~/shared/api/generated/operations/department-transfers/department-transfer-close'
import { getDepartmentTransferGetQueryKey } from '~/shared/api/generated/operations/department-transfers/department-transfer-get'
import { getDepartmentTransferListQueryKey } from '~/shared/api/generated/operations/department-transfers/department-transfer-list'
import { ItFormDialog } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { getItError } from '../../shared/hooks/it-errors'

export function TransferCloseDialog({ id, allowed, onClose }: { id: string; allowed: boolean; onClose: () => void }) {
  const { t: translate } = useTranslation('itTransfers')
  const [uncertain, setUncertain] = useState(false)
  const feedback = useItMutationFeedback(
    [getDepartmentTransferGetQueryKey(id), getDepartmentTransferListQueryKey()],
    onClose
  )
  const mutation = useDepartmentTransferClose({
    mutation: {
      ...feedback,
      retry: false,
      onError: async (error) => {
        setUncertain(getItError(error).key === 'unknownOutcome')
        await feedback.onError(error)
        const blockers = axios.isAxiosError<{ error?: { details?: { blockers?: unknown } } }>(error)
          ? error.response?.data.error?.details?.blockers
          : undefined
        if (Array.isArray(blockers)) {
          if (blockers.includes('SERVICE_ACCOUNT_UNASSIGNED'))
            toast.error(translate('close.blockedService'), { id: 'it-admin-write' })
          else if (blockers.includes('NOT_EFFECTIVE'))
            toast.error(translate('close.blockedEffective'), { id: 'it-admin-write' })
        }
      }
    }
  })
  return (
    <ItFormDialog
      title={translate('close.action')}
      pending={mutation.isPending}
      submitDisabled={!allowed || uncertain}
      submitLabel={translate('close.confirm')}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault()
        if (allowed && !uncertain && !mutation.isPending) mutation.mutate({ id })
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate('close.hint')}</p>
      {uncertain && (
        <p role='status' className='text-sm text-danger-ink'>
          {translate('close.uncertain')}
        </p>
      )}
    </ItFormDialog>
  )
}
