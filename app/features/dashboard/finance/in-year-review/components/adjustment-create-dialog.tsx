import { isAxiosError } from 'axios'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CreateAdjustmentBodyDtoKind,
  CreateAdjustmentBodyDtoTransferReason,
  type CreateAdjustmentBodyDto
} from '~/shared/api/generated/model/budget-adjustments'
import { useBudgetCycleGet, useBudgetCyclePackage } from '~/shared/api/generated/operations/budget-cycles'
import { useCostCenterList } from '~/shared/api/generated/operations/cost-centers'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { MoneyInput } from '~/shared/ui/money-input'
import { FinanceField, FinanceSelect, financeInputClass } from '../../shared/components/finance-ui'
import { formatMoney } from '../../shared/finance-money'
import { isDecimal } from '../../shared/finance-money'
import { useAdjustmentActions } from '../hooks/use-in-year-actions'

type Kind = CreateAdjustmentBodyDto['kind']

/** Which Cost Centers each kind takes (BE refuses any other shape with BUDGET_ADJUSTMENT.INVALID_SHAPE). */
export const adjustmentShape: Record<Kind, { from: boolean; to: boolean }> = {
  SUPPLEMENT: { from: false, to: true },
  TRANSFER: { from: true, to: true },
  RETURN: { from: true, to: false },
  CEILING_REDUCTION: { from: false, to: false }
}

const MIN_YEAR = 2000
const MAX_YEAR = 2100

/** The submission deadline BE reports with 409 BUDGET_ADJUSTMENT.CYCLE_NOT_LOCKED, when it sends one. */
export function cycleNotLockedDeadline(error: unknown): string | null {
  if (!isAxiosError(error)) return null
  const body = error.response?.data as { error?: { code?: string; details?: { submissionDeadline?: unknown } } }
  if (body?.error?.code !== 'BUDGET_ADJUSTMENT.CYCLE_NOT_LOCKED') return null
  const deadline = body.error.details?.submissionDeadline
  return typeof deadline === 'string' ? deadline : null
}

