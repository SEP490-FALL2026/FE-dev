import { i18n } from '~/shared/i18n/i18n'

/**
 * Policy text is written once by the company and carries a few English words (Finance, Request, Cost Center, seat,
 * case, checklist). On a Vietnamese screen they read as Vietnamese. Only words in running text are changed: call it on
 * plain text nodes, never on addresses, codes or identifiers.
 */
const RULES: { pattern: RegExp; vietnamese: string }[] = [
  { pattern: /\bCost Centers?\b/gi, vietnamese: 'trung tâm chi phí' },
  { pattern: /\bChecklists?\b/gi, vietnamese: 'danh sách kiểm tra' },
  { pattern: /\bRequests?\b/gi, vietnamese: 'yêu cầu' },
  { pattern: /\bSeats?\b/gi, vietnamese: 'suất' },
  { pattern: /\bcase\b/gi, vietnamese: 'trường hợp' },
  { pattern: /\bFinance\b/g, vietnamese: 'Tài chính' }
]

const startsSentence = (before: string) => {
  const trimmed = before.trimEnd()
  return trimmed === '' || /[.?!:]$/.test(trimmed)
}

export function localizeTerms(text: string, language = i18n.language): string {
  if (!language.startsWith('vi')) return text
  return RULES.reduce(
    (current, { pattern, vietnamese }) =>
      current.replace(pattern, (word, offset: number) => {
        if (word === 'Finance') return vietnamese
        const capital = word[0] === word[0].toUpperCase() && startsSentence(current.slice(0, offset))
        return capital ? vietnamese[0].toUpperCase() + vietnamese.slice(1) : vietnamese
      }),
    text
  )
}
