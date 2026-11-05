import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { WindowBodyDto } from '~/shared/api/generated/model/budget-versions/windowBodyDto'
import type { VersionLinePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-versions/versionLinePageResponseDtoDataItemsItem'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'

export function BudgetLineWindowForm({
  line,
  pending,
  onSubmit,
  onClose,
  disabled = false
}: {
  line: VersionLinePageResponseDtoDataItemsItem
  pending: boolean
  onSubmit: (window: WindowBodyDto) => void
  onClose: () => void
  disabled?: boolean
}) {
  const { t: translate } = useTranslation('financeBudget')
  const [from, setFrom] = useState(line.windowFrom)
  const [to, setTo] = useState(line.windowTo)
  const [reason, setReason] = useState('')
  return (
    <FinanceFormDialog
      title={translate('actions.moveWindow')}
      pending={pending}
      onClose={onClose}
      submitLabel={translate('actions.saveWindow')}
      submitDisabled={disabled || !from || !to || from > to || !reason.trim()}
      onSubmit={(event) => {
        event.preventDefault()
        if (!disabled && from && to && from <= to && reason.trim())
          onSubmit({ windowFrom: from, windowTo: to, reason: reason.trim() })
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate('windowHint')}</p>
      <div className='grid gap-4 sm:grid-cols-2'>
        <FinanceField required label={translate('fields.windowFrom')}>
          <input
            required
            type='date'
            className={financeInputClass}
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
        </FinanceField>
        <FinanceField
          required
          label={translate('fields.windowTo')}
          error={from && to && from > to ? translate('windowOrder') : null}
        >
          <input
            required
            type='date'
            min={from}
            className={financeInputClass}
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </FinanceField>
      </div>
      <FinanceField required label={translate('fields.reason')}>
        <textarea
          required
          rows={3}
          maxLength={1000}
          className={financeInputClass}
          placeholder={translate('placeholders.windowReason')}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </FinanceField>
    </FinanceFormDialog>
  )
}
