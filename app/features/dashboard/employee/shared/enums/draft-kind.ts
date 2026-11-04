import { AccessRequestDraftPageResponseDtoDataItemsItemKind as DRAFT_KIND } from '~/shared/api/generated/model/access-requests/accessRequestDraftPageResponseDtoDataItemsItemKind'

export { DRAFT_KIND }
export function canSubmitEmployeeDraft(kind: string) {
  return kind === DRAFT_KIND.INDIVIDUAL || kind === DRAFT_KIND.GROUP
}
