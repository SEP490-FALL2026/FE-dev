import { useState } from 'react'
import { MoneyInput } from '~/shared/ui/money-input'
import { useTranslation } from 'react-i18next'
import type { VersionBodyDto } from '~/shared/api/generated/model/budget-versions/versionBodyDto'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { isDecimal } from '../../shared/finance-money'
import { amountsEqual, isDefaultReserve } from '../../shared/finance-validation'

const sectionTitleClass = 'text-xs font-semibold tracking-wider text-muted-foreground uppercase'
const amountClass = `${financeInputClass} text-right font-mono tabular-nums`

type ProposalVersionBody = Extract<VersionBodyDto, { proposalId: string }>
export type BudgetFigures = Pick<ProposalVersionBody, 'base' | 'reserve' | 'reserveReason'>
/** A change of the base figure of an existing version carries the reason for it. */
export type BudgetFiguresChange = BudgetFigures & { baseReason?: string }

export function BudgetVersionForm({
  initial,
  onSubmit,
  onClose,
  pending,
  currency,
  disabled = false,
  askBaseReason = false
}: {
  initial: BudgetFigures
  onSubmit: (figures: BudgetFiguresChange) => void
  onClose: () => void
  pending: boolean
  currency: string
  disabled?: boolean
  askBaseReason?: boolean
}) {
  const { t: translate } = useTranslation('financeBudget')
  const [base, setBase] = useState(initial.base.amount)
  const [reserve, setReserve] = useState(initial.reserve?.amount ?? '')
  const [reason, setReason] = useState(initial.reserveReason ?? '')
  const [baseReason, setBaseReason] = useState('')
  const [invalid, setInvalid] = useState(false)
  const baseOk = isDecimal(base)
  const reserveOk = !reserve || isDecimal(reserve)
  // The API wants a reason when the base of an existing version changes.
  const baseChanged = askBaseReason && baseOk && !amountsEqual(base, initial.base.amount)
  // A reserve that is not the default share of the base needs a reason (checked by the API when the version is sent).
  const reserveEdited = Boolean(reserve) && reserveOk && !amountsEqual(reserve, initial.reserve?.amount ?? '')
  const reserveNeedsReason = reserveEdited && baseOk && !isDefaultReserve(base, reserve)
  const valid =
    baseOk &&
    reserveOk &&
    (!baseChanged || Boolean(baseReason.trim())) &&
    (!reserveNeedsReason || Boolean(reason.trim()))
  const money = (amount: string) => ({ amount })
  return (
    <FinanceFormDialog
      page
      title={translate('actions.save')}
      pending={pending}
      submitDisabled={disabled}
      onClose={onClose}
      submitLabel={translate('actions.save')}
      onSubmit={(event) => {
        event.preventDefault()
        if (disabled) return
        if (!valid) {
          setInvalid(true)
          return
        }
        onSubmit({
          base: money(base),
          ...(askBaseReason && baseReason.trim() ? { baseReason: baseReason.trim() } : {}),
          ...(reserve ? { reserve: money(reserve) } : {}),
          ...(reason.trim() ? { reserveReason: reason.trim() } : {})
        })
      }}
    >
      <p className='inline-flex w-fit items-center gap-2 rounded-md bg-surface-subtle px-2.5 py-1 text-xs text-muted-foreground'>
        {translate('fields.currency')}
        <span className='font-mono font-semibold text-foreground'>{currency}</span>
      </p>
      <h3 className={sectionTitleClass}>{translate('sections.figures')}</h3>
      <div className='grid gap-4 sm:grid-cols-2'>
        <FinanceField
          required
          label={translate('fields.base')}
          hint={translate('decimalHint')}
          error={invalid && !isDecimal(base) ? translate('fieldInvalid') : null}
        >
          <MoneyInput
            required
            maxLength={40}
            aria-invalid={invalid && !isDecimal(base)}
            className={amountClass}
            placeholder={translate('placeholders.amount')}
            value={base}
            onValueChange={setBase}
          />
        </FinanceField>
        <FinanceField
          label={translate('fields.reserve')}
          error={invalid && !isDecimal(reserve) ? translate('fieldInvalid') : null}
        >
          <MoneyInput
            maxLength={40}
            aria-invalid={invalid && !isDecimal(reserve)}
            className={amountClass}
            placeholder={translate('placeholders.reserve')}
            value={reserve}
            onValueChange={setReserve}
          />
        </FinanceField>
      </div>
      {askBaseReason && (
        <FinanceField
          required={baseChanged}
          label={translate('fields.baseReason')}
          hint={translate('baseReasonHint')}
          error={invalid && baseChanged && !baseReason.trim() ? translate('fieldInvalid') : null}
        >
          <textarea
            rows={2}
            maxLength={1000}
            className={financeInputClass}
            value={baseReason}
            onChange={(event) => setBaseReason(event.target.value)}
          />
        </FinanceField>
      )}
      <FinanceField
        required={reserveNeedsReason}
        label={translate('fields.reserveReason')}
        hint={reserveNeedsReason ? translate('reserveReasonHint') : undefined}
        error={invalid && reserveNeedsReason && !reason.trim() ? translate('fieldInvalid') : null}
      >
        <textarea
          rows={3}
          maxLength={1000}
          className={financeInputClass}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={translate('placeholders.versionReason')}
        />
      </FinanceField>
      <p className='min-h-5 text-sm text-danger' role={invalid ? 'alert' : undefined}>
        {invalid ? translate('invalid') : null}
      </p>
    </FinanceFormDialog>
  )
}
