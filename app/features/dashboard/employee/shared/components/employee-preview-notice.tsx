import { Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export function EmployeePreviewNotice({ children }: { children: ReactNode }) {
  const { t } = useTranslation('dashboard')

  return (
    <div
      className='flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-soft/40 p-4 text-sm text-foreground'
      role='note'
    >
      <Info aria-hidden='true' className='mt-0.5 size-5 shrink-0 text-primary-ink' />
      <div>
        <p className='font-bold'>{t('employee.preview.title')}</p>
        <p className='mt-1 text-muted-foreground'>{children}</p>
      </div>
    </div>
  )
}
