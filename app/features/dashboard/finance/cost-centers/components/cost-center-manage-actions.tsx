import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { CostCenterPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/cost-centers'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { FinanceButton, FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { useCostCenterActions } from '../hooks/use-cost-center-actions'
import { CostCenterPageResponseDtoDataItemsItemStatus } from '../enums/cost-center-status'

/** Rename and retire one Cost Center. Retiring is refused while Requests or commitments still sit on it (409). */
export function CostCenterManageActions({ item }: { item: CostCenterPageResponseDtoDataItemsItem }) {
  const { t: translate } = useTranslation('financeSettings')
  const [dialog, setDialog] = useState<'rename' | 'deactivate'>()
  const [name, setName] = useState(item.name)
  const { rename, deactivate } = useCostCenterActions(() => setDialog(undefined))
  const active = item.status === CostCenterPageResponseDtoDataItemsItemStatus.ACTIVE
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
      {active && (
        <FinanceButton variant='ghost' onClick={() => setDialog('deactivate')}>
          {translate('costCenterActions.deactivate')}
        </FinanceButton>
      )}
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
      {dialog === 'deactivate' && (
        <AdminFormDialog
          danger
          title={translate('costCenterActions.deactivateTitle', { code: item.code })}
          pending={deactivate.isPending}
          submitLabel={translate('costCenterActions.deactivateSubmit')}
          onClose={() => setDialog(undefined)}
          onSubmit={(event) => {
            event.preventDefault()
            if (!deactivate.isPending) deactivate.mutate({ id: item.id })
          }}
        >
          <p className='text-sm'>{translate('costCenterActions.deactivateHint')}</p>
        </AdminFormDialog>
      )}
    </div>
  )
}
