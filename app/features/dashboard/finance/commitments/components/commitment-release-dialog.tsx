import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { formatMoney } from '../../shared/finance-money'
import { useReleaseCommitment, useCommitmentReleases } from '../hooks/use-finance-commitments'
import type { ExtendedCommitmentItem } from '../../shared/finance-api-extensions'

export function CommitmentReleaseDialog({
  commitment,
  onClose
}: {
  commitment: ExtendedCommitmentItem
  onClose: () => void
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const { t: translateFinance } = useTranslation('finance')

  const [reason, setReason] = useState('')
  const mutation = useReleaseCommitment(commitment.id)
  const releasesQuery = useCommitmentReleases(commitment.id)
  const pastReleases = releasesQuery.data ?? []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return

    mutation.mutate(reason.trim(), {
      onSuccess: () => {
        toast.success(translateFinance('commitments.releaseSuccess', { defaultValue: 'Đã giải phóng phần dư cam kết thành công.' }))
        onClose()
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error?.message || translateFinance('errors.validation'))
      }
    })
  }

  return (
    <FinanceFormDialog
      title={translateFinance('releaseRemainder')}
      pending={mutation.isPending}
      onClose={onClose}
      submitLabel={translateFinance('releaseRemainder')}
      submitDisabled={!reason.trim()}
      onSubmit={handleSubmit}
    >
      <div className='space-y-4'>
        <div className='rounded-lg border border-border/70 bg-surface-subtle/40 p-3 text-xs space-y-1.5'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>{translate('department')}:</span>
            <span className='font-medium text-foreground'>{commitment.costCenter.name}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>{translateFinance('held')}:</span>
            <span className='font-mono font-bold text-warning-ink'>{formatMoney(commitment.held, i18n.language)}</span>
          </div>
        </div>

        <FinanceField label={translateFinance('fields.reason', { defaultValue: 'Lý do' })} required>
          <textarea
            required
            rows={3}
            className={`${financeInputClass} resize-none`}
            placeholder={translateFinance('commitments.releaseReasonPlaceholder', {
              defaultValue: 'Nhập lý do giải phóng phần dư (ví dụ: Nhà cung cấp đã xuất đủ hóa đơn, không còn khoản chi phát sinh)...'
            })}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </FinanceField>

        {pastReleases.length > 0 && (
          <div className='border-t border-border/70 pt-3'>
            <h4 className='text-xs font-semibold text-muted-foreground mb-2'>
              {translateFinance('commitments.pastReleases', { defaultValue: 'Lịch sử giải phóng trước đó' })}
            </h4>
            <div className='space-y-1.5'>
              {pastReleases.map((rel: any) => (
                <div key={rel.id} className='rounded border border-border/60 p-2 text-xs flex justify-between items-center'>
                  <div>
                    <span className='font-mono font-semibold'>{formatMoney(rel.amount, i18n.language)}</span>
                    <span className='ml-2 text-muted-foreground'>({rel.reason})</span>
                  </div>
                  <span className='text-[10px] text-muted-foreground'>
                    {new Date(rel.releasedAt).toLocaleDateString(i18n.language)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </FinanceFormDialog>
  )
}
