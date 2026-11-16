import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import { useContractGet } from '~/shared/api/generated/operations/contracts/contract-get'
import { useContractList } from '~/shared/api/generated/operations/contracts/contract-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass, itPrimaryClass } from '../../shared/components/it-form'
import { ContractCreateDialog } from '../components/contract-create-dialog'
import { DocumentUploadDialog } from '../components/document-upload-dialog'
import { DocumentDetail } from '../components/document-detail'

export function ItPurchaseDocumentsView() {
  const { t: translate } = useTranslation('itPurchases')
  const { formatDateTime } = useDashboardFormat()
  const [contractId, setContractId] = useState('')
  const [documentId, setDocumentId] = useState('')
  const [creating, setCreating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [view, setView] = useState<'lookup' | 'contract' | 'document'>('lookup')
  const [page, setPage] = useState(1)
  const pageRef = useRef<HTMLElement>(null)
  useEffect(() => {
    pageRef.current?.focus()
  }, [view])
  const query = useContractGet(contractId, { query: { enabled: !!contractId } })
  const contracts = useContractList({ page, pageSize: 20 }, { query: { enabled: view === 'lookup' } })
  const contract = query.data?.data?.contract
  return (
    <section ref={pageRef} tabIndex={-1} className='space-y-5 outline-none'>
      {view !== 'lookup' && (
        <button
          type='button'
          className={itButtonClass}
          onClick={() => setView(view === 'document' ? 'contract' : 'lookup')}
        >
          {translate('back')}
        </button>
      )}
      {view === 'lookup' && (
        <>
          <header className='flex flex-wrap items-center justify-between gap-3'>
            <h1 className='flex items-center gap-3 text-2xl font-semibold tracking-tight'>
              <FileText aria-hidden strokeWidth={1.5} className='size-6 text-primary' />
              {translate('title')}
            </h1>
            <button type='button' className={itPrimaryClass} onClick={() => setCreating(true)}>
              {translate('create')}
            </button>
          </header>
          <p className='max-w-3xl text-sm text-muted-foreground'>{translate('contractListHint')}</p>
          <ItQueryState query={contracts}>
            {contracts.data?.data?.items.length ? (
              <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
                {contracts.data.data.items.map((item) => (
                  <article key={item.id} className='flex flex-wrap items-center justify-between gap-4 p-4'>
                    <div>
                      <h2 className='font-medium'>{item.name}</h2>
                      <p className='text-sm text-muted-foreground'>
                        {item.vendor?.name ?? translate('unknown')} ·{' '}
                        {translate(`contractStates.${item.status}`, { defaultValue: translate('unknown') })}
                      </p>
                    </div>
                    <button
                      type='button'
                      className={itButtonClass}
                      onClick={() => {
                        setContractId(item.id)
                        setView('contract')
                      }}
                    >
                      {translate('openContract')}
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <ItEmpty />
            )}
          </ItQueryState>
          <ItPagination
            page={page}
            pageSize={20}
            total={contracts.data?.data?.pagination.totalItems ?? 0}
            onChange={setPage}
          />
        </>
      )}
      {view === 'contract' && contractId && (
        <ItQueryState query={query}>
          {contract ? (
            <section className='space-y-4 rounded-lg border border-border/70 bg-surface p-5'>
              <h2 className='truncate text-lg font-semibold' title={contract.name}>
                {contract.name}
              </h2>
              <p className='break-all font-mono text-xs'>{translate('contractRef', { id: contract.id })}</p>
              <p className='text-right font-mono text-xs tabular-nums text-muted-foreground'>
                {formatDateTime(contract.createdAt)}
              </p>
              <p>
                {contract.vendor?.name ?? translate('unknown')} ·{' '}
                {translate(`contractStates.${contract.status}`, { defaultValue: translate('unknown') })}
              </p>
              <h3 className='font-semibold'>{translate('subscriptions')}</h3>
              {contract.subscriptions.map((subscription) => (
                <p key={subscription.subscriptionId}>
                  {subscription.applicationName} · {subscription.planName}
                </p>
              ))}
              <h3 className='font-semibold'>{translate('documents')}</h3>
              {contract.documents.map((document) => (
                <button
                  type='button'
                  key={document.id}
                  className={itButtonClass}
                  onClick={() => {
                    setDocumentId(document.id)
                    setView('document')
                  }}
                >
                  {document.fileName}
                </button>
              ))}
              <button
                type='button'
                className={itButtonClass}
                disabled={query.isFetching}
                onClick={() => setUploading(true)}
              >
                {translate('upload')}
              </button>
            </section>
          ) : (
            <ItEmpty />
          )}
        </ItQueryState>
      )}
      {view === 'document' && documentId && <DocumentDetail key={documentId} id={documentId} contractId={contractId} />}
      {creating && (
        <ContractCreateDialog
          onClose={() => setCreating(false)}
          onCreated={(id) => {
            setContractId(id)
            setDocumentId('')
            setView('contract')
          }}
        />
      )}
      {uploading && contract && (
        <DocumentUploadDialog
          key={contract.id}
          contractId={contract.id}
          onClose={() => setUploading(false)}
          onUploaded={(id) => {
            setDocumentId(id)
            setView('document')
          }}
        />
      )}
    </section>
  )
}
