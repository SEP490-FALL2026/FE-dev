import { useState } from 'react'
import { useCatalogSearch } from '~/shared/hooks/use-catalog-search'
import { useTranslation } from 'react-i18next'
import { useApplicationList } from '~/shared/api/generated/operations/applications/application-list'
import { usePlanList } from '~/shared/api/generated/operations/plans/plan-list'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { ItField, itInputClass } from '../../shared/components/it-form'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'

export function CatalogLinkPlanPicker({
  applicationId,
  planId,
  disabled,
  onApplicationChange,
  onPlanChange
}: {
  applicationId: string
  planId: string
  disabled: boolean
  onApplicationChange: (id: string) => void
  onPlanChange: (id: string) => void
}) {
  const { t: translate } = useTranslation('itNewSoftware')
  const {
    draft: search,
    setDraft: setSearch,
    search: debouncedSearch,
    page: applicationPage,
    setPage: setApplicationPage
  } = useCatalogSearch()
  const [planPage, setPlanPage] = useState(1)
  const applications = useApplicationList({ search: debouncedSearch || undefined, page: applicationPage, pageSize: 20 })
  const plans = usePlanList(
    { applicationId, page: planPage, pageSize: 20 },
    { query: { enabled: Boolean(applicationId) } }
  )
  const applicationItems = applications.data?.data?.items ?? []
  const planItems = plans.data?.data?.items ?? []
  return (
    <div className='space-y-3'>
      <ItField label={translate('catalogLink.searchApplication')}>
        <input
          className={itInputClass}
          type='search'
          placeholder={translate('catalogLink.searchPlaceholder')}
          maxLength={100}
          value={search}
          disabled={disabled}
          onChange={(event) => {
            setSearch(event.target.value)
            setApplicationPage(1)
          }}
        />
      </ItField>
      <ItChoiceSelect
        label={translate('catalogLink.application')}
        value={applicationId}
        options={applicationItems.map((application) => ({ value: application.id, label: application.name }))}
        disabled={disabled || applications.isFetching || applications.isError}
        onChange={(id) => {
          setPlanPage(1)
          onApplicationChange(id)
        }}
      />
      <ItQueryState query={applications}>
        {!applicationItems.length && <ItEmpty />}
        <ItPagination
          page={applicationPage}
          pageSize={20}
          total={applications.data?.data?.pagination.totalItems ?? 0}
          disabled={disabled || applications.isFetching}
          onChange={setApplicationPage}
        />
      </ItQueryState>
      {applicationId && (
        <>
          <ItChoiceSelect
            key={applicationId}
            label={translate('catalogLink.plan')}
            value={planId}
            options={planItems.map((plan) => ({ value: plan.id, label: plan.name }))}
            disabled={disabled || plans.isFetching || plans.isError}
            onChange={onPlanChange}
          />
          <ItQueryState query={plans}>
            {!planItems.length && <ItEmpty />}
            <ItPagination
              page={planPage}
              pageSize={20}
              total={plans.data?.data?.pagination.totalItems ?? 0}
              disabled={disabled || plans.isFetching}
              onChange={setPlanPage}
            />
          </ItQueryState>
        </>
      )}
    </div>
  )
}
