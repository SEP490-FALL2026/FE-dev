import { useTranslation } from 'react-i18next'

interface ReturnLicenseStepperProps {
  currentStep?: number
}

export function ReturnLicenseStepper({ currentStep = 1 }: ReturnLicenseStepperProps) {
  const { t } = useTranslation()

  const steps = [
    {
      number: 1,
      label: t('returnLicense.stepper.step1')
    },
    {
      number: 2,
      label: t('returnLicense.stepper.step2')
    },
    {
      number: 3,
      label: t('returnLicense.stepper.step3')
    }
  ]

  return (
    <div className='flex items-center space-x-2 sm:space-x-4'>
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
                className={`hidden text-sm sm:inline ${
                  isActive ? 'font-semibold text-brand-600' : 'font-medium text-neutral-600'
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && <div className='mx-2 h-px w-8 bg-neutral-200 sm:mx-4 sm:w-16' />}
          </div>
        )
      })}
    </div>
  )
}
