type SummaryMetric = {
  label: string
  value: string | number
}

export function ManagerSummaryStrip({ metrics }: { metrics: readonly SummaryMetric[] }) {
  return (
    <div className='grid gap-3 sm:grid-cols-3'>
      {metrics.map((metric) => (
        <div className='rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm' key={metric.label}>
          <p className='text-sm font-medium text-muted-foreground'>{metric.label}</p>
          <p className='mt-2 text-2xl font-extrabold tracking-tight text-foreground'>{metric.value}</p>
        </div>
      ))}
    </div>
  )
}
