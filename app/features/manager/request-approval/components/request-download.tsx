import { Download } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { TeamRequest } from '~/entities/request/manager-requests-demo'

import { buildRequestReport } from '../request-report'

export function RequestDownload({ request }: { request: TeamRequest }) {
  const { t, i18n } = useTranslation()
  const [failed, setFailed] = useState(false)
  function download() {
    setFailed(false)
    try {
      const blob = new Blob(['\uFEFF', buildRequestReport(request, i18n.resolvedLanguage ?? 'vi', t)], {
        type: 'text/plain;charset=utf-8'
      })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${request.id}.txt`
      document.body.append(anchor)
      anchor.click()
      anchor.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      setFailed(true)
    }
  }
  return (
    <div>
      <button
        type='button'
        onClick={download}
        title={t('requestApproval.downloadHint')}
        className='inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-brand-bg'
      >
        <Download size={16} aria-hidden='true' className='text-neutral-500' />
        {t('requestApproval.download')}
      </button>
      {failed && (
        <p role='alert' className='mt-2 text-xs text-danger'>
          {t('requestApproval.downloadFailed')}
        </p>
      )}
    </div>
  )
}
