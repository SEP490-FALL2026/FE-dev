import { ChevronDown, History } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RequestEventTimeline } from './request-event-timeline'

export function RequestHistoryDisclosure({ id }: { id: string }) {
  const { t } = useTranslation('requestFlow')
  const contentId = useId()
  const [expanded, setExpanded] = useState(false)
  const [activated, setActivated] = useState(false)

  return (
    <section className='border-t border-border/60 pt-2'>
      <button
        type='button'
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => {
          setActivated(true)
          setExpanded(!expanded)
        }}
        className='flex min-h-12 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-primary'
      >
        <History aria-hidden strokeWidth={1.5} className='size-4 shrink-0 text-muted-foreground' />
        <span className='min-w-0 flex-1'>{t('timeline')}</span>
        <ChevronDown
          aria-hidden
          strokeWidth={1.5}
          className={`size-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      <div id={contentId} hidden={!expanded} className='px-3 pb-2'>
        {activated && <RequestEventTimeline id={id} bare />}
      </div>
    </section>
  )
}
