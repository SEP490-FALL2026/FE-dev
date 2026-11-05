import { useId, useRef } from 'react'
import { Paperclip, RefreshCw, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ManagerButton, ManagerQueryState, ManagerSection } from '../../shared/components/manager-api-ui'
import { BUDGET_ATTACHMENT_STATUS } from '../enums/attachment-status'
import { budgetFileAccept, budgetFileType } from '../hooks/budget-file-upload'
import type { useBudgetAttachments } from '../hooks/use-budget-attachments'

export function ManagerBudgetAttachments({
  files,
  disabled,
  invalid = false
}: {
  files: ReturnType<typeof useBudgetAttachments>
  disabled: boolean
  invalid?: boolean
}) {
  const { t: translate } = useTranslation('manager')
  const input = useRef<HTMLInputElement>(null)
  const errorId = useId()
  const retrySeconds = Math.max(0, Math.ceil((files.retryAt - files.now) / 1000))
  const locked = disabled || files.busy || retrySeconds > 0
  return (
    <ManagerSection title={translate('budgetForm.attachments')}>
      <div
        className='space-y-4'
        role='group'
        aria-label={translate('budgetForm.attachments')}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
      >
        <p className='text-sm text-muted-foreground'>{translate('budgetForm.attachmentHint')}</p>
        <p id={errorId} className='min-h-5 text-xs text-danger'>
          {invalid ? translate('budgetForm.notAttachable') : null}
        </p>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <ManagerButton
            disabled={locked || files.uncertain || files.selected.length >= 20 || files.items.length >= 20}
            busy={files.busy}
            onClick={() => input.current?.click()}
          >
            <Paperclip aria-hidden strokeWidth={1.5} className='size-4' />
            {retrySeconds ? translate('retryAfter', { seconds: retrySeconds }) : translate('budgetForm.chooseFile')}
          </ManagerButton>
          <span className='font-mono text-xs tabular-nums'>
            {translate('budgetForm.selectedFiles', { count: files.selected.length })}
          </span>
        </div>
        <input
          ref={input}
          type='file'
          tabIndex={-1}
          className='sr-only'
          accept={budgetFileAccept}
          disabled={locked || files.uncertain || files.selected.length >= 20 || files.items.length >= 20}
          aria-label={translate('budgetForm.selectFile')}
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (!file) return
            if (!budgetFileType(file)) {
              toast.error(translate('budgetForm.invalidFile'), { id: 'budget-file' })
              return
            }
            files.run({ kind: 'upload', file })
          }}
        />
        <p className='text-xs text-muted-foreground'>{translate('budgetForm.formats')}</p>
        <div className='flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4'>
          <p className='text-sm font-medium'>{translate('budgetForm.availableFiles')}</p>
          <ManagerButton disabled={locked} busy={files.query.isFetching} onClick={() => void files.refresh()}>
            <RefreshCw aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('budgetForm.refresh')}
          </ManagerButton>
        </div>
        <p className='text-xs text-muted-foreground'>{translate('budgetForm.availableHint')}</p>
        <ManagerQueryState
          query={files.query}
          empty={!files.items.length}
          emptyTitle={translate('budgetForm.emptyFiles')}
        />
        <ul className='divide-y divide-border/40'>
          {files.items.map((file) => {
            const ready =
              file.status === BUDGET_ATTACHMENT_STATUS.UPLOADED && new Date(file.expiresAt).getTime() > files.now
            const selected = files.selected.includes(file.id)
            return (
              <li key={file.id} className='flex flex-wrap items-center gap-3 py-3'>
                <label className='flex min-h-11 min-w-0 flex-1 items-center gap-3 text-sm'>
                  <input
                    type='checkbox'
                    checked={selected}
                    disabled={locked || (!selected && (!ready || files.selected.length >= 20))}
                    onChange={(event) =>
                      files.setSelected((previous) =>
                        event.target.checked
                          ? [...new Set([...previous, file.id])]
                          : previous.filter((id) => id !== file.id)
                      )
                    }
                  />
                  <span className='min-w-0'>
                    <span className='block truncate' title={file.fileName}>
                      {file.fileName}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {translate(ready ? 'budgetForm.uploaded' : 'budgetForm.awaiting')}
                    </span>
                  </span>
                </label>
                <span className='font-mono text-xs tabular-nums'>
                  {translate('budgetForm.fileBytes', { size: new Intl.NumberFormat().format(file.sizeBytes) })}
                </span>
                {file.status === BUDGET_ATTACHMENT_STATUS.AWAITING_UPLOAD && (
                  <ManagerButton disabled={locked} onClick={() => files.run({ kind: 'complete', id: file.id })}>
                    {translate('budgetForm.complete')}
                  </ManagerButton>
                )}
                <ManagerButton
                  disabled={locked}
                  aria-label={`${translate('budgetForm.discard')}: ${file.fileName}`}
                  onClick={() => files.run({ kind: 'discard', id: file.id })}
                >
                  <Trash2 aria-hidden strokeWidth={1.5} className='size-4' />
                </ManagerButton>
              </li>
            )
          })}
        </ul>
      </div>
    </ManagerSection>
  )
}
