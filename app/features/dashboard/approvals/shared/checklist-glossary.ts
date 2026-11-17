/**
 * The checklist questions come from the policies as written for the company and carry short codes in backticks
 * (`K1`, `GH-1`, `BM-10`…) and _italic_ marks. The five codes below are defined in a policy, so each reads as its
 * plain words and cites the policy point that defines it. Any other internal code is dropped from what is shown.
 */
export const GLOSSARY = {
  K1: { policy: 'POL-MF1', point: 6 },
  K2: { policy: 'POL-MF1', point: 7 },
  'GH-1': { policy: 'POL-GEN', point: 4 },
  'GH-2': { policy: 'POL-GEN', point: 4 },
  'BM-10': { policy: 'POL-MF4', point: 3 }
} as const
export type GlossaryTerm = keyof typeof GLOSSARY

export type ChecklistSegment =
  { type: 'text'; value: string } | { type: 'italic'; value: string } | { type: 'term'; term: GlossaryTerm }

const isTerm = (value: string): value is GlossaryTerm => Object.hasOwn(GLOSSARY, value)

/** Internal reference codes such as QĐ-111h, FR-3.22, C-19, SBF-15, K4: not defined for the reader, so not shown. */
const REFERENCE_CODE = /^[A-ZĐ]{1,5}-?\d+(?:\.\d+)?[a-z]*$/

/** Empty brackets, stray separators and double spaces left behind by a dropped code. */
function tidy(text: string) {
  return text
    .replace(/\(\s*[,;/·]*\s*\)/g, '')
    .replace(/\s+([,;.)])/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

export function parseChecklistText(text: string): ChecklistSegment[] {
  const withoutReferences = tidy(
    text.replace(/`([^`]+)`/g, (whole, code: string) => (!isTerm(code) && REFERENCE_CODE.test(code) ? '' : whole))
  )
  const segments: ChecklistSegment[] = []
  const pattern = /`([^`]+)`|(?<![A-Za-z0-9])_([^_]+)_(?![A-Za-z0-9])/g
  let last = 0
  for (const match of withoutReferences.matchAll(pattern)) {
    if (match.index > last) segments.push({ type: 'text', value: withoutReferences.slice(last, match.index) })
    const [, code, italic] = match
    if (code !== undefined) segments.push(isTerm(code) ? { type: 'term', term: code } : { type: 'text', value: code })
    else segments.push({ type: 'italic', value: italic })
    last = match.index + match[0].length
  }
  if (last < withoutReferences.length) segments.push({ type: 'text', value: withoutReferences.slice(last) })
  return segments
}

/** The glossary terms used by a set of questions, in the order they first appear. */
export function termsOf(texts: readonly string[]): GlossaryTerm[] {
  const found: GlossaryTerm[] = []
  for (const text of texts)
    for (const segment of parseChecklistText(text))
      if (segment.type === 'term' && !found.includes(segment.term)) found.push(segment.term)
  return found
}
