import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { ManagerQueryState } from '../../shared/components/manager-api-ui'
import type { useSupplementMembers } from '../hooks/use-supplement-members'

export function ManagerSupplementMembers({
  source,
  selected,
  onChange
}: {
  source: ReturnType<typeof useSupplementMembers>
  selected: readonly string[]
  onChange: (ids: string[]) => void
}) {
  const { t } = useTranslation('manager')
  const hintId = useId()
  return (
    <fieldset aria-describedby={hintId} className='space-y-3'>
      <legend className='text-sm font-medium'>{t('dropEmployees')}</legend>
      <p id={hintId} className='text-sm text-muted-foreground'>
        {t('requestUx.dropHint')}
      </p>
      <ManagerQueryState query={source.query} empty={!source.members.length} emptyTitle={t('requestUx.noMembers')} />
      {!source.query.isError && (
        <div className='max-h-72 overflow-y-auto'>
          {source.members.map(({ employee }) => {
            const checked = selected.includes(employee.employeeId)
            return (
              <label
                key={employee.employeeId}
                className='flex min-h-11 cursor-pointer items-center gap-3 border-b border-border/40 px-1 py-2 text-sm'
              >
                <input
                  type='checkbox'
                  checked={checked}
                  disabled={source.query.isFetching || (!checked && selected.length >= source.members.length - 1)}
                  onChange={(event) =>
                    onChange(
                      event.target.checked
                        ? [...selected, employee.employeeId]
                        : selected.filter((id) => id !== employee.employeeId)
                    )
                  }
                />
                <span className='min-w-0'>
                  <span className='block truncate font-medium' title={employee.fullName}>
                    {employee.fullName}
                  </span>
                  <span className='text-xs text-muted-foreground'>{employee.employeeCode}</span>
                </span>
              </label>
            )
          })}
        </div>
      )}
      <p role='status' className='text-xs text-muted-foreground'>
        {t('requestUx.dropCount', { count: selected.length })}
      </p>
    </fieldset>
  )
}
