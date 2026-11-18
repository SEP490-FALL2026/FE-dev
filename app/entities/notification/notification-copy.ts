const internalIdPattern = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i

/** Compile the catalogue's optional clauses and parameter values without exposing missing placeholders. */
export function notificationBodyTemplate(code: string, raw: string, params: Record<string, unknown>) {
  raw = raw.replace(/\{reasons:list\}/g, '{{reasons}}')
  if (
    [
      'REQUEST_SUBMITTED',
      'RETURN_REQUESTED',
      'REQUEST_CANCELLED_BENEFICIARY_GONE',
      'REQUEST_BENEFICIARY_GONE_IT_CHECK'
    ].includes(code) &&
    !params[code === 'REQUEST_SUBMITTED' ? 'stage' : code === 'RETURN_REQUESTED' ? 'source' : 'reasonKind']
  )
    return ''
  const variant =
    code === 'REQUEST_SUBMITTED'
      ? params.stage
      : code === 'REQUEST_WITHDRAWN'
        ? `byRequester = ${params.byRequester}`
        : code === 'RETURN_REQUESTED'
          ? params.source
          : code === 'SPEND_QUEUE_REMINDER'
            ? `cause = ${params.cause}`
            : code === 'REQUEST_CANCELLED_BENEFICIARY_GONE' || code === 'REQUEST_BENEFICIARY_GONE_IT_CHECK'
              ? params.reasonKind
              : undefined
  if (variant !== undefined) {
    const escaped = String(variant).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const match = new RegExp(`${escaped}: "([^"]*)"`).exec(raw)
    if (!match) return ''
    raw = match[1]
  }
  if (/^[A-Z_]+:\s/.test(raw)) return ''
  // Explanatory instructions in the documentation are not notification copy.
  raw = raw.split(/ \((?:When|Khi|câu|phần) /)[0].split(/ (?:When|Khi) [a-zA-Z]/)[0]
  // Internal identifiers are never shown: "request {{requestId}}" reads as "request", other
  // optional clauses holding an identifier are dropped, and a required one hides the body.
  const internalKeys = new Set(
    Object.entries(params)
      .filter(([, value]) => typeof value === 'string' && internalIdPattern.test(value))
      .map(([key]) => key)
  )
  if (internalKeys.has('requestId')) raw = raw.replace(/((?:request|yêu cầu)) \{\{requestId\}\}/gi, '$1')
  params = Object.fromEntries(Object.entries(params).filter(([key]) => !internalKeys.has(key)))
  raw = raw
    .replace(/\[(.*?)\]/g, (_match, clause: string) => {
      const keys = [...clause.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1])
      return keys.length &&
        keys.every(
          (key) =>
            params[key] !== undefined &&
            params[key] !== null &&
            params[key] !== '' &&
            (key !== 'overdueWorkingDays' || Number(params[key]) > 0)
        )
        ? clause
        : ''
    })
    .replace(/^"|"$/g, '')
  const required = [...raw.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1])
  if (
    required.some((key) => params[key] === undefined || params[key] === null || params[key] === '') ||
    /\{[^{}]+:[^{}]+\}/.test(raw)
  )
    return ''
  return raw
}
