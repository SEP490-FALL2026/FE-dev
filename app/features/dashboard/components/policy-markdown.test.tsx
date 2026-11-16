import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PolicyMarkdown, parsePolicyBlocks, safeHref } from './policy-markdown'

const mount = (text: string) => render(<PolicyMarkdown text={text} />)

describe('PolicyMarkdown', () => {
  it('renders bold, italic with underscores or stars, and inline code', () => {
    const { container } = mount('Mọi **quyền qua Request**, _Đối chiếu:_ khớp, *nhấn mạnh* và `change_note`.')
    expect(container.querySelector('strong')?.textContent).toBe('quyền qua Request')
    const italics = [...container.querySelectorAll('em')].map((node) => node.textContent)
    expect(italics).toEqual(['Đối chiếu:', 'nhấn mạnh'])
    expect(container.querySelector('code')?.textContent).toBe('change_note')
    expect(container.textContent).not.toContain('**')
  })

  it('leaves snake_case words and lone markers as plain text', () => {
    const { container } = mount('Giữ nguyên some_snake_case_word, 2 * 3 = 6 và một_dấu.')
    expect(container.querySelector('em')).toBeNull()
    expect(container.textContent).toBe('Giữ nguyên some_snake_case_word, 2 * 3 = 6 và một_dấu.')
  })

  it('renders http(s) links that open safely in a new tab', () => {
    mount('Xem [NIST AC-2](https://csf.tools/reference/nist-sp-800-53/r5/ac/ac-2/) và [HTTP](http://example.test/a).')
    const link = screen.getByRole('link', { name: 'NIST AC-2' })
    expect(link.getAttribute('href')).toBe('https://csf.tools/reference/nist-sp-800-53/r5/ac/ac-2/')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    expect(link.className).toContain('overflow-wrap:anywhere')
    expect(screen.getByRole('link', { name: 'HTTP' }).getAttribute('href')).toBe('http://example.test/a')
  })

  it('never makes a link of javascript:, data: or other schemes, but keeps the words', () => {
    const { container } = mount('[bấm vào](javascript:alert(1)) [tệp](data:text/html;base64,AAAA) [ftp](ftp://host/x)')
    expect(container.querySelector('a')).toBeNull()
    expect(container.textContent).toContain('bấm vào')
    expect(container.textContent).toContain('tệp')
    expect(container.textContent).not.toContain('javascript')
    expect(safeHref('javascript:alert(1)')).toBeNull()
    expect(safeHref('//evil.test/x')).toBeNull()
    expect(safeHref('not a url')).toBeNull()
    expect(safeHref('https://ok.test/a')).toBe('https://ok.test/a')
  })

  it('does not interpret HTML in the text', () => {
    const { container } = mount('<img src=x onerror=alert(1)> **an toàn**')
    expect(container.querySelector('img')).toBeNull()
    expect(container.textContent).toContain('<img src=x onerror=alert(1)>')
    expect(container.querySelector('strong')?.textContent).toBe('an toàn')
  })

  it('splits ordered items on single newlines and keeps their numbers', () => {
    const { container } = mount('1. **Một** điều\n2. Hai điều\n3. Ba điều')
    const list = container.querySelector('ol')
    expect(list).not.toBeNull()
    expect([...list!.querySelectorAll('li')].map((item) => item.textContent)).toEqual([
      'Một điều',
      'Hai điều',
      'Ba điều'
    ])
    expect(list?.getAttribute('start')).toBe('1')
    expect(container.querySelector('li strong')?.textContent).toBe('Một')

    const later = mount('5. Năm\n6. Sáu')
    expect(later.container.querySelector('ol')?.getAttribute('start')).toBe('5')
  })

  it('renders bullet lists, paragraphs and line breaks, and joins an indented continuation to its item', () => {
    const { container } = mount('Giới thiệu\ndòng hai\n\n- a\n* b\n  tiếp theo\n\nĐoạn cuối')
    const paragraphs = [...container.querySelectorAll('p')]
    expect(paragraphs).toHaveLength(2)
    expect(paragraphs[0].querySelectorAll('br')).toHaveLength(1)
    const items = [...container.querySelectorAll('ul li')].map((item) => item.textContent)
    expect(items).toEqual(['a', 'b tiếp theo'])
    expect(paragraphs[1].textContent).toBe('Đoạn cuối')
  })

  it('handles a list that changes kind and CRLF line endings', () => {
    expect(parsePolicyBlocks('1. a\r\n- b')).toEqual([
      { kind: 'list', ordered: true, start: 1, items: ['a'] },
      { kind: 'list', ordered: false, start: 1, items: ['b'] }
    ])
    expect(parsePolicyBlocks('')).toEqual([])
  })

  it('renders a real policy line: numbered item with bold, italic and a link', () => {
    const { container } = mount(
      '1. **Mọi quyền qua Request**, không tự cấp. — _Đối chiếu:_ Khớp chuẩn · [NIST AC-2](https://csf.tools/ac-2/)'
    )
    const item = container.querySelector('ol > li')
    expect(item?.querySelector('strong')?.textContent).toBe('Mọi quyền qua Request')
    expect(item?.querySelector('em')?.textContent).toBe('Đối chiếu:')
    expect(item?.querySelector('a')?.getAttribute('href')).toBe('https://csf.tools/ac-2/')
    expect(item?.textContent).not.toMatch(/[*_[\]]/)
  })
})
