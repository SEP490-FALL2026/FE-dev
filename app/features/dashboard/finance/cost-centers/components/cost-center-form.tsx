import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { type CostCenterPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/cost-centers'
import { CostCenterPageResponseDtoDataItemsItemKind } from '../enums/cost-center-kind'
import { CostCenterPageResponseDtoDataItemsItemStatus } from '../enums/cost-center-status'

import {
  useCostCenterCreate,
  useCostCenterRename,
  getCostCenterListQueryKey
} from '~/shared/api/generated/operations/cost-centers'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { useFinanceRetry } from '../../shared/hooks/use-finance-retry'
import { getBudgetTableQueryKey } from '~/shared/api/generated/operations/budgets/budget-table'
import { getBudgetProposalListQueryKey } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import { getBudgetVersionListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-list'

export function CostCenterForm({
  item,
  onClose
}: {
  item?: CostCenterPageResponseDtoDataItemsItem
  onClose: () => void
}) {
  const { t: translate } = useTranslation('financeSettings')
  const [code, setCode] = useState('')
  const [name, setName] = useState(item?.name ?? '')
  const [departmentId, setDepartmentId] = useState('')
  const feedback = useFinanceFeedback(
    [
      getCostCenterListQueryKey(),
      getBudgetTableQueryKey(),
      getBudgetProposalListQueryKey(),
      getBudgetVersionListQueryKey()
    ],
    onClose
  )
  const create = useCostCenterCreate({ mutation: feedback })
  const rename = useCostCenterRename({ mutation: feedback })
  const retrySeconds = useFinanceRetry()
  const pending = create.isPending || rename.isPending
  const validName = !!name.trim() && name.length <= 1000
  const valid =
    validName &&
    (item
      ? item.status === CostCenterPageResponseDtoDataItemsItemStatus.ACTIVE
      : /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(code.trim()) &&
        code.trim().length <= 50 &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(departmentId.trim()))
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending || !valid || retrySeconds > 0) return
    if (item) rename.mutate({ id: item.id, data: { name: name.trim() } })
    else
      create.mutate({
        data: {
          code: code.trim(),
          name: name.trim(),
          kind: CostCenterPageResponseDtoDataItemsItemKind.UNIT,
          departmentId: departmentId.trim()
        }
      })
  }
  return (
    <FinanceFormDialog
      title={item ? translate('rename') : translate('create')}
      onClose={onClose}
      onSubmit={submit}
      pending={pending}
      submitDisabled={!valid || retrySeconds > 0}
      submitLabel={translate('save')}
    >
      {!item && (
        <FinanceField label={translate('code')}>
          <input
            className={financeInputClass}
            required
            maxLength={50}
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </FinanceField>
      )}
      <FinanceField label={translate('name')}>
        <input
          className={financeInputClass}
          required
          maxLength={1000}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </FinanceField>
      {!item && (
        <FinanceField label={translate('departmentId')} hint={translate('departmentIdHint')}>
          <input
            className={financeInputClass}
            required
            value={departmentId}
            onChange={(event) => setDepartmentId(event.target.value)}
          />
        </FinanceField>
      )}
    </FinanceFormDialog>
  )
}
