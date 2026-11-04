import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { toast } from 'sonner'
import { useContractCreate } from '~/shared/api/generated/operations/contracts/contract-create'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { getItError } from '../../shared/hooks/it-errors'
export function ContractCreateDialog({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const { t: translate } = useTranslation('itPurchases')
  const feedback = useItMutationFeedback([])
  const [uncertain, setUncertain] = useState(false)
  const mutation = useContractCreate({
    mutation: {
      onError: async (error) => {
        setUncertain(getItError(error).key === 'unknownOutcome')
        await feedback.onError(error)
      },
      onSuccess: async (result) => {
        if (!result.data?.contract) {
          setUncertain(true)
          toast.error(translate('contractUncertain'), { id: 'it-admin-write' })
          return
        }
        await feedback.onSuccess()
        onCreated(result.data.contract.id)
        onClose()
      }
    }
  })
  return (
    <ItFormDialog
      title={translate('create')}
      onClose={onClose}
      pending={mutation.isPending}
      submitLabel={translate('create')}
      submitDisabled={uncertain}
      onSubmit={(event) => {
        event.preventDefault()
        const name = String(new FormData(event.currentTarget).get('name') ?? '').trim()
        if (!mutation.isPending && !uncertain) mutation.mutate({ data: name ? { name } : {} })
      }}
    >
      <ItField label={translate('name')}>
        <input name='name' maxLength={200} placeholder={translate('namePlaceholder')} className={itInputClass} />
      </ItField>
      {uncertain && (
        <p role='status' className='text-sm text-danger-ink'>
          {translate('contractUncertain')}
        </p>
      )}
    </ItFormDialog>
  )
}
