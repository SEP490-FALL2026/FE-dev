import { FileUp, PencilLine, type LucideIcon } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { FinancePage } from '../../shared/components/finance-ui'
import { InvoiceImportDropzone } from '../components/invoice-import-dropzone'
import { InvoiceManualEntry } from '../components/invoice-manual-entry'

const modes = ['manual', 'import'] as const
type IntakeMode = (typeof modes)[number]
const modeIcons: Record<IntakeMode, LucideIcon> = { manual: PencilLine, import: FileUp }

const segmentClass =
  'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none md:min-h-9'

/** Màn 4: record invoices against held commitments, by hand or (once the API exists) from a file. */
export function FinanceInvoiceIntakeView() {
  const { t: translate } = useTranslation('financeSpend')
  const [searchParams, setSearchParams] = useSearchParams()
  const mode: IntakeMode = searchParams.get('mode') === 'import' ? 'import' : 'manual'
  return (
    <FinancePage title={translate('invoiceIntake.title')} description={translate('invoiceIntake.description')}>
      <div
        role='group'
        aria-label={translate('invoiceIntake.modeLabel')}
        className='inline-flex gap-1 rounded-lg border border-border/70 bg-surface-subtle p-1'
      >
        {modes.map((option) => {
          const Icon = modeIcons[option]
          const active = option === mode
          return (
            <button
              key={option}
              type='button'
              aria-pressed={active}
              className={`${segmentClass} ${
                active
                  ? 'bg-primary text-primary-foreground shadow-[0_1px_2px_0_rgba(0,0,0,0.12)]'
                  : 'text-muted-foreground hover:bg-surface hover:text-foreground active:bg-primary-soft active:text-primary-ink'
              }`}
              onClick={() =>
                setSearchParams(
                  (current) => {
                    const next = new URLSearchParams(current)
                    next.set('mode', option)
                    return next
                  },
                  { replace: true }
                )
              }
            >
              <Icon aria-hidden className='size-4' strokeWidth={1.5} />
              {translate(`invoiceIntake.modes.${option}`)}
            </button>
          )
        })}
      </div>
      {mode === 'manual' ? <InvoiceManualEntry /> : <InvoiceImportDropzone />}
    </FinancePage>
  )
}
