import { useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { getBudgetCycleBaselineQueryKey } from '~/shared/api/generated/operations/budget-cycles'
import { getCostCenterListQueryKey, useCostCenterCreate } from '~/shared/api/generated/operations/cost-centers'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { getFinanceErrorCode } from '../../shared/finance-errors'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import {
  COST_CENTER_CODE_MAX,
  COST_CENTER_CODE_PATTERN,
  COST_CENTER_NAME_MAX,
  isReservedCostCenterName,
  normalizeCostCenterName,
  suggestCostCenterCode
} from '../cost-center-naming'
import { useFinanceDepartments } from '../hooks/use-finance-departments'

type Field = 'code' | 'name' | 'department'
type ServerMessage = 'codeTaken' | 'nameReserved' | 'nameInvalid' | 'departmentLinked'

/** BE answers that belong to one field are shown at that field instead of a toast. */
const serverMessages: Partial<Record<string, { field: Field; message: ServerMessage }>> = {
  'COST_CENTER.CODE_TAKEN': { field: 'code', message: 'codeTaken' },
  'COST_CENTER.NAME_RESERVED': { field: 'name', message: 'nameReserved' },
  'COST_CENTER.NAME_INVALID': { field: 'name', message: 'nameInvalid' },
  'COST_CENTER.DEPARTMENT_ALREADY_LINKED': { field: 'department', message: 'departmentLinked' }
}

/** A Cost Center is always of kind UNIT, so the kind is not asked. It becomes the current one of its department. */
export function CostCenterCreateDialog({ onClose }: { onClose: () => void }) {
  const { t: translate } = useTranslation('financeSettings')
  const queryClient = useQueryClient()
  const { departments, isPending, noCycle, year } = useFinanceDepartments()
  const [departmentId, setDepartmentId] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [codeEdited, setCodeEdited] = useState(false)
  const [nameEdited, setNameEdited] = useState(false)
  const [serverError, setServerError] = useState<{ field: Field; message: ServerMessage } | null>(null)

  const feedback = useFinanceFeedback([getCostCenterListQueryKey(), getBudgetCycleBaselineQueryKey(year)], onClose)
  const create = useCostCenterCreate({
    mutation: {
      onSuccess: feedback.onSuccess,
      onError: async (error: unknown) => {
        const known = serverMessages[getFinanceErrorCode(error)]
        if (!known) return feedback.onError(error)
        setServerError(known)
        if (known.field === 'department') {
          // The department already has a Cost Center: reload the list so it drops out of the choices.
          setDepartmentId('')
          await queryClient.invalidateQueries({ queryKey: getBudgetCycleBaselineQueryKey(year) })
        }
      }
    }
  })

  const codeValue = code.trim()
  const nameValue = normalizeCostCenterName(name)
  const codeError =
    codeValue && (!COST_CENTER_CODE_PATTERN.test(codeValue) || codeValue.length > COST_CENTER_CODE_MAX)
      ? translate('costCenterActions.codeInvalid')
      : serverError?.field === 'code'
        ? translate(`costCenterActions.${serverError.message}`)
        : null
  const nameError =
    nameValue && isReservedCostCenterName(nameValue)
      ? translate('costCenterActions.nameReserved')
      : serverError?.field === 'name'
        ? translate(`costCenterActions.${serverError.message}`)
        : null
  const valid =
    Boolean(departmentId) &&
    codeValue.length >= 1 &&
    COST_CENTER_CODE_PATTERN.test(codeValue) &&
    nameValue.length >= 1 &&
    nameValue.length <= COST_CENTER_NAME_MAX &&
    !isReservedCostCenterName(nameValue)
  const nothingToPick = !isPending && departments.length === 0

  const chooseDepartment = (id: string) => {
    setDepartmentId(id)
    setServerError(null)
    const department = departments.find((item) => item.departmentId === id)
    if (!department) return
    if (!codeEdited) setCode(suggestCostCenterCode(department.departmentCode))
    if (!nameEdited) setName(department.departmentName)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid || create.isPending) return
    setServerError(null)
    create.mutate({ data: { code: codeValue, name: nameValue, kind: 'UNIT', departmentId } })
  }

  return (
    <AdminFormDialog
      title={translate('costCenterActions.createTitle')}
      pending={create.isPending}
      submitLabel={translate('costCenterActions.createSubmit')}
      submitDisabled={!valid || nothingToPick}
      onClose={onClose}
      onSubmit={submit}
    >
      {nothingToPick ? (
        <p role='status' className='rounded-md border border-border/70 bg-surface-subtle p-4 text-sm'>
          {noCycle
            ? translate('costCenterActions.noDepartments', { year })
            : translate('costCenterActions.allLinked', { year })}
        </p>
      ) : (
        <>
          <FinanceField
            label={translate('costCenterActions.department')}
            required
            error={serverError?.field === 'department' ? translate(`costCenterActions.${serverError.message}`) : null}
          >
            <select
              required
              className={financeInputClass}
              value={departmentId}
              onChange={(event) => chooseDepartment(event.target.value)}
            >
              <option value=''>{translate('costCenterActions.pickDepartment')}</option>
              {departments.map((department) => (
                <option key={department.departmentId} value={department.departmentId}>
                  {department.departmentCode} · {department.departmentName}
                </option>
              ))}
            </select>
          </FinanceField>
          <div className='grid gap-3 sm:grid-cols-2'>
            <FinanceField
              label={translate('costCenterActions.code')}
              required
              hint={translate('costCenterActions.codeHint')}
              error={codeError}
            >
              <input
                required
                maxLength={COST_CENTER_CODE_MAX}
                className={`${financeInputClass} font-mono uppercase`}
                value={code}
                onChange={(event) => {
                  setCode(event.target.value.toUpperCase())
                  setCodeEdited(true)
                  if (serverError?.field === 'code') setServerError(null)
                }}
              />
            </FinanceField>
            <FinanceField label={translate('costCenterActions.name')} required error={nameError}>
              <input
                required
                maxLength={COST_CENTER_NAME_MAX}
                className={financeInputClass}
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  setNameEdited(true)
                  if (serverError?.field === 'name') setServerError(null)
                }}
              />
            </FinanceField>
          </div>
          <p role='note' className='text-xs font-medium text-warning-ink'>
            {translate('costCenterActions.createWarning')}
          </p>
        </>
      )}
    </AdminFormDialog>
  )
}
