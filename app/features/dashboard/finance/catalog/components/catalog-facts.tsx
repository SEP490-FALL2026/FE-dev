import type { ReactNode } from 'react'

/** A short list of labelled facts, in columns that wrap: the read-only body of a catalog detail. */
export function CatalogFacts({ rows }: { rows: readonly (readonly [string, ReactNode])[] }) {
  return (
    <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-2'>
      {rows.map(([label, value]) => (
        <div key={label} className='min-w-0'>
          <dt className='text-xs font-medium text-muted-foreground'>{label}</dt>
          <dd className='mt-1 text-sm wrap-break-word whitespace-pre-wrap text-foreground'>{value}</dd>
        </div>
      ))}
    </dl>
  )
}
