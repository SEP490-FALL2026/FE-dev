import { useTranslation } from 'react-i18next'
import { useDashboardFormat } from '../../../dashboard-ui'
import { isKnownParameterKey, OPERATING_PARAMETER_LABELS } from '../enums/operating-parameter-key'

const unitLabels = {
  'working days': 'workingDays',
  steps: 'steps',
  'minutes per day': 'minutesPerDay',
  'month of the year': 'monthOfYear',
  days: 'days',
  'calendar days': 'days',
  minutes: 'minutes',
  hours: 'hours',
  months: 'months',
  percent: 'percent',
  '%': 'percent'
} as const

function isKnownUnit(unit: string): unit is keyof typeof unitLabels {
  return Object.hasOwn(unitLabels, unit)
}

export function useParameterPresentation() {
  const { t: translate } = useTranslation('admin')
  const { formatNumber } = useDashboardFormat()
  return {
    isKnownParameterKey,
    name: (key: string) =>
      isKnownParameterKey(key)
        ? translate(`parameters.definitions.${OPERATING_PARAMETER_LABELS[key]}.name`)
        : translate('parameters.unknownName'),
    description: (key: string, fallback?: string) =>
      isKnownParameterKey(key)
        ? translate(`parameters.definitions.${OPERATING_PARAMETER_LABELS[key]}.description`)
        : fallback || translate('parameters.unknownDescription'),
    unit: (value: string) =>
      isKnownUnit(value) ? translate(`parameters.units.${unitLabels[value]}`) : translate('parameters.unknownUnit'),
    value: (value: unknown) =>
      Array.isArray(value) && value.every((entry) => typeof entry === 'number')
        ? value.map(formatNumber).join(', ')
        : typeof value === 'number'
          ? formatNumber(value)
          : typeof value === 'string'
            ? value
            : (JSON.stringify(value) ?? translate('none'))
  }
}
