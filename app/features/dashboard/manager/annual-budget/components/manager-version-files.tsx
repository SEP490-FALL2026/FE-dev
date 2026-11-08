import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useBudgetVersionAttachmentList } from '~/shared/api/generated/operations/budgets/budget-version-attachment-list'
import { budgetAttachmentLink } from '~/shared/api/generated/operations/budgets/budget-attachment-link'
import { ManagerButton, ManagerPagination, ManagerQueryState } from '../../shared/components/manager-api-ui'

function formatBytes(bytes: number, locale = 'en') {
  const units = ['B', 'KB', 'MB']
  const exponent = Math.min(Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(1024)), units.length - 1)
  const value = new Intl.NumberFormat(locale, { maximumFractionDigits: exponent ? 1 : 0 }).format(
    bytes / 1024 ** exponent
  )
  return `${value} ${units[exponent]}`
}

export function ManagerVersionFiles({ versionId }: { versionId: string }) {
  const { t: translate, i18n } = useTranslation('manager')
  const [page, setPage] = useState(1)
  const query = useBudgetVersionAttachmentList(versionId, { page, pageSize: 20 })

  const download = useMutation({
    retry: false,
    mutationFn: async (attachmentId: string) => {
      const response = await budgetAttachmentLink(attachmentId)
      if (!response.data) throw new Error('LINK_EMPTY')
      const target = new URL(response.data.url)
      if (!['https:', 'http:'].includes(target.protocol) || new Date(response.data.expiresAt).getTime() <= Date.now())
        throw new Error('LINK_INVALID')
      const anchor = document.createElement('a')
      anchor.href = target.href
      anchor.target = '_blank'
      anchor.rel = 'noopener noreferrer'
      anchor.click()
    },
    onError: () => toast.error(translate('budgetForm.downloadFailed'), { id: 'version-budget-download' })
  })

  const files = !query.isError ? (query.data?.data?.items ?? []) : []

  return (
    <section className='space-y-3' aria-label={translate('versionFiles')}>
      <h3 className='text-sm font-semibold'>{translate('versionFiles')}</h3>
      <ManagerQueryState query={query} empty={!files.length} emptyTitle={translate('emptyVersionFiles')} />
      <ul className='divide-y divide-border/40'>
        {files.map((file) => (
          <li key={file.id} className='flex items-center justify-between gap-3 py-2.5'>
            <div className='flex items-center gap-3 min-w-0 flex-1'>
              <span className='grid size-8 shrink-0 place-items-center rounded-lg bg-surface-subtle text-muted-foreground'>
                <FileText aria-hidden className='size-4' strokeWidth={1.5} />
              </span>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium text-foreground' title={file.fileName}>
                  {file.fileName}
                </p>
                <p className='font-mono text-xs text-muted-foreground tabular-nums'>
                  {formatBytes(file.sizeBytes, i18n.language)}
                </p>
              </div>
            </div>
            <ManagerButton
              disabled={download.isPending}
              busy={download.isPending && download.variables === file.id}
              onClick={() => download.mutate(file.id)}
              aria-label={`${translate('budgetForm.download')}: ${file.fileName}`}
            >
              <Download aria-hidden strokeWidth={1.5} className='size-4' />
            </ManagerButton>
          </li>
        ))}
      </ul>
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={setPage} busy={query.isFetching} />
    </section>
  )
}

