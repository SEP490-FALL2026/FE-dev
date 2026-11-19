import { useTranslation } from 'react-i18next'
import { REVIEW_LIGHT } from '../enums/review-light'

const tones = {
  [REVIEW_LIGHT.GREEN]: 'bg-success/10 text-success-ink',
  [REVIEW_LIGHT.YELLOW]: 'bg-warning/10 text-warning-ink',
  [REVIEW_LIGHT.RED]: 'bg-danger/10 text-danger-ink',
  [REVIEW_LIGHT.UNDER]: 'bg-info/10 text-info-ink'
}
export function ManagerBudgetLabel({
  value,
  group
}: {
  value: string
  group:
    | 'lights'
    | 'periodStates'
    | 'periodKinds'
    | 'explanationStates'
    | 'adjustmentStates'
    | 'adjustmentKinds'
    | 'persistence'
}) {
  const { t } = useTranslation('manager')
  const tone =
    group === 'lights' && Object.hasOwn(tones, value)
      ? tones[value as keyof typeof tones]
      : 'bg-surface-subtle text-foreground'
  return (
    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${tone}`}>
      {t(`budgetWorkspace.${group}.${value}`, { defaultValue: t('unknownStatus') })}
    </span>
  )
}
