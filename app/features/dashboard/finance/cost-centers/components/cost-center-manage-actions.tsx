import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { CostCenterPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/cost-centers'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { FinanceButton, FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { useCostCenterActions } from '../hooks/use-cost-center-actions'

/** Rename one cost center. */
export function CostCenterManageActions({ item }: { item: CostCenterPageResponseDtoDataItemsItem }) {
  const { t: translate } = useTranslation('financeSettings')
  const [dialog, setDialog] = useState<'rename'>()
  const [name, setName] = useState(item.name)
  const { rename } = useCostCenterActions(() => setDialog(undefined))
  const nameValue = name.trim()
  const renameValid = nameValue.length >= 1 && nameValue.length <= 1000 && nameValue !== item.name

  const submitRename = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!renameValid || rename.isPending) return
    rename.mutate({ id: item.id, data: { name: nameValue } })
  }

  return (
    <div className='flex flex-wrap gap-2'>
      <FinanceButton
        onClick={() => {
          setName(item.name)
          setDialog('rename')
        }}
      >
        {translate('costCenterActions.rename')}
      </FinanceButton>
      {dialog === 'rename' && (
        <AdminFormDialog
          title={translate('costCenterActions.renameTitle', { code: item.code })}
          pending={rename.isPending}
          submitLabel={translate('costCenterActions.renameSubmit')}
          submitDisabled={!renameValid}
          onClose={() => setDialog(undefined)}
          onSubmit={submitRename}
        >
          <FinanceField
            label={translate('costCenterActions.name')}
            required
            hint={translate('costCenterActions.renameHint')}
          >
            <input
              required
              maxLength={1000}
              className={financeInputClass}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </FinanceField>
        </AdminFormDialog>
      )}
    </div>
  )
}
