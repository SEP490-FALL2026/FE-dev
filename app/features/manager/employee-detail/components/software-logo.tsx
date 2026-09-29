import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function SoftwareLogo({ name, url }: { name: string; url: string }) {
  const { t } = useTranslation()
  const [failed, setFailed] = useState(false)
  return (
    <span className='flex size-8 shrink-0 items-center justify-center rounded bg-brand-bg'>
      {failed ? (
        <span aria-hidden='true' className='text-xs font-bold text-brand-600'>
          {name[0]}
        </span>
      ) : (
        <img
          src={url}
          alt={t('employeeDetail.logo', { name })}
          className='size-5 object-contain'
          loading='lazy'
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}
