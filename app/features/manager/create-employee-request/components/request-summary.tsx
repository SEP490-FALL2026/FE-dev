import { FileText, Lightbulb } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TeamMember } from '~/entities/user/team-member.types'

export function RequestSummary({ employee }: { employee?: TeamMember }) {
  const { t } = useTranslation()
  return (
    <aside aria-label={t('createEmployee.summary')} className='space-y-6'>
      <section className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'>
        <h2 className='mb-5 flex items-center gap-2 font-bold'>
          <FileText size={18} aria-hidden='true' className='text-neutral-500' />
          {t('createEmployee.summary')}
        </h2>
        <dl className='divide-y divide-neutral-200 text-sm'>
          {(['employee', 'software', 'plan', 'type', 'from', 'until', 'reason', 'project', 'costCenter'] as const).map(
            (key) => (
              <div key={key} className='flex flex-wrap items-start justify-between gap-3 py-3'>
                <dt className='text-neutral-500'>{t(`createEmployee.fields.${key}`)}</dt>
                <dd className='max-w-48 text-right font-medium'>
                  {key === 'employee' && employee ? employee.name : t('createEmployee.unset')}
                </dd>
              </div>
            )
          )}
        </dl>
      </section>
      <section className='flex items-start gap-3 rounded-lg border border-brand-200 bg-brand-bg p-4'>
        <Lightbulb size={18} aria-hidden='true' className='mt-0.5 shrink-0 text-brand-600' />
        <div>
          <h2 className='text-sm font-semibold'>{t('createEmployee.note')}</h2>
          <p className='mt-2 text-sm leading-relaxed text-neutral-500'>{t('createEmployee.noteHint')}</p>
        </div>
      </section>
    </aside>
  )
}
