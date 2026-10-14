import { Ban, CheckCircle2, FileSpreadsheet, RotateCcw, Upload } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  StatTile,
  dangerButtonClassName,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  useDashboardFormat
} from '../../dashboard-ui'
import { importPreview, importReconcileResult, importTemplates } from '../finance-data'
import type { FinanceTabKey } from '../finance-nav'

type Stage = 'cancelled' | 'done' | 'preview' | 'upload'

interface FinanceSpendImportViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey) => void
}

export function FinanceSpendImportView({ formatCurrency, onSelectTab }: FinanceSpendImportViewProps) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const [stage, setStage] = useState<Stage>('upload')
  const [template, setTemplate] = useState<string>(importTemplates[1].id)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileError, setFileError] = useState(false)

  const rows = importPreview.rows
  const validRows = rows.filter((row) => !row.problem)
  const errorRows = rows.filter((row) => row.problem === 'INVALID_DATE' || row.problem === 'MISSING_AMOUNT')
  const duplicateRows = rows.filter((row) => row.problem === 'DUPLICATE')

  const pickFile = (file: File | undefined) => {
    if (!file) return
    const isCsv = file.name.toLowerCase().endsWith('.csv')
    setFileError(!isCsv)
    setFileName(isCsv ? file.name : null)
  }

  const reset = () => {
    setStage('upload')
    setFileName(null)
    setFileError(false)
  }

  return (
    <div className='space-y-6'>
      <PageHeader subtitle={t('finance.import.subtitle')} title={t('finance.import.title')} />

      <ol aria-label={t('finance.import.stepsLabel')} className='grid gap-2 sm:grid-cols-3'>
        {(['upload', 'preview', 'done'] as const).map((step, index) => {
          const isActive = stage === step || (step === 'done' && stage === 'cancelled')
          return (
            <li
              aria-current={isActive ? 'step' : undefined}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                isActive ? 'border-primary bg-primary-soft/40 text-primary' : 'border-border text-muted-foreground'
              }`}
              key={step}
            >
              {index + 1}. {t(`finance.import.steps.${step}`)}
            </li>
          )
        })}
      </ol>

      {stage === 'upload' && (
        <Panel>
          <PanelTitle hint={t('finance.import.uploadHint')} title={t('finance.import.uploadTitle')} />
          <div className='mt-4 grid gap-4 md:grid-cols-2'>
            <div>
              <label className='text-xs font-bold text-foreground' htmlFor='import-template'>
                {t('finance.import.templateLabel')}
              </label>
              <select
                className={`${inputClassName} mt-2`}
                id='import-template'
                onChange={(event) => setTemplate(event.target.value)}
                value={template}
              >
                {importTemplates.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='text-xs font-bold text-foreground' htmlFor='import-file'>
                {t('finance.import.fileLabel')}
              </label>
              <input
                accept='.csv,text/csv'
                className={`${inputClassName} mt-2 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-soft file:px-3 file:py-1 file:text-xs file:font-bold file:text-primary`}
                id='import-file'
                onChange={(event) => pickFile(event.target.files?.[0])}
                type='file'
              />
              {fileError && (
                <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                  {t('finance.import.fileRejected')}
                </p>
              )}
            </div>
          </div>

          <div className='mt-4 flex flex-wrap items-center gap-3'>
            <button
              className={primaryButtonClassName}
              disabled={!fileName}
              onClick={() => setStage('preview')}
              type='button'
            >
              <Upload aria-hidden='true' className='size-3.5' />
              {t('finance.import.toPreview')}
            </button>
            <button
              className={secondaryButtonClassName}
              onClick={() => {
                setFileName(importPreview.fileName)
                setFileError(false)
              }}
              type='button'
            >
              <FileSpreadsheet aria-hidden='true' className='size-3.5' />
              {t('finance.import.useSample')}
            </button>
            {fileName && <span className='font-mono text-xs text-muted-foreground'>{fileName}</span>}
          </div>
          <p className='mt-3 text-[0.7rem] text-muted-foreground'>{t('finance.import.formatNote')}</p>
        </Panel>
      )}

      {stage === 'preview' && (
        <>
          <section aria-label={t('finance.import.previewSummary')} className='grid gap-4 sm:grid-cols-3'>
            <StatTile
              icon={CheckCircle2}
              label={t('finance.import.validRows')}
              tone='success'
              value={String(validRows.length)}
            />
            <StatTile icon={Ban} label={t('finance.import.errorRows')} tone='danger' value={String(errorRows.length)} />
            <StatTile
              icon={RotateCcw}
              label={t('finance.import.duplicateRows')}
              tone='warning'
              value={String(duplicateRows.length)}
            />
          </section>

          <Panel>
            <PanelTitle hint={t('finance.import.previewHint')} title={fileName ?? importPreview.fileName} />
            <div className='mt-4 overflow-x-auto'>
              <table className='w-full min-w-160 text-left text-xs'>
                <thead>
                  <tr className='border-b border-border text-muted-foreground'>
                    <th className='py-2.5 font-semibold'>{t('finance.import.colLine')}</th>
                    <th className='py-2.5 font-semibold'>{t('finance.import.colDate')}</th>
                    <th className='py-2.5 font-semibold'>{t('finance.import.colDescription')}</th>
                    <th className='py-2.5 text-right font-semibold'>{t('finance.import.colAmount')}</th>
                    <th className='py-2.5 font-semibold'>{t('finance.import.colResult')}</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {rows.map((row) => (
                    <tr className={row.problem ? 'bg-surface-subtle/40' : ''} key={row.line}>
                      <td className='py-2.5 font-mono'>{row.line}</td>
                      <td className='py-2.5'>
                        {/^\d{4}-\d{2}-\d{2}$/.test(row.date) ? formatDate(row.date) : row.date}
                      </td>
                      <td className='py-2.5 font-semibold'>{row.description}</td>
                      <td className='py-2.5 text-right'>{row.amount === null ? '—' : formatCurrency(row.amount)}</td>
                      <td className='py-2.5'>
                        {row.problem === undefined ? (
                          <Pill tone='success'>{t('finance.import.rowValid')}</Pill>
                        ) : row.problem === 'DUPLICATE' ? (
                          <Pill tone='warning'>{t('finance.import.problem.DUPLICATE')}</Pill>
                        ) : (
                          <Pill tone='danger'>{t(`finance.import.problem.${row.problem}`)}</Pill>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className='mt-3 text-[0.7rem] text-muted-foreground'>{t('finance.import.rowErrorNote')}</p>

            <div className='mt-4 flex flex-wrap justify-end gap-3'>
              <button className={dangerButtonClassName} onClick={() => setStage('cancelled')} type='button'>
                <Ban aria-hidden='true' className='size-3.5' />
                {t('finance.import.cancelBatch')}
              </button>
              <button className={primaryButtonClassName} onClick={() => setStage('done')} type='button'>
                <CheckCircle2 aria-hidden='true' className='size-3.5' />
                {t('finance.import.confirm', { count: validRows.length })}
              </button>
            </div>
          </Panel>
        </>
      )}

      {stage === 'cancelled' && (
        <Panel>
          <Notice icon={Ban} tone='neutral'>
            {t('finance.import.cancelledResult')}
          </Notice>
          <button className={`${secondaryButtonClassName} mt-4`} onClick={reset} type='button'>
            {t('finance.import.newImport')}
          </button>
        </Panel>
      )}

      {stage === 'done' && (
        <Panel>
          <Notice icon={CheckCircle2} tone='success'>
            {t('finance.import.doneResult', { count: validRows.length })}
          </Notice>
          <div className='mt-4 grid gap-4 sm:grid-cols-3'>
            <StatTile
              hint={t('finance.import.noFollowUpHint')}
              icon={CheckCircle2}
              label={t('finance.import.noFollowUp')}
              tone='success'
              value={String(importReconcileResult.noFollowUp)}
            />
            <StatTile
              action={t('finance.overview.openAction')}
              hint={t('finance.import.exceptionHint')}
              icon={Ban}
              label={t('finance.import.exception')}
              onClick={() => onSelectTab('charge-exceptions')}
              tone='danger'
              value={String(importReconcileResult.exception)}
            />
            <StatTile
              hint={t('finance.import.vendorQueueHint')}
              icon={RotateCcw}
              label={t('finance.import.vendorQueue')}
              tone='info'
              value={String(importReconcileResult.vendorQueue)}
            />
          </div>
          <button className={`${secondaryButtonClassName} mt-4`} onClick={reset} type='button'>
            {t('finance.import.newImport')}
          </button>
        </Panel>
      )}
    </div>
  )
}
