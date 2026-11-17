import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { approvals } from '~/shared/i18n/locales/en/approvals'
import { parseChecklistText, termsOf } from './checklist-glossary'
import { ChecklistFootnotes, ChecklistText } from './components/checklist-text'

// Sentences as the policies of the company write them.
const budgetProposal = 'Đã xem đề nghị `BM-10` của trưởng phòng cạnh phiên bản và file giải thích của Finance'
const accessKind =
  'Kiểu cấp hợp lý về chi phí: `K1` cho nhu cầu cá nhân ngắn hạn; nhu cầu dài hạn hoặc nhiều người đã cân nhắc kho dùng chung `K2`'
const limits = 'Không người thụ hưởng nào vướng `GH-1`/`GH-2`; phần mềm case B không trùng mục đã có'
const withReferences = 'Gói giữ nguyên (`QĐ-111h`, `FR-3.22`) và kiểu cấp `K4` không đổi (`C-19`)'
const flag = 'Phòng mang cờ _phòng không nộp đề nghị_ (nếu có): số chốt từ số liệu nền là hợp lý'

describe('checklist text', () => {
  it('finds the defined codes in the order they appear', () => {
    expect(termsOf([budgetProposal, accessKind, limits])).toEqual(['BM-10', 'K1', 'K2', 'GH-1', 'GH-2'])
  })

  it('drops internal codes nobody defines, with the brackets they leave empty', () => {
    const shown = parseChecklistText(withReferences)
      .map((segment) => (segment.type === 'term' ? segment.term : segment.value))
      .join('')
    expect(shown).toBe('Gói giữ nguyên và kiểu cấp không đổi')
    expect(termsOf([withReferences])).toEqual([])
  })

  it('turns underscores into italics and never shows the backticks', () => {
    const segments = parseChecklistText(flag)
    expect(segments).toContainEqual({ type: 'italic', value: 'phòng không nộp đề nghị' })
    expect(JSON.stringify(segments)).not.toContain('`')
  })

  it('leaves a snake_case word alone', () => {
    expect(parseChecklistText('Trường change_note ghi lại')).toEqual([
      { type: 'text', value: 'Trường change_note ghi lại' }
    ])
  })
})

describe('checklist text on screen', () => {
  beforeEach(async () => {
    i18n.addResourceBundle('en', 'approvals', approvals)
    await setAppLanguage('en', false)
  })

  it('shows the plain words with a footnote number, and cites the policy that defines the code', () => {
    const terms = termsOf([budgetProposal])
    render(
      <div>
        <p data-testid='question'>
          <ChecklistText text={budgetProposal} terms={terms} />
        </p>
        <ChecklistFootnotes terms={terms} />
      </div>
    )
    expect(screen.getByTestId('question')).toHaveTextContent('Đã xem đề nghị budget proposal[1] của trưởng phòng')
    expect(screen.getByTestId('question')).not.toHaveTextContent('BM-10')
    expect(screen.getByText(/\(BM-10\): at least one file on the template/)).toBeInTheDocument()
    expect(
      screen.getByText(/Annual software budget and in-year review policy, Rules section, point 3/)
    ).toBeInTheDocument()
  })

  it('shows no footnotes for a question without a defined code', () => {
    const { container } = render(<ChecklistFootnotes terms={termsOf([flag])} />)
    expect(container).toBeEmptyDOMElement()
  })
})
