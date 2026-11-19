/** Placeholder blocks that reserve the final layout while data loads (no layout shift on arrival). */
export function ApprovalsSkeleton({ rows = 3, label }: { rows?: number; label: string }) {
  return (
    <div role='status' aria-busy='true' className='space-y-3'>
      <span className='sr-only'>{label}</span>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          aria-hidden
          className='h-10 animate-pulse rounded-md bg-surface-subtle motion-reduce:animate-none'
          style={{ opacity: 1 - index * 0.18 }}
        />
      ))}
    </div>
  )
}
