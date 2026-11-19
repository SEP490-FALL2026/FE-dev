import { useMutation } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { importTemplateGet } from '~/shared/api/generated/operations/import-templates/import-template-get'
import { FinanceButton } from '../../shared/components/finance-ui'

const fileName = 'mau-budget-proposal.xlsx'

/** Downloads the BM-10 sample file the department heads fill in (`kind = budget-proposal`). */
export function BudgetTemplateDownload() {
  const { t: translate } = useTranslation('financeBudget')
  const download = useMutation({
    retry: false,
    mutationFn: async () => {
      const blob = await importTemplateGet('budget-proposal', { format: 'xlsx' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = fileName
      anchor.click()
      URL.revokeObjectURL(url)
    },
    onError: () => toast.error(translate('template.failed'), { id: 'budget-template' })
  })
  return (
    <FinanceButton pending={download.isPending} onClick={() => download.mutate()}>
      <Download aria-hidden className='size-4' strokeWidth={1.5} />
      {translate('template.download')}
    </FinanceButton>
  )
}
