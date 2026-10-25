import { Copy, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ItProvisioningItem } from '../../it-admin-data'

export interface ProvisioningCredentialsCardProps {
  currentItem: ItProvisioningItem
  isRevealed: boolean
  onOpenRevealModal: () => void
  setIsRevealed: (revealed: boolean) => void
  showToast: (msg: string) => void
}

export function ProvisioningCredentialsCard({
  currentItem,
  isRevealed,
  onOpenRevealModal,
  setIsRevealed,
  showToast
}: ProvisioningCredentialsCardProps) {
  const { t, i18n } = useTranslation('dashboard')

  const demoValue = (item: ItProvisioningItem, field: string, value: string) =>
    i18n.t(`dashboard:itAdmin.provisioning.extra.demoDetails.${item.id}.${field}`, { defaultValue: value })

  if (!currentItem.provisioningResult) return null

  return (
    <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-sm font-bold uppercase tracking-wider text-muted-foreground'>
            {t('itAdmin.provisioning.extra.credentials')}
          </h3>
          <p className='text-xs text-muted-foreground mt-0.5'>
            {t('itAdmin.provisioning.extra.provisionedAt')} {currentItem.provisioningResult.grantedAt}{' '}
            {t('itAdmin.provisioning.extra.operator')} {currentItem.provisioningResult.operatorName}
          </p>
        </div>
        {currentItem.provisioningResult.providerRef && (
          <span className='font-mono text-xs rounded-md bg-surface-subtle px-2 py-1 border border-border text-muted-foreground'>
            Ref: {currentItem.provisioningResult.providerRef}
          </span>
        )}
      </div>

      {currentItem.provisioningResult.accountDetails && (
        <div className='rounded-xl border border-border bg-surface-subtle p-4 space-y-3 text-xs'>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div>
              <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.username')}</span>
              <p className='font-mono font-bold text-foreground mt-0.5'>
                {currentItem.provisioningResult.accountDetails.username}
              </p>
            </div>
            <div>
              <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.initialPassword')}</span>
              <div className='flex items-center gap-2 mt-0.5'>
                <span className='font-mono font-bold text-foreground'>
                  {isRevealed
                    ? currentItem.provisioningResult.accountDetails.initialPassword
                    : '••••••••••••••••'}
                </span>
                <button
                  className='rounded-md border border-border bg-surface p-1.5 text-xs text-muted-foreground hover:text-foreground'
                  onClick={() => {
                    if (!isRevealed) onOpenRevealModal()
                    else setIsRevealed(false)
                  }}
                  title={
                    isRevealed
                      ? t('itAdmin.provisioning.extra.hidePassword')
                      : t('itAdmin.provisioning.extra.revealPassword')
                  }
                  type='button'
                >
                  {isRevealed ? <EyeOff className='size-3.5' /> : <Eye className='size-3.5' />}
                </button>
                {isRevealed && (
                  <button
                    className='rounded-md border border-border bg-surface p-1.5 text-xs text-muted-foreground hover:text-foreground'
                    onClick={() => {
                      navigator.clipboard.writeText(
                        currentItem.provisioningResult?.accountDetails?.initialPassword || ''
                      )
                      showToast(t('itAdmin.provisioning.extra.passwordCopied'))
                    }}
                    title={t('itAdmin.provisioning.extra.copy')}
                    type='button'
                  >
                    <Copy className='size-3.5' />
                  </button>
                )}
              </div>
            </div>
          </div>
          {currentItem.provisioningResult.accountDetails.setupLink && (
            <div className='pt-2 border-t border-border/40'>
              <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.activationLink')}</span>
              <p className='font-mono text-[0.7rem] text-primary truncate mt-0.5'>
                {currentItem.provisioningResult.accountDetails.setupLink}
              </p>
            </div>
          )}
        </div>
      )}

      {currentItem.provisioningResult.apiKeyDetails && (
        <div className='rounded-xl border border-border bg-surface-subtle p-4 space-y-3 text-xs'>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div>
              <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.apiKeyName')}</span>
              <p className='font-mono font-bold text-foreground mt-0.5'>
                {currentItem.provisioningResult.apiKeyDetails.keyName}
              </p>
            </div>
            <div>
              <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.apiSecret')}</span>
              <div className='flex items-center gap-2 mt-0.5'>
                <span className='font-mono font-bold text-foreground'>
                  {isRevealed
                    ? currentItem.provisioningResult.apiKeyDetails.fullKey
                    : currentItem.provisioningResult.apiKeyDetails.maskedKey}
                </span>
                <button
                  className='rounded-md border border-border bg-surface p-1.5 text-xs text-muted-foreground hover:text-foreground'
                  onClick={() => {
                    if (!isRevealed) onOpenRevealModal()
                    else setIsRevealed(false)
                  }}
                  title={
                    isRevealed
                      ? t('itAdmin.provisioning.extra.hideKey')
                      : t('itAdmin.provisioning.extra.revealKey')
                  }
                  type='button'
                >
                  {isRevealed ? <EyeOff className='size-3.5' /> : <Eye className='size-3.5' />}
                </button>
              </div>
            </div>
          </div>
          <div className='pt-2 border-t border-border/40 text-[0.7rem] text-muted-foreground'>
            {t('itAdmin.provisioning.extra.expiresAt')} {currentItem.provisioningResult.apiKeyDetails.expiresAt}{' '}
            {t('itAdmin.provisioning.extra.scope')} {currentItem.provisioningResult.apiKeyDetails.scopes}
          </div>
        </div>
      )}

      {currentItem.provisioningResult.directAccessDetails && (
        <div className='rounded-xl border border-border bg-surface-subtle p-4 text-xs'>
          <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.ssoStatus')}</span>
          <p className='font-bold text-success mt-1'>
            {currentItem.provisioningResult.directAccessDetails.status}
          </p>
          <p className='text-muted-foreground mt-0.5'>
            {t('itAdmin.provisioning.extra.accountIdentity')}{' '}
            {currentItem.provisioningResult.directAccessDetails.accountId} · Workspace:{' '}
            {currentItem.provisioningResult.directAccessDetails.workspaceId}
          </p>
        </div>
      )}

      {currentItem.provisioningResult.lastError && (
        <div className='rounded-xl border border-danger/30 bg-danger/10 p-4 text-xs space-y-1'>
          <span className='font-bold text-danger'>{t('itAdmin.provisioning.extra.vendorApiError')}</span>
          <p className='text-muted-foreground font-mono'>
            {demoValue(currentItem, 'lastError', currentItem.provisioningResult.lastError)}
          </p>
        </div>
      )}
      {currentItem.provisioningResult.recoveryGuide && (
        <div className='rounded-xl border border-warning/30 bg-warning/10 p-4 text-xs space-y-1'>
          <span className='font-bold text-warning'>{t('itAdmin.provisioning.extra.handoverHelp')}</span>
          <p className='text-foreground'>
            {demoValue(currentItem, 'recoveryGuide', currentItem.provisioningResult.recoveryGuide)}
          </p>
        </div>
      )}
    </div>
  )
}
