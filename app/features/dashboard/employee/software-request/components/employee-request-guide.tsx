import { Check, FileText, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmployeeSection } from '../../shared/components/employee-api-ui'

export function EmployeeRequestGuide({ needsPreview }: { needsPreview: boolean }) {
  const { t: translate } = useTranslation('employee')
  const steps = [
    { title: 'guidePrepare', hint: 'guidePrepareHint', icon: FileText },
    ...(needsPreview ? [{ title: 'guidePreview', hint: 'guidePreviewHint', icon: Search } as const] : []),
    { title: 'guideTrack', hint: 'guideTrackHint', icon: Check }
  ] as const
  return (
    <EmployeeSection title={translate('redesign.requestGuide')}>
      <ol className='space-y-5'>
        {steps.map(({ title, hint, icon: Icon }) => (
          <li key={title} className='flex items-start gap-3'>
            <span className='grid size-8 shrink-0 place-items-center rounded-md bg-primary-soft/50 text-primary-ink'>
              <Icon aria-hidden strokeWidth={1.5} className='size-4' />
            </span>
            <div>
              <p className='text-sm font-medium'>{translate(`redesign.${title}`)}</p>
              <p className='mt-1.5 text-sm leading-relaxed text-muted-foreground'>{translate(`redesign.${hint}`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </EmployeeSection>
  )
}
