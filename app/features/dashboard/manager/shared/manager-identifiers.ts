export const resourceIdPattern = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
export const isResourceId = (value: string) => new RegExp(`^${resourceIdPattern}$`).test(value)
export const parseEmployeeIds = (value: string) => [...new Set(value.split(/\s+/).filter(Boolean))]
