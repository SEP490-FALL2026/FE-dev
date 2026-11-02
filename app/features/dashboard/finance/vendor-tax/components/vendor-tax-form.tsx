import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  type DeclareTaxProfileBodyDtoLinesItem,
  type TaxProfileResponseDtoData
} from '~/shared/api/generated/model/vendors'
import { DeclareTaxProfileBodyDtoGroup } from '../enums/tax-group'

import {
  useVendorTaxProfileSet,
  getVendorTaxProfileGetQueryKey,
  getVendorTaxProfileHistoryQueryKey,
  getVendorTaxEstimateQueryKey,
  getVendorListQueryKey
} from '~/shared/api/generated/operations/vendors'
import { getSubscriptionListQueryKey } from '~/shared/api/generated/operations/subscriptions'
import { FinanceButton, FinanceDrawer, FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { useFinanceRetry } from '../../shared/hooks/use-finance-retry'
import { taxProfileBody } from '../tax-profile'

export function VendorTaxForm({
  vendorId,
  profile,
  onClose
}: {
  vendorId: string
  profile: NonNullable<TaxProfileResponseDtoData>
  onClose: () => void
}) {
  const { t: translate } = useTranslation('financeSettings')
  const initial = profile.profile ?? profile.defaultProfile
  const [group, setGroup] = useState<string>(initial.group)
  const [lines, setLines] = useState<DeclareTaxProfileBodyDtoLinesItem[]>(
    initial.lines.map(({ taxType, ratePercent, deductible }) => ({ taxType, ratePercent, deductible }))
  )
  const feedback = useFinanceFeedback(
    [
      getVendorListQueryKey(),
      getVendorTaxProfileGetQueryKey(vendorId),
      getVendorTaxProfileHistoryQueryKey(vendorId),
      getVendorTaxEstimateQueryKey(vendorId),
      getSubscriptionListQueryKey()
    ],
    onClose
  )
  const declare = useVendorTaxProfileSet({ mutation: feedback })
  const retrySeconds = useFinanceRetry()
  const data = taxProfileBody(group, lines)
  function updateLine(index: number, change: Partial<DeclareTaxProfileBodyDtoLinesItem>) {
    setLines((current) => current.map((line, lineIndex) => (lineIndex === index ? { ...line, ...change } : line)))
  }
  return (
    <FinanceDrawer title={translate('declareProfile')} onClose={onClose} pending={declare.isPending}>
      <form
        className='space-y-5'
        onSubmit={(event) => {
          event.preventDefault()
          if (data && !declare.isPending && retrySeconds === 0) declare.mutate({ id: vendorId, data })
        }}
      >
        <fieldset disabled={declare.isPending} className='space-y-5'>
          <FinanceField label={translate('taxGroup')} hint={translate('taxGroupHint')}>
            <select className={financeInputClass} value={group} onChange={(event) => setGroup(event.target.value)}>
              {Object.values(DeclareTaxProfileBodyDtoGroup).map((value) => (
                <option key={value} value={value}>
                  {translate(`enum.${value}`)}
                </option>
              ))}
            </select>
          </FinanceField>
          {lines.map((line, index) => (
            <div key={index} className='grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2'>
              <FinanceField label={translate('taxType')}>
                <input
                  className={financeInputClass}
                  required
                  maxLength={1000}
                  placeholder={translate('taxTypePlaceholder')}
                  value={line.taxType}
                  onChange={(event) => updateLine(index, { taxType: event.target.value })}
                />
              </FinanceField>
              <FinanceField label={translate('ratePercent')}>
                <input
                  className={financeInputClass}
                  required
                  inputMode='decimal'
                  value={line.ratePercent}
                  onChange={(event) => updateLine(index, { ratePercent: event.target.value })}
                />
              </FinanceField>
              <label className='flex min-h-11 items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  checked={line.deductible}
                  onChange={(event) => updateLine(index, { deductible: event.target.checked })}
                />
                {translate('deductible')}
              </label>
              <FinanceButton
                type='button'
                onClick={() => setLines((current) => current.filter((_, lineIndex) => lineIndex !== index))}
              >
                {translate('removeTaxLine')}
              </FinanceButton>
            </div>
          ))}
          <FinanceButton
            type='button'
            onClick={() => setLines((current) => [...current, { taxType: '', ratePercent: '', deductible: false }])}
          >
            {translate('addTaxLine')}
          </FinanceButton>
        </fieldset>
        <div className='sticky bottom-0 flex justify-end gap-3 border-t border-border bg-surface py-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
          <FinanceButton type='button' disabled={declare.isPending} onClick={onClose}>
            {translate('cancel')}
          </FinanceButton>
          <FinanceButton variant='primary' type='submit' pending={declare.isPending} disabled={!data}>
            {translate('save')}
          </FinanceButton>
        </div>
      </form>
    </FinanceDrawer>
  )
}
