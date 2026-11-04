import { useState } from 'react'
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
  const query = useContractGet(contractId, { query: { enabled: !!contractId } })
  const contract = query.data?.data?.contract
  return (
    <section className='space-y-5'>
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
          button={translate('openContract')}
          onSubmit={setContractId}
        />
        <LookupForm
          label={translate('documentId')}
          placeholder={translate('documentPlaceholder')}
          button={translate('openDocument')}
          onSubmit={setDocumentId}
        />
      </div>
      {contractId && (
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
      {documentId && <DocumentDetail key={documentId} id={documentId} contractId={contractId} />}
      {creating && (
        <ContractCreateDialog
          onClose={() => setCreating(false)}
          onCreated={(id) => {
            setContractId(id)
            setDocumentId('')
          }}
        />
      )}
      {uploading && contract && (
        <DocumentUploadDialog
          key={contract.id}
          contractId={contract.id}
          onClose={() => setUploading(false)}
          onUploaded={setDocumentId}
        />
      )}
    </section>
  )
}

function LookupForm({
  label,
  placeholder,
  button,
  onSubmit
}: {
  label: string
  placeholder: string
  button: string
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
        <ItField label={label}>
          <input name='id' required pattern='[0-9a-fA-F-]{36}' placeholder={placeholder} className={itInputClass} />
        </ItField>
      </div>
      <button type='submit' className={itButtonClass}>
        {button}
      </button>
    </form>
  )
}
