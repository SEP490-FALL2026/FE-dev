import { useMutation } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { importTemplateGet } from '~/shared/api/generated/operations/import-templates/import-template-get'
import { ImportTemplateGetFormat } from '~/shared/api/generated/model/import-templates/importTemplateGetFormat'
import { ManagerButton } from '../../shared/components/manager-api-ui'

/** The generated client returns only the file body, so the file is named after the BM-10 form. */
const templateFileName = 'BM-10.xlsx'

/** Downloads the BM-10 template the head fills in and attaches to the proposal. */
export function ManagerBudgetTemplate() {
  const { t: translate } = useTranslation('requestFlow')
  const download = useMutation({
    retry: false,
    mutationFn: () => importTemplateGet('budget-proposal', { format: ImportTemplateGetFormat.xlsx }),
    onSuccess: (file) => {
      const url = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.download = templateFileName
      link.click()
      URL.revokeObjectURL(url)
    },
    onError: () => toast.error(translate('templateError'), { id: 'budget-template' })
  })
  return (
    <div className='flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/60 p-3'>
      <p className='min-w-0 flex-1 text-sm text-muted-foreground'>{translate('templateHint')}</p>
      <ManagerButton busy={download.isPending} disabled={download.isPending} onClick={() => download.mutate()}>
        <Download aria-hidden strokeWidth={1.5} className='size-4' />
        {translate('template')}
      </ManagerButton>
    </div>
  )
}
