/** A table cell with the main value and an optional muted second line, so one column can carry two facts. */
export function PrimaryWithDetail({ primary, detail }: { primary: string; detail?: string | null }) {
  return (
    <div className='min-w-0'>
      <p className='truncate text-foreground' title={primary}>
        {primary}
      </p>
      {detail && (
        <p className='truncate text-xs text-muted-foreground' title={detail}>
          {detail}
        </p>
      )}
    </div>
  )
}
