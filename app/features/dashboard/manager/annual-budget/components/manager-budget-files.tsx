import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useBudgetProposalAttachmentList } from '~/shared/api/generated/operations/budgets/budget-proposal-attachment-list'
import { budgetAttachmentLink } from '~/shared/api/generated/operations/budgets/budget-attachment-link'
import { ManagerButton, ManagerPagination, ManagerQueryState } from '../../shared/components/manager-api-ui'

export function ManagerBudgetFiles({ id }: { id: string }) {
  const { t: translate, i18n } = useTranslation('manager')
  const [page, setPage] = useState(1)
  const query = useBudgetProposalAttachmentList(id, { page, pageSize: 20 })
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
    onError: () => toast.error(translate('budgetForm.downloadFailed'), { id: 'budget-download' })
  })
  const files = !query.isError ? (query.data?.data?.items ?? []) : []
  return (
    <section className='space-y-4 border-t border-border/60 pt-6' aria-label={translate('budgetForm.attachments')}>
      <header className='flex flex-wrap items-center justify-between gap-2'>
        <h3 className='text-sm font-semibold'>{translate('budgetForm.attachments')}</h3>
        {!query.isError && query.data?.data && (
          <span className='text-xs text-muted-foreground'>
            {translate('budgetHistory.files', { count: query.data.data.pagination.totalItems })}
          </span>
        )}
      </header>
      <ManagerQueryState query={query} empty={!files.length} emptyTitle={translate('budgetForm.emptyFiles')} />
      <ul className='divide-y divide-border/40'>
        {files.map((file) => (
          <li key={file.id} className='flex items-start gap-3 py-3 first:pt-0 last:pb-0'>
            <span
              aria-hidden
              className='grid size-10 shrink-0 place-items-center rounded-md bg-surface-subtle text-muted-foreground'
            >
              <FileText strokeWidth={1.5} className='size-5' />
            </span>
            <div className='min-w-0 flex-1 space-y-1 pt-0.5'>
              <p className='line-clamp-2 text-sm leading-relaxed [overflow-wrap:anywhere]' title={file.fileName}>
                {file.fileName}
              </p>
              <p className='font-mono text-xs text-muted-foreground tabular-nums'>
                {translate('budgetForm.fileBytes', {
                  size: new Intl.NumberFormat(i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN').format(file.sizeBytes)
                })}
              </p>
            </div>
            <ManagerButton
              disabled={download.isPending}
              busy={download.isPending && download.variables === file.id}
              onClick={() => download.mutate(file.id)}
              aria-label={`${translate('budgetForm.download')}: ${file.fileName}`}
            >
              <Download aria-hidden strokeWidth={1.5} className='size-4' />
              <span className='hidden sm:inline'>{translate('budgetForm.download')}</span>
            </ManagerButton>
          </li>
        ))}
      </ul>
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={setPage} busy={query.isFetching} />
    </section>
  )
}
