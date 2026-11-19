import { PreviewResponseDtoDataPreviewTermRefusal } from '~/shared/api/generated/model/access-requests/previewResponseDtoDataPreviewTermRefusal'

/** Why the chosen "Thời gian dùng" cannot be submitted yet; codes come from the preview contract. */
export const TERM_REFUSAL = PreviewResponseDtoDataPreviewTermRefusal
export type TermRefusal = (typeof TERM_REFUSAL)[keyof typeof TERM_REFUSAL]

export function isTermRefusal(value: unknown): value is TermRefusal {
  return typeof value === 'string' && Object.values<string>(TERM_REFUSAL).includes(value)
}
