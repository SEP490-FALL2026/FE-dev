import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { FileSpreadsheet, LoaderCircle, UploadCloud } from 'lucide-react'
import type { EmployeeImportRowListOutcome } from '~/shared/api/generated/model/employee-imports'
import { useEmployeeImportUpload } from '~/shared/api/generated/operations/employee-imports/employee-import-upload'
import {
  useEmployeeImportGet,
  getEmployeeImportGetQueryKey
} from '~/shared/api/generated/operations/employee-imports/employee-import-get'
import {
  useEmployeeImportRowList,
  getEmployeeImportRowListQueryKey
} from '~/shared/api/generated/operations/employee-imports/employee-import-row-list'
import { useEmployeeImportPreviewRefresh } from '~/shared/api/generated/operations/employee-imports/employee-import-preview-refresh'
import { useEmployeeImportConfirm } from '~/shared/api/generated/operations/employee-imports/employee-import-confirm'
import { useEmployeeImportCancel } from '~/shared/api/generated/operations/employee-imports/employee-import-cancel'
import { importTemplateGet } from '~/shared/api/generated/operations/import-templates/import-template-get'
import { getAccountCandidatesListQueryKey } from '~/shared/api/generated/operations/app-users/account-candidates-list'
import { AdminField, adminButtonClass, adminInputClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'
import { PersonnelForm } from '../../shared/components/personnel-form'
import { PersonnelCard, PersonnelCode, PersonnelList } from '../../shared/components/personnel-list'
import { importOutcomes } from '../enums/import-outcome'
import { useAdminRetryDelay } from '../../shared/hooks/use-admin-retry-delay'
import { useRecentEmployeeImports } from '../hooks/use-recent-employee-imports'
import { importColumnField } from '../enums/import-column'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ImportPreviewCard } from './import-preview-card'
import { AdminSelect } from '../../shared/components/admin-select'
import { AdminSectionTitle } from '../../shared/components/admin-page-header'