export function AdjustmentCreateDialog({ onClose }: { onClose: () => void }) {
  const { t: translate, i18n } = useTranslation('financeReview')
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [kind, setKind] = useState<Kind>(CreateAdjustmentBodyDtoKind.SUPPLEMENT)
  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [costChange, setCostChange] = useState(false)
  const [deadline, setDeadline] = useState<string | null>(null)
  const costCenters = useCostCenterList({ pageSize: 100 })
  const cycleQuery = useBudgetCycleGet(Number(year), { query: { enabled: /^\d{4}$/.test(year), retry: false } })
  const { create } = useAdjustmentActions(onClose)
  // A supplement and a ceiling reduction are capped by the part of the ceiling nobody holds yet.
  const needsUnallocated =
    kind === CreateAdjustmentBodyDtoKind.SUPPLEMENT || kind === CreateAdjustmentBodyDtoKind.CEILING_REDUCTION
  const packageQuery = useBudgetCyclePackage(Number(year), {
    query: { enabled: needsUnallocated && /^\d{4}$/.test(year), retry: false }
  })
  const unallocated = packageQuery.data?.data?.unallocated

  const shape = adjustmentShape[kind]
  const yearNumber = Number(year)
  const yearValid = Number.isInteger(yearNumber) && yearNumber >= MIN_YEAR && yearNumber <= MAX_YEAR
  const amountValid = isDecimal(amount) && Number(amount) > 0
  const sameCostCenter = shape.from && shape.to && Boolean(fromId) && fromId === toId
  // BE only takes an adjustment once the cycle of the year is locked; a year with no cycle is left to the API.
  const cycle = cycleQuery.data?.data
  const cycleOpen = cycle?.status === 'DRAFT' || cycle?.status === 'OPEN'
  const valid =
    yearValid &&
    !cycleOpen &&
    amountValid &&
    Boolean(reason.trim()) &&
    (!shape.from || Boolean(fromId)) &&
    (!shape.to || Boolean(toId)) &&
    !sameCostCenter

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid || create.isPending) return
    setDeadline(null)
    create.mutate(
      {
        data: {
          year: yearNumber,
          kind,
          amount: { amount },
          reason: reason.trim(),
          ...(shape.from ? { fromCostCenterId: fromId } : {}),
          ...(shape.to ? { toCostCenterId: toId } : {}),
          ...(kind === CreateAdjustmentBodyDtoKind.TRANSFER && costChange
            ? { transferReason: CreateAdjustmentBodyDtoTransferReason.COST_CENTER_CHANGE }
            : {})
        }
      },
      { onError: (error) => setDeadline(cycleNotLockedDeadline(error)) }
    )
  }

  const options = costCenters.data?.data?.items ?? []
  const costCenterSelect = (label: string, value: string, onChange: (next: string) => void, error = false) => (
    <FinanceField label={label} required error={error ? translate('adjustments.sameCostCenter') : null}>
      <FinanceSelect value={value} required onChange={(event) => onChange(event.target.value)}>
        <option value=''>—</option>
        {options.map((costCenter) => (
          <option key={costCenter.id} value={costCenter.id}>
            {costCenter.code} · {costCenter.name}
          </option>
        ))}
      </FinanceSelect>
    </FinanceField>
  )

  return (
    <AdminFormDialog
      title={translate('adjustments.createTitle')}
      pending={create.isPending}
      submitLabel={translate('adjustments.createSubmit')}
      submitDisabled={!valid}
      onClose={onClose}
      onSubmit={submit}
    >
      <div className='grid gap-3 sm:grid-cols-2'>
        <FinanceField label={translate('year')} required error={yearValid ? null : translate('yearInvalid')}>
          <input
            type='number'
            inputMode='numeric'
            min={MIN_YEAR}
            max={MAX_YEAR}
            className={`${financeInputClass} font-mono tabular-nums`}
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
        </FinanceField>
        <FinanceField label={translate('adjustments.kind')} required hint={translate(`adjustments.kindHints.${kind}`)}>
          <FinanceSelect
            value={kind}
            onChange={(event) => {
              setKind(event.target.value as Kind)
              setFromId('')
              setToId('')
              setCostChange(false)
            }}
          >
            {Object.values(CreateAdjustmentBodyDtoKind).map((value) => (
              <option key={value} value={value}>
                {translate(`adjustments.kinds.${value}`)}
              </option>
            ))}
          </FinanceSelect>
        </FinanceField>
        {shape.from && costCenterSelect(translate('adjustments.from'), fromId, setFromId)}
        {shape.to && costCenterSelect(translate('adjustments.to'), toId, setToId, sameCostCenter)}
        <FinanceField
          label={translate('amount')}
          required
          hint={
            needsUnallocated && unallocated
              ? translate('adjustments.unallocatedHint', { year, amount: formatMoney(unallocated, i18n.language) })
              : undefined
          }
          error={amount && !amountValid ? translate('adjustments.amountInvalid') : null}
        >
          <MoneyInput
            maxLength={40}
            aria-invalid={Boolean(amount) && !amountValid}
            className={`${financeInputClass} font-mono tabular-nums`}
            value={amount}
            onValueChange={setAmount}
          />
        </FinanceField>
      </div>
      {kind === CreateAdjustmentBodyDtoKind.TRANSFER && (
        <label className='flex items-center gap-2 text-sm'>
          <input type='checkbox' checked={costChange} onChange={(event) => setCostChange(event.target.checked)} />
          {translate('adjustments.transferReason')}
        </label>
      )}
      <FinanceField label={translate('reason')} required>
        <textarea
          required
          rows={3}
          maxLength={1000}
          className={`${financeInputClass} max-h-48 min-h-24 resize-y`}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </FinanceField>
      {cycleOpen && cycle && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate('adjustments.cycleNotLockedOn', { date: cycle.submissionDeadline })}
        </p>
      )}
      {deadline && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate('adjustments.cycleNotLockedOn', { date: deadline })}
        </p>
      )}
    </AdminFormDialog>
  )
}
