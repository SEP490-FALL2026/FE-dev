import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useBudgetProposalAttachmentList } from '~/shared/api/generated/operations/budgets/budget-proposal-attachment-list'
import { budgetAttachmentLink } from '~/shared/api/generated/operations/budgets/budget-attachment-link'
import { ManagerButton, ManagerPagination, ManagerQueryState } from '../../shared/components/manager-api-ui'

export function ManagerBudgetFiles({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
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
    <section className='space-y-3' aria-label={translate('budgetForm.attachments')}>
      <h3 className='text-sm font-semibold'>{translate('budgetForm.attachments')}</h3>
      <ManagerQueryState query={query} empty={!files.length} emptyTitle={translate('budgetForm.emptyFiles')} />
      <ul className='divide-y divide-border/40'>
        {files.map((file) => (
          <li key={file.id} className='flex items-center justify-between gap-3 py-2'>
            <span className='min-w-0 truncate text-sm' title={file.fileName}>
              {file.fileName}
            </span>
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
