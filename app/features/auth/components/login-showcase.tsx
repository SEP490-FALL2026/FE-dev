import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

import mascot from '~/assets/auth/sentry-mascot.png'

export function LoginShowcase() {
  const { t } = useTranslation('auth')

  return (
    <aside className='login-showcase' aria-hidden='true'>
      <div className='login-mascot-halo' />
      <motion.div
        className='login-mascot-wrap'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        <img
          className='login-mascot'
          src={mascot}
          alt=''
          width={1254}
          height={1254}
          fetchPriority='high'
          draggable={false}
        />
      </motion.div>
      <div className='login-showcase-caption'>
        <p className='text-xs font-medium tracking-[0.16em] text-primary-ink uppercase'>{t('eyebrow')}</p>
        <h2 className='mt-3 text-2xl leading-snug font-semibold tracking-tight xl:text-3xl'>{t('title')}</h2>
      </div>
    </aside>
  )
}
