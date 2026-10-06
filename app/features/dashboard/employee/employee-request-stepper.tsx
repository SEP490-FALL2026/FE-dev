import { useTranslation } from 'react-i18next'

export function EmployeeRequestStepper({
  currentStep,
  firstStepLabel
}: {
  currentStep: 1 | 2
  firstStepLabel: string
}) {
  const { t } = useTranslation('dashboard')
  const steps = [firstStepLabel, t('employee.requestNewSoftware.step2'), t('employee.requestNewSoftware.step3')]

  return (
    <ol
      aria-label={t('employee.requestNewSoftware.progressLabel')}
      className='grid grid-cols-3 gap-2 rounded-2xl border border-border bg-surface p-3 shadow-sm sm:gap-4 sm:p-4'
    >
      {steps.map((label, index) => {
        const step = index + 1
        const isCurrent = step === currentStep
        const isComplete = step < currentStep
        return (
          <li
            aria-current={isCurrent ? 'step' : undefined}
            className='flex min-w-0 flex-col items-center gap-2 text-center'
            key={label}
          >
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                isCurrent
                  ? 'bg-primary-action text-white'
                  : isComplete
                    ? 'bg-success/10 text-success-ink'
                    : 'border border-border bg-surface-subtle text-muted-foreground'
              }`}
            >
              {step}
            </span>
            <span
              className={`text-xs leading-snug sm:text-sm ${isCurrent ? 'font-bold text-foreground' : 'text-muted-foreground'}`}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
