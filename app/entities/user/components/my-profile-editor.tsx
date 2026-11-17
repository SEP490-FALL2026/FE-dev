import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserRound } from 'lucide-react'
import { getMeGetQueryKey, useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { meAvatarPut } from '~/shared/api/generated/operations/profile/me-avatar-put'
import { meAvatarDelete } from '~/shared/api/generated/operations/profile/me-avatar-delete'
import { meProfilePatch } from '~/shared/api/generated/operations/profile/me-profile-patch'
import { useApiWrite } from '~/shared/api/use-api-write'
import { toast } from 'sonner'

export function MyProfileEditor() {
  const { t } = useTranslation('common')
  const me = useMeGet()
  const user = !me.isError ? me.data?.data : null
  const [phone, setPhone] = useState<string | null>(null)
  const [phoneInvalid, setPhoneInvalid] = useState(false)
  const [brokenUrl, setBrokenUrl] = useState<string>()
  const action = useApiWrite({
    mutationFn: async (change: { file: File } | { remove: true } | { workPhone: string }) => {
      if ('file' in change) {
        await meAvatarPut(change)
        return { phoneChanged: false as const }
      }
      if ('remove' in change) {
        await meAvatarDelete()
        return { phoneChanged: false as const }
      }
      const result = await meProfilePatch({ workPhone: change.workPhone.trim() || null })
      return { phoneChanged: true as const, workPhone: result.data?.workPhone }
    },
    invalidate: [getMeGetQueryKey()],
    onSuccess: (result) => {
      if (result.phoneChanged) {
        setPhone(result.workPhone ?? null)
        setPhoneInvalid(false)
      }
    },
    onError: (code) => {
      if (code === 'PROFILE.WORK_PHONE_INVALID') setPhoneInvalid(true)
    },
    errorMessage: (code) => {
      if (code === 'PROFILE.WORK_PHONE_INVALID') return t('selfService.phoneInvalid')
      if (code === 'PROFILE.AVATAR_TOO_LARGE') return t('selfService.avatarSize')
      if (code.startsWith('PROFILE.AVATAR_')) return t('selfService.avatarType')
    }
  })
  if (!user) return null
  const url = user.avatar?.url
  return (
    <section className='space-y-5 border-t border-border/50 pt-5' aria-label={t('selfService.editProfile')}>
      <div className='flex flex-wrap items-center gap-4'>
        <span className='grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-soft text-primary-ink'>
          {url && url !== brokenUrl ? (
            <img src={url} alt='' className='size-full object-cover' onError={() => setBrokenUrl(url)} />
          ) : (
            <UserRound aria-hidden strokeWidth={1.5} className='size-7' />
          )}
        </span>
        <div className='space-y-2'>
          <label className='inline-flex min-h-11 cursor-pointer items-center rounded-md border border-border px-4 text-sm hover:bg-surface-subtle focus-within:outline-2 focus-within:outline-primary'>
            {t('selfService.changeAvatar')}
            <input
              type='file'
              accept='image/png,image/jpeg,image/webp'
              className='sr-only'
              disabled={action.blocked}
              onChange={(event) => {
                const file = event.target.files?.[0]
                event.target.value = ''
                if (!file) return
                if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || !file.size) {
                  toast.error(t('selfService.avatarType'))
                  return
                }
                if (file.size > 1024 * 1024) {
                  toast.error(t('selfService.avatarSize'))
                  return
                }
                action.mutate({ file })
              }}
            />
          </label>
          {url && (
            <button
              type='button'
              className='ml-2 min-h-11 px-3 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50'
              disabled={action.blocked}
              onClick={() => action.mutate({ remove: true })}
            >
              {t('selfService.removeAvatar')}
            </button>
          )}
          <p className='text-xs text-muted-foreground'>{t('selfService.avatarHint')}</p>
        </div>
      </div>
      <form
        className='max-w-md space-y-2'
        onSubmit={(event) => {
          event.preventDefault()
          const value = phone ?? user.workPhone ?? ''
          const invalid = !!value.trim() && !/^\+?\d{8,15}$/.test(value.replace(/[ .-]/g, ''))
          setPhoneInvalid(invalid)
          if (!invalid) action.mutate({ workPhone: value })
        }}
      >
        <label htmlFor='my-work-phone' className='block text-sm font-medium'>
          {t('selfService.workPhone')}
        </label>
        <input
          id='my-work-phone'
          type='tel'
          autoComplete='tel'
          maxLength={40}
          value={phone ?? user.workPhone ?? ''}
          onChange={(event) => {
            setPhone(event.target.value)
            setPhoneInvalid(false)
          }}
          className='min-h-11 w-full rounded-md border border-border bg-background px-3 text-base md:text-sm'
          disabled={action.blocked}
          aria-describedby='work-phone-hint'
          aria-invalid={phoneInvalid || action.fields.includes('workPhone') || undefined}
        />
        <p id='work-phone-hint' className='min-h-5 text-xs text-muted-foreground'>
          {t(phoneInvalid ? 'selfService.phoneInvalid' : 'selfService.phoneHint')}
        </p>
        <button
          type='submit'
          disabled={action.blocked || phone === null || phone === (user.workPhone ?? '')}
          className='min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50'
        >
          {action.seconds ? t('selfService.retryAfter', { seconds: action.seconds }) : t('selfService.save')}
        </button>
      </form>
      {action.uncertain && (
        <button
          type='button'
          className='min-h-11 rounded-md border border-border px-4 text-sm'
          onClick={() => window.location.reload()}
        >
          {t('selfService.refresh')}
        </button>
      )}
    </section>
  )
}
