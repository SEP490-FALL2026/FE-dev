import { test, type Locator, type Page } from '@playwright/test'

const FAST = process.env.E2E_FAST === '1'
const MIN_DELAY_MS = Number(process.env.E2E_DELAY_MIN ?? 1000)
const MAX_DELAY_MS = Number(process.env.E2E_DELAY_MAX ?? 2000)

/** Waits 1-2 s (random) so a person can follow the run. E2E_FAST=1 turns it off for quick verification. */
export async function think(page: Page) {
  if (FAST) return
  await page.waitForTimeout(MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS))
}

async function spotlight(target: Locator, on: boolean) {
  await target
    .evaluate((element, enabled) => {
      const node = element as HTMLElement
      if (enabled) {
        node.dataset.e2ePrevOutline = node.style.outline
        node.style.outline = '3px solid #f43f5e'
        node.style.outlineOffset = '2px'
      } else {
        node.style.outline = node.dataset.e2ePrevOutline ?? ''
        delete node.dataset.e2ePrevOutline
      }
    }, on)
    .catch(() => undefined) // The element may already be gone after a click that navigates.
}

async function approach(target: Locator) {
  const page = target.page()
  await target.scrollIntoViewIfNeeded()
  await spotlight(target, true)
  await target.hover() // moves the visible cursor onto the element before the click
  await think(page)
}

/** Highlights the element, moves the cursor to it, waits 1-2 s, then clicks. */
export async function click(target: Locator, label: string) {
  await test.step(`click: ${label}`, async () => {
    await approach(target)
    await target.click()
    await spotlight(target, false)
  })
}

/** Same as click, then types the text key by key so the typing is visible. */
export async function type(target: Locator, text: string, label: string) {
  await test.step(`type: ${label}`, async () => {
    await approach(target)
    await target.click()
    await target.fill('')
    await target.pressSequentially(text, { delay: FAST ? 0 : 60 })
    // A controlled input can drop keys while React re-renders; type the rest in one go rather than submit a wrong value.
    if ((await target.inputValue()) !== text) await target.fill(text)
    await spotlight(target, false)
    await think(target.page())
  })
}

export async function choose(target: Locator, option: string | { label: string }, label: string) {
  await test.step(`select: ${label}`, async () => {
    await approach(target)
    await target.selectOption(option)
    await spotlight(target, false)
  })
}