export function ImportPanel() {
  const { t: translate } = useTranslation('adminPersonnel')
  const { t: translateAdmin } = useTranslation('admin')
  const retrySeconds = useAdminRetryDelay()
  const { formatDateTime } = useDashboardFormat()
  const [searchParams, setSearchParams] = useSearchParams()
  const importId = searchParams.get('importId') ?? ''
  const setImportId = (id: string) =>
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      if (id) {
        next.set('importId', id)
        next.set('section', 'imports')
      } else next.delete('importId')
      return next
    })
  const [page, setPage] = useState(1)
  const [outcome, setOutcome] = useState<EmployeeImportRowListOutcome | undefined>()
  const [action, setAction] = useState<'confirm' | 'cancel' | null>(null)
  const [version, setVersion] = useState(0)
  const intents = useRef(new Map<string, string>())
  const query = useEmployeeImportGet(importId, { query: { enabled: Boolean(importId) } })
  const rows = useEmployeeImportRowList(
    importId,
    { page, pageSize: 20, outcome },
    { query: { enabled: Boolean(importId) } }
  )
  const feedback = usePersonnelMutationFeedback(
    [
      getEmployeeImportGetQueryKey(importId),
      getEmployeeImportRowListQueryKey(importId),
      getAccountCandidatesListQueryKey()
    ],
    () => setAction(null)
  )
  const [downloadingTemplate, setDownloadingTemplate] = useState(false)
  async function handleDownloadTemplate(format: 'xlsx' | 'csv') {
    if (downloadingTemplate) return
    setDownloadingTemplate(true)
    try {
      const file = await importTemplateGet('employees', { format })
      const url = URL.createObjectURL(file)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `employee-template.${format}`
      document.body.append(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      toast.error(translate('downloadTemplateError'), { id: 'admin-import-template' })
    } finally {
      setDownloadingTemplate(false)
    }
  }
  const upload = useEmployeeImportUpload({
    mutation: {
      ...feedback,
      retry: false,
      onSuccess: async (response) => {
        if (response.data) {
          setImportId(response.data.id)
          setPage(1)
          setOutcome(undefined)
          intents.current.clear()
        }
        await feedback.onSuccess()
      }
    }
  })
  const refresh = useEmployeeImportPreviewRefresh({
    mutation: {
      ...feedback,
      retry: false,
      onSuccess: async () => {
        intents.current.clear()
        await feedback.onSuccess()
      }
    }
  })
  const confirm = useEmployeeImportConfirm({ mutation: { ...feedback, retry: false } })
  const cancel = useEmployeeImportCancel({ mutation: { ...feedback, retry: false } })
  const pending = upload.isPending || refresh.isPending || confirm.isPending || cancel.isPending
  const data = query.data?.data
  const recentImports = useRecentEmployeeImports(data)
  const columnLabel = (column: string) => {
    const field = importColumnField(column)
    return field ? translate(`fields.${field}`) : translate('otherImportColumn')
  }
  return (
    <section className='space-y-5'>
      {importId ? (
        <button
          type='button'
          className={adminButtonClass}
          disabled={pending}
          onClick={() => {
            setImportId('')
            setAction(null)
            setPage(1)
            setOutcome(undefined)
          }}
        >
          {translate('details.backImports')}
        </button>
      ) : (
        <>
          <div className='grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]'>
            <div className='space-y-5 rounded-xl border border-border/80 bg-surface p-5 shadow-[0_1px_2px_rgb(0_0_0/4%),0_12px_28px_-24px_rgb(35_39_65/40%)] sm:p-6'>
              <div className='flex items-start gap-3'>
                <span className='rounded-lg bg-primary-soft p-2.5 text-primary-ink'>
                  <UploadCloud aria-hidden className='size-5' strokeWidth={1.5} />
                </span>
                <div>
                  <p className='text-[11px] font-semibold tracking-widest text-primary-ink uppercase'>
                    {translate('ui.importStepUpload')}
                  </p>
                  <h2 className='mt-0.5 font-semibold'>{translate('importUploadTitle')}</h2>
                  <p className='mt-1 text-sm text-muted-foreground'>{translate('importUploadDescription')}</p>
                </div>
              </div>
              <AdminField label={translate('file')} description={translate('fieldHelp.file')} required>
                <input
                  className={`${adminInputClass} h-auto w-full cursor-pointer py-3 file:mr-4 file:rounded-md file:border-0 file:bg-primary-soft file:px-3 file:py-2 file:font-medium file:text-primary-ink`}
                  name='file'
                  type='file'
                  accept='.csv,.xlsx'
                  required
                  disabled={pending || retrySeconds > 0}
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0]
                    event.currentTarget.value = ''
                    if (!file || pending || retrySeconds > 0) return
                    if (!file.size || file.size > 2 * 1024 * 1024 || !/\.(csv|xlsx)$/i.test(file.name)) {
                      toast.error(translate('invalidFile'), { id: 'admin-import' })
                      return
                    }
                    upload.mutate({ data: { file } })
                  }}
                />
              </AdminField>
              {upload.isPending && (
                <p role='status' className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <LoaderCircle aria-hidden className='size-4 animate-spin' strokeWidth={1.5} />
                  {translate('preparingPreview')}
                </p>
              )}
              {retrySeconds > 0 && (
                <p role='status' className='text-sm text-muted-foreground'>
                  {translateAdmin('retryIn', { count: retrySeconds })}
                </p>
              )}
            </div>
            <div className='soft-panel space-y-4 p-5 sm:p-6'>
              <div className='flex items-start gap-3'>
                <span className='rounded-lg bg-surface-subtle p-2.5 text-muted-foreground'>
                  <FileSpreadsheet aria-hidden className='size-5' strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className='font-semibold'>{translate('importTemplateTitle')}</h2>
                  <p className='mt-1 text-sm text-muted-foreground'>{translate('importTemplateDescription')}</p>
                </div>
              </div>
              <p className='text-sm leading-relaxed text-muted-foreground'>{translate('importHelp')}</p>
              <div className='flex flex-wrap gap-2'>
                <button
                  type='button'
                  className={adminButtonClass}
                  disabled={pending || downloadingTemplate}
                  aria-busy={downloadingTemplate}
                  onClick={() => void handleDownloadTemplate('xlsx')}
                >
                  {downloadingTemplate && (
                    <LoaderCircle aria-hidden className='size-4 animate-spin' strokeWidth={1.5} />
                  )}
                  {translate(downloadingTemplate ? 'templateLoading' : 'downloadTemplate')}
                </button>
                <button
                  type='button'
                  className={adminButtonClass}
                  disabled={pending || downloadingTemplate}
                  onClick={() => void handleDownloadTemplate('csv')}
                >
                  {translate('downloadCsvTemplate')}
                </button>
              </div>
            </div>
          </div>
          {recentImports.length > 0 && (
            <div className='space-y-3 rounded-xl border border-border bg-surface p-5 sm:p-6'>
              <h2 className='section-accent font-semibold'>{translate('recentImportsTitle')}</h2>
              <AdminField label={translate('fields.importId')} description={translate('recentImportsHelp')}>
                <AdminSelect
                  value=''
                  disabled={pending}
                  onChange={(id) => {
                    if (!id) return
                    setImportId(id)
                    setPage(1)
                    setOutcome(undefined)
                    intents.current.clear()
                  }}
                  options={recentImports.map((item) => ({
                    value: item.id,
                    label: item.fileName,
                    description: formatDateTime(item.createdAt)
                  }))}
                  placeholder={translate('ui.pickRecentImport')}
                />
              </AdminField>
            </div>
          )}
        </>
      )}
      {importId && (
        <AdminQueryState query={query}>
          {data && (
            <ImportPreviewCard
              data={data}
              ignoredColumns={data.ignoredColumns.map(columnLabel).join(', ')}
              pending={pending}
              refreshDisabled={pending || retrySeconds > 0}
              confirmDisabled={pending || query.isFetching}
              onRefresh={() => refresh.mutate({ id: importId })}
              onConfirm={() => {
                setVersion(data.previewVersion)
                setAction('confirm')
              }}
              onCancel={() => setAction('cancel')}
            />
          )}
        </AdminQueryState>
      )}
      {importId && (
        <>
          <AdminSectionTitle title={translate('ui.importRowsTitle')} hint={translate('ui.importRowsHint')} />
          <div className='soft-panel p-4'>
            <AdminField label={translate('allRows')} description={translate('fieldHelp.allRows')}>
              <AdminSelect
                className='max-w-sm'
                value={outcome ?? ''}
                clearable
                onChange={(next) => {
                  setOutcome(importOutcomes.find((code) => code === next))
                  setPage(1)
                }}
                options={importOutcomes.map((code) => ({ value: code, label: translate(`codes.${code}`) }))}
                placeholder={translate('ui.allOutcomes')}
              />
            </AdminField>
          </div>
          <AdminQueryState query={rows}>
            <PersonnelList empty={!rows.data?.data?.items.length}>
              {rows.data?.data?.items.map((row) => (
                <PersonnelCard key={row.line} title={translate('row', { line: row.line })}>
                  <PersonnelCode code={row.outcome} values={importOutcomes} />
                  <dl className='grid gap-1 sm:grid-cols-2'>
                    {Object.entries(row.cells).map(([key, cell]) => (
                      <div key={key}>
                        <dt className='text-xs'>{columnLabel(key)}</dt>
                        <dd className='break-words'>
                          {importColumnField(key) === 'employmentType'
                            ? translate(`codes.${cell}`, { defaultValue: translate('unknown') })
                            : importColumnField(key)
                              ? cell
                              : translate('unsupportedImportValue')}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {row.errors.length > 0 && (
                    <p className='break-words'>
                      {translate('rowErrors', {
                        errors: row.errors
                          .map((error) => translate('invalidImportCell', { field: columnLabel(error.column) }))
                          .join(', ')
                      })}
                    </p>
                  )}
                  {row.differences?.length ? (
                    <p>
                      {translate('differences', {
                        fields: row.differences.map((difference) => columnLabel(difference.column)).join(', ')
                      })}
                    </p>
                  ) : null}
                </PersonnelCard>
              ))}
            </PersonnelList>
            <AdminPagination
              pagination={rows.data?.data?.pagination}
              onPageChange={setPage}
              disabled={rows.isFetching}
            />
          </AdminQueryState>
        </>
      )}
      {action && (
        <PersonnelForm
          title={translate(action === 'confirm' ? 'confirmImport' : 'cancelImport')}
          pending={pending}
          fields={
            action === 'confirm' && data?.summary.duplicateOf
              ? [{ name: 'acknowledgeDuplicateFile', type: 'checkbox' }]
              : []
          }
          onClose={() => setAction(null)}
          onSubmit={(values) => {
            if (pending) return
            if (action === 'cancel') {
              cancel.mutate({ id: importId })
              return
            }
            const intent = {
              previewVersion: version,
              ...(values.get('acknowledgeDuplicateFile') ? { acknowledgeDuplicateFile: true } : {})
            }
            const signature = JSON.stringify({ importId, ...intent })
            let idempotencyKey = intents.current.get(signature)
            if (!idempotencyKey) {
              idempotencyKey = crypto.randomUUID()
              intents.current.set(signature, idempotencyKey)
            }
            confirm.mutate({ id: importId, data: { ...intent, idempotencyKey } })
          }}
        />
      )}
    </section>
  )
}
