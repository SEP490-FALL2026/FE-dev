import { Unplug } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ItAdminTabKey } from '../../enums'
import { itAdminMenuItems } from '../../it-admin-nav'

export type UnsupportedItTab =
  'reconciliation' | 'usage-import' | 'device-collectors' | 'license-optimization' | 'identities' | 'renewals'
export function ItUnavailableView({ tab }: { tab: UnsupportedItTab }) {
  const { t: translate } = useTranslation('itAdmin')
  const item = itAdminMenuItems
    .flatMap((menu) => menu.children ?? [])
    .find((child) => child.key === (tab as ItAdminTabKey))
  return (
    <section className='space-y-5'>
      <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>
        {item ? translate(`navigation.${item.translationKey}`) : translate('unavailableTitle')}
      </h1>
      <div role='status' className='flex items-start gap-4 rounded-lg border border-border bg-surface p-6'>
        <Unplug aria-hidden strokeWidth={1.5} className='size-6 shrink-0 text-muted-foreground' />
        <p className='max-w-2xl text-sm text-muted-foreground'>{translate(`unsupported.${tab}`)}</p>
      </div>
    </section>
  )
}
