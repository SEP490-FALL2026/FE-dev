import { RequestableApplicationResponseDtoDataDataSensitivity } from '~/shared/api/generated/model/requestable-software/requestableApplicationResponseDtoDataDataSensitivity'

export const CATALOG_SENSITIVITY = RequestableApplicationResponseDtoDataDataSensitivity
export type CatalogSensitivity = (typeof CATALOG_SENSITIVITY)[keyof typeof CATALOG_SENSITIVITY]

/** The application may have no sensitivity yet (`null`) or a code this client does not know. */
export function isCatalogSensitivity(value: unknown): value is CatalogSensitivity {
  return typeof value === 'string' && Object.values<string>(CATALOG_SENSITIVITY).includes(value)
}
