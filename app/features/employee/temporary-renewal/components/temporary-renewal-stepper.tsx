import { useTranslation } from 'react-i18next'

interface TemporaryRenewalStepperProps {
  currentStep?: number
}

export function TemporaryRenewalStepper({ currentStep = 1 }: TemporaryRenewalStepperProps) {
  const { t } = useTranslation()

  const steps = [
    {
      number: 1,
      label: t('temporaryRenewal.stepper.step1')
    },
    {
      number: 2,
      label: t('temporaryRenewal.stepper.step2')
    },
    {
      number: 3,
      label: t('temporaryRenewal.stepper.step3')
    }
  ]

  return (
    <div className='flex items-center'>
      {steps.map((step, index) => {
        const isActive = step.number === currentStep
        const isCompleted = step.number < currentStep

        return (
          <div className='flex items-center' key={step.number}>
            <div className='flex items-center gap-2'>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-xs ${
                  isActive
                    ? 'bg-brand-500 text-white'
                    : isCompleted
                      ? 'bg-status-active text-white'
                      : 'border border-neutral-200 bg-white text-neutral-600'
                }`}
              >
                {step.number}
              </div>
              <span
                className={`hidden text-sm sm:inline-block ${
                  isActive ? 'font-semibold text-brand-600' : 'font-medium text-neutral-600'
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && <div className='mx-4 h-px w-12 bg-neutral-200 sm:w-16' />}
          </div>
        )
      })}
    </div>
  )
}
