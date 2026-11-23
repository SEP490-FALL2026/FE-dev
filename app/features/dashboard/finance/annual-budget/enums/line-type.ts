import { AddLinesBodyDtoLinesItemLineType } from '~/shared/api/generated/model/budget-versions/addLinesBodyDtoLinesItemLineType'

/** Kind of a budget line: a CANCEL amount is shown and never added to the total. */
export const LINE_TYPE = AddLinesBodyDtoLinesItemLineType
export type LineType = (typeof LINE_TYPE)[keyof typeof LINE_TYPE]
export const lineTypes: readonly LineType[] = Object.values(LINE_TYPE)

export function isLineType(value: string): value is LineType {
  return (lineTypes as readonly string[]).includes(value)
}
