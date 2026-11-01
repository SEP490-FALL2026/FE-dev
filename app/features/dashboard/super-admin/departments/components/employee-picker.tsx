import { useTranslation } from 'react-i18next'
import { AdminField } from '../../shared/components/admin-form'
import { EmployeeLookup } from '../../shared/components/employee-lookup'

/** The server checks membership and eligibility on the selected effective date. */
export function EmployeePicker({ name, itAdmin = false, initialId = '', initialLabel = '', optional = false }: {
  name: string
  itAdmin?: boolean
  initialId?: string
  initialLabel?: string
  optional?: boolean
}) {
  const { t: translate } = useTranslation('adminOrganization')
  return (
    <section className='grid gap-3'>
      <AdminField label={translate(itAdmin ? 'itAdminId' : 'employeeId')}>
        <EmployeeLookup name={name} required={!optional} initial={initialId} initialLabel={initialLabel}
          purpose={itAdmin ? 'itAdmin' : 'leadership'} initiallyOpen />
      </AdminField>
      <p className='text-sm text-muted-foreground'>{translate(itAdmin ? 'itAdminHelp' : 'candidateHelp')}</p>
    </section>
  )
}
