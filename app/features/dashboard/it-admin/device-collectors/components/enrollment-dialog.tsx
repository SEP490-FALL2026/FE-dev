import { useTranslation } from 'react-i18next'
import { ItFormDialog } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { useEnrollmentCode } from '../hooks/use-enrollment-code'

export function EnrollmentDialog({ registrationId, onClose }: { registrationId: string; onClose: () => void }) {
  const { t: translate } = useTranslation('itDevices')
  const feedback = useItMutationFeedback([])
  const operation = useEnrollmentCode(
    registrationId,
    () => {
      void feedback.onSuccess()
    },
    feedback.onError
  )
  return (
    <ItFormDialog
      title={translate('enroll')}
      pending={operation.pending}
      onClose={onClose}
      submitLabel={translate('generate')}
      submitDisabled={!!operation.secret}
      onSubmit={(event) => {
        event.preventDefault()
        void operation.create()
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate('hints.enroll')}</p>
      {operation.secret && (
        <div className='space-y-3'>
          <p className='text-sm'>{translate('secretWarning')}</p>
          <output className='block select-all break-all rounded-md bg-surface-subtle p-4 font-mono text-xl'>
            {operation.secret.code}
          </output>
          <p className='text-xs text-muted-foreground'>
            {translate('expires', {
              value: new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'short' }).format(
                new Date(operation.secret.expiresAt)
              )
            })}
          </p>
        </div>
      )}
    </ItFormDialog>
  )
}
