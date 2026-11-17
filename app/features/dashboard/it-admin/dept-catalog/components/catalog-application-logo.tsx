import { useState } from 'react'

export function CatalogApplicationLogo({ name, url }: { name: string; url: string | null }) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      aria-hidden='true'
      className='grid size-11 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-surface-subtle font-semibold'
    >
      {url && !failed ? (
        <img src={url} alt='' className='size-full object-contain p-1' onError={() => setFailed(true)} />
      ) : (
        name.trim().charAt(0).toLocaleUpperCase()
      )}
    </div>
  )
}
