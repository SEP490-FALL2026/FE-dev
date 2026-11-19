import { useTranslation } from 'react-i18next'
import type { DraftWriteBodyDtoContent } from '~/shared/api/generated/model/policies'
import { AdminField, adminButtonClass, adminInputClass } from '../../shared/components/admin-form'
import { AdminSelect } from '../../shared/components/admin-select'
import { usePolicyPresentation } from '../hooks/use-policy-presentation'

type Props = {
  content: DraftWriteBodyDtoContent
  original: DraftWriteBodyDtoContent
  onChange: (content: DraftWriteBodyDtoContent) => void
}
export function PolicyContentEditor({ content, original, onChange }: Props) {
  const { t } = useTranslation('admin')
  const { stepName } = usePolicyPresentation()
  const updateSection = (index: number, patch: Partial<DraftWriteBodyDtoContent['sections'][number]>) =>
    onChange({
      ...content,
      sections: content.sections.map((section, i) => (i === index ? { ...section, ...patch } : section))
    })
  const updateStep = (index: number, patch: Partial<DraftWriteBodyDtoContent['steps'][number]>) =>
    onChange({ ...content, steps: content.steps.map((step, i) => (i === index ? { ...step, ...patch } : step)) })
  return (
    <div className='space-y-8'>
      <section className='space-y-4'>
        <h2 className='section-accent text-lg font-semibold'>{t('policies.sections')}</h2>
        {!content.sections.length && <p className='text-sm text-muted-foreground'>{t('policies.emptySections')}</p>}
        {content.sections.map((section, index) => (
          <section key={index} className='space-y-4 rounded-xl border border-border/80 bg-surface p-4 sm:p-5'>
            <AdminField
              required
              label={t('policies.sectionHeading', { number: index + 1 })}
              description={t('policies.headingHelp')}
            >
              <input
                required
                maxLength={200}
                className={adminInputClass}
                placeholder={t('ui.placeholders.sectionHeading')}
                value={section.heading}
                onChange={(event) => updateSection(index, { heading: event.target.value })}
              />
            </AdminField>
            <AdminField
              required
              label={t('policies.sectionBody', { number: index + 1 })}
              description={t('policies.bodyHelp')}
            >
              <textarea
                required
                rows={5}
                maxLength={20000}
                className={adminInputClass}
                placeholder={t('ui.placeholders.sectionBody')}
                value={section.body}
                onChange={(event) => updateSection(index, { body: event.target.value })}
              />
            </AdminField>
            <button
              type='button'
              className={adminButtonClass}
              onClick={() => onChange({ ...content, sections: content.sections.filter((_, i) => i !== index) })}
            >
              {t('policies.removeSection', { number: index + 1 })}
            </button>
          </section>
        ))}
        <button
          type='button'
          className={adminButtonClass}
          disabled={content.sections.length >= 30}
          onClick={() => onChange({ ...content, sections: [...content.sections, { heading: '', body: '' }] })}
        >
          {t('policies.addSection')}
        </button>
      </section>
      {!!content.steps.length && (
        <section className='space-y-4'>
          <h2 className='text-lg font-semibold'>{t('policies.steps')}</h2>
          <p className='text-sm text-muted-foreground'>{t('policies.fixedStepsHelp')}</p>
          {content.steps.map((step, index) => (
            <section key={step.code} className='space-y-4 rounded-xl border border-border/80 bg-surface p-4 sm:p-5'>
              <h3 className='font-semibold'>{stepName(step.code)}</h3>
              <AdminField required label={t('policies.stepTitle')} description={t('policies.stepTitleHelp')}>
                <input
                  required
                  maxLength={300}
                  className={adminInputClass}
                  placeholder={t('ui.placeholders.stepTitle')}
                  value={step.title}
                  onChange={(event) => updateStep(index, { title: event.target.value })}
                />
              </AdminField>
              {step.checklist.map((item, itemIndex) => (
                <div key={item.code} className='space-y-3 border-t border-border pt-4'>
                  <AdminField
                    required
                    label={t('policies.checklistText', { number: itemIndex + 1 })}
                    description={t('policies.checklistHelp')}
                  >
                    <textarea
                      required
                      rows={2}
                      maxLength={1000}
                      className={adminInputClass}
                      placeholder={t('ui.placeholders.checklistText')}
                      value={item.text}
                      onChange={(event) =>
                        updateStep(index, {
                          checklist: step.checklist.map((entry, i) =>
                            i === itemIndex ? { ...entry, text: event.target.value } : entry
                          )
                        })
                      }
                    />
                  </AdminField>
                  <AdminField required label={t('policies.checkType')} description={t('policies.checkTypeHelp')}>
                    <AdminSelect
                      required
                      value={item.check}
                      onChange={(next) =>
                        updateStep(index, {
                          checklist: step.checklist.map((entry, i) =>
                            i === itemIndex ? { ...entry, check: next === 'SYSTEM' ? 'SYSTEM' : 'PERSON' } : entry
                          )
                        })
                      }
                      options={[
                        { value: 'PERSON', label: t('policies.personCheck') },
                        ...(original.steps
                          .find((entry) => entry.code === step.code)
                          ?.checklist.some((entry) => entry.code === item.code && entry.check === 'SYSTEM')
                          ? [{ value: 'SYSTEM', label: t('policies.systemCheck') }]
                          : [])
                      ]}
                      placeholder={t('ui.pickCheckType')}
                    />
                  </AdminField>
                  <button
                    type='button'
                    className={adminButtonClass}
                    disabled={step.checklist.length <= 1}
                    onClick={() => updateStep(index, { checklist: step.checklist.filter((_, i) => i !== itemIndex) })}
                  >
                    {t('policies.removeItem', { number: itemIndex + 1 })}
                  </button>
                </div>
              ))}
              <button
                type='button'
                className={adminButtonClass}
                disabled={step.checklist.length >= 30}
                onClick={() => {
                  const codes = new Set(content.steps.flatMap((entry) => entry.checklist.map((check) => check.code)))
                  let number = 1
                  while (codes.has(`REVIEW-${number}`)) number++
                  updateStep(index, {
                    checklist: [...step.checklist, { code: `REVIEW-${number}`, text: '', check: 'PERSON' }]
                  })
                }}
              >
                {t('policies.addItem')}
              </button>
            </section>
          ))}
        </section>
      )}
    </div>
  )
}
