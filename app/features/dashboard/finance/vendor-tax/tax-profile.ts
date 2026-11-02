import {
  type DeclareTaxProfileBodyDto,
  type DeclareTaxProfileBodyDtoLinesItem
} from '~/shared/api/generated/model/vendors'
import { DeclareTaxProfileBodyDtoGroup } from './enums/tax-group'

export function taxProfileBody(
  group: string,
  lines: DeclareTaxProfileBodyDtoLinesItem[]
): DeclareTaxProfileBodyDto | null {
  const knownGroup = Object.values(DeclareTaxProfileBodyDtoGroup).find((value) => value === group)
  if (
    !knownGroup ||
    lines.length > 100 ||
    lines.some(
      (line) =>
        !line.taxType.trim() ||
        line.taxType.trim().length > 1000 ||
        !/^\d+(\.\d+)?$/.test(line.ratePercent) ||
        line.ratePercent.length > 20
    )
  )
    return null
  return {
    group: knownGroup,
    lines: lines.map(({ taxType, ratePercent, deductible }) => ({ taxType: taxType.trim(), ratePercent, deductible }))
  }
}
