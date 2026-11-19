export type FinanceSkeletonShape = 'table' | 'kpis' | 'detail' | 'lines'

const bar = 'animate-pulse rounded-md bg-surface-subtle motion-reduce:animate-none'
const card = 'rounded-xl border border-border/70 bg-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]'

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <div className={`${card} overflow-hidden`}>
      <div className='flex gap-6 border-b border-border/70 bg-surface-subtle/60 px-4 py-3'>
        {[40, 16, 16, 16].map((width, index) => (
          <div key={index} className={`h-3 ${bar}`} style={{ width: `${width}%` }} />
        ))}
      </div>
      <div className='divide-y divide-border/40'>
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className='flex items-center gap-6 px-4 py-3.5' style={{ opacity: 1 - index * 0.12 }}>
            <div className='w-[40%] space-y-1.5'>
              <div className={`h-3.5 w-3/4 ${bar}`} />
              <div className={`h-2.5 w-1/3 ${bar}`} />
            </div>
            <div className={`h-5 w-[16%] ${bar}`} />
            <div className={`h-3.5 w-[16%] ${bar}`} />
            <div className={`h-3.5 w-[16%] ${bar}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

function KpiSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={`${card} space-y-3 p-4`}>
            <div className={`size-9 rounded-lg ${bar}`} />
            <div className={`h-3 w-1/2 ${bar}`} />
            <div className={`h-6 w-3/4 ${bar}`} />
          </div>
        ))}
      </div>
      <div className='grid gap-4 lg:grid-cols-2'>
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className={`${card} space-y-4 p-5`}>
            <div className={`h-4 w-1/3 ${bar}`} />
            <div className={`h-48 ${bar}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className='space-y-5'>
      <div className='grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 sm:grid-cols-3'>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className='space-y-2 bg-surface p-4'>
            <div className={`h-3 w-1/2 ${bar}`} />
            <div className={`h-5 w-2/3 ${bar}`} />
          </div>
        ))}
      </div>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className={`h-4 ${bar}`} style={{ width: `${90 - index * 15}%` }} />
      ))}
    </div>
  )
}

/** Placeholder blocks shaped like the content that is loading, so nothing jumps when data arrives. */
export function FinanceSkeleton({
  rows = 5,
  label,
  shape = 'table'
}: {
  rows?: number
  label: string
  shape?: FinanceSkeletonShape
}) {
  return (
    <div role='status' aria-busy='true'>
      <span className='sr-only'>{label}</span>
      <div aria-hidden>
        {shape === 'table' && <TableSkeleton rows={rows} />}
        {shape === 'kpis' && <KpiSkeleton />}
        {shape === 'detail' && <DetailSkeleton />}
        {shape === 'lines' && (
          <div className='space-y-3'>
            {Array.from({ length: rows }, (_, index) => (
              <div key={index} className={`h-10 ${bar}`} style={{ opacity: 1 - index * 0.18 }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
