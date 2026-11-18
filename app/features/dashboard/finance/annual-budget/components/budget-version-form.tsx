import { useState } from 'react'
import { MoneyInput } from '~/shared/ui/money-input'
import { useTranslation } from 'react-i18next'
import type { VersionBodyDto } from '~/shared/api/generated/model/budget-versions/versionBodyDto'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, FinanceSelect, financeInputClass } from '../../shared/components/finance-ui'
import { isDecimal } from '../../shared/finance-money'
import { useDefaultReservePercent } from '../../shared/hooks/use-default-reserve-percent'
import { amountsEqual, isDefaultReserve } from '../../shared/finance-validation'

const sectionTitleClass = 'section-accent text-sm font-semibold tracking-tight text-foreground'
const amountClass = `${financeInputClass} text-right font-mono tabular-nums`

type ProposalVersionBody = Extract<VersionBodyDto, { proposalId: string }>
export type BudgetFigures = Pick<ProposalVersionBody, 'base' | 'reserve' | 'reservePercent' | 'reserveReason'>
type InitialFigures = {
  base?: { amount: string }
  reserve?: { amount: string } | null
  /** Share the version was built with; only a share the user changes is sent again. */
  reservePercent?: number | null
  reserveReason?: string
}
type ReserveMode = 'percent' | 'amount'
const percentPattern = /^\d{1,3}$/
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
  initial: InitialFigures
  onSubmit: (figures: BudgetFiguresChange) => void
  onClose: () => void
  pending: boolean
  currency: string
  disabled?: boolean
  askBaseReason?: boolean
}) {
  const { t: translate } = useTranslation('financeBudget')
  const defaultPercent = useDefaultReservePercent()
  const [base, setBase] = useState(initial.base?.amount ?? '')
  // An existing reserve that is not the default share of the base was typed as an amount.
  const startsAsAmount = Boolean(
    initial.reserve && initial.base && !isDefaultReserve(initial.base.amount, initial.reserve.amount, defaultPercent)
  )
  const [mode, setMode] = useState<ReserveMode>(startsAsAmount ? 'amount' : 'percent')
  const [reserve, setReserve] = useState(startsAsAmount ? (initial.reserve?.amount ?? '') : '')
  const initialPercent = startsAsAmount || initial.reservePercent == null ? '' : String(initial.reservePercent)
  const [percent, setPercent] = useState(initialPercent)
  const [reason, setReason] = useState(initial.reserveReason ?? '')
  const [baseReason, setBaseReason] = useState('')
  const [invalid, setInvalid] = useState(false)
  const baseOk = isDecimal(base)
  const amountMode = mode === 'amount'
  const reserveOk = !amountMode || !reserve || isDecimal(reserve)
  const percentOk = amountMode || !percent || (percentPattern.test(percent) && Number(percent) <= 100)
  // The API wants a reason when the base of an existing version changes.
  const baseChanged = askBaseReason && baseOk && !amountsEqual(base, initial.base?.amount ?? '')
  // A reserve that is not the default share of the base needs a reason (checked by the API when the version is sent).
  const reserveEdited =
    amountMode && Boolean(reserve) && reserveOk && !amountsEqual(reserve, initial.reserve?.amount ?? '')
  // A share other than the organisation default needs a reason too.
  const percentEdited = !amountMode && Boolean(percent) && percentOk && percent !== initialPercent
  const reserveNeedsReason =
    (reserveEdited && baseOk && !isDefaultReserve(base, reserve, defaultPercent)) ||
    (percentEdited && Number(percent) !== defaultPercent)
  const valid =
    baseOk &&
    reserveOk &&
    percentOk &&
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
          ...(amountMode && reserve ? { reserve: money(reserve) } : {}),
          ...(percentEdited ? { reservePercent: Number(percent) } : {}),
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
        <div className='space-y-2'>
          <FinanceField label={translate('fields.reserveMode')}>
            <FinanceSelect
              placeholder={translate('screen.reserveModePlaceholder')}
              value={mode}
              onValueChange={(value) => setMode(value === 'amount' ? 'amount' : 'percent')}
              options={[
                { value: 'percent', label: translate('reserveMode.percent') },
                { value: 'amount', label: translate('reserveMode.amount') }
              ]}
            />
          </FinanceField>
          {amountMode ? (
            <FinanceField
              label={translate('fields.reserve')}
              error={invalid && !isDecimal(reserve) && reserve ? translate('fieldInvalid') : null}
            >
              <MoneyInput
                maxLength={40}
                aria-invalid={invalid && Boolean(reserve) && !isDecimal(reserve)}
                className={amountClass}
                placeholder={translate('placeholders.reserve')}
                value={reserve}
                onValueChange={setReserve}
              />
            </FinanceField>
          ) : (
            <FinanceField
              label={translate('fields.reservePercent')}
              hint={translate('reservePercentHint', { percent: defaultPercent })}
              error={invalid && !percentOk ? translate('fieldInvalid') : null}
            >
              <input
                inputMode='numeric'
                maxLength={3}
                aria-invalid={invalid && !percentOk}
                className={amountClass}
                placeholder={translate('screen.percentPlaceholder', { percent: defaultPercent })}
                value={percent}
                onChange={(event) => setPercent(event.target.value.trim())}
              />
            </FinanceField>
          )}
        </div>
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
            placeholder={translate('screen.baseReasonPlaceholder')}
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
