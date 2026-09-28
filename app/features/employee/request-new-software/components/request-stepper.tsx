import { useTranslation } from 'react-i18next'

interface RequestStepperProps {
  currentStep?: number
}

export function RequestStepper({ currentStep = 1 }: RequestStepperProps) {
  const { t } = useTranslation()

  const steps = [
    {
      number: 1,
      title: t('requestNewSoftware.stepper.step1'),
      subtitle: t('requestNewSoftware.stepper.step1Sub')
    },
    {
      number: 2,
      title: t('requestNewSoftware.stepper.step2'),
      subtitle: t('requestNewSoftware.stepper.step2Sub')
    },
    {
      number: 3,
      title: t('requestNewSoftware.stepper.step3'),
      subtitle: t('requestNewSoftware.stepper.step3Sub')
    },
    {
      number: 4,
      title: t('requestNewSoftware.stepper.step4'),
      subtitle: t('requestNewSoftware.stepper.step4Sub')
    }
  ]

  return (
    <div className='mb-10 flex items-center justify-between'>
      {steps.map((step, index) => {
        const isActive = step.number === currentStep
        const isCompleted = step.number < currentStep

        return (
          <div className='flex flex-1 items-center last:flex-initial' key={step.number}>
            <div className='relative z-10 flex items-center gap-3'>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-xs ${
                  isActive
                    ? 'bg-brand-500 text-white'
                    : isCompleted
                      ? 'bg-status-active text-white'
                      : 'border border-neutral-200 bg-brand-50/60 font-medium text-neutral-600'
                }`}
              >
                {step.number}
              </div>
              <div className='hidden sm:block'>
                <div className={`text-sm font-semibold ${isActive ? 'text-neutral-900' : 'text-neutral-600'}`}>
                  {step.title}
                </div>
                <div className='text-xs text-neutral-500'>{step.subtitle}</div>
              </div>
            </div>

            {index < steps.length - 1 && <div className='mx-4 h-px flex-1 bg-neutral-200' />}
          </div>
        )
      })}
    </div>
  )
}
