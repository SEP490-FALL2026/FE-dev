import type { ParameterListResponseDtoDataItemsItemConstraints } from '~/shared/api/generated/model/operating-parameters'

export function parseParameterValue(draft: string, constraints: unknown): string | number | number[] | undefined {
  if (!constraints || typeof constraints !== 'object' || !('kind' in constraints)) return undefined
  const rules = constraints as ParameterListResponseDtoDataItemsItemConstraints
  if (rules.kind === 'enum') return rules.options.includes(draft) ? draft : undefined
  if (rules.kind !== 'int' && rules.kind !== 'int-list') return undefined
  const integer = (value: number) => Number.isSafeInteger(value) && value >= rules.min && value <= rules.max
  if (rules.kind === 'int') {
    const parsed = Number(draft)
    return draft.trim() && integer(parsed) ? parsed : undefined
  }
  const entries = draft.split(',').map((entry) => entry.trim())
  if (entries.some((entry) => !entry)) return undefined
  const parsed = entries.map(Number)
  if (parsed.length < rules.length.min || parsed.length > rules.length.max || !parsed.every(integer)) return undefined
  if (
    parsed.some(
      (value, index) =>
        index > 0 && (rules.order === 'ascending' ? value <= parsed[index - 1] : value >= parsed[index - 1])
    )
  )
    return undefined
  return parsed
}
