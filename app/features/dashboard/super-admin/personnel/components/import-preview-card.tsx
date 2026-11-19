import { useTranslation } from 'react-i18next'
import { CircleCheck, CircleX, Equal, FileSpreadsheet, GitCompareArrows, TriangleAlert } from 'lucide-react'
import type { EmployeeImportResponseDtoData } from '~/shared/api/generated/model/employee-imports'
import { useDashboardFormat } from '../../../dashboard-ui'
import { adminButtonClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { PersonnelCode } from '../../shared/components/personnel-list'
import { importStatuses, previewImport } from '../enums/import-status'
import { ImportImpactSummary } from './import-impact-summary'

/** Step 2 of the import: preview summary, impact and the confirm/cancel decision. */
export function ImportPreviewCard({
  data,
  ignoredColumns,
  pending,
  refreshDisabled,
  confirmDisabled,
  onRefresh,
  onConfirm,
  onCancel
}: {
  data: NonNullable<EmployeeImportResponseDtoData>
  ignoredColumns: string
  pending: boolean
  refreshDisabled: boolean
  confirmDisabled: boolean
  onRefresh: () => void
  onConfirm: () => void
  onCancel: () => void
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const { formatNumber } = useDashboardFormat()
  const tiles = [
    { key: 'valid', value: data.summary.valid, icon: CircleCheck },
    { key: 'errors', value: data.summary.errors, icon: CircleX },
    { key: 'same', value: data.summary.existingSame, icon: Equal },
    { key: 'different', value: data.summary.existingDifferent, icon: GitCompareArrows }
  ] as const
  return (
    <section className='space-y-5 rounded-xl border border-border/80 bg-surface p-5 shadow-[0_1px_2px_rgb(0_0_0/4%),0_12px_28px_-24px_rgb(35_39_65/40%)] sm:p-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='flex min-w-0 items-start gap-3'>
          <span className='grid size-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-ink'>
            <FileSpreadsheet aria-hidden className='size-5' strokeWidth={1.5} />
          </span>
          <div className='min-w-0'>
            <p className='text-[11px] font-semibold tracking-widest text-primary-ink uppercase'>
              {translate('ui.importStepPreview')}
            </p>
            <h2 className='mt-0.5 truncate text-lg font-semibold' title={data.fileName}>
              {data.fileName}
            </h2>
            <p className='mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
              <PersonnelCode code={data.status} values={importStatuses} />
              {translate('importVersion', { version: data.previewVersion })}
            </p>
          </div>
        </div>
        {data.status === previewImport && (
          <div className='flex flex-wrap gap-2'>
            <button type='button' className={adminButtonClass} disabled={pending} onClick={onCancel}>
              {translate('cancelImport')}
            </button>
            <button type='button' className={adminButtonClass} disabled={refreshDisabled} onClick={onRefresh}>
              {translate('refreshPreview')}
            </button>
            <button type='button' className={adminPrimaryClass} disabled={confirmDisabled} onClick={onConfirm}>
              {translate('confirmImport')}
            </button>
          </div>
        )}
      </div>
      <dl className='kpi-tone-grid grid grid-cols-2 gap-3 lg:grid-cols-4'>
        {tiles.map(({ key, value, icon: Icon }) => (
          <div key={key} className='soft-panel flex items-center gap-3 p-3.5'>
            <span className='kpi-chip grid size-9 shrink-0 place-items-center rounded-lg'>
              <Icon aria-hidden className='size-[1.125rem]' strokeWidth={1.5} />
            </span>
            <div className='min-w-0'>
              <dt className='truncate text-xs text-muted-foreground'>{translate(`ui.importTiles.${key}`)}</dt>
              <dd className='font-mono text-xl font-semibold tabular-nums'>{formatNumber(value)}</dd>
            </div>
          </div>
        ))}
      </dl>
      {data.result && (
        <p className='text-sm'>
          {translate('importResult', { created: data.result.created, errors: data.result.errors })}
        </p>
      )}
      {ignoredColumns && (
        <p className='text-sm text-muted-foreground'>{translate('ignoredColumns', { columns: ignoredColumns })}</p>
      )}
      {data.summary.duplicateOf && (
        <p className='flex items-start gap-2 rounded-md bg-warning/10 px-3 py-2.5 text-sm text-warning-ink'>
          <TriangleAlert aria-hidden className='mt-0.5 size-4 shrink-0' strokeWidth={1.5} />
          {translate('duplicateFile')}
        </p>
      )}
      <ImportImpactSummary summary={data.summary} />
    </section>
  )
}
