import { Lightbulb, RefreshCw, RotateCcw, UserRound, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { RequestMode } from '../hooks/use-live-request-form'

const modes = [
  { key: 'individual', icon: UserRound },
  { key: 'group', icon: UsersRound },
  { key: 'proposal', icon: Lightbulb },
  { key: 'renewal', icon: RefreshCw },
  { key: 'return', icon: RotateCcw }
] as const

export function EmployeeRequestModeNav({
  mode,
  onChange
}: {
  mode: RequestMode
  onChange: (mode: RequestMode) => void
}) {
  const { t } = useTranslation('employee')
  return (
    <nav aria-label={t('mode')}>
      <div className='inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-border/60 bg-surface-subtle/60 p-1'>
        {modes.map(({ key, icon: Icon }) => (
          <button
            key={key}
            type='button'
            aria-pressed={mode === key}
            onClick={() => onChange(key)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-4 ${mode === key ? 'bg-surface text-primary-ink shadow-sm ring-1 ring-border/70' : 'text-muted-foreground hover:bg-surface hover:text-foreground'}`}
          >
            <Icon aria-hidden='true' className='size-4 shrink-0' strokeWidth={1.75} />
            {t(key)}
          </button>
        ))}
      </div>
    </nav>
  )
}
