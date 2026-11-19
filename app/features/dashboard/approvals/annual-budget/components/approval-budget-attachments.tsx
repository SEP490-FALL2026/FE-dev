import { Download, FileText } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { BudgetAttachmentPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budgets/budgetAttachmentPageResponseDtoDataItemsItem'
import { useBudgetAttachmentLink } from '~/shared/api/generated/operations/budgets/budget-attachment-link'
import { useBudgetProposalAttachmentList } from '~/shared/api/generated/operations/budgets/budget-proposal-attachment-list'
import { useBudgetVersionAttachmentList } from '~/shared/api/generated/operations/budgets/budget-version-attachment-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsEmpty, ApprovalsPagination, ApprovalsSection } from '../../shared/components/approvals-ui'
import { useApprovalsFeedback } from '../../shared/hooks/use-approvals-feedback'
import { attachmentStatus } from '../enums/attachment-status'

type Attachment = BudgetAttachmentPageResponseDtoDataItemsItem
const pageSize = 10

function formatBytes(bytes: number, locale: string) {
  const units = ['B', 'KB', 'MB']
  const exponent = Math.min(Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(1024)), units.length - 1)
  const value = new Intl.NumberFormat(locale, { maximumFractionDigits: exponent ? 1 : 0 }).format(
    bytes / 1024 ** exponent
  )
  return `${value} ${units[exponent]}`
}

function AttachmentRow({
  attachment,
  downloading,
  onDownload
}: {
  attachment: Attachment
  downloading: boolean
  onDownload: () => void
}) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDateTime } = useDashboardFormat()
  const removed = attachment.status === attachmentStatus.REMOVED
  return (
    <li className={`flex items-center gap-3 px-4 py-3 ${removed ? 'text-muted-foreground' : ''}`}>
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-md ${removed ? 'bg-surface-subtle' : 'bg-primary-soft text-primary-ink'}`}
      >
        <FileText aria-hidden className='size-4' strokeWidth={1.5} />
      </span>
      <div className='min-w-0 flex-1'>
        <p className={`truncate text-sm font-medium ${removed ? 'line-through' : ''}`} title={attachment.fileName}>
          {attachment.fileName}
        </p>
        <p className='truncate text-xs text-muted-foreground'>
          <span className='font-mono tabular-nums'>{formatBytes(attachment.sizeBytes, i18n.language)}</span>
          {' · '}
          {attachment.uploadedBy?.fullName ?? translate('attachments.system')}
          {' · '}
          <span className='font-mono tabular-nums'>
            {formatDateTime(removed && attachment.removedAt ? attachment.removedAt : attachment.attachedAt)}
          </span>
          {removed && ` · ${translate('attachments.removed')}`}
        </p>
      </div>
      {!removed && (
        <button
          type='button'
          aria-label={translate('attachments.download', { name: attachment.fileName })}
          title={translate('attachments.downloadShort')}
          aria-busy={downloading || undefined}
          disabled={downloading}
          className='grid size-11 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none active:bg-primary-soft active:text-primary-ink disabled:cursor-not-allowed disabled:opacity-50 md:size-8'
          onClick={onDownload}
        >
          <Download aria-hidden className='size-4' strokeWidth={1.5} />
        </button>
      )}
    </li>
  )
}

/** Read-only list: the Spending Approver reviews supporting files but never uploads or removes them. */
export function ApprovalBudgetAttachments({ target, ownerId }: { target: 'version' | 'proposal'; ownerId: string }) {
  const { t: translate } = useTranslation('approvalsBudget')
  const [page, setPage] = useState(1)
  const params = { page, pageSize }
  const versionQuery = useBudgetVersionAttachmentList(ownerId, params, { query: { enabled: target === 'version' } })
  const proposalQuery = useBudgetProposalAttachmentList(ownerId, params, { query: { enabled: target === 'proposal' } })
  const query = target === 'version' ? versionQuery : proposalQuery
  const result = query.data?.data
  const linkFeedback = useApprovalsFeedback([])
  const link = useBudgetAttachmentLink({
    mutation: {
      onError: linkFeedback.onError,
      onSuccess: (response) => {
        if (response.data?.url) window.open(response.data.url, '_blank', 'noopener,noreferrer')
      }
    }
  })
  return (
    <div role='region' aria-label={translate('attachments.title')}>
      <ApprovalsSection title={translate('attachments.title')}>
        <ApprovalsQueryState query={query}>
          {result?.items.length ? (
            <ul className='divide-y divide-border/50 overflow-hidden rounded-lg border border-border/70 bg-surface'>
              {result.items.map((attachment) => (
                <AttachmentRow
                  key={attachment.id}
                  attachment={attachment}
                  downloading={link.isPending && link.variables?.id === attachment.id}
                  onDownload={() => {
                    if (!link.isPending) link.mutate({ id: attachment.id })
                  }}
                />
              ))}
            </ul>
          ) : (
            <ApprovalsEmpty message={translate('attachments.empty')} />
          )}
          <ApprovalsPagination pagination={result?.pagination} onPageChange={setPage} />
        </ApprovalsQueryState>
      </ApprovalsSection>
    </div>
  )
}
