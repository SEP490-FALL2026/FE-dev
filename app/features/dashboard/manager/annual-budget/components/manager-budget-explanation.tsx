import { useTranslation } from 'react-i18next'
import type { ExplainLineBodyDto } from '~/shared/api/generated/model/budget-review-periods/explainLineBodyDto'
import type { ReviewPeriodDetailResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-review-periods/reviewPeriodDetailResponseDtoDataItemsItem'
import { budgetReviewLineExplain } from '~/shared/api/generated/operations/budget-review-periods/budget-review-line-explain'
import { getBudgetReviewPeriodGetQueryKey } from '~/shared/api/generated/operations/budget-review-periods/budget-review-period-get'
import { getBudgetReviewPeriodListQueryKey } from '~/shared/api/generated/operations/budget-review-periods/budget-review-period-list'
import { Dialog } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { ManagerFormSelect, enumOptions } from '../../shared/components/manager-select'
import { EXPLANATION_PERSISTENCE } from '../enums/explanation-persistence'
import { budgetAmountPattern } from '../budget-limits'

export function ManagerBudgetExplanation({
  periodId,
  costCenterId,
  line,
  disabled,
  onClose
}: {
  periodId: string
  costCenterId: string
  line: ReviewPeriodDetailResponseDtoDataItemsItem
  disabled: boolean
  onClose: () => void
}) {
  const { t } = useTranslation('manager')
  const previous = line.explanation
  const action = useManagerAction({
    mutationFn: (body: ExplainLineBodyDto) => budgetReviewLineExplain(periodId, costCenterId, body),
    invalidate: [getBudgetReviewPeriodGetQueryKey(periodId), getBudgetReviewPeriodListQueryKey()],
    onSuccess: onClose
  })
  return (
    <Dialog
      presentation='drawer'
      title={t('budgetWorkspace.explanation')}
      onClose={() => {
        if (!action.isPending) onClose()
      }}
    >
      <p className='text-sm text-muted-foreground'>{t('budgetWorkspace.explanationHint')}</p>
      <ManagerFormErrors fields={action.fields}>
        <form
          className='space-y-5'
          onSubmit={(event) => {
            event.preventDefault()
            if (!event.currentTarget.reportValidity()) return
            if (disabled || action.blocked || line.costCenter?.id !== costCenterId) return
            const form = new FormData(event.currentTarget)
            const persistence = Object.values(EXPLANATION_PERSISTENCE).find(
              (value) => value === form.get('persistence')
            )
            if (!persistence) return
            const cause = String(form.get('cause') ?? '').trim()
            const nextAction = String(form.get('action') ?? '').trim()
            const note = String(form.get('knownNeedsToYearEnd.note') ?? '').trim()
            if (!cause || !nextAction || !note) return
            action.mutate({
              cause,
              persistence,
              action: nextAction,
              knownNeedsToYearEnd: {
                amount: { amount: String(form.get('knownNeedsToYearEnd.amount.amount') ?? '').trim() },
                note
              }
            })
          }}
        >
          <fieldset disabled={disabled || action.blocked} className='grid gap-4 sm:grid-cols-2'>
            <div className='sm:col-span-2'>
              <ManagerField label={t('budgetWorkspace.cause')}>
                <textarea
                  className={managerInputClass}
                  name='cause'
                  placeholder={t('ui.placeholders.cause')}
                  required
                  maxLength={2000}
                  rows={3}
                  defaultValue={previous?.cause}
                />
              </ManagerField>
            </div>
            <ManagerField label={t('budgetWorkspace.persistenceLabel')}>
              <ManagerFormSelect
                name='persistence'
                required
                placeholder={t('ui.placeholders.persistence')}
                defaultValue={previous?.persistence ?? EXPLANATION_PERSISTENCE.ONE_OFF}
                options={enumOptions(Object.values(EXPLANATION_PERSISTENCE), (value) =>
                  t(`budgetWorkspace.persistence.${value}`)
                )}
              />
            </ManagerField>
            <ManagerField label={t('budgetWorkspace.knownAmount')}>
              <input
                className={managerInputClass}
                name='knownNeedsToYearEnd.amount.amount'
                placeholder={t('ui.placeholders.knownAmount')}
                inputMode='numeric'
                pattern={budgetAmountPattern}
                maxLength={16}
                required
                defaultValue={previous?.knownNeedsToYearEnd.amount?.amount ?? '0'}
              />
            </ManagerField>
            <div className='sm:col-span-2'>
              <ManagerField label={t('budgetWorkspace.action')}>
                <textarea
                  className={managerInputClass}
                  name='action'
                  placeholder={t('ui.placeholders.action')}
                  required
                  maxLength={2000}
                  rows={3}
                  defaultValue={previous?.action}
                />
              </ManagerField>
            </div>
            <div className='sm:col-span-2'>
              <ManagerField label={t('budgetWorkspace.knownNote')}>
                <textarea
                  className={managerInputClass}
                  name='knownNeedsToYearEnd.note'
                  placeholder={t('ui.placeholders.knownNote')}
                  required
                  maxLength={1000}
                  rows={3}
                  defaultValue={previous?.knownNeedsToYearEnd.note}
                />
              </ManagerField>
            </div>
          </fieldset>
          <ManagerActionState action={action} />
          <div className='flex justify-end gap-3 border-t border-border/60 pt-4'>
            <ManagerButton disabled={action.isPending} onClick={onClose}>
              {t('cancel')}
            </ManagerButton>
            <ManagerButton primary type='submit' disabled={disabled || action.blocked} busy={action.isPending}>
              {action.retrySeconds ? t('retryAfter', { seconds: action.retrySeconds }) : t('save')}
            </ManagerButton>
          </div>
        </form>
      </ManagerFormErrors>
    </Dialog>
  )
}
