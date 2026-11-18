import { useEffect, useRef, useState, type CSSProperties } from 'react'

import spriteUrl from '~/assets/mascot/sentry-mascot-sprite.webp'
import './sentry-mascot.css'

type MascotMood = 'idle' | 'hop' | 'cheer'

interface SentryMascotProps {
  /** Rendered size in px; the sprite frames are 192px so anything up to ~96px stays sharp on 2x screens. */
  size?: number
  className?: string
  /**
   * Interactive mode renders a button: hover/focus plays the hop reel, click/Enter plays the cheer reel and shows the
   * next message in a speech bubble. Without it the mascot is purely decorative.
   */
  interactive?: {
    label: string
    messages: readonly string[]
  }
  /** Forces one reel, e.g. `hop` while something is loading. */
  mood?: MascotMood
}

const BUBBLE_VISIBLE_MS = 4200

export function SentryMascot({ size = 56, className = '', interactive, mood }: SentryMascotProps) {
  const [pointerMood, setPointerMood] = useState<MascotMood>('idle')
  const [messageIndex, setMessageIndex] = useState<number | null>(null)
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
    },
    []
  )

  const activeMood = mood ?? pointerMood
  const style = { '--mascot-size': `${size}px` } as CSSProperties
  const figure = (
    <>
      <span aria-hidden='true' className='sentry-mascot-stage' />
      <span aria-hidden='true' className='sentry-mascot-shadow' />
      <span aria-hidden='true' className='sentry-mascot-body' style={{ backgroundImage: `url(${spriteUrl})` }} />
    </>
  )

  if (!interactive) {
    return (
      <span aria-hidden='true' className={`sentry-mascot ${className}`} data-mood={activeMood} style={style}>
        {figure}
      </span>
    )
  }

  const messages = interactive.messages
  const cheer = () => {
    setPointerMood('cheer')
    setMessageIndex((current) => (messages.length ? ((current ?? -1) + 1) % messages.length : null))
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
    bubbleTimer.current = setTimeout(() => setMessageIndex(null), BUBBLE_VISIBLE_MS)
  }

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        aria-label={interactive.label}
        className='sentry-mascot sentry-mascot-button'
        data-mood={activeMood}
        onAnimationEnd={(event) => {
          if (event.animationName === 'sentry-mascot-reel' && pointerMood === 'cheer') setPointerMood('idle')
        }}
        onBlur={() => setPointerMood('idle')}
        onClick={cheer}
        onFocus={(event) => {
          if (event.currentTarget.matches(':focus-visible')) setPointerMood('hop')
        }}
        onPointerEnter={() => setPointerMood((current) => (current === 'cheer' ? current : 'hop'))}
        onPointerLeave={() => setPointerMood((current) => (current === 'cheer' ? current : 'idle'))}
        style={style}
        type='button'
      >
        {figure}
      </button>
      <span aria-live='polite' className='sr-only'>
        {messageIndex === null ? '' : messages[messageIndex]}
      </span>
      {messageIndex !== null && (
        <span aria-hidden='true' className='sentry-mascot-bubble' data-align='start' style={style}>
          {messages[messageIndex]}
        </span>
      )}
    </span>
  )
}
