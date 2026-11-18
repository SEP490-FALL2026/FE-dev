import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequestableApplicationList } from '~/shared/api/generated/operations/requestable-software/requestable-application-list'
import { accessRequestPropose } from '~/shared/api/generated/operations/access-requests/access-request-propose'
import { getMeAccessRequestListQueryKey } from '~/shared/api/generated/operations/me/me-access-request-list'
import { useApiWrite } from '~/shared/api/use-api-write'
import { useCatalogSearch } from '~/shared/hooks/use-catalog-search'
import { SearchableSelect } from '~/shared/ui/searchable-select'
import { TermMonthsField } from './term-months-field'
import { softwareProposalPayload, existingSoftwareFromError, type ExistingSoftware } from '../software-proposal'
import { requestContractErrorKey } from '../request-contract-errors'
import type { ProposalBodyDto } from '~/shared/api/generated/model'

const input = 'min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-base md:text-sm'
export function SoftwareProposalForm({
  onCreated,
  onUsePlan
}: {
  onCreated: (id: string) => void
  onUsePlan: (planId: string) => void
}) {
  const { t } = useTranslation('requestFlow')
  const { t: employee } = useTranslation('employee')
  const { t: common } = useTranslation('common')
  const [existing, setExisting] = useState(false)
  const [application, setApplication] = useState<{ id: string; name: string } | null>(null)
  const [duplicate, setDuplicate] = useState<ExistingSoftware>()
  const search = useCatalogSearch()
  const apps = useRequestableApplicationList(
    { search: search.search || undefined, page: 1, pageSize: 50 },
    { query: { enabled: existing } }
  )
  const action = useApiWrite({
    mutationFn: async (payload: ProposalBodyDto) => {
      const result = await accessRequestPropose(payload)
      if (!result.data?.request.id) throw new Error('API.WRITE_OUTCOME_UNKNOWN')
      return result
    },
    invalidate: [getMeAccessRequestListQueryKey()],
    onSuccess: (result) => {
      if (result.data?.request.id) onCreated(result.data.request.id)
    },
    errorMessage: (_code, error) => {
      const key = requestContractErrorKey(error)
      return key ? t(key) : undefined
    },
    onError: (_code, error) => setDuplicate(existingSoftwareFromError(error))
  })
  const field = (name: string, label: string, placeholder: string, type = 'text', maxLength = 200) => (
    <label className='grid gap-2 text-sm font-medium'>
      {label}
      <input
        name={name}
        type={type}
        required
        maxLength={type === 'number' ? undefined : maxLength}
        min={type === 'number' ? 1 : undefined}
        max={type === 'number' ? 1000000 : undefined}
        step={type === 'number' ? 1 : undefined}
        defaultValue={type === 'number' ? 1 : undefined}
        placeholder={placeholder}
        className={input}
        aria-invalid={action.fields.includes(name) || undefined}
      />
      <span className='min-h-5 text-xs text-danger-ink'>
        {action.fields.includes(name) ? common('selfService.failed') : ''}
      </span>
    </label>
  )
  const data = !apps.isError ? apps.data?.data : null
  return (
    <section className='space-y-5 rounded-2xl border border-border/60 bg-surface p-4 shadow-sm sm:p-5'>
      <h2 className='section-accent text-base font-semibold'>{employee('proposal')}</h2>
      <form
        className='space-y-5'
        onSubmit={(event) => {
          event.preventDefault()
          if (!action.blocked && (!existing || (application && search.current)))
            action.mutate(softwareProposalPayload(event.currentTarget))
        }}
      >
        <fieldset disabled={action.blocked} className='space-y-5'>
          <label className='flex min-h-11 items-center gap-3 text-sm'>
            <input
              type='checkbox'
              checked={existing}
              onChange={(event) => {
                setExisting(event.target.checked)
                setApplication(null)
                setDuplicate(undefined)
              }}
            />
            {t('proposalForm.existing')}
          </label>
          {existing && (
            <div className='space-y-3'>
              {apps.isError ? (
                <div role='alert'>
                  <p>{t('proposalForm.loadError')}</p>
                  <button type='button' className='min-h-11 px-3 text-sm' onClick={() => void apps.refetch()}>
                    {common('notifications.retry')}
                  </button>
                </div>
              ) : (
                <label className='grid gap-2 text-sm font-medium'>
                  {t('proposalForm.application')}
                  <SearchableSelect
                    name='existingApplicationId'
                    required
                    value={application?.id ?? ''}
                    selectedLabel={application?.name}
                    placeholder={employee('ui.placeholders.application')}
                    loading={apps.isFetching || !search.current}
                    emptyText={t('proposalForm.empty')}
                    onSearchChange={search.setDraft}
                    options={(search.current ? (data?.items ?? []) : []).map((item) => ({
                      value: item.id,
                      label: item.name,
                      description: item.vendorName ?? undefined
                    }))}
                    onChange={(id, option) => {
                      setApplication(option ? { id, name: option.label } : null)
                      setDuplicate(undefined)
                    }}
                  />
                </label>
              )}
              <input type='hidden' name='softwareName' value={application?.name ?? ''} />
              <div key={application?.id ?? 'none'}>
                {field('plannedPlanName', t('proposalForm.planName'), employee('ui.placeholders.plannedPlanName'))}
              </div>
            </div>
          )}
          <div className='grid items-start gap-4 sm:grid-cols-2'>
            {!existing && field('softwareName', employee('softwareName'), employee('ui.placeholders.softwareName'))}
            {field('homepageUrl', employee('homepage'), employee('ui.placeholders.homepage'), 'url', 500)}
            {field('expectedUsers', employee('expectedUsers'), employee('ui.placeholders.expectedUsers'), 'number')}
            <TermMonthsField
              subject='NEW_SOFTWARE'
              inputClassName={input}
              placeholder={employee('ui.placeholders.termMonths')}
              invalid={action.fields.includes('termMonths')}
            />
          </div>
          {(['purpose', 'dataDescription'] as const).map((name) => (
            <label key={name} className='grid gap-2 text-sm font-medium'>
              {employee(name)}
              <textarea
                required
                name={name}
                maxLength={1000}
                rows={3}
                placeholder={employee(`ui.placeholders.${name}`)}
                className={input}
                aria-invalid={action.fields.includes(name) || undefined}
              />
              <span className='min-h-5 text-xs text-danger-ink'>
                {action.fields.includes(name) ? common('selfService.failed') : ''}
              </span>
            </label>
          ))}
        </fieldset>
        <button
          type='submit'
          className='min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50'
          disabled={
            action.blocked || (existing && (!application || apps.isError || apps.isFetching || !search.current))
          }
        >
          {action.seconds ? common('selfService.retryAfter', { seconds: action.seconds }) : employee('submit')}
        </button>
        {action.uncertain && (
          <button
            type='button'
            className='min-h-11 rounded-md border border-border px-4 text-sm'
            onClick={() => window.location.reload()}
          >
            {common('selfService.refresh')}
          </button>
        )}
      </form>
      {duplicate && (
        <section className='space-y-3 border-t border-border/50 pt-4' aria-label={t('softwareInCatalog')}>
          <h3 className='text-sm font-semibold'>
            {t('softwareInCatalog')} {duplicate.name}
          </h3>
          <ul className='space-y-1'>
            {duplicate.plans.map((plan) => (
              <li key={plan.id}>
                <button
                  type='button'
                  className='min-h-11 text-sm text-primary-ink underline underline-offset-4'
                  onClick={() => onUsePlan(plan.id)}
                >
                  {plan.name}
                </button>
              </li>
            ))}
          </ul>
          {!duplicate.plans.length && <p className='text-sm text-muted-foreground'>{t('proposalForm.emptyPlans')}</p>}
        </section>
      )}
    </section>
  )
}
