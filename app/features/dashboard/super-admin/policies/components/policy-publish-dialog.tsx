import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePolicyDraftPublish } from '~/shared/api/generated/operations/policies/policy-draft-publish'
import type { PublishBodyDtoApplicableRolesItem } from '~/shared/api/generated/model/policies'
import { AdminField, AdminFormDialog, adminInputClass } from '../../shared/components/admin-form'
import { AdminSelect } from '../../shared/components/admin-select'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { policyWriteKeys } from '../hooks/policy-cache'
import { usePolicyPresentation } from '../hooks/use-policy-presentation'

const ROLE_OPTIONS: PublishBodyDtoApplicableRolesItem[] = [
  'EMPLOYEE',
  'MANAGER',
  'IT_ADMIN',
  'FINANCE',
  'SPENDING_APPROVER'
]
export function PolicyPublishDialog({
  code,
  roles,
  onClose,
  onPublished
}: {
  code: string
  roles: string[]
  onClose: () => void
  onPublished: () => void
}) {
  const { t } = useTranslation('admin')
  const { roleName } = usePolicyPresentation()
  const [changeNote, setChangeNote] = useState('')
  const [applicableRoles, setApplicableRoles] = useState<PublishBodyDtoApplicableRolesItem[]>(
    ROLE_OPTIONS.filter((role) => roles.includes(role))
  )
  const [reack, setReack] = useState('yes')
  const feedback = useAdminMutationFeedback(policyWriteKeys(code), onPublished)
  const mutation = usePolicyDraftPublish({ mutation: feedback })
  const valid = !!changeNote.trim() && applicableRoles.length >= 1 && applicableRoles.length <= 5
  return (
    <AdminFormDialog
      title={t('policies.publish')}
      onClose={onClose}
      pending={mutation.isPending}
      submitLabel={t('policies.publishConfirm')}
      submitDisabled={!valid}
      onSubmit={(event) => {
        event.preventDefault()
        if (!valid || mutation.isPending) return
        mutation.mutate({
          code,
          data: { changeNote: changeNote.trim(), applicableRoles, requiresReacknowledgement: reack === 'yes' }
        })
      }}
    >
      <p className='text-sm text-muted-foreground'>{t('policies.publishNotice')}</p>
      <AdminField required label={t('policies.changeNote')} description={t('policies.issuingHelp')}>
        <textarea
          required
          rows={3}
          maxLength={1000}
          placeholder={t('policies.changeNotePlaceholder')}
          className={adminInputClass}
          value={changeNote}
          onChange={(event) => setChangeNote(event.target.value)}
        />
      </AdminField>
      <fieldset className='space-y-3' aria-describedby='policy-role-help'>
        <legend className='text-sm font-medium'>
          {t('policies.applicableRoles')}
          <span aria-hidden className='ml-1 text-danger'>
            *
          </span>
        </legend>
        <p id='policy-role-help' className='text-xs text-muted-foreground'>
          {t('policies.rolesHelp')}
        </p>
        <div className='grid gap-2 sm:grid-cols-2'>
          {ROLE_OPTIONS.map((role) => (
            <label key={role} className='flex min-h-11 cursor-pointer items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={applicableRoles.includes(role)}
                onChange={() =>
                  setApplicableRoles((previous) =>
                    previous.includes(role) ? previous.filter((entry) => entry !== role) : [...previous, role]
                  )
                }
              />
              {roleName(role)}
            </label>
          ))}
        </div>
      </fieldset>
      <AdminField required label={t('policies.reackLabel')} description={t('policies.reackHelp')}>
        <AdminSelect
          required
          value={reack}
          onChange={setReack}
          options={[
            { value: 'yes', label: t('policies.reackYes') },
            { value: 'no', label: t('policies.reackNo') }
          ]}
          placeholder={t('ui.pickReack')}
        />
      </AdminField>
    </AdminFormDialog>
  )
}
