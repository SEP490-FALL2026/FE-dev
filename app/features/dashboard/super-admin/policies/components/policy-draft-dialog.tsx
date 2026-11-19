import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePolicyDraftGet } from '~/shared/api/generated/operations/policies/policy-draft-get'
import { usePolicyDraftPut } from '~/shared/api/generated/operations/policies/policy-draft-put'
import { usePolicyDraftDelete } from '~/shared/api/generated/operations/policies/policy-draft-delete'
import type { DraftWriteBodyDtoContent, PolicyDraftResponseDtoData } from '~/shared/api/generated/model/policies'
import {
  AdminField,
  AdminFormDialog,
  adminButtonClass,
  adminInputClass,
  adminPrimaryClass
} from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { useDashboardFormat } from '../../../dashboard-ui'
import { policyWriteKeys } from '../hooks/policy-cache'
import { usePolicyPresentation } from '../hooks/use-policy-presentation'
import { PolicyPublishDialog } from './policy-publish-dialog'
import { PolicyContentEditor } from './policy-content-editor'

type Draft = NonNullable<PolicyDraftResponseDtoData>
type Form = { title: string; content: DraftWriteBodyDtoContent }
const getForm = (draft: Draft): Form => ({ title: draft.title, content: structuredClone(draft.content) })
function validForm(form: Form) {
  return (
    !!form.title.trim() &&
    form.title.length <= 300 &&
    form.content.sections.length <= 30 &&
    form.content.sections.every(
      (section) =>
        !!section.heading.trim() &&
        section.heading.length <= 200 &&
        !!section.body.trim() &&
        section.body.length <= 20000
    ) &&
    form.content.steps.every(
      (step) =>
        !!step.title.trim() &&
        step.title.length <= 300 &&
        step.checklist.length >= 1 &&
        step.checklist.length <= 30 &&
        new Set(step.checklist.map((item) => item.code)).size === step.checklist.length &&
        step.checklist.every((item) => !!item.text.trim() && item.text.length <= 1000)
    )
  )
}

export function PolicyDraftDialog({ code, onClose }: { code: string; onClose: () => void }) {
  // Start each editor session from a fresh draft without resetting unsaved
  // fields when this session receives a background refetch.
  const query = usePolicyDraftGet(code, { query: { gcTime: 0 } })
  const { t } = useTranslation('admin')
  if (query.data?.data) return <DraftEditor code={code} draft={query.data.data} onClose={onClose} />
  return (
    <section className='space-y-6'>
      <button type='button' className={adminButtonClass} onClick={onClose}>
        {t('policies.back')}
      </button>
      <AdminQueryState query={query}>
        <p className='text-sm text-muted-foreground'>{t('empty')}</p>
      </AdminQueryState>
    </section>
  )
}
function DraftEditor({ code, draft, onClose }: { code: string; draft: Draft; onClose: () => void }) {
  const { t } = useTranslation('admin')
  const { formatDate } = useDashboardFormat()
  const { policyName } = usePolicyPresentation()
  const [form, setForm] = useState(() => getForm(draft))
  const [baseline, setBaseline] = useState(() => JSON.stringify(getForm(draft)))
  const [original] = useState(() => structuredClone(draft.content))
  const [confirmation, setConfirmation] = useState<'publish' | 'discard' | 'leave' | null>(null)
  const dirty = JSON.stringify(form) !== baseline
  const valid = validForm(form)
  const feedback = useAdminMutationFeedback(policyWriteKeys(code))
  const discardFeedback = useAdminMutationFeedback(policyWriteKeys(code), onClose)
  const save = usePolicyDraftPut({
    mutation: {
      ...feedback,
      onSuccess: async (_, variables) => {
        await feedback.onSuccess()
        setBaseline(JSON.stringify(variables.data))
      }
    }
  })
  const discard = usePolicyDraftDelete({ mutation: discardFeedback })
  const pending = save.isPending || discard.isPending
  useEffect(() => {
    if (!dirty) return
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => window.removeEventListener('beforeunload', beforeUnload)
  }, [dirty])
  return (
    <section className='mx-auto max-w-5xl space-y-6'>
      <button
        type='button'
        className={adminButtonClass}
        disabled={pending}
        onClick={() => (dirty ? setConfirmation('leave') : onClose())}
      >
        {t('policies.back')}
      </button>
      <header className='page-banner space-y-2'>
        <h1 className='text-2xl leading-tight font-semibold tracking-tight [text-wrap:balance]'>
          {policyName(code, draft.title)}
        </h1>
        <p className='text-sm text-muted-foreground'>{t('policies.draftHelp')}</p>
        <p className='text-xs text-muted-foreground'>
          {t('policies.updatedAt')}: {formatDate(draft.updatedAt)}
        </p>
      </header>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (pending || !valid || !dirty) return
          save.mutate({ code, data: form })
        }}
        className='space-y-6'
      >
        <fieldset
          disabled={pending}
          className='space-y-6 rounded-xl border border-border/80 bg-surface p-5 shadow-[0_1px_2px_rgb(0_0_0/4%),0_12px_28px_-24px_rgb(35_39_65/40%)]'
        >
          <AdminField required label={t('policies.titleLabel')} description={t('policies.titleHelp')}>
            <input
              required
              maxLength={300}
              placeholder={t('ui.placeholders.policyTitle')}
              className={adminInputClass}
              value={form.title}
              onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
            />
          </AdminField>
          <PolicyContentEditor
            content={form.content}
            original={original}
            onChange={(content) => setForm((previous) => ({ ...previous, content }))}
          />
        </fieldset>
        {dirty && <p className='text-sm text-muted-foreground'>{t('policies.unsaved')}</p>}
        <div className='flex flex-wrap items-center gap-3'>
          <button
            type='submit'
            className={dirty ? adminPrimaryClass : adminButtonClass}
            disabled={pending || !dirty || !valid}
          >
            {t(pending ? 'saving' : 'policies.saveDraft')}
          </button>
          <button
            type='button'
            className={!dirty ? adminPrimaryClass : adminButtonClass}
            disabled={pending || dirty || !valid}
            onClick={() => setConfirmation('publish')}
          >
            {t('policies.publish')}
          </button>
          <button
            type='button'
            className={`${adminButtonClass} text-danger`}
            disabled={pending}
            onClick={() => setConfirmation('discard')}
          >
            {t('policies.discardDraft')}
          </button>
        </div>
      </form>
      {confirmation === 'publish' && (
        <PolicyPublishDialog
          code={code}
          roles={draft.applicableRoles}
          onClose={() => setConfirmation(null)}
          onPublished={onClose}
        />
      )}
      {(confirmation === 'discard' || confirmation === 'leave') && (
        <AdminFormDialog
          title={t(confirmation === 'discard' ? 'policies.discardTitle' : 'policies.leaveTitle')}
          submitLabel={t(confirmation === 'discard' ? 'policies.discardDraft' : 'policies.leaveConfirm')}
          danger
          pending={pending}
          onClose={() => setConfirmation(null)}
          onSubmit={(event) => {
            event.preventDefault()
            if (pending) return
            if (confirmation === 'discard') discard.mutate({ code })
            else onClose()
          }}
        >
          <p className='text-sm text-muted-foreground'>
            {t(confirmation === 'discard' ? 'policies.discardDescription' : 'policies.leaveDescription')}
          </p>
        </AdminFormDialog>
      )}
    </section>
  )
}
