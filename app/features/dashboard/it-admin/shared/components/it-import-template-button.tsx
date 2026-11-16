import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { importTemplateGet } from '~/shared/api/generated/operations/import-templates/import-template-get'
import { getItError } from '../hooks/it-errors'
import { itButtonClass } from './it-form'

export function ItImportTemplateButton({ kind }: { kind: 'seat-baseline' | 'license-keys' | 'usage-csv' }) {
  const { t: translate } = useTranslation('itAdmin')
  const [pending, setPending] = useState(false)
  async function download() {
    if (pending) return
    setPending(true)
    try {
      const file = await importTemplateGet(kind, { format: 'csv' })
      const url = URL.createObjectURL(file)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${kind}.csv`
      document.body.append(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (error) {
      const failure = getItError(error)
      toast.error(translate(`errors.${failure.key}`), {
        id: 'it-import-template',
        description: failure.requestId ? translate('requestId', { id: failure.requestId }) : undefined
      })
    } finally {
      setPending(false)
    }
  }
  return (
    <button
      type='button'
      className={itButtonClass}
      disabled={pending}
      aria-busy={pending}
      onClick={() => void download()}
    >
      {translate(pending ? 'templateLoading' : 'stock.downloadTemplate')}
    </button>
  )
}
