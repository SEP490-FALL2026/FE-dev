import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'
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
import { getAccountCandidatesListQueryKey } from '~/shared/api/generated/operations/app-users/account-candidates-list'
import { AdminField, adminButtonClass, adminInputClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'
import { PersonnelForm, readBasis, uuidPattern, value } from '../../shared/components/personnel-form'
import { PersonnelCard, PersonnelCode, PersonnelList } from '../../shared/components/personnel-list'
import { importStatuses, previewImport } from '../enums/import-status'
import { importOutcomes } from '../enums/import-outcome'
import { useAdminRetryDelay } from '../../shared/hooks/use-admin-retry-delay'

export function ImportPanel() {
  const { t: translate } = useTranslation('adminPersonnel')
  const { t: translateAdmin } = useTranslation('admin')
  const retrySeconds = useAdminRetryDelay()
  const [searchParams] = useSearchParams()
  const [importId, setImportId] = useState(searchParams.get('importId') ?? '')
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
  return (
    <section className='space-y-5'>
      <p className='text-sm text-muted-foreground'>{translate('importHelp')}</p>
      <form
        className='flex flex-wrap items-end gap-3'
        onSubmit={(event) => {
          event.preventDefault()
          if (pending || retrySeconds > 0) return
          const file = new FormData(event.currentTarget).get('file')
          if (
            !(file instanceof File) ||
            !file.size ||
            file.size > 2 * 1024 * 1024 ||
            !/\.(csv|xlsx)$/i.test(file.name)
          ) {
            toast.error(translate('invalidFile'), { id: 'admin-import' })
            return
          }
          upload.mutate({ data: { file } })
        }}
      >
        <AdminField label={translate('file')}>
          <input className={adminInputClass} name='file' type='file' accept='.csv,.xlsx' required disabled={pending} />
        </AdminField>
        <button className={adminPrimaryClass} disabled={pending || retrySeconds > 0} aria-busy={upload.isPending}>
          {upload.isPending && <LoaderCircle aria-hidden className='size-4 animate-spin' strokeWidth={1.5} />}
          {upload.isPending
            ? translateAdmin('saving')
            : retrySeconds > 0
              ? translateAdmin('retryIn', { count: retrySeconds })
              : translate('upload')}
        </button>
      </form>
      <form
        className='flex flex-wrap items-end gap-3'
        onSubmit={(event) => {
          event.preventDefault()
          if (!pending) {
            setImportId(value(new FormData(event.currentTarget), 'importId'))
            setPage(1)
            setOutcome(undefined)
            intents.current.clear()
          }
        }}
      >
        <AdminField label={translate('fields.importId')}>
          <input
            className={adminInputClass}
            name='importId'
            placeholder={translate('importIdPlaceholder')}
            pattern={uuidPattern}
            required
            disabled={pending}
          />
        </AdminField>
        <button className={adminButtonClass} disabled={pending}>
          {translate('resumeImport')}
        </button>
      </form>
      {importId && (
        <AdminQueryState query={query}>
          {data && (
            <div className='space-y-4 rounded-lg border border-border bg-surface p-4'>
              <h3 className='font-semibold'>{data.fileName}</h3>
              <PersonnelCode code={data.status} values={importStatuses} />
              <p>{translate('importVersion', { version: data.previewVersion })}</p>
              <p>
                {translate('importSummary', {
                  valid: data.summary.valid,
                  errors: data.summary.errors,
                  same: data.summary.existingSame,
                  different: data.summary.existingDifferent
                })}
              </p>
              {data.result && (
                <p>{translate('importResult', { created: data.result.created, errors: data.result.errors })}</p>
              )}
              {data.ignoredColumns.length > 0 && (
                <p>{translate('ignoredColumns', { columns: data.ignoredColumns.join(', ') })}</p>
              )}
              {data.summary.duplicateOf && <p className='text-warning'>{translate('duplicateFile')}</p>}
              {data.status === previewImport && (
                <div className='flex flex-wrap gap-3'>
                  <button
                    className={adminButtonClass}
                    disabled={pending || retrySeconds > 0}
                    onClick={() => refresh.mutate({ id: importId })}
                  >
                    {translate('refreshPreview')}
                  </button>
                  <button
                    className={adminButtonClass}
                    disabled={pending || query.isFetching}
                    onClick={() => {
                      setVersion(data.previewVersion)
                      setAction('confirm')
                    }}
                  >
                    {translate('confirmImport')}
                  </button>
                  <button className={adminButtonClass} disabled={pending} onClick={() => setAction('cancel')}>
                    {translate('cancelImport')}
                  </button>
                </div>
              )}
            </div>
          )}
        </AdminQueryState>
      )}
      {importId && (
        <>
          <AdminField label={translate('allRows')}>
            <select
              className={`${adminInputClass} max-w-xs`}
              value={outcome ?? ''}
              onChange={(event) => {
                setOutcome(event.target.value ? (event.target.value as EmployeeImportRowListOutcome) : undefined)
                setPage(1)
              }}
            >
              <option value=''>{translate('allRows')}</option>
              {importOutcomes.map((code) => (
                <option key={code} value={code}>
                  {translate(`codes.${code}`)}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminQueryState query={rows}>
            <PersonnelList empty={!rows.data?.data?.items.length}>
              {rows.data?.data?.items.map((row) => (
                <PersonnelCard key={row.line} title={translate('row', { line: row.line })}>
                  <PersonnelCode code={row.outcome} values={importOutcomes} />
                  <dl className='grid gap-1 sm:grid-cols-2'>
                    {Object.entries(row.cells).map(([key, cell]) => (
                      <div key={key}>
                        <dt className='font-mono text-xs'>{key}</dt>
                        <dd className='break-words'>{cell}</dd>
                      </div>
                    ))}
                  </dl>
                  {row.errors.length > 0 && (
                    <p className='break-words'>
                      {translate('rowErrors', {
                        errors: row.errors.map((error) => `${error.column}: ${error.code}`).join(', ')
                      })}
                    </p>
                  )}
                  {row.differences?.length ? (
                    <p>
                      {translate('differences', {
                        fields: row.differences.map((difference) => difference.column).join(', ')
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
          basis={action === 'confirm'}
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
              hrBasis: readBasis(values),
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
