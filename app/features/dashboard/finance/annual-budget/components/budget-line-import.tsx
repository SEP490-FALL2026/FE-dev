import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetVersionImport } from '~/shared/api/generated/operations/budget-versions/budget-version-import'
import { FinanceButton, FinanceDrawer, FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { budgetQueryKeys } from '../budget-query-keys'
import { useFinanceRetry } from '../../shared/hooks/use-finance-retry'

export function BudgetLineImport({
  versionId,
  onClose,
  disabled = false
}: {
  versionId: string
  onClose: () => void
  disabled?: boolean
}) {
  const { t: translate } = useTranslation('financeBudget')
  const [file, setFile] = useState<File>()
  const retrySeconds = useFinanceRetry()
  const feedback = useFinanceFeedback(budgetQueryKeys(versionId))
  const mutation = useBudgetVersionImport({ mutation: feedback })
  const result = mutation.data?.data?.result
  const tooLarge = Boolean(file && file.size > 2 * 1024 * 1024)
  return (
    <FinanceDrawer title={translate('actions.import')} pending={mutation.isPending} onClose={onClose}>
      <form
        className='space-y-4'
        onSubmit={(event) => {
          event.preventDefault()
          if (!disabled && retrySeconds === 0 && file && !tooLarge && !mutation.isPending && !mutation.isSuccess)
            mutation.mutate({ id: versionId, data: { file } })
        }}
      >
        <FinanceField required label={translate('actions.import')} hint={translate('importHint')}>
          <input
            required
            type='file'
            aria-invalid={tooLarge}
            aria-describedby='budget-import-file-error'
            className={`${financeInputClass} file:mr-3 file:rounded-md file:border-0 file:bg-primary-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-ink hover:file:bg-primary-soft/80`}
            disabled={mutation.isPending}
            onChange={(event) => {
              setFile(event.target.files?.[0])
              mutation.reset()
            }}
          />
        </FinanceField>
        <p id='budget-import-file-error' className='min-h-5 text-sm text-danger'>
          {tooLarge ? translate('fileTooLarge') : null}
        </p>
        <FinanceButton
          type='submit'
          variant='primary'
          pending={mutation.isPending}
          disabled={disabled || !file || tooLarge || mutation.isSuccess}
        >
          {translate('actions.upload')}
        </FinanceButton>
      </form>
      {result && (
        <section aria-live='polite' className='mt-4 space-y-3'>
          <p className='text-sm'>{translate('importResult', result)}</p>
          <ul className='space-y-2 text-sm'>
            {result.errors.map((error) => (
              <li key={`${error.row}-${error.code}`}>
                {translate('importRow', {
                  row: error.row,
                  code: translate(`importCodes.${error.code}`, { defaultValue: translate('importRejected') })
                })}
              </li>
            ))}
          </ul>
        </section>
      )}
    </FinanceDrawer>
  )
}
