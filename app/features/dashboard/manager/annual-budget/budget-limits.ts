// BM-10 accepts 1–10 attachments; up to 20 unattached files can be kept for reuse.
export const BUDGET_PROPOSAL_FILE_LIMIT = 10
export const BUDGET_DRAFT_FILE_LIMIT = 20
// API money convention: VND, at most 16 integer digits, no fractional part.
export const budgetAmountPattern = '[0-9]{1,16}'
