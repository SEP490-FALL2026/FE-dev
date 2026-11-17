/** Cost Center code accepted by BE: 1–50 characters, starts with a letter or digit, then letters, digits, `.`, `_`, `-`. */
export const COST_CENTER_CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/
export const COST_CENTER_CODE_MAX = 50
export const COST_CENTER_NAME_MAX = 1000

/** Names BE keeps for the unallocated cost lines (compared without case or accents). */
const RESERVED_NAMES = ['chua phan loai', 'chua phan bo', 'chua phan bo cost center', 'unclassified', 'unallocated']

/** BE shows a name with single spaces and no spaces at either end. */
export function normalizeCostCenterName(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g')

function foldForComparison(value: string) {
  return normalizeCostCenterName(value).normalize('NFD').replace(COMBINING_MARKS, '').replace(/đ/gi, 'd').toLowerCase()
}

export function isReservedCostCenterName(value: string) {
  return RESERVED_NAMES.includes(foldForComparison(value))
}

/** The code cannot change after creation, so it is suggested from the department code and Finance can edit it. */
export function suggestCostCenterCode(departmentCode: string) {
  return `CC-${departmentCode}`
    .toUpperCase()
    .replace(/[^A-Z0-9._-]/g, '-')
    .slice(0, COST_CENTER_CODE_MAX)
}
