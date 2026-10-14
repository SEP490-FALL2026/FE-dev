import { ArrowLeft, ChevronRight, FileText, Forward, Paperclip, ReceiptText, ShieldAlert, Wrench } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Dialog,
  FilterChips,
  InfoRow,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  useDashboardFormat,
  type Tone
} from '../../dashboard-ui'
import { chargeExceptions, type ChargeException, type ExceptionStatus } from '../finance-data'
import type { FinanceTabKey } from '../finance-nav'

type ExceptionFilter = 'all' | ExceptionStatus

const statusTones: Record<ExceptionStatus, Tone> = {
  BASIS_LINKED: 'success',
  BILLING_ERROR: 'neutral',
  CHECKING: 'warning',
  SENT_TO_APPROVER: 'info'
}
const statusOrder: readonly ExceptionStatus[] = ['CHECKING', 'SENT_TO_APPROVER', 'BASIS_LINKED', 'BILLING_ERROR']

/**
 * FIN-07: the list opens first; choosing an exception opens its own detail screen (`id` search param).
 * The view stays mounted while switching between the two, so changes and the filter survive the round trip.
 */
export function FinanceChargeExceptionsView({
  exceptionId,
  formatCurrency,
  onSelectTab
}: {
  exceptionId?: string
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const [items, setItems] = useState<ChargeException[]>(chargeExceptions)
  const [filter, setFilter] = useState<ExceptionFilter>('all')
  const selected = items.find((item) => item.id === exceptionId)

  const update = (id: string, patch: Partial<ChargeException>) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))

  if (selected) {
    return (
      <ChargeExceptionDetail
        formatCurrency={formatCurrency}
        item={selected}
        key={selected.id}
        onBack={() => onSelectTab('charge-exceptions')}
        onUpdate={(patch) => update(selected.id, patch)}
      />
    )
  }

  return (
    <ChargeExceptionList
      filter={filter}
      formatCurrency={formatCurrency}
      items={items}
      onFilterChange={setFilter}
      onOpen={(id) => onSelectTab('charge-exceptions', { id })}
    />
  )
}

