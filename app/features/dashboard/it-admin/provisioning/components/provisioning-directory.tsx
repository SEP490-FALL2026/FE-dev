import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { itButtonClass } from '../../shared/components/it-form'
import { provisioningMembersQueryOptions, useProvisioningDepartments } from '../hooks/use-provisioning-departments'
import { ProvisioningGrantQueue } from './provisioning-grant-queue'
import { ItDepartmentCards } from '../../shared/components/it-department-cards'

export function ProvisioningDirectory({ onCreated }: { onCreated: (id: string) => void }) {
  const { t } = useTranslation('itProvisioning')
  const { departments } = useProvisioningDepartments()
  const [department, setDepartment] = useState<{ id: string; name: string }>()
  const [employee, setEmployee] = useState<{ id: string; fullName: string }>()
  const members = useQuery({ ...provisioningMembersQueryOptions(department?.id ?? ''), enabled: !!department })
  if (department && employee)
    return (
      <section className='space-y-4'>
        <button type='button' className={itButtonClass} onClick={() => setEmployee(undefined)}>
          {t('directory.backMembers')}
        </button>
        <header>
          <p className='text-sm text-muted-foreground'>{department.name}</p>
          <h2 className='section-accent text-lg font-semibold tracking-tight'>{employee.fullName}</h2>
        </header>
        <ProvisioningGrantQueue
          key={`${department.id}-${employee.id}`}
          onCreated={onCreated}
          context={{ departmentId: department.id, employeeId: employee.id }}
        />
      </section>
    )
  if (department)
    return (
      <section className='space-y-4'>
        <button type='button' className={itButtonClass} onClick={() => setDepartment(undefined)}>
          {t('directory.backDepartments')}
        </button>
        <header>
          <h2 className='section-accent text-lg font-semibold tracking-tight'>{department.name}</h2>
          <p className='text-sm text-muted-foreground'>{t('directory.chooseEmployee')}</p>
        </header>
        <ItQueryState query={members}>
          {members.data?.length ? (
            <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
              {members.data.map((item) => (
                <button
                  key={item.id}
                  type='button'
                  className='block w-full p-4 text-left hover:bg-muted/40'
                  onClick={() => setEmployee(item)}
                >
                  <span className='font-medium'>{item.fullName}</span>
                  <span className='ml-2 text-sm text-muted-foreground'>{item.code}</span>
                </button>
              ))}
            </div>
          ) : (
            <ItEmpty />
          )}
        </ItQueryState>
      </section>
    )
  return (
    <section className='space-y-4'>
      <h2 className='section-accent text-lg font-semibold tracking-tight'>{t('directory.chooseDepartment')}</h2>
      <ItQueryState query={departments}>
        {departments.data?.length ? (
          <ItDepartmentCards items={departments.data} onSelect={setDepartment} />
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
    </section>
  )
}
