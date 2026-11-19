import type { BrowserContext } from '@playwright/test'

/**
 * Playwright drives the page without a visible pointer. This script draws one (a red dot that glides to each target),
 * a ripple on every click and a small caption naming what was clicked or typed into, so a person watching the headed
 * browser can see which button or field the test is using. It runs in every page of the context, after each navigation.
 */
function installCursor() {
  if (window.top !== window) return

  const describe = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return ''
    const element =
      target.closest('button, a, input, select, textarea, [role="button"], [role="tab"], [role="menuitem"], label') ??
      target
    const field = element as HTMLInputElement
    const labelled = field.id ? document.querySelector(`label[for="${CSS.escape(field.id)}"]`)?.textContent : ''
    const text =
      element.getAttribute('aria-label') ||
      labelled ||
      field.placeholder ||
      (element.textContent ?? '').trim().replace(/\s+/g, ' ') ||
      element.tagName.toLowerCase()
    return `${element.tagName.toLowerCase()}: ${text.slice(0, 60)}`
  }

  const mount = () => {
    if (document.getElementById('__e2e_cursor')) return
    const style = document.createElement('style')
    style.textContent = `
      #__e2e_cursor{position:fixed;top:0;left:0;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;
        background:rgba(244,63,94,.35);border:2px solid #f43f5e;pointer-events:none;z-index:2147483647;
        transition:transform .45s cubic-bezier(.2,.8,.2,1)}
      #__e2e_cursor::after{content:'';position:absolute;left:50%;top:50%;width:4px;height:4px;margin:-2px 0 0 -2px;
        border-radius:50%;background:#f43f5e}
      .__e2e_ripple{position:fixed;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;
        border:3px solid #f43f5e;pointer-events:none;z-index:2147483646;animation:__e2e_ping .7s ease-out forwards}
      @keyframes __e2e_ping{to{transform:scale(5);opacity:0}}
      #__e2e_caption{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);max-width:70vw;padding:6px 12px;
        border-radius:6px;background:rgba(17,24,39,.92);color:#fff;font:600 13px/1.3 ui-monospace,monospace;
        pointer-events:none;z-index:2147483647;opacity:0;transition:opacity .15s}`
    document.head.append(style)
    const cursor = document.createElement('div')
    cursor.id = '__e2e_cursor'
    const caption = document.createElement('div')
    caption.id = '__e2e_caption'
    document.body.append(cursor, caption)

    let hideCaption: number | undefined
    const say = (text: string) => {
      caption.textContent = text
      caption.style.opacity = '1'
      window.clearTimeout(hideCaption)
      hideCaption = window.setTimeout(() => (caption.style.opacity = '0'), 1800)
    }

    document.addEventListener(
      'mousemove',
      (event) => {
        cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`
      },
      true
    )
    document.addEventListener(
      'mousedown',
      (event) => {
        const ripple = document.createElement('div')
        ripple.className = '__e2e_ripple'
        ripple.style.left = `${event.clientX}px`
        ripple.style.top = `${event.clientY}px`
        document.body.append(ripple)
        window.setTimeout(() => ripple.remove(), 800)
        say(`click  ${describe(event.target)}`)
      },
      true
    )
    document.addEventListener('input', (event) => say(`type   ${describe(event.target)}`), true)
  }

  if (document.body) mount()
  else document.addEventListener('DOMContentLoaded', mount, { once: true })
}

export async function installVisibleCursor(context: BrowserContext) {
  await context.addInitScript(installCursor)
}
