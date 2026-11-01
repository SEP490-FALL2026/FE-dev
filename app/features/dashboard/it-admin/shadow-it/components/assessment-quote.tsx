import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AssessmentPatchDto } from '~/shared/api/generated/model/access-requests/assessmentPatchDto'
import { ItField, itInputClass, itButtonClass } from '../../shared/components/it-form'
export function AssessmentQuote({
  quote,
  onChange
}: {
  quote: AssessmentPatchDto['quote']
  onChange: (quote: AssessmentPatchDto['quote']) => void
}) {
  const { t: translate } = useTranslation('itNewSoftware')
  const [enabled, setEnabled] = useState(false)
  return (
    <div className='space-y-3'>
      <button
        className={itButtonClass}
        type='button'
        onClick={() => {
          setEnabled(true)
          onChange(quote ?? { unitPrice: { amount: '', currency: '' }, billingCycle: 'MONTHLY', validFrom: '' })
        }}
      >
        {translate('quote.edit')}
      </button>
      {enabled && (
        <>
          <div className='grid gap-3 sm:grid-cols-2'>
            {(['amount', 'currency', 'validFrom', 'validUntil', 'commitmentMonths', 'firstPaymentOn'] as const).map(
              (key) => (
                <ItField key={key} label={translate(`quote.${key}`)}>
                  <input
                    className={itInputClass}
                    required={key === 'amount' || key === 'currency' || key === 'validFrom'}
                    type={
                      key === 'validFrom' || key === 'validUntil' || key === 'firstPaymentOn'
                        ? 'date'
                        : key === 'commitmentMonths'
                          ? 'number'
                          : 'text'
                    }
                    min={key === 'commitmentMonths' ? 1 : undefined}
                    max={key === 'commitmentMonths' ? 120 : undefined}
                    maxLength={key === 'amount' ? 40 : key === 'currency' ? 3 : undefined}
                    pattern={key === 'currency' ? '[A-Z]{3}' : undefined}
                    value={
                      key === 'amount' || key === 'currency' ? (quote?.unitPrice[key] ?? '') : (quote?.[key] ?? '')
                    }
                    onChange={(event) => {
                      if (!quote) return
                      const value = event.target.value
                      onChange(
                        key === 'amount' || key === 'currency'
                          ? { ...quote, unitPrice: { ...quote.unitPrice, [key]: value } }
                          : {
                              ...quote,
                              [key]: key === 'commitmentMonths' ? (value ? Number(value) : null) : value || null
                            }
                      )
                    }}
                  />
                </ItField>
              )
            )}
          </div>
          <fieldset>
            <legend>{translate('quote.billingCycle')}</legend>
            <div className='flex flex-wrap gap-3'>
              {(['MONTHLY', 'QUARTERLY', 'ANNUAL'] as const).map((value) => (
                <label key={value} className='flex min-h-11 items-center gap-2'>
                  <input
                    type='radio'
                    name='billingCycle'
                    checked={quote?.billingCycle === value}
                    onChange={() => quote && onChange({ ...quote, billingCycle: value })}
                  />
                  {translate(`quote.${value}`)}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{translate('quote.paymentFrequency')}</legend>
            <div className='flex flex-wrap gap-3'>
              {(['MONTHLY', 'QUARTERLY', 'ANNUAL', 'UPFRONT_ONCE'] as const).map((value) => (
                <label key={value} className='flex min-h-11 items-center gap-2'>
                  <input
                    type='radio'
                    name='paymentFrequency'
                    checked={quote?.paymentFrequency === value}
                    onChange={() => quote && onChange({ ...quote, paymentFrequency: value })}
                  />
                  {translate(`quote.${value}`)}
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}
    </div>
  )
}
