import type { PolicyDetailResponseDtoData } from '~/shared/api/generated/model'
import { InlineMarkdown } from '~/shared/ui/inline-markdown'

export function PolicyContent({ policy }: { policy: NonNullable<PolicyDetailResponseDtoData> }) {
  return (
    <div className='space-y-5'>
      {policy.changeNote && (
        <InlineMarkdown text={policy.changeNote} className='text-sm text-muted-foreground [overflow-wrap:anywhere]' />
      )}
      {policy.content.sections.map((section, index) => (
        <section key={`${index}:${section.heading}`} className='space-y-2'>
          <h3 className='text-base font-semibold'>{section.heading}</h3>
          <InlineMarkdown text={section.body} className='text-sm leading-relaxed [overflow-wrap:anywhere]' />
        </section>
      ))}
      {policy.content.steps.map((step) => (
        <section key={step.code} className='space-y-3 border-t border-border/50 pt-4'>
          <h3 className='text-base font-semibold'>
            {step.code} · {step.title}
          </h3>
          <ul className='space-y-2'>
            {step.checklist.map((item) => (
              <li key={item.code} className='text-sm leading-relaxed'>
                <span className='font-mono text-xs text-muted-foreground'>{item.code} </span>
                <InlineMarkdown text={item.text} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
