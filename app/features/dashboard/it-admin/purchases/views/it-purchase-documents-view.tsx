import { useEffect, useRef, useState } from 'react'
import { ItPageHeader } from '../../shared/components/it-page-header'
import { useTranslation } from 'react-i18next'
import { ArrowRight, FileText } from 'lucide-react'
import { useContractGet } from '~/shared/api/generated/operations/contracts/contract-get'
import { useContractList } from '~/shared/api/generated/operations/contracts/contract-list'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass, itPrimaryClass } from '../../shared/components/it-form'
import { ContractCreateDialog } from '../components/contract-create-dialog'
import { DocumentUploadDialog } from '../components/document-upload-dialog'
import { DocumentDetail } from '../components/document-detail'
import { ContractDetailContent } from '../components/contract-detail-content'

export function ItPurchaseDocumentsView() {
  const { t: translate } = useTranslation('itPurchases')
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
          <ItPageHeader
            icon={FileText}
            title={translate('title')}
            subtitle={translate('contractListHint')}
            actions={
              <button type='button' className={itPrimaryClass} onClick={() => setCreating(true)}>
                {translate('create')}
              </button>
            }
          />
          <h2 className='section-accent text-lg font-semibold tracking-tight'>{translate('listTitle')}</h2>
          <ItQueryState query={contracts}>
            {contracts.data?.data?.items.length ? (
              <div className='grid gap-4 lg:grid-cols-2'>
                {contracts.data.data.items.map((item) => (
                  <article
                    key={item.id}
                    className='flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-surface p-5'
                  >
                    <div className='flex items-start gap-3'>
                      <span className='grid size-10 shrink-0 place-items-center rounded-md bg-primary-soft text-primary-ink'>
                        <FileText aria-hidden strokeWidth={1.5} className='size-5' />
                      </span>
                      <div className='min-w-0 flex-1'>
                        <h3 className='break-words font-semibold'>{item.name}</h3>
                        <p className='mt-1 text-sm text-muted-foreground'>
                          {item.vendor?.name ?? translate('unknown')}
                        </p>
                      </div>
                    </div>
                    <div className='border-t border-border pt-4'>
                      <span className='rounded-md bg-surface-subtle px-2.5 py-1 text-xs font-medium'>
                        {translate(`contractStates.${item.status}`, { defaultValue: translate('unknown') })}
                      </span>
                    </div>
                    <button
                      type='button'
                      className={`${itButtonClass} self-start`}
                      onClick={() => {
                        setContractId(item.id)
                        setView('contract')
                      }}
                    >
                      {translate('openContract')}
                      <ArrowRight aria-hidden strokeWidth={1.5} className='size-4' />
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
            <ContractDetailContent
              contract={contract}
              uploadingDisabled={query.isFetching}
              onUpload={() => setUploading(true)}
              onOpenDocument={(id) => {
                setDocumentId(id)
                setView('document')
              }}
            />
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
