import { useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { PolicyReader } from './policy-reader'
import { usePolicyGet } from '~/shared/api/generated/operations/policies/policy-get'
import { POLICY_ACKNOWLEDGEMENT } from '../enums/policy-acknowledgement'

export function PolicyAcknowledgementGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation('policy')
  const me = useMeGet()
  const pending = !me.isError ? (me.data?.data?.pendingPolicyAcknowledgements ?? []) : []
  const current = pending[0]
  const currentCode = current?.code
  const policy = usePolicyGet(current?.code ?? '', undefined, { query: { enabled: !!current } })
  const acknowledgement = !policy.isError ? policy.data?.data?.myAcknowledgement : undefined
  const refreshMe = me.refetch
  useEffect(() => {
    if (
      currentCode &&
      (acknowledgement === POLICY_ACKNOWLEDGEMENT.DONE || acknowledgement === POLICY_ACKNOWLEDGEMENT.NOT_REQUIRED)
    )
      void refreshMe()
  }, [currentCode, acknowledgement, refreshMe])
  if (!current) return children
  return (
    <section className='mx-auto max-w-3xl space-y-5'>
      <h1 className='text-2xl font-semibold'>{t('gate.title')}</h1>
      <p className='text-sm text-muted-foreground'>{t('gate.hint')}</p>
      <p className='text-xs text-muted-foreground'>{t('gate.progress', { current: 1, total: pending.length })}</p>
      <PolicyReader key={current.code + ':' + current.versionNumber} code={current.code} />
    </section>
  )
}
