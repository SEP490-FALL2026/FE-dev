import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AssessmentQueue } from '../components/assessment-queue'
import { useAccessRequestAssessmentGet } from '~/shared/api/generated/operations/access-requests/access-request-assessment-get'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useAccessRequestGet } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { itButtonClass, itPrimaryClass, itInputClass, ItField } from '../../shared/components/it-form'
import { AssessmentDialog } from '../components/assessment-dialog'
import { CatalogLinkSection } from '../components/catalog-link-section'
import { InternalRegistrationDialog } from '../components/internal-registration-dialog'
import { AssessmentStatus } from '../enums/assessment-status'
import { AssessmentClassification } from '../enums/assessment-classification'
import { AssessmentStepState } from '../enums/assessment-step-state'
import { canCompleteAssessment } from '../hooks/assessment-gates'
import type { ItAdminTabKey } from '../../it-admin-nav'

export function ItShadowItView({
  onSelectTab,
  initialRequestId
}: {
  onSelectTab?: (tab: ItAdminTabKey) => void
  initialRequestId?: string
}) {
  const { t: translate } = useTranslation('itNewSoftware')
  const [draftId, setDraftId] = useState(initialRequestId ?? '')
  const [id, setId] = useState(initialRequestId ?? '')
  const [queueAllowsAction, setQueueAllowsAction] = useState<boolean | undefined>()
  return (
    <div className='space-y-5'>
      <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('title')}</h1>
      {!id && (
        <AssessmentQueue
          onOpen={(requestId, canAct) => {
            setQueueAllowsAction(canAct)
            setId(requestId)
          }}
        />
      )}
      {id && (
        <button type='button' className={itButtonClass} onClick={() => setId('')}>
          {translate('queue.back')}
        </button>
      )}
      <form
        className='flex flex-wrap items-end gap-3'
        onSubmit={(event) => {
          event.preventDefault()
          setQueueAllowsAction(undefined)
          setId(draftId.trim())
        }}
      >
        <div className='min-w-0 flex-1'>
          <ItField label={translate('requestId')}>
            <input
              required
              pattern='[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
              className={itInputClass}
              placeholder={translate('requestIdPlaceholder')}
              value={draftId}
              onChange={(event) => setDraftId(event.target.value)}
            />
          </ItField>
        </div>
        <button className={itButtonClass} type='submit' disabled={!draftId.trim()}>
          {translate('lookup')}
        </button>
      </form>
      {id && <AssessmentDetail key={id} id={id} queueAllowsAction={queueAllowsAction} onSelectTab={onSelectTab} />}
    </div>
  )
}
function AssessmentDetail({
  id,
  onSelectTab,
  queueAllowsAction
}: {
  id: string
  onSelectTab?: (tab: ItAdminTabKey) => void
  queueAllowsAction?: boolean
}) {
  const { t: translate } = useTranslation('itNewSoftware')
  const query = useAccessRequestAssessmentGet(id)
  const me = useMeGet()
  const requestQuery = useAccessRequestGet(id, { query: { enabled: queueAllowsAction === undefined } })
  const requestData = requestQuery.data?.data
  const request = requestData && 'request' in requestData ? requestData.request : undefined
  const employeeId = me.data?.data?.employee?.id
  const independent =
    request &&
    !requestQuery.isError &&
    !requestQuery.isFetching &&
    !!employeeId &&
    request.requester.employeeId !== employeeId &&
    request.beneficiary?.employeeId !== employeeId
  const [mode, setMode] = useState<'save' | 'complete' | 'reject' | null>(null)
  const [internalOpen, setInternalOpen] = useState(false)
  const item = query.data?.data?.assessment
  const authorized =
    (queueAllowsAction === true || (queueAllowsAction === undefined && !!independent)) &&
    !me.isError &&
    (me.data?.data?.roles.includes('IT_ADMIN') ?? false)
  const editable =
    authorized &&
    !query.isFetching &&
    item?.status === AssessmentStatus.DRAFT &&
    item.step?.state === AssessmentStepState.PENDING
  if (item && mode === 'save') return <AssessmentDialog item={item} mode={mode} onClose={() => setMode(null)} />
  if (item && internalOpen) return <InternalRegistrationDialog item={item} onClose={() => setInternalOpen(false)} />
  return (
    <ItQueryState query={query}>
      {item ? (
        <div className='space-y-4'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <h2
              className='min-w-0 max-w-full truncate text-xl font-semibold [text-wrap:balance]'
              title={item.proposal.softwareName}
            >
              {item.proposal.softwareName}
            </h2>
            <button className={itButtonClass} onClick={() => void query.refetch()}>
              {translate('refresh')}
            </button>
          </div>
          <dl className='grid gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2'>
            {(['purpose', 'dataDescription', 'homepageUrl', 'expectedUsers'] as const).map((key) => (
              <div key={key}>
                <dt className='text-sm text-muted-foreground'>{translate(`proposal.${key}`)}</dt>
                <dd className='break-words text-sm'>{item.proposal[key]}</dd>
              </div>
            ))}
            <div>
              <dt className='text-sm text-muted-foreground'>{translate('status')}</dt>
              <dd>{translate(`values.${item.status}`, { defaultValue: translate('unknown') })}</dd>
            </div>
          </dl>
          <dl className='grid gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2'>
            {(
              [
                'classification',
                'provisioningType',
                'controlLevel',
                'dataSensitivity',
                'plannedPlanName',
                'termsSummary',
                'memberUsageMethod',
                'grantRevokeMethod',
                'controlRiskNote'
              ] as const
            ).map((key) => (
              <div key={key}>
                <dt className='text-sm text-muted-foreground'>{translate(`fields.${key}`)}</dt>
                <dd className='break-words text-sm'>
                  {item[key] == null
                    ? translate('unfilled')
                    : ['classification', 'provisioningType', 'controlLevel', 'dataSensitivity'].includes(key)
                      ? translate(`values.${item[key]}`, { defaultValue: translate('unknown') })
                      : item[key]}
                </dd>
              </div>
            ))}
          </dl>
          {!item.complete && <p className='text-sm text-muted-foreground'>{translate('incomplete')}</p>}
          {item.classification === AssessmentClassification.INTERNAL && (
            <p className='text-sm text-muted-foreground'>{translate('internalHint')}</p>
          )}
          {item.rejection && <p className='rounded-lg border border-border p-4 text-sm'>{item.rejection.reason}</p>}
          <CatalogLinkSection item={item} authorized={authorized} />
          <div className='flex flex-wrap gap-2'>
            {item.classification === AssessmentClassification.INTERNAL && (
              <button className={itButtonClass} disabled={!editable} onClick={() => setInternalOpen(true)}>
                {translate('registerInternal')}
              </button>
            )}
            <button className={itPrimaryClass} disabled={!editable} onClick={() => setMode('save')}>
              {translate('save')}
            </button>
            <button
              className={itButtonClass}
              disabled={!editable || !canCompleteAssessment(item, authorized)}
              onClick={() => setMode('complete')}
            >
              {translate('complete')}
            </button>
            <button className={itButtonClass} disabled={!editable} onClick={() => setMode('reject')}>
              {translate('reject')}
            </button>
            {onSelectTab && (
              <button className={itButtonClass} onClick={() => onSelectTab('dept-catalog')}>
                {translate('catalog')}
              </button>
            )}
          </div>
          {mode && <AssessmentDialog item={item} mode={mode} onClose={() => setMode(null)} />}
        </div>
      ) : (
        <ItEmpty />
      )}
    </ItQueryState>
  )
}
