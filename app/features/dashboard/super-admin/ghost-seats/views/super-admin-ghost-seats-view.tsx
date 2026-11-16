import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { adminButtonClass } from '../../shared/components/admin-form'
import { Thresholds } from '../components/thresholds'
import { Decisions } from '../components/decisions'
import { Runs } from '../components/runs'
import { RunSkips } from '../components/run-skips'

const sections = ['thresholds', 'decisions', 'runs'] as const
export function SuperAdminGhostSeatsView() {
  const { t: translate } = useTranslation('admin')
  const [params, setParams] = useSearchParams()
  const section = sections.find((key) => key === params.get('section')) ?? 'thresholds'
  const runId = params.get('runId')
  const openRun = (id: string | null) =>
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('section', 'runs')
      if (id) next.set('runId', id)
      else next.delete('runId')
      return next
    })
  if (runId && section === 'runs') return <RunSkips id={runId} onBack={() => openRun(null)} />
  return (
    <div className='space-y-5'>
      <header>
        <h1 className='text-2xl font-semibold tracking-tight'>{translate('ghostSeats.title')}</h1>
        <p className='mt-2 text-sm text-muted-foreground'>{translate('ghostSeats.subtitle')}</p>
      </header>
      <nav aria-label={translate('ghostSeats.title')} className='flex flex-wrap gap-2'>
        {sections.map((key) => (
          <button
            key={key}
            type='button'
            aria-current={key === section ? 'page' : undefined}
            aria-pressed={key === section}
            className={adminButtonClass}
            onClick={() =>
              setParams((previous) => {
                const next = new URLSearchParams(previous)
                next.set('section', key)
                next.delete('runId')
                return next
              })
            }
          >
            {translate(`ghostSeats.sections.${key}`)}
          </button>
        ))}
      </nav>
      {section === 'thresholds' && <Thresholds />}
      {section === 'decisions' && <Decisions />}
      {section === 'runs' && <Runs onOpenRun={openRun} />}
    </div>
  )
}
