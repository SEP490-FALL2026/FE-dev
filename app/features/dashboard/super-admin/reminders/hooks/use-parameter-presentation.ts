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
  const { t: translate, i18n } = useTranslation('admin')
  const { formatNumber } = useDashboardFormat()
  return {
    isKnownParameterKey,
    name: (key: string, label?: string) =>
      i18n.resolvedLanguage === 'vi' && label
        ? label
        : isKnownParameterKey(key)
          ? translate(`parameters.definitions.${OPERATING_PARAMETER_LABELS[key]}.name`)
          : translate(`parameters.additionalDefinitions.${key}.name`, {
              defaultValue: translate('parameters.unknownName')
            }),
    description: (key: string) =>
      isKnownParameterKey(key)
        ? translate(`parameters.definitions.${OPERATING_PARAMETER_LABELS[key]}.description`)
        : translate(`parameters.additionalDefinitions.${key}.description`, {
            defaultValue: translate('parameters.unknownDescription')
          }),
    group: (group: string, label?: string) =>
      i18n.resolvedLanguage === 'vi' && label
        ? label
        : translate(`parameters.groups.${group}`, { defaultValue: translate('parameters.contract.ungrouped') }),
    unit: (value: string, label?: string) =>
      i18n.resolvedLanguage === 'vi' && label
        ? label
        : isKnownUnit(value)
          ? translate(`parameters.units.${unitLabels[value]}`)
          : translate('parameters.unknownUnit'),
    option: (value: string, labels?: Record<string, string>) =>
      i18n.resolvedLanguage === 'vi' && labels?.[value]
        ? labels[value]
        : translate(`parameters.options.${value}`, { defaultValue: translate('unknown') }),
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
