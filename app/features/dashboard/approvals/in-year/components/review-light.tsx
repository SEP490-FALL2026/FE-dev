import { useTranslation } from 'react-i18next'

const dotClasses: Record<string, string> = {
  GREEN: 'bg-success',
  YELLOW: 'bg-warning',
  RED: 'bg-danger',
  UNDER: 'bg-info'
}

const edgeClasses: Record<string, string> = {
  GREEN: 'border-l-success',
  YELLOW: 'border-l-warning',
  RED: 'border-l-danger',
  UNDER: 'border-l-info'
}

/** The coloured left edge of a Cost Center card: the same signal as the dot, never a figure. */
export const reviewLightEdge = (light: string) => edgeClasses[light] ?? 'border-l-border'

/**
 * The light of a Cost Center is a signal, not a figure: a coloured dot beside the Cost Center, never a column of its
 * own. The colour is not the only carrier: the dot has a text name and the rule behind it for assistive tech and hover.
 */
export function ReviewLightDot({ light }: { light: string }) {
  const { t: translate } = useTranslation('approvalsBudget')
  const label = translate(`inYear.lights.${light}`, { defaultValue: light })
  return (
    <span
      role='img'
      aria-label={label}
      title={label}
      className={`inline-block size-3 shrink-0 rounded-full ring-2 ring-surface ${dotClasses[light] ?? 'bg-muted-foreground'}`}
    />
  )
}
