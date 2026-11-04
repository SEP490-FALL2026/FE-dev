import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ApplicationDetailResponseDtoData } from '~/shared/api/generated/model/applications'
import {
  useApplicationRetirementGet,
  getApplicationRetirementGetQueryKey
} from '~/shared/api/generated/operations/applications/application-retirement-get'
import { useApplicationRetire } from '~/shared/api/generated/operations/applications/application-retire'
import { getApplicationGetQueryKey } from '~/shared/api/generated/operations/applications/application-get'
import { getApplicationListQueryKey } from '~/shared/api/generated/operations/applications/application-list'
import { ItQueryState } from '../../shared/components/it-query-state'
import { ItFormDialog, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { CatalogRetirementConfirmation } from './catalog-retirement-confirmation'
export function CatalogRetirement({
  id,
  application
}: {
  id: string
  application: ApplicationDetailResponseDtoData | undefined
}) {
  const { t: translate } = useTranslation('itCatalog')
  const [confirmRetire, setConfirmRetire] = useState(false)
  const [ownerConfirmation, setOwnerConfirmation] = useState(false)
  const retirement = useApplicationRetirementGet(id)
  const feedback = useItMutationFeedback([
    getApplicationListQueryKey(),
    getApplicationGetQueryKey(id),
    getApplicationRetirementGetQueryKey(id)
  ])
  const retire = useApplicationRetire({ mutation: feedback })
  return (
    <>
      <section className='space-y-3 rounded-lg border border-border p-4'>
        <h2 className='font-semibold [text-wrap:balance]'>{translate('retirement')}</h2>
        <p className='text-sm text-muted-foreground'>{translate('retirementHint')}</p>
        <ItQueryState query={retirement}>
          {retirement.data?.data?.retirement && (
            <>
              <dl className='grid gap-3 text-sm sm:grid-cols-2'>
                <div>
                  <dt className='text-muted-foreground'>{translate('ownerReview.assignments')}</dt>
                  <dd className='text-right font-mono tabular-nums'>
                    {retirement.data.data.retirement.blockers.assignmentTotal}
                  </dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{translate('ownerReview.subscriptions')}</dt>
                  <dd className='text-right font-mono tabular-nums'>
                    {retirement.data.data.retirement.blockers.subscriptionTotal}
                  </dd>
                </div>
              </dl>
              {retirement.data.data.retirement.confirmed ? (
                <p className='text-sm text-success-ink'>{translate('ownerReview.confirmed')}</p>
              ) : (
                <button
                  type='button'
                  className={itButtonClass}
                  disabled={
                    !application || retirement.isFetching || retirement.data.data.retirement.status !== 'APPROVED'
                  }
                  onClick={() => setOwnerConfirmation(true)}
                >
                  {translate('ownerReview.confirm')}
                </button>
              )}
            </>
          )}
          <button
            className={itButtonClass}
            disabled={!retirement.data?.data?.retirement.canRetire || retire.isPending}
            aria-busy={retire.isPending}
            onClick={() => setConfirmRetire(true)}
          >
            {translate('retire')}
          </button>
        </ItQueryState>
      </section>
      {confirmRetire && (
        <ItFormDialog
          title={translate('retire')}
          pending={retire.isPending}
          submitDisabled={!retirement.data?.data?.retirement.canRetire || retirement.isFetching}
          submitLabel={translate('retire')}
          danger
          onClose={() => setConfirmRetire(false)}
          onSubmit={(event) => {
            event.preventDefault()
            if (retirement.data?.data?.retirement.canRetire && !retirement.isFetching && !retire.isPending)
              retire.mutate({ id }, { onSuccess: () => setConfirmRetire(false) })
          }}
        >
          <p>{translate('retirementHint')}</p>
        </ItFormDialog>
      )}
      {ownerConfirmation && application && (
        <CatalogRetirementConfirmation
          applicationId={id}
          owner={application.businessOwner}
          onClose={() => setOwnerConfirmation(false)}
        />
      )}
    </>
  )
}
