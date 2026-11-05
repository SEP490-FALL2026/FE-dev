import { Download, FileText, Paperclip, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { BudgetAttachmentPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budgets/budgetAttachmentPageResponseDtoDataItemsItem'
import { useBudgetAttachmentLink } from '~/shared/api/generated/operations/budgets/budget-attachment-link'
import {
  getBudgetProposalAttachmentListQueryKey,
  useBudgetProposalAttachmentList
} from '~/shared/api/generated/operations/budgets/budget-proposal-attachment-list'
import {
  getBudgetVersionAttachmentListQueryKey,
  useBudgetVersionAttachmentList
} from '~/shared/api/generated/operations/budgets/budget-version-attachment-list'
import { useBudgetVersionAttachmentRemove } from '~/shared/api/generated/operations/budgets/budget-version-attachment-remove'
import { getBudgetVersionHistoryListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-history-list'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  FinanceButton,
  FinanceEmpty,
  FinancePagination,
  FinanceQueryState,
  FinanceSection
} from '../../shared/components/finance-ui'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { attachmentAccept, attachmentStatus } from '../enums/attachment-rules'
import { useBudgetAttachmentUpload } from '../hooks/use-budget-attachment-upload'

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

const iconButtonClass =
  'grid size-11 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:size-8'

function AttachmentRow({
  attachment,
  onDownload,
  onRemove,
  downloading
}: {
  attachment: Attachment
  onDownload: () => void
  onRemove?: () => void
  downloading: boolean
}) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const { formatDateTime } = useDashboardFormat()
  const removed = attachment.status === attachmentStatus.REMOVED
  return (
    <li className={`flex items-center gap-3 px-4 py-3 ${removed ? 'opacity-60' : ''}`}>
      <span className='grid size-9 shrink-0 place-items-center rounded-md bg-primary-soft text-primary-ink'>
        <FileText aria-hidden className='size-4' strokeWidth={1.5} />
      </span>
      <div className='min-w-0 flex-1'>
        <p className={`truncate text-sm font-medium ${removed ? 'line-through' : ''}`} title={attachment.fileName}>
          {attachment.fileName}
        </p>
        <p className='truncate text-xs text-muted-foreground'>
          <span className='font-mono tabular-nums'>{formatBytes(attachment.sizeBytes, i18n.language)}</span>
          {' · '}
          {attachment.uploadedBy?.fullName ?? translate('system')}
          {' · '}
          <span className='font-mono tabular-nums'>
            {formatDateTime(removed && attachment.removedAt ? attachment.removedAt : attachment.attachedAt)}
          </span>
          {removed && ` · ${translate('attachments.removed')}`}
        </p>
      </div>
      {!removed && (
        <div className='flex items-center gap-1'>
          <button
            type='button'
            aria-label={translate('attachments.download', { name: attachment.fileName })}
            title={translate('attachments.downloadShort')}
            disabled={downloading}
            className={`${iconButtonClass} hover:bg-surface-subtle hover:text-foreground active:bg-primary-soft active:text-primary-ink`}
            onClick={onDownload}
          >
            <Download aria-hidden className='size-4' strokeWidth={1.5} />
          </button>
          {onRemove && (
            <button
              type='button'
              aria-label={translate('attachments.remove', { name: attachment.fileName })}
              title={translate('attachments.removeShort')}
              className={`${iconButtonClass} hover:bg-danger/10 hover:text-danger active:bg-danger/15 active:text-danger`}
              onClick={onRemove}
            >
              <Trash2 aria-hidden className='size-4' strokeWidth={1.5} />
            </button>
          )}
        </div>
      )}
    </li>
  )
}

export function BudgetAttachments({
  target,
  ownerId,
  editable = false
}: {
  target: 'version' | 'proposal'
  ownerId: string
  editable?: boolean
}) {
  const { t: translate } = useTranslation('financeBudget')
  const [page, setPage] = useState(1)
  const [removing, setRemoving] = useState<Attachment>()
  const fileInput = useRef<HTMLInputElement>(null)
  const params = { page, pageSize }
  const versionQuery = useBudgetVersionAttachmentList(ownerId, params, { query: { enabled: target === 'version' } })
  const proposalQuery = useBudgetProposalAttachmentList(ownerId, params, { query: { enabled: target === 'proposal' } })
  const query = target === 'version' ? versionQuery : proposalQuery
  const result = query.data?.data
  const queryKeys =
    target === 'version'
      ? [getBudgetVersionAttachmentListQueryKey(ownerId), getBudgetVersionHistoryListQueryKey(ownerId)]
      : [getBudgetProposalAttachmentListQueryKey(ownerId)]
  const { upload, uploadingName } = useBudgetAttachmentUpload(ownerId, queryKeys)
  const removeFeedback = useFinanceFeedback(queryKeys, () => setRemoving(undefined))
  const removeMutation = useBudgetVersionAttachmentRemove({ mutation: removeFeedback })
  const linkFeedback = useFinanceFeedback([])
  const linkMutation = useBudgetAttachmentLink({
    mutation: {
      onError: linkFeedback.onError,
      onSuccess: (response) => {
        if (response.data?.url) window.open(response.data.url, '_blank', 'noopener,noreferrer')
      }
    }
  })
  const canUpload = editable && target === 'version'
  return (
    <FinanceSection
      title={translate('attachments.title')}
      actions={
        canUpload && (
          <>
            <input
              ref={fileInput}
              type='file'
              accept={attachmentAccept}
              className='sr-only'
              tabIndex={-1}
              aria-label={translate('attachments.choose')}
              onChange={(event) => {
                const file = event.target.files?.[0]
                event.target.value = ''
                if (file) void upload(file)
              }}
            />
            <FinanceButton pending={Boolean(uploadingName)} onClick={() => fileInput.current?.click()}>
              {!uploadingName && <Upload aria-hidden className='size-4' strokeWidth={1.5} />}
              {uploadingName ? translate('attachments.uploading') : translate('attachments.upload')}
            </FinanceButton>
          </>
        )
      }
    >
      {canUpload && <p className='text-xs text-muted-foreground'>{translate('attachments.hint')}</p>}
      <FinanceQueryState query={query}>
        {result?.items.length ? (
          <ul className='divide-y divide-border/50 overflow-hidden rounded-lg border border-border/70 bg-surface'>
            {result.items.map((attachment) => (
              <AttachmentRow
                key={attachment.id}
                attachment={attachment}
                downloading={linkMutation.isPending && linkMutation.variables?.id === attachment.id}
                onDownload={() => linkMutation.mutate({ id: attachment.id })}
                onRemove={canUpload ? () => setRemoving(attachment) : undefined}
              />
            ))}
          </ul>
        ) : (
          <FinanceEmpty message={translate('attachments.empty')} />
        )}
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
      {removing && (
        <FinanceFormDialog
          danger
          title={translate('attachments.removeTitle')}
          pending={removeMutation.isPending}
          submitLabel={translate('attachments.confirmRemove')}
          onClose={() => setRemoving(undefined)}
          onSubmit={(event) => {
            event.preventDefault()
            removeMutation.mutate({ id: ownerId, attachmentId: removing.id })
          }}
        >
          <p className='flex items-start gap-2 text-sm'>
            <Paperclip aria-hidden className='mt-0.5 size-4 shrink-0 text-muted-foreground' strokeWidth={1.5} />
            <span className='min-w-0 break-words'>
              {translate('attachments.removeHint', { name: removing.fileName })}
            </span>
          </p>
        </FinanceFormDialog>
      )}
    </FinanceSection>
  )
}
