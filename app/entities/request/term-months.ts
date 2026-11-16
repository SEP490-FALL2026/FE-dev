import { RequestablePlanPageResponseDtoDataItemsItemProvisioningType as PROVISIONING_TYPE } from '~/shared/api/generated/model/requestable-software/requestablePlanPageResponseDtoDataItemsItemProvisioningType'

/** Plan kinds of the catalog, plus a request for software that is not in the catalog yet. */
export type TermSubject = (typeof PROVISIONING_TYPE)[keyof typeof PROVISIONING_TYPE] | 'NEW_SOFTWARE'

export interface TermRule {
  /** The form shows the "Thời gian dùng" field. */
  asked: boolean
  /** Months are mandatory; "Dùng lâu dài" is not offered. */
  required: boolean
  maxMonths: number
}

/**
 * "Thời gian dùng" rules by plan kind (QĐ-111i): K1 1–9 months required; K2, K5 and new software 1–12 months or
 * long-term use; K4 is not asked. K3 follows the generic 1–12 rule; the server's preview has the final say.
 */
export function termRule(subject: TermSubject | null | undefined): TermRule {
  if (!subject || subject === PROVISIONING_TYPE.K4) return { asked: false, required: false, maxMonths: 0 }
  if (subject === PROVISIONING_TYPE.K1) return { asked: true, required: true, maxMonths: 9 }
  return { asked: true, required: false, maxMonths: 12 }
}

/**
 * Reads the field from a form: a whole number of months, or `undefined` when the field is absent or left on
 * "Dùng lâu dài" (the contract treats an omitted field as long-term use).
 */
export function readTermMonths(form: FormData): number | undefined {
  const value = String(form.get('termMonths') ?? '').trim()
  if (!value) return undefined
  const months = Number(value)
  return Number.isInteger(months) && months > 0 ? months : undefined
}

export function termMonthsPayload(months: number | undefined) {
  return months === undefined ? {} : { termMonths: months }
}

/**
 * Text for the term of a request: months for new requests, the end date for requests created before
 * "Thời gian dùng" existed, otherwise long-term use (also a one-time K4 purchase).
 */
export function requestTermLabel(
  request: { termMonths: number | null; expectedEndDate: string | null },
  translate: (key: 'monthsValue' | 'longTerm', options?: { count: number }) => string,
  formatDate: (value: string) => string
) {
  if (request.termMonths !== null) return translate('monthsValue', { count: request.termMonths })
  if (request.expectedEndDate) return formatDate(request.expectedEndDate)
  return translate('longTerm')
}