function ChargeExceptionList({
  filter,
  formatCurrency,
  items,
  onFilterChange,
  onOpen
}: {
  filter: ExceptionFilter
  formatCurrency: (value: number) => string
  items: ChargeException[]
  onFilterChange: (filter: ExceptionFilter) => void
  onOpen: (id: string) => void
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()

  const visible = items.filter((item) => filter === 'all' || item.status === filter)
  const count = (status: ExceptionStatus) => items.filter((item) => item.status === status).length

  return (
    <div className='space-y-6'>
      <PageHeader
        code='UF-12 · FIN-07'
        subtitle={t('finance.exceptions.subtitle')}
        title={t('finance.exceptions.title')}
      />

      <Notice icon={ShieldAlert} tone='info'>
        {t('finance.exceptions.ruleNotice')}
      </Notice>

      <Panel>
        <FilterChips<ExceptionFilter>
          label={t('finance.exceptions.filterLabel')}
          onChange={onFilterChange}
          options={[
            { count: items.length, label: t('ui.all'), value: 'all' },
            ...statusOrder.map((status) => ({
              count: count(status),
              label: t(`finance.exceptions.status.${status}`),
              value: status
            }))
          ]}
          value={filter}
        />

        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-184 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('finance.exceptions.colCharge')}</th>
                <th className='py-2.5 font-semibold'>{t('finance.exceptions.colDate')}</th>
                <th className='py-2.5 font-semibold'>{t('finance.exceptions.reasonLabel')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.exceptions.amount')}</th>
                <th className='py-2.5 pl-6 font-semibold'>{t('finance.exceptions.colStatus')}</th>
                <th className='py-2.5'>
                  <span className='sr-only'>{t('finance.exceptions.openDetail')}</span>
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {visible.map((item) => (
                <tr
                  className='cursor-pointer transition hover:bg-surface-subtle/60'
                  key={item.id}
                  onClick={() => onOpen(item.id)}
                >
                  <td className='py-3'>
                    <p className='font-mono font-bold text-primary'>{item.code}</p>
                    <p className='mt-0.5 font-semibold text-foreground'>{item.vendor}</p>
                  </td>
                  <td className='py-3'>
                    <p>{formatDate(item.date)}</p>
                    <p className='text-[0.7rem] text-muted-foreground'>
                      {t('finance.exceptions.card', { last4: item.cardLast4 })}
                    </p>
                  </td>
                  <td className='py-3'>{t(`finance.exceptions.reason.${item.reason}`)}</td>
                  <td className='py-3 text-right font-bold'>{formatCurrency(item.amount)}</td>
                  <td className='py-3 pl-6'>
                    <Pill tone={statusTones[item.status]}>{t(`finance.exceptions.status.${item.status}`)}</Pill>
                  </td>
                  <td className='py-3 text-right'>
                    <button
                      aria-label={t('finance.exceptions.openDetailFor', { code: item.code })}
                      className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                      onClick={(event) => {
                        event.stopPropagation()
                        onOpen(item.id)
                      }}
                      type='button'
                    >
                      {t('finance.exceptions.openDetail')}
                      <ChevronRight aria-hidden='true' className='size-3.5' />
                    </button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td className='py-8 text-center text-muted-foreground' colSpan={6}>
                    {t('finance.exceptions.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

function ChargeExceptionDetail({
  formatCurrency,
  item,
  onBack,
  onUpdate
}: {
  formatCurrency: (value: number) => string
  item: ChargeException
  onBack: () => void
  onUpdate: (patch: Partial<ChargeException>) => void
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const [showBillingDialog, setShowBillingDialog] = useState(false)

  return (
    <div className='space-y-6'>
      <button
        className='inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground'
        onClick={onBack}
        type='button'
      >
        <ArrowLeft aria-hidden='true' className='size-4' />
        {t('finance.exceptions.backToList')}
      </button>

      <PageHeader
        actions={<Pill tone={statusTones[item.status]}>{t(`finance.exceptions.status.${item.status}`)}</Pill>}
        code={`UF-12 · FIN-07 · ${item.code}`}
        subtitle={`${item.code} · ${formatDate(item.date)} · ${t('finance.exceptions.card', { last4: item.cardLast4 })}`}
        title={item.vendor}
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'>
        <div className='space-y-6'>
          <Panel>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='rounded-xl border border-border bg-background p-4'>
                <p className='text-xs font-bold'>{t('finance.exceptions.chargeTitle')}</p>
                <div className='mt-2 divide-y divide-border'>
                  <InfoRow label={t('finance.exceptions.amount')} value={formatCurrency(item.amount)} />
                  {item.approvedAmount !== undefined && (
                    <>
                      <InfoRow
                        label={t('finance.exceptions.approvedAmount')}
                        value={formatCurrency(item.approvedAmount)}
                      />
                      <InfoRow
                        label={t('finance.exceptions.excess')}
                        value={<span className='text-danger'>{formatCurrency(item.amount - item.approvedAmount)}</span>}
                      />
                    </>
                  )}
                  <InfoRow
                    label={t('finance.exceptions.reasonLabel')}
                    value={<Pill tone='warning'>{t(`finance.exceptions.reason.${item.reason}`)}</Pill>}
                  />
                </div>
                <p className='mt-3 text-[0.7rem] text-muted-foreground'>{t('finance.exceptions.unallocatedNote')}</p>
              </div>

              <div className='rounded-xl border border-border bg-background p-4'>
                <p className='text-xs font-bold'>{t('finance.exceptions.basisTried')}</p>
                <ul className='mt-2 space-y-1.5 text-xs text-muted-foreground'>
                  {item.basisTried.map((basis) => (
                    <li className='flex items-start gap-1.5' key={basis}>
                      <ReceiptText aria-hidden='true' className='mt-px size-3.5 shrink-0' />
                      {basis}
                    </li>
                  ))}
                </ul>
                {item.itNote && (
                  <div className='mt-3 rounded-lg bg-surface-subtle p-2.5 text-xs'>
                    <p className='flex items-center gap-1.5 font-bold'>
                      <Wrench aria-hidden='true' className='size-3.5' />
                      {t('finance.exceptions.itNote')}
                    </p>
                    <p className='mt-1 text-muted-foreground'>{item.itNote}</p>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelTitle
              action={
                item.status === 'CHECKING' && (
                  <label className={`${secondaryButtonClassName} cursor-pointer`}>
                    <Paperclip aria-hidden='true' className='size-3.5' />
                    {t('finance.exceptions.attach')}
                    <input
                      className='sr-only'
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) onUpdate({ evidence: [...item.evidence, file.name] })
                      }}
                      type='file'
                    />
                  </label>
                )
              }
              title={t('finance.exceptions.evidence', { count: item.evidence.length })}
            />
            <ul className='mt-3 space-y-1 text-xs'>
              {item.evidence.map((file) => (
                <li className='flex items-center gap-1.5 font-mono text-muted-foreground' key={file}>
                  <FileText aria-hidden='true' className='size-3.5' />
                  {file}
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel className='h-fit xl:sticky xl:top-0'>
          <PanelTitle title={t('finance.exceptions.resultTitle')} />
          <div className='mt-4'>
            {item.status === 'CHECKING' ? (
              <div className='space-y-3'>
                <button
                  className={`${primaryButtonClassName} w-full`}
                  onClick={() => onUpdate({ status: 'SENT_TO_APPROVER' })}
                  type='button'
                >
                  <Forward aria-hidden='true' className='size-3.5' />
                  {t('finance.exceptions.sendToApprover')}
                </button>
                <button
                  className={`${secondaryButtonClassName} w-full`}
                  onClick={() => setShowBillingDialog(true)}
                  type='button'
                >
                  {t('finance.exceptions.billingError')}
                </button>
                <p className='text-[0.7rem] text-muted-foreground'>{t('finance.exceptions.linkedByIt')}</p>
              </div>
            ) : (
              <Notice
                icon={statusTones[item.status] === 'success' ? ReceiptText : Forward}
                tone={statusTones[item.status]}
              >
                <p>{t(`finance.exceptions.outcome.${item.status}`)}</p>
                {item.closeNote && <p className='mt-1 italic'>{item.closeNote}</p>}
              </Notice>
            )}
          </div>
        </Panel>
      </div>

      {showBillingDialog && (
        <BillingErrorDialog
          code={item.code}
          onClose={() => setShowBillingDialog(false)}
          onConfirm={(note) => {
            onUpdate({ closeNote: note, status: 'BILLING_ERROR' })
            setShowBillingDialog(false)
          }}
        />
      )}
    </div>
  )
}

function BillingErrorDialog({
  code,
  onClose,
  onConfirm
}: {
  code: string
  onClose: () => void
  onConfirm: (note: string) => void
}) {
  const { t } = useTranslation('dashboard')
  const [note, setNote] = useState('')
  const [showError, setShowError] = useState(false)

  return (
    <Dialog
      hint={t('finance.exceptions.billingDialogHint')}
      onClose={onClose}
      title={t('finance.exceptions.billingDialogTitle', { code })}
    >
      <form
        className='space-y-3'
        onSubmit={(event) => {
          event.preventDefault()
          if (note.trim().length === 0) {
            setShowError(true)
            return
          }
          onConfirm(note.trim())
        }}
      >
        <label className='text-xs font-bold' htmlFor='billing-note'>
          {t('finance.exceptions.billingNote')}
        </label>
        <textarea
          className={`${inputClassName} min-h-24`}
          id='billing-note'
          onChange={(event) => setNote(event.target.value)}
          value={note}
        />
        {showError && note.trim().length === 0 && (
          <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
            {t('finance.exceptions.billingNoteRequired')}
          </p>
        )}
        <div className='flex flex-wrap justify-end gap-2 pt-2'>
          <button className={secondaryButtonClassName} onClick={onClose} type='button'>
            {t('ui.cancel')}
          </button>
          <button className={primaryButtonClassName} type='submit'>
            {t('finance.exceptions.closeBillingError')}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
