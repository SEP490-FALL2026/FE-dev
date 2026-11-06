import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import { useContractGet } from '~/shared/api/generated/operations/contracts/contract-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItField, itButtonClass, itPrimaryClass, itInputClass } from '../../shared/components/it-form'
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
  const pageRef = useRef<HTMLElement>(null)
  useEffect(() => {
    pageRef.current?.focus()
  }, [view])
  const query = useContractGet(contractId, { query: { enabled: !!contractId } })
  const contract = query.data?.data?.contract
  return (
    <section ref={pageRef} tabIndex={-1} className='space-y-5 outline-none'>
      {view !== 'lookup' && (
        <button type='button' className={itButtonClass} onClick={() => setView('lookup')}>
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
          <p className='max-w-3xl text-sm text-muted-foreground'>{translate('lookupHint')}</p>
          <div className='grid gap-4 lg:grid-cols-2'>
            <LookupForm
              label={translate('contractId')}
              placeholder={translate('contractPlaceholder')}
              hint={translate('help.contractId')}
              button={translate('openContract')}
              initialValue={contractId}
              onSubmit={(id) => {
                setContractId(id)
                setView('contract')
              }}
            />
            <LookupForm
              label={translate('documentId')}
              placeholder={translate('documentPlaceholder')}
              hint={translate('help.documentId')}
              button={translate('openDocument')}
              initialValue={documentId}
              onSubmit={(id) => {
                setDocumentId(id)
                setView('document')
              }}
            />
          </div>
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

function LookupForm({
  label,
  placeholder,
  hint,
  button,
  initialValue,
  onSubmit
}: {
  label: string
  placeholder: string
  hint: string
  button: string
  initialValue: string
  onSubmit: (id: string) => void
}) {
  return (
    <form
      className='flex flex-wrap items-end gap-3 rounded-lg border border-border/70 bg-surface p-4'
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(String(new FormData(event.currentTarget).get('id')).trim())
      }}
    >
      <div className='min-w-0 flex-1 basis-48'>
        <ItField label={label} hint={hint}>
          <input
            name='id'
            required
            pattern='[0-9a-fA-F-]{36}'
            defaultValue={initialValue}
            placeholder={placeholder}
            className={itInputClass}
          />
        </ItField>
      </div>
      <button type='submit' className={itButtonClass}>
        {button}
      </button>
    </form>
  )
}
