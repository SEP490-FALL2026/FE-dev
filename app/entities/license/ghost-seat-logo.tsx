import { Code2, MessageSquare, PanelsTopLeft, Video } from 'lucide-react'
import { FigmaMark } from '~/entities/software/figma-mark'
import type { GhostSeat } from './ghost-seats-demo'

export function GhostSeatLogo({ seat, large = false }: { seat: GhostSeat; large?: boolean }) {
  return (
    <span
      aria-hidden='true'
      className={`flex shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-brand-bg text-brand-600 ${large ? 'size-14' : 'size-8'}`}
    >
      {seat.id === 'figma' ? (
        <FigmaMark />
      ) : seat.id === 'github' ? (
        <Code2 size={large ? 28 : 18} />
      ) : seat.id === 'zoom' ? (
        <Video size={large ? 28 : 18} />
      ) : seat.id === 'slack' ? (
        <MessageSquare size={large ? 28 : 18} />
      ) : (
        <PanelsTopLeft size={large ? 28 : 18} />
      )}
    </span>
  )
}
