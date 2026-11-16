import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ItField, itButtonClass, itInputClass } from '../../shared/components/it-form'
import { useUsageNavigation } from '../hooks/use-usage-navigation'

export function UsagePeriod() {
  const { t } = useTranslation('itDepartmentWork')
  const { params, update } = useUsageNavigation()
  const [from, setFrom] = useState(params.get('from') ?? '')
  const [to, setTo] = useState(params.get('to') ?? '')
  const days = (Date.parse(to) - Date.parse(from)) / 86400000 + 1
  const valid = (!from && !to) || (!!from && !!to && days > 0 && days <= 366)
  return (
    <form
      className='flex flex-wrap items-end gap-3'
      onSubmit={(event) => {
        event.preventDefault()
        if (valid) update({ from, to, softwarePage: undefined, overviewPage: undefined })
      }}
    >
      <ItField label={t('usage.from')}>
        <input type='date' className={itInputClass} value={from} onChange={(event) => setFrom(event.target.value)} />
      </ItField>
      <ItField label={t('usage.to')} hint={t('usage.periodHint')}>
        <input
          type='date'
          className={itInputClass}
          value={to}
          onChange={(event) => setTo(event.target.value)}
          aria-invalid={!valid}
        />
      </ItField>
      <button type='submit' className={itButtonClass} disabled={!valid}>
        {t('usage.apply')}
      </button>
      {!valid && <p className='w-full text-sm text-danger'>{t('usage.invalidPeriod')}</p>}
    </form>
  )
}
