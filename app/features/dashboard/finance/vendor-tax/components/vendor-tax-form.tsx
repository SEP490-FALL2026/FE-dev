import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
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
import {
  FinanceButton,
  FinanceDrawer,
  FinanceField,
  FinanceSection,
  FinanceSelect,
  financeInputClass
} from '../../shared/components/finance-ui'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { useFinanceRetry } from '../../shared/hooks/use-finance-retry'
import { taxProfileBody } from '../tax-profile'

const ratePattern = /^\d+(\.\d+)?$/

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
        className='space-y-6'
        onSubmit={(event) => {
          event.preventDefault()
          if (data && !declare.isPending && retrySeconds === 0) declare.mutate({ id: vendorId, data })
        }}
      >
        <fieldset disabled={declare.isPending} className='space-y-6'>
          <FinanceField label={translate('taxGroup')} hint={translate('taxGroupHint')} required>
            <div className='max-w-xs'>
              <FinanceSelect required value={group} onChange={(event) => setGroup(event.target.value)}>
                {Object.values(DeclareTaxProfileBodyDtoGroup).map((value) => (
                  <option key={value} value={value}>
                    {translate(`enum.${value}`)}
                  </option>
                ))}
              </FinanceSelect>
            </div>
          </FinanceField>
          <FinanceSection
            title={translate('taxLines')}
            actions={
              <FinanceButton
                onClick={() => setLines((current) => [...current, { taxType: '', ratePercent: '', deductible: false }])}
              >
                <Plus aria-hidden className='size-4' strokeWidth={1.5} />
                {translate('addTaxLine')}
              </FinanceButton>
            }
          >
            {!lines.length && (
              <p className='rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground'>
                {translate('noTaxLines')}
              </p>
            )}
            {lines.map((line, index) => {
              const rateError =
                line.ratePercent && !ratePattern.test(line.ratePercent) ? translate('ratePercentInvalid') : null
              return (
                <article key={index} className='space-y-3 rounded-lg border border-border/70 bg-surface p-4'>
                  <header className='flex items-center justify-between gap-3'>
                    <h3 className='text-sm font-medium'>{translate('taxLine', { index: index + 1 })}</h3>
                    <FinanceButton
                      variant='ghost'
                      className='hover:text-danger'
                      onClick={() => setLines((current) => current.filter((_, lineIndex) => lineIndex !== index))}
                    >
                      <Trash2 aria-hidden className='size-4' strokeWidth={1.5} />
                      {translate('removeTaxLine')}
                    </FinanceButton>
                  </header>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <FinanceField label={translate('taxType')} required>
                      <input
                        className={financeInputClass}
                        required
                        maxLength={1000}
                        placeholder={translate('taxTypePlaceholder')}
                        value={line.taxType}
                        onChange={(event) => updateLine(index, { taxType: event.target.value })}
                      />
                    </FinanceField>
                    <FinanceField label={translate('ratePercent')} required error={rateError}>
                      <input
                        className={`${financeInputClass} max-w-xs text-right font-mono tabular-nums`}
                        required
                        inputMode='decimal'
                        autoComplete='off'
                        placeholder={translate('ratePercentPlaceholder')}
                        aria-invalid={!!rateError}
                        value={line.ratePercent}
                        onChange={(event) => updateLine(index, { ratePercent: event.target.value })}
                      />
                    </FinanceField>
                  </div>
                  <label className='flex min-h-11 w-fit cursor-pointer items-center gap-2 text-sm md:min-h-9'>
                    <input
                      type='checkbox'
                      className='size-4 cursor-pointer rounded accent-primary'
                      checked={line.deductible}
                      onChange={(event) => updateLine(index, { deductible: event.target.checked })}
                    />
                    {translate('deductible')}
                  </label>
                </article>
              )
            })}
          </FinanceSection>
        </fieldset>
        <div className='sticky bottom-0 flex justify-end gap-3 border-t border-border/60 bg-surface py-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
          <FinanceButton variant='ghost' disabled={declare.isPending} onClick={onClose}>
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
