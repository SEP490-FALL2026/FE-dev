import { useTranslation } from 'react-i18next'
import { ManagerField, managerInputClass } from '../../shared/components/manager-api-ui'
import type { ManagerChoice } from '../../shared/components/manager-choice-select'

export function ManagerMemberReasons({
  people,
  required,
  reasons,
  onChange
}: {
  people: readonly ManagerChoice[]
  required: readonly string[]
  reasons: Record<string, string>
  onChange: (employeeId: string, reason: string) => void
}) {
  const { t } = useTranslation('manager')
  const { t: flow } = useTranslation('requestFlow')
  const visible = people.filter((person) => required.includes(person.value) || !!reasons[person.value])
  if (!visible.length) return null
  return (
    <section aria-label={t('requestUx.memberReasons')} className='space-y-4 border-t border-border/60 pt-4'>
      <div className='space-y-1'>
        <h3 className='text-sm font-semibold'>{t('requestUx.memberReasons')}</h3>
        <p className='text-sm text-muted-foreground'>{t('requestUx.memberReasonsHint')}</p>
      </div>
      {visible.map((person) => (
        <ManagerField key={person.value} label={`${person.label}: ${flow('manyReason')}`}>
          <textarea
            className={managerInputClass}
            rows={2}
            maxLength={1000}
            name={`lines.${people.indexOf(person)}.manyPaidSoftwareReason`}
            required={required.includes(person.value)}
            value={reasons[person.value] ?? ''}
            onChange={(event) => onChange(person.value, event.target.value)}
          />
        </ManagerField>
      ))}
    </section>
  )
}
