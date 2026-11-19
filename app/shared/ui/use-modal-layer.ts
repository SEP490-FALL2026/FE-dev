import { createContext, useContext, useEffect, type RefObject } from 'react'

export const ModalLayerDepth = createContext(0)

type Layer = { element: HTMLElement; depth: number; order: number }
const layers = new Set<Layer>()
const originalInert = new Map<HTMLElement, boolean>()
let originalOverflow = ''
let order = 0

function topLayer() {
  return [...layers].sort((left, right) => right.depth - left.depth || right.order - left.order)[0]
}

function synchronizeLayers() {
  const top = topLayer()
  if (!top) {
    originalInert.forEach((inert, element) => element.toggleAttribute('inert', inert))
    originalInert.clear()
    document.body.style.overflow = originalOverflow
    return
  }
  for (const element of document.body.children) {
    if (!(element instanceof HTMLElement)) continue
    if (!originalInert.has(element)) originalInert.set(element, element.hasAttribute('inert'))
    element.toggleAttribute('inert', element !== top.element)
  }
}

/** Modal roots must be portaled directly into document.body. */
export function useModalLayer(layerRef: RefObject<HTMLElement | null>, enabled = true) {
  const depth = useContext(ModalLayerDepth)
  useEffect(() => {
    const element = layerRef.current
    if (!enabled || !element) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    if (!layers.size) originalOverflow = document.body.style.overflow
    const layer = { element, depth, order: order++ }
    layers.add(layer)
    document.body.style.overflow = 'hidden'
    synchronizeLayers()
    if (topLayer() === layer) element.querySelector<HTMLElement>('[role="dialog"]')?.focus()
    return () => {
      const wasTop = topLayer() === layer
      layers.delete(layer)
      synchronizeLayers()
      if (!wasTop) return
      if (previousFocus?.isConnected && !previousFocus.closest('[inert]')) previousFocus.focus()
      else topLayer()?.element.querySelector<HTMLElement>('[role="dialog"]')?.focus()
    }
  }, [depth, enabled, layerRef])
  return depth
}
