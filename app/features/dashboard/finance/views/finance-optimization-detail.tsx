import { ArrowLeft, Send } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PageHeader, Panel, PanelTitle, Pill, inputClassName, primaryButtonClassName } from '../../dashboard-ui'
import type { OptimizationOpportunity } from '../optimization-data'
import { sendOptimizationToApprover } from '../optimization-store'
import {
  OptimizationEvidencePanel,
  OptimizationSavingsPanel,
  OptimizationStatusNotice,
  optimizationKindTones,
  optimizationStatusTones
} from './optimization-parts'

/** FIN-35 detail: evidence and cost impact of one proposal; Finance sends a draft to the Spending Approver. */
export function FinanceOptimizationDetail({
  formatCurrency,
  item,
  onBack
}: {
  formatCurrency: (value: number) => string
  item: OptimizationOpportunity
  onBack: () => void
}) {
  const { t } = useTranslation('dashboard')
  const [note, setNote] = useState('')

  return (
    <div className='space-y-6'>
      <button
        className='inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground'
        onClick={onBack}
        type='button'
      >
        <ArrowLeft aria-hidden='true' className='size-4' />
        {t('finance.optimization.backToList')}
      </button>

      <PageHeader
        actions={
          <span className='flex flex-wrap gap-2'>
            <Pill tone={optimizationKindTones[item.kind]}>{t(`finance.optimization.kind.${item.kind}`)}</Pill>
            <Pill tone={optimizationStatusTones[item.status]}>{t(`finance.optimization.status.${item.status}`)}</Pill>
          </span>
        }
        subtitle={`${item.code} · ${item.costCenter}`}
        title={item.app}
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]'>
        <OptimizationEvidencePanel item={item} />

        <div className='space-y-6'>
          <OptimizationSavingsPanel formatCurrency={formatCurrency} item={item} />

          <Panel>
            <PanelTitle hint={t('finance.optimization.sendHint')} title={t('finance.optimization.sendTitle')} />
            <div className='mt-4 space-y-3'>
              {item.status === 'DRAFT' ? (
                <form
                  className='space-y-3'
                  onSubmit={(event) => {
                    event.preventDefault()
                    sendOptimizationToApprover(item.id, note.trim())
                  }}
                >
                  <label className='text-xs font-bold' htmlFor='optimization-note'>
                    {t('finance.optimization.noteLabel')}
                  </label>
                  <textarea
                    className={`${inputClassName} min-h-20`}
                    id='optimization-note'
                    onChange={(event) => setNote(event.target.value)}
                    value={note}
                  />
                  <button className={`${primaryButtonClassName} w-full`} type='submit'>
                    <Send aria-hidden='true' className='size-3.5' />
                    {t('finance.optimization.send')}
                  </button>
                </form>
              ) : (
                <>
                  <OptimizationStatusNotice item={item} />
                  {item.financeNote && (
                    <p className='text-xs text-muted-foreground'>
                      <span className='font-bold text-foreground'>{t('finance.optimization.financeNote')}: </span>
                      {item.financeNote}
                    </p>
                  )}
                </>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
