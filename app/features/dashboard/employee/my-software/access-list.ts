export const ACCESS_LIST = {
  SOFTWARE: 'software',
  EXPIRY: 'expiry',
  RETURNS: 'returns'
} as const

export function getAccessList(value: string | null) {
  return Object.values(ACCESS_LIST).find((option) => option === value) ?? ACCESS_LIST.SOFTWARE
}
