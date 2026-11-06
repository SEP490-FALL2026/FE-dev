import type { ReactNode } from 'react'

export interface RenewalFact {
  key: string
  label: string
  value: ReactNode
  /** Numbers, dates and identifiers align right in a monospace face. */
  numeric?: boolean
}

/** Label/value pairs in a bordered panel; long free text wraps instead of breaking the grid. */
export function RenewalFacts({ facts }: { facts: RenewalFact[] }) {
  return (
    <dl className='grid gap-x-6 gap-y-3 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-2'>
      {facts.map((fact) => (
        <div key={fact.key} className='flex min-w-0 items-start justify-between gap-4 text-sm'>
          <dt className='shrink-0 text-muted-foreground'>{fact.label}</dt>
          <dd
            className={`min-w-0 text-right break-words ${fact.numeric ? 'font-mono tabular-nums' : 'text-foreground'}`}
          >
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** Free text from the API (notes, reasons, opinions) keeps its line breaks. */
export function RenewalText({ label, text, hint }: { label: string; text: string; hint?: string }) {
  return (
    <div className='space-y-1 rounded-lg border border-border/70 bg-surface p-4 text-sm'>
      <p className='font-medium text-foreground'>{label}</p>
      {hint && <p className='text-xs text-muted-foreground'>{hint}</p>}
      <p className='whitespace-pre-wrap break-words text-foreground [text-wrap:pretty]'>{text}</p>
    </div>
  )
}
