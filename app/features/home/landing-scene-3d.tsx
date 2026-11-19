import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { LandingVisual } from './landing-visual'
import './landing-scene/landing-scene.css'

/**
 * Interactive 3D hero (three.js, loaded lazily so the landing text paints first). Falls back to the 2D LandingVisual
 * when WebGL is unavailable or the scene fails to start.
 */
export function LandingScene3d() {
  const container = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion() ?? false
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')

  useEffect(() => {
    let disposed = false
    let cleanup: (() => void) | undefined
    let themeObserver: MutationObserver | undefined
    import('./landing-scene/create-landing-scene')
      .then(({ createLandingScene }) => {
        if (disposed || !container.current) return
        const scene = createLandingScene(container.current, reducedMotion)
        themeObserver = new MutationObserver(scene.refreshTheme)
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
        cleanup = scene.dispose
        setState('ready')
      })
      .catch(() => {
        if (!disposed) setState('failed')
      })
    return () => {
      disposed = true
      themeObserver?.disconnect()
      cleanup?.()
    }
  }, [reducedMotion])

  if (state === 'failed') return <LandingVisual />

  return (
    <div className='landing-scene relative mx-auto aspect-square w-full max-w-full min-w-0 select-none sm:max-w-[600px] lg:max-w-none'>
      <div aria-hidden='true' className='landing-scene-glow pointer-events-none absolute inset-[8%] rounded-full' />
      <div
        ref={container}
        aria-hidden='true'
        className={`absolute inset-0 transition-opacity duration-700 ${state === 'ready' ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
