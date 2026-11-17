import { useTranslation } from 'react-i18next'
import { localizeTerms } from '~/shared/lib/localize-terms'
import { GLOSSARY, parseChecklistText, type ChecklistSegment, type GlossaryTerm } from '../checklist-glossary'

/**
 * A label that starts with the words the sentence already ends with ("đề nghị" + "đề nghị ngân sách") drops them;
 * a label the sentence already ends with whole ("kho dùng chung" + "kho dùng chung") shows nothing but its footnote mark.
 */
function withoutRepeatedStart(before: string, label: string) {
  const words = label.split(' ')
  const tail = before.trimEnd().toLowerCase()
  for (let count = Math.min(words.length, 3); count >= 1; count -= 1)
    if (tail.endsWith(words.slice(0, count).join(' ').toLowerCase())) return words.slice(count).join(' ')
  return label
}

type Shown = { segment: ChecklistSegment; text: string; term?: GlossaryTerm }

/** What each part of a question shows, with the words the sentence already holds not said twice. */
function shownParts(text: string, labelOf: (term: GlossaryTerm) => string): Shown[] {
  return parseChecklistText(text).reduce<Shown[]>((parts, segment) => {
    const before = parts.map((part) => part.text).join('')
    if (segment.type === 'term')
      return [...parts, { segment, text: withoutRepeatedStart(before, labelOf(segment.term)), term: segment.term }]
    return [...parts, { segment, text: localizeTerms(segment.value) }]
  }, [])
}

function useShownParts(text: string): Shown[] {
  const { t: translate } = useTranslation('approvals')
  return shownParts(text, (term) => translate(`glossary.terms.${term}.label`))
}

/**
 * One checklist question without the codes written into it: a defined code reads as its plain words with a small
 * footnote number, italics show as italics, and other internal codes are not shown.
 */
export function ChecklistText({ text, terms }: { text: string; terms?: readonly GlossaryTerm[] }) {
  const parts = useShownParts(text)
  return (
    <>
      {parts.map(({ segment, text: shown, term }, index) => {
        if (segment.type === 'text') return shown
        if (segment.type === 'italic') return <em key={index}>{shown}</em>
        const number = terms && term ? terms.indexOf(term) + 1 : 0
        return (
          <span key={index}>
            {shown}
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
    shownParts(text, (term) => translate(`glossary.terms.${term}.label`))
      .map((part) => part.text)
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
