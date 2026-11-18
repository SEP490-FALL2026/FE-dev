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
import { useContractList } from '~/shared/api/generated/operations/contracts/contract-list'
import { useCatalogSearch } from '~/shared/hooks/use-catalog-search'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'

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
        <section className='space-y-5'>
          <header className='space-y-2 border-b border-border pb-5'>
            <p className='text-xs font-semibold uppercase tracking-wider text-primary'>{translate('documents')}</p>
            <h1 className='break-all text-2xl font-semibold tracking-tight' title={document.fileName}>
              {document.fileName}
            </h1>
          </header>
          <div className='space-y-4 rounded-lg border border-border bg-surface p-5'>
            <dl className='grid gap-4 text-sm sm:grid-cols-2'>
              <div>
                <dt className='text-muted-foreground'>{translate('status')}</dt>
                <dd className='mt-1 font-medium'>
                  {translate(`values.${document.status}`, { defaultValue: translate('unknown') })}
                </dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>{translate('size')}</dt>
                <dd className='mt-1 font-mono font-medium tabular-nums'>
                  {translate('bytes', { size: formatNumber(document.sizeBytes) })}
                </dd>
              </div>
            </dl>
          </div>
          {document.status === DocumentStatus.PENDING_ATTACH && (
            <form
              className='field-bar flex flex-wrap gap-3'
              onSubmit={(event) => {
                event.preventDefault()
                if (!attach.isPending && target) attach.mutate({ id, data: { contractId: target } })
              }}
            >
              {!contractId && (
                <div className='min-w-0 flex-1'>
                  <ContractPicker value={target} onChange={setTarget} />
                </div>
              )}
              <button
                type='submit'
                className={itButtonClass}
                disabled={attach.isPending || query.isFetching || !target}
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

function ContractPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const { t: translate } = useTranslation('itPurchases')
  const { t: translatePlaceholder } = useTranslation('itPlaceholders')
  const { draft, setDraft, search, page } = useCatalogSearch()
  const contracts = useContractList({ search: search || undefined, page, pageSize: 50 })
  const options = (contracts.data?.data?.items ?? []).map((item) => ({
    value: item.id,
    label: item.name,
    description: item.number ?? item.vendor?.name
  }))
  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      <ItField label={translate('contractSearch')}>
        <input
          placeholder={translatePlaceholder('searchContract')}
          type='search'
          maxLength={100}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className={itInputClass}
        />
      </ItField>
      <ItChoiceSelect
        label={translate('contractId')}
        hint={translate('help.contractId')}
        required
        value={value}
        options={options}
        disabled={contracts.isError}
        onChange={onChange}
      />
    </div>
  )
}
