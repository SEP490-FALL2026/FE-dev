import { FileSpreadsheet, Info, UploadCloud, X } from 'lucide-react'
import { useId, useRef, useState, type DragEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { FinanceButton } from '../../shared/components/finance-ui'

const acceptedExtensions = ['csv', 'xlsx'] as const
const accept = acceptedExtensions.map((extension) => `.${extension}`).join(',')

const isAccepted = (file: File) =>
  (acceptedExtensions as readonly string[]).includes(file.name.split('.').pop()?.toLowerCase() ?? '')

function formatSize(bytes: number, locale: string) {
  const units = ['B', 'KB', 'MB'] as const
  const exponent = Math.min(Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(1024)), units.length - 1)
  const value = new Intl.NumberFormat(locale, { maximumFractionDigits: exponent ? 1 : 0 }).format(
    bytes / 1024 ** exponent
  )
  return `${value} ${units[exponent]}`
}

/**
 * Drop zone and file picker for invoice import. The backend has no invoice import route yet, so the file stays in the
 * browser: nothing is uploaded or parsed and the import action stays disabled until the API exists.
 */
export function InvoiceImportDropzone() {
  const { t: translate, i18n } = useTranslation('financeSpend')
  const inputId = useId()
  const input = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File>()
  const [rejected, setRejected] = useState(false)
  const [dragging, setDragging] = useState(false)
  const choose = (candidate: File | undefined) => {
    if (!candidate) return
    if (!isAccepted(candidate)) {
      setRejected(true)
      return
    }
    setRejected(false)
    setFile(candidate)
  }
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    choose(event.dataTransfer.files[0])
  }
  return (
    <div className='space-y-4'>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center transition-colors duration-150 ${
          dragging ? 'border-primary bg-primary-soft/60' : 'border-border bg-surface hover:border-primary/40'
        }`}
      >
        <span className='grid size-12 place-items-center rounded-lg bg-primary-soft text-primary-ink'>
          <UploadCloud aria-hidden className='size-6' strokeWidth={1.5} />
        </span>
        <div className='space-y-1'>
          <p className='text-sm font-medium'>{translate('invoiceIntake.import.dropTitle')}</p>
          <p className='text-xs text-muted-foreground'>{translate('invoiceIntake.import.dropHint')}</p>
        </div>
        <input
          ref={input}
          id={inputId}
          type='file'
          accept={accept}
          className='sr-only'
          tabIndex={-1}
          aria-label={translate('invoiceIntake.import.choose')}
          onChange={(event) => {
            choose(event.target.files?.[0])
            event.target.value = ''
          }}
        />
        <FinanceButton onClick={() => input.current?.click()}>{translate('invoiceIntake.import.choose')}</FinanceButton>
        <p role={rejected ? 'alert' : undefined} className='min-h-5 text-xs text-danger'>
          {rejected ? translate('invoiceIntake.import.rejected') : null}
        </p>
      </div>
      {file && (
        <div className='flex items-center gap-3 rounded-lg border border-border/70 bg-surface px-4 py-3'>
          <span className='grid size-9 shrink-0 place-items-center rounded-md bg-surface-subtle text-muted-foreground'>
            <FileSpreadsheet aria-hidden className='size-4' strokeWidth={1.5} />
          </span>
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-medium' title={file.name}>
              {file.name}
            </p>
            <p className='font-mono text-xs text-muted-foreground tabular-nums'>
              {formatSize(file.size, i18n.language)}
            </p>
          </div>
          <button
            type='button'
            aria-label={translate('invoiceIntake.import.remove', { name: file.name })}
            className='grid size-11 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-danger/10 hover:text-danger focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none active:bg-danger/15 md:size-8'
            onClick={() => setFile(undefined)}
          >
            <X aria-hidden className='size-4' strokeWidth={1.5} />
          </button>
        </div>
      )}
      <div className='flex items-start gap-3 rounded-lg border border-info/25 bg-info/5 p-4 text-sm'>
        <Info aria-hidden className='mt-0.5 size-4 shrink-0 text-info-ink' strokeWidth={1.5} />
        <p className='text-pretty'>{translate('invoiceIntake.import.unavailable')}</p>
      </div>
      <div className='flex justify-end border-t border-border/60 pt-4'>
        <FinanceButton variant='primary' disabled>
          {translate('invoiceIntake.import.preview')}
        </FinanceButton>
      </div>
    </div>
  )
}
