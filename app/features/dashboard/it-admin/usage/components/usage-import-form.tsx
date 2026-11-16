import { useTranslation } from 'react-i18next'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { UsageImportUploadBody } from '~/shared/api/generated/model'
import { useUsageSourceList } from '~/shared/api/generated/operations/usage-sources/usage-source-list'
import { useUsageSourceGet } from '~/shared/api/generated/operations/usage-sources/usage-source-get'
import { getUsageImportListQueryKey } from '~/shared/api/generated/operations/usage-imports/usage-import-list'
import { usageImportUpload } from '~/shared/api/generated/operations/usage-imports/usage-import-upload'
import { ItField, itButtonClass, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { getItError } from '../../shared/hooks/it-errors'
import { ItImportTemplateButton } from '../../shared/components/it-import-template-button'

export function ImportForm({ onBack, onUploaded }: { onBack: () => void; onUploaded: (id: string) => void }) {
  const { t } = useTranslation('itDepartmentWork')
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [source, setSource] = useState('')
  const [file, setFile] = useState<File>()
  const [coverageFrom, setCoverageFrom] = useState('')
  const [coverageTo, setCoverageTo] = useState('')
  const sourceDetail = useUsageSourceGet(source, { query: { enabled: !!source } })
  const validCoverage = (!coverageFrom && !coverageTo) || (!!coverageFrom && !!coverageTo && coverageFrom <= coverageTo)
  const [uncertain, setUncertain] = useState(false)
  const sources = useUsageSourceList({ page, pageSize: 20 })
  const feedback = useItMutationFeedback([getUsageImportListQueryKey()])
  const upload = useMutation({
    mutationFn: (body: UsageImportUploadBody) => usageImportUpload(body),
    onError: async (error) => {
      if (getItError(error).key === 'unknownOutcome') setUncertain(true)
      await feedback.onError(error)
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: getUsageImportListQueryKey() })
      if (result.data) {
        toast.success(t('usageImport.previewReady'), { id: 'it-usage-upload' })
        onUploaded(result.data.id)
      } else setUncertain(true)
    }
  })
  return (
    <section className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {t('back')}
      </button>
      <h1 className='text-2xl font-semibold'>{t('usageImport.new')}</h1>
      <ItImportTemplateButton kind='usage-csv' />
      <form
        className='space-y-5'
        onSubmit={(event) => {
          event.preventDefault()
          if (source && file && file.size <= 10 * 1024 * 1024 && validCoverage && !upload.isPending && !uncertain)
            upload.mutate({ sourceId: source, file, ...(coverageFrom ? { coverageFrom, coverageTo } : {}) })
        }}
      >
        <fieldset className='space-y-3' disabled={upload.isPending}>
          <legend className='font-medium'>
            {t('usageImport.source')}{' '}
            <span className='text-danger' aria-hidden='true'>
              *
            </span>
          </legend>
          <p className='text-sm text-muted-foreground'>{t('usageImport.sourceHint')}</p>
          <ItQueryState query={sources}>
            {sources.data?.data?.items.length ? (
              sources.data.data.items.map((item) => (
                <label key={item.id} className='flex min-h-11 items-center gap-3 rounded-md border border-border p-3'>
                  <input
                    type='radio'
                    name='source'
                    required
                    checked={source === item.id}
                    onChange={() => setSource(item.id)}
                  />
                  <span>
                    {item.application.name} · {item.name}
                  </span>
                </label>
              ))
            ) : (
              <ItEmpty />
            )}
          </ItQueryState>
          <ItPagination
            page={page}
            pageSize={20}
            total={sources.data?.data?.pagination.totalItems ?? 0}
            onChange={setPage}
          />
          {sourceDetail.data?.data && (
            <div className='rounded-lg border border-border p-4'>
              <p className='font-medium'>{t('usageImport.activityDefinition')}</p>
              <p className='text-sm'>{sourceDetail.data.data.activityDefinition}</p>
              <p className='mt-2 text-sm'>
                {t('usageImport.configuration')}:{' '}
                {Object.values(sourceDetail.data.data.template.columns).filter(Boolean).join(', ')}
              </p>
            </div>
          )}
          <div className='grid gap-4 sm:grid-cols-2'>
            <ItField label={t('usageImport.coverageFrom')}>
              <input
                type='date'
                className={itInputClass}
                value={coverageFrom}
                onChange={(event) => setCoverageFrom(event.target.value)}
              />
            </ItField>
            <ItField label={t('usageImport.coverageTo')} hint={t('usageImport.coverageHint')}>
              <input
                type='date'
                className={itInputClass}
                value={coverageTo}
                onChange={(event) => setCoverageTo(event.target.value)}
                aria-invalid={!validCoverage}
              />
            </ItField>
          </div>
          <ItField label={t('usageImport.file')} hint={t('usageImport.fileHint')}>
            <input
              type='file'
              required
              className={itInputClass}
              onChange={(event) => setFile(event.target.files?.[0])}
            />
          </ItField>
          <button
            type='submit'
            className={itButtonClass}
            disabled={
              !source || !file || file.size > 10 * 1024 * 1024 || !validCoverage || upload.isPending || uncertain
            }
          >
            {t('usageImport.upload')}
          </button>
        </fieldset>
        {uncertain && (
          <p role='status' className='text-sm text-danger'>
            {t('usageImport.uploadUncertain')}
          </p>
        )}
      </form>
    </section>
  )
}
