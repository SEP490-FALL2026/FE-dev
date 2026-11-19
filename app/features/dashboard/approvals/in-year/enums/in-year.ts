import { AdjustmentListResponseDtoDataItemsItemKind } from '~/shared/api/generated/model/budget-adjustments/adjustmentListResponseDtoDataItemsItemKind'
import { BudgetAdjustmentListState } from '~/shared/api/generated/model/budget-adjustments/budgetAdjustmentListState'
import { DecideAdjustmentBodyDtoDecision } from '~/shared/api/generated/model/budget-adjustments/decideAdjustmentBodyDtoDecision'

export const adjustmentKind = AdjustmentListResponseDtoDataItemsItemKind
export const adjustmentState = BudgetAdjustmentListState
export type AdjustmentState = (typeof adjustmentState)[keyof typeof adjustmentState]
export const adjustmentDecision = DecideAdjustmentBodyDtoDecision
export type AdjustmentDecision = (typeof adjustmentDecision)[keyof typeof adjustmentDecision]

export const IN_YEAR_SECTIONS = ['adjustments', 'periods', 'deadlines'] as const
export type InYearSection = (typeof IN_YEAR_SECTIONS)[number]
