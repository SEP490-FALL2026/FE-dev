import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { useCostCenterActions } from '../hooks/use-cost-center-actions'
import { useFinanceDepartments } from '../hooks/use-finance-departments'

const codePattern = /^[A-Za-z0-9][A-Za-z0-9._-]*$/

/** A Cost Center is always of kind UNIT and becomes the current one of its department. */
export function CostCenterCreateDialog({ onClose }: { onClose: () => void }) {
  const { t: translate } = useTranslation('financeSettings')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const { create } = useCostCenterActions(onClose)
  const { departments, isPending, noCycle, year } = useFinanceDepartments()

  const codeValue = code.trim()
  const nameValue = name.trim()
  const valid =
    codeValue.length >= 1 &&
    codeValue.length <= 50 &&
    codePattern.test(codeValue) &&
    nameValue.length >= 1 &&
    nameValue.length <= 1000 &&
    Boolean(departmentId)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid || create.isPending) return
    create.mutate({ data: { code: codeValue, name: nameValue, kind: 'UNIT', departmentId } })
  }

  return (
    <AdminFormDialog
      title={translate('costCenterActions.createTitle')}
      pending={create.isPending}
      submitLabel={translate('costCenterActions.createSubmit')}
      submitDisabled={!valid}
      onClose={onClose}
      onSubmit={submit}
    >
      <div className='grid gap-3 sm:grid-cols-2'>
        <FinanceField
          label={translate('costCenterActions.code')}
          required
          error={code && !codePattern.test(codeValue) ? translate('costCenterActions.codeInvalid') : null}
        >
          <input
            required
            maxLength={50}
            className={`${financeInputClass} font-mono`}
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </FinanceField>
        <FinanceField label={translate('costCenterActions.name')} required>
          <input
            required
            maxLength={1000}
            className={financeInputClass}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FinanceField>
      </div>
      <FinanceField
        label={translate('costCenterActions.department')}
        required
        hint={
          departments.length || isPending
            ? undefined
            : noCycle
              ? translate('costCenterActions.noDepartments', { year })
              : translate('costCenterActions.allLinked', { year })
        }
      >
        <select
          required
          className={financeInputClass}
          value={departmentId}
          onChange={(event) => setDepartmentId(event.target.value)}
        >
          <option value=''>{translate('costCenterActions.pickDepartment')}</option>
          {departments.map((department) => (
            <option key={department.departmentId} value={department.departmentId}>
              {department.departmentCode} · {department.departmentName}
            </option>
          ))}
        </select>
      </FinanceField>
      <p className='text-xs text-muted-foreground'>{translate('costCenterActions.createHint')}</p>
    </AdminFormDialog>
  )
}
