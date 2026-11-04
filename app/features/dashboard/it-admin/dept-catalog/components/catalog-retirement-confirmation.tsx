import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApplicationRetirementConfirm } from '~/shared/api/generated/operations/applications/application-retirement-confirm'
import { getApplicationRetirementGetQueryKey } from '~/shared/api/generated/operations/applications/application-retirement-get'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'

export function CatalogRetirementConfirmation({
  applicationId,
  owner,
  onClose
}: {
  applicationId: string
  owner: { employeeId: string; fullName: string }
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itCatalog')
  const [note, setNote] = useState('')
  const feedback = useItMutationFeedback([getApplicationRetirementGetQueryKey(applicationId)], onClose)
  const mutation = useApplicationRetirementConfirm({ mutation: feedback })
  return (
    <ItFormDialog
      title={translate('ownerReview.confirm')}
      pending={mutation.isPending}
      onClose={onClose}
      submitLabel={translate('ownerReview.confirm')}
      onSubmit={(event) => {
        event.preventDefault()
        if (!mutation.isPending)
          mutation.mutate({
            id: applicationId,
            data: { businessOwnerEmployeeId: owner.employeeId, ...(note.trim() ? { note: note.trim() } : {}) }
          })
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate('ownerReview.hint')}</p>
      <p className='truncate text-sm font-medium' title={owner.fullName}>
        {owner.fullName}
      </p>
      <ItField label={translate('ownerReview.evidence')}>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={2000}
          placeholder={translate('ownerReview.placeholder')}
          className={itInputClass}
        />
      </ItField>
    </ItFormDialog>
  )
}
