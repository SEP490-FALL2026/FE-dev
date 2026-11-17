import { useTranslation } from 'react-i18next'
import { GLOSSARY, parseChecklistText, type GlossaryTerm } from '../checklist-glossary'

/**
 * One checklist question without the codes written into it: a defined code reads as its plain words with a small
 * footnote number, italics show as italics, and other internal codes are not shown.
 */
export function ChecklistText({ text, terms }: { text: string; terms?: readonly GlossaryTerm[] }) {
  const { t: translate } = useTranslation('approvals')
  return (
    <>
      {parseChecklistText(text).map((segment, index) => {
        if (segment.type === 'text') return segment.value
        if (segment.type === 'italic') return <em key={index}>{segment.value}</em>
        const number = terms ? terms.indexOf(segment.term) + 1 : 0
        return (
          <span key={index}>
            {translate(`glossary.terms.${segment.term}.label`)}
            {number > 0 && <sup className='ml-0.5 text-[0.7rem] font-medium text-muted-foreground'>[{number}]</sup>}
          </span>
        )
      })}
    </>
  )
}

/** The plain sentence of a question, for names read by a screen reader. */
export function useChecklistPlainText() {
  const { t: translate } = useTranslation('approvals')
  return (text: string) =>
    parseChecklistText(text)
      .map((segment) => (segment.type === 'term' ? translate(`glossary.terms.${segment.term}.label`) : segment.value))
      .join('')
}

/** What each footnote number stands for, and the policy point that defines it. */
export function ChecklistFootnotes({ terms }: { terms: readonly GlossaryTerm[] }) {
  const { t: translate } = useTranslation('approvals')
  if (terms.length === 0) return null
  return (
    <ol className='space-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground'>
      {terms.map((term, index) => (
        <li key={term}>
          [{index + 1}] <span className='font-medium text-foreground'>{translate(`glossary.terms.${term}.label`)}</span>{' '}
          ({term}): {translate(`glossary.terms.${term}.definition`)}{' '}
          <span className='whitespace-nowrap'>
            {translate('glossary.citation', {
              policy: translate(`glossary.policies.${GLOSSARY[term].policy}`),
              point: GLOSSARY[term].point
            })}
          </span>
        </li>
      ))}
    </ol>
  )
}
