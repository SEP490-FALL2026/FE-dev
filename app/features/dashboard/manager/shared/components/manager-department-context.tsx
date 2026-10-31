import { useTranslation } from 'react-i18next'
import { Building2, Link2 } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { ManagerButton, ManagerField, managerInputClass } from './manager-api-ui'
import { resourceIdPattern } from '../manager-identifiers'

export function ManagerDepartmentContext({ name }: { name?: string }) {
  const { t: translate } = useTranslation('manager')
  const [params, setParams] = useSearchParams()
  return (
    <details className='rounded-lg border border-border/60 bg-surface p-4'>
      <summary className='cursor-pointer text-sm font-medium'>
        <span className='ml-1 inline-flex items-center gap-2'>
          <Building2 aria-hidden strokeWidth={1.5} className='size-4 text-primary-ink' />
          {params.get('departmentId') ? translate('departmentConnected') : translate('connectDepartment')}
          {name && <span className='font-normal text-muted-foreground'> · {name}</span>}
        </span>
      </summary>
      {!params.get('departmentId') && (
        <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>{translate('departmentSetupHint')}</p>
      )}
      <p className='mt-3 max-w-2xl text-sm text-muted-foreground'>{translate('departmentHint')}</p>
      <form
        className='mt-4 flex flex-wrap items-start gap-3'
        onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          setParams((previous) => {
            const next = new URLSearchParams(previous)
            next.set('departmentId', String(form.get('departmentId')).trim())
            next.delete('page')
            next.delete('search')
            return next
          })
        }}
      >
        <div className='w-full max-w-md'>
          <ManagerField label={translate('departmentId')}>
            <input
              key={params.get('departmentId')}
              name='departmentId'
              required
              pattern={resourceIdPattern}
              defaultValue={params.get('departmentId') ?? ''}
              className={managerInputClass}
            />
          </ManagerField>
        </div>
        <div className='pt-7'>
          <ManagerButton type='submit'>
            <Link2 aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('open')}
          </ManagerButton>
        </div>
      </form>
    </details>
  )
}
