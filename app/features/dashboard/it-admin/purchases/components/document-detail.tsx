import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDocumentGet, getDocumentGetQueryKey } from '~/shared/api/generated/operations/documents/document-get'
import { useDocumentAttach } from '~/shared/api/generated/operations/documents/document-attach'
import { documentLink } from '~/shared/api/generated/operations/documents/document-link'
import { useDashboardFormat } from '../../../dashboard-ui'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItField, itButtonClass, itInputClass } from '../../shared/components/it-form'
import { DocumentStatus } from '../enums/document-status'

export function DocumentDetail({ id, contractId }: { id: string; contractId?: string }) {
  const { t: translate } = useTranslation('itPurchases')
  const { formatNumber } = useDashboardFormat()
  const query = useDocumentGet(id)
  const document = query.data?.data?.document
  const [target, setTarget] = useState(contractId ?? '')
  const [opening, setOpening] = useState(false)
  const feedback = useItMutationFeedback([getDocumentGetQueryKey(id)])
  const attach = useDocumentAttach({ mutation: feedback })
  async function open() {
    if (opening) return
    // Open synchronously so popup blockers do not discard the user action.
    const tab = window.open('about:blank', '_blank')
    if (tab) tab.opener = null
    setOpening(true)
    try {
      const result = await documentLink(id)
      if (!result.data) throw new Error('DOCUMENT_LINK_EMPTY')
      const link = new URL(result.data.url)
      if (!['https:', 'http:'].includes(link.protocol)) throw new Error('DOCUMENT_LINK_INVALID')
      if (tab) tab.location.replace(link.href)
      else throw new Error('DOCUMENT_POPUP_BLOCKED')
    } catch (error) {
      tab?.close()
      await feedback.onError(error)
    } finally {
      setOpening(false)
    }
  }
  return (
    <ItQueryState query={query}>
      {document ? (
        <section className='space-y-4 rounded-lg border border-border/70 bg-surface p-5'>
          <h2 className='truncate font-semibold' title={document.fileName}>
            {document.fileName}
          </h2>
          <dl className='grid gap-3 text-sm sm:grid-cols-2'>
            <div>
              <dt className='text-muted-foreground'>{translate('status')}</dt>
              <dd>{translate(`values.${document.status}`, { defaultValue: translate('unknown') })}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('size')}</dt>
              <dd className='text-right font-mono tabular-nums'>
                {translate('bytes', { size: formatNumber(document.sizeBytes) })}
              </dd>
            </div>
          </dl>
          {document.contractId && (
            <p className='break-all font-mono text-xs'>{translate('contractRef', { id: document.contractId })}</p>
          )}
          {document.status === DocumentStatus.PENDING_ATTACH && (
            <form
              className='flex flex-wrap items-end gap-3'
              onSubmit={(event) => {
                event.preventDefault()
                if (!attach.isPending) attach.mutate({ id, data: { contractId: target.trim() } })
              }}
            >
              <div className='min-w-0 flex-1'>
                <ItField label={translate('contractId')} hint={translate('help.contractId')}>
                  <input
                    required
                    pattern='[0-9a-fA-F-]{36}'
                    value={target}
                    onChange={(event) => setTarget(event.target.value)}
                    placeholder={translate('contractPlaceholder')}
                    className={itInputClass}
                  />
                </ItField>
              </div>
              <button
                type='submit'
                className={itButtonClass}
                disabled={attach.isPending || query.isFetching}
                aria-busy={attach.isPending}
              >
                {translate('attach')}
              </button>
            </form>
          )}
          <button
            type='button'
            className={itButtonClass}
            disabled={document.status !== DocumentStatus.READY || query.isFetching || opening}
            aria-busy={opening}
            onClick={() => void open()}
          >
            {translate('openFile')}
          </button>
        </section>
      ) : (
        <ItEmpty />
      )}
    </ItQueryState>
  )
}
