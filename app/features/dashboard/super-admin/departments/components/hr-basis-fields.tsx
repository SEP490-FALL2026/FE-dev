import { useTranslation } from 'react-i18next'
import type { CreateDepartmentBodyDtoHrBasis } from '~/shared/api/generated/model'
import { AdminField, adminInputClass } from '../../shared/components/admin-form'

export function HrBasisFields() {
  const { t: translate } = useTranslation('adminOrganization')
  return (
    <section className='grid gap-4 border-t border-border pt-4'>
      <h3 className='font-semibold'>{translate('hrBasis')}</h3>
      {(['type', 'reference', 'issuer', 'issuedOn'] as const).map((field) => (
        <AdminField key={field} label={translate(`basis.${field}`)}>
          <input
            className={adminInputClass}
            name={`basis-${field}`}
            required
            type={field === 'issuedOn' ? 'date' : 'text'}
            maxLength={field === 'type' ? 100 : field === 'issuedOn' ? undefined : 200}
            pattern={field === 'issuedOn' ? undefined : '.*\\S.*'}
          />
        </AdminField>
      ))}
    </section>
  )
}

export function readHrBasis(form: FormData): CreateDepartmentBodyDtoHrBasis {
  return {
    type: String(form.get('basis-type') ?? '').trim(),
    reference: String(form.get('basis-reference') ?? '').trim(),
    issuer: String(form.get('basis-issuer') ?? '').trim(),
    issuedOn: String(form.get('basis-issuedOn') ?? '')
  }
}
