import { useTranslation } from 'react-i18next'
import type { RequestTerm } from '~/entities/request/request-term'

/** The "time of use" of a request as the BRD names it: a number of months, long-term use, or a one-time licence. */
export function useRequestTermText() {
  const { t: translate } = useTranslation('approvalsSpend')
  return (term: RequestTerm) => {
    if (term.kind === 'MONTHS') return translate('termMonthsCount', { count: term.months })
    if (term.kind === 'OPEN_ENDED') return translate('termOpenEnded')
    if (term.kind === 'ONE_TIME') return translate('termOneTime')
    return translate('unavailable')
  }
}
