import { ChartPie, Cloud, Code2, Diamond, PanelsTopLeft, Hash } from 'lucide-react'

import type { TeamRequest } from './manager-requests-demo'
import { FigmaMark } from '~/entities/software/figma-mark'

const brands = {
  Figma: { icon: PanelsTopLeft, color: 'text-violet-600' },
  GitHub: { icon: Code2, color: 'text-neutral-900' },
  Jira: { icon: Diamond, color: 'text-blue-600' },
  Slack: { icon: Hash, color: 'text-pink-600' },
  'AWS Console': { icon: Cloud, color: 'text-amber-600' },
  Tableau: { icon: ChartPie, color: 'text-blue-700' }
}
export function RequestSoftware({ request, large = false }: { request: TeamRequest; large?: boolean }) {
  const brand = brands[request.software as keyof typeof brands]
  const Icon = brand?.icon ?? Code2
  return (
    <div className='flex items-center gap-2'>
      <span
        className={
          large
            ? 'flex size-16 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-brand-bg'
            : ''
        }
      >
        {request.software === 'Figma' ? (
          <FigmaMark large={large} />
        ) : (
          <Icon
            size={large ? 36 : 21}
            aria-hidden='true'
            className={`shrink-0 ${brand?.color ?? 'text-neutral-500'}`}
          />
        )}
      </span>
      <div>
        <p className={large ? 'text-xl font-bold' : 'font-medium'}>{request.software}</p>
        <p className='mt-0.5 text-xs text-neutral-500'>{request.plan}</p>
      </div>
    </div>
  )
}
