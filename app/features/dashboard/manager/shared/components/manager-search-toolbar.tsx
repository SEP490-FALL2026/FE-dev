import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { ManagerButton, managerInputClass } from './manager-api-ui'

export function ManagerSearchToolbar({
  label,
  placeholder,
  queryKey = 'search',
  disabled = false
}: {
  label: string
  placeholder: string
  queryKey?: string
  disabled?: boolean
}) {
  const { t: translate } = useTranslation('manager')
  const [params, setParams] = useSearchParams()
  const value = params.get(queryKey) ?? ''
  const update = (search: string) =>
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      if (search.trim()) next.set(queryKey, search.trim())
      else next.delete(queryKey)
      next.delete('page')
      return next
    })
  return (
    <form
      role='search'
      aria-label={translate('search')}
      className='flex flex-wrap items-center gap-2'
      onSubmit={(event) => {
        event.preventDefault()
        update(String(new FormData(event.currentTarget).get('query') ?? ''))
      }}
    >
      <div className='relative min-w-0 flex-1 sm:max-w-xl'>
        <Search
          aria-hidden
          strokeWidth={1.5}
          className='pointer-events-none absolute top-3 left-3 size-5 text-muted-foreground'
        />
        <input
          key={value}
          type='search'
          name='query'
          aria-label={label}
          placeholder={placeholder}
          defaultValue={value}
          disabled={disabled}
          maxLength={100}
          className={`${managerInputClass} pl-10`}
        />
      </div>
      <ManagerButton type='submit' disabled={disabled}>
        {translate('search')}
      </ManagerButton>
      {value && (
        <ManagerButton disabled={disabled} onClick={() => update('')}>
          <X aria-hidden strokeWidth={1.5} className='size-4' />
          {translate('clearSearch')}
        </ManagerButton>
      )}
    </form>
  )
}
