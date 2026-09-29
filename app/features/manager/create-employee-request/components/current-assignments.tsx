import { PanelsTopLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { assignedSoftware } from '~/entities/license/employee-assignments-demo'
import { FigmaMark } from '~/entities/software/figma-mark'
import { managerEmployeePreview } from '~/entities/user/manager-employee-preview'

export function CurrentAssignments({ employeeId }: { employeeId?: string }) {
  const { t } = useTranslation()
  const detailed = employeeId === managerEmployeePreview.id
  return (
    <section aria-label={t('createEmployee.assignments')}>
      <h3 className='mb-3 text-sm font-semibold'>
        {detailed
          ? t('createEmployee.assignmentCount', { count: assignedSoftware.length })
          : t('createEmployee.assignments')}
      </h3>
      {detailed ? (
        <ul className='grid gap-4 sm:grid-cols-2'>
          {assignedSoftware.map((software) => (
            <li key={software.id} className='flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3'>
              <span className='flex size-9 items-center justify-center rounded-lg bg-brand-bg text-brand-600'>
                {software.id === 'figma' ? <FigmaMark /> : <PanelsTopLeft size={18} aria-hidden='true' />}
              </span>
              <div>
                <p className='text-sm font-medium'>{software.name}</p>
                <p className='text-xs text-neutral-500'>{software.plan}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className='rounded-lg bg-brand-bg p-4 text-sm text-neutral-500'>
          {t(employeeId ? 'createEmployee.noAssignments' : 'createEmployee.selectForAssignments')}
        </p>
      )}
    </section>
  )
}
