export const uuidPattern = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
export function isEmployeeResourceId(value: string) {
  return new RegExp(`^${uuidPattern}$`).test(value)
}
