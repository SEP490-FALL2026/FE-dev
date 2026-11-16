import type { ReactNode } from 'react'

/**
 * A small, safe renderer for the markdown BE writes in policy text. It builds React elements (never HTML strings),
 * understands only: paragraphs, ordered and unordered lists, **bold**, _italic_ / *italic*, `code` and
 * [label](http(s) url). Anything else stays plain text.
 */

// One pass over the text: the leftmost construct wins, the alternatives are tried in this order at the same place.
const INLINE = new RegExp(
  [
    '`([^`\\n]+)`', // 1: code
    '\\[([^\\]\\n]+)\\]\\(([^\\s)]+)\\)', // 2: link label, 3: link target
    '\\*\\*(?=\\S)(.+?)(?<=\\S)\\*\\*', // 4: bold
    '(?<![\\p{L}\\p{N}_*])_(?=\\S)([^_\\n]+?)(?<=\\S)_(?![\\p{L}\\p{N}_])', // 5: italic with underscores
    '(?<![\\p{L}\\p{N}*])\\*(?=[^\\s*])([^*\\n]+?)(?<=[^\\s*])\\*(?![\\p{L}\\p{N}*])' // 6: italic with stars
  ].join('|'),
  'gu'
)

const linkClass = 'text-primary underline underline-offset-2 [overflow-wrap:anywhere] hover:opacity-80'

/** Only plain web links are followed; `javascript:`, `data:` and the like are shown as text. */
export function safeHref(target: string): string | null {
  try {
    const url = new URL(target)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

/** Inline constructs of one line of text. `allowLinks` is off inside a link label. */
export function renderPolicyInline(text: string, allowLinks = true, keyPrefix = 'i'): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let index = 0
  for (const match of text.matchAll(INLINE)) {
    const start = match.index ?? 0
    if (start > last) nodes.push(text.slice(last, start))
    const key = `${keyPrefix}-${index++}`
    const [whole, code, label, target, bold, underscoreItalic, starItalic] = match
    if (code !== undefined) {
      nodes.push(
        <code
          key={key}
          className='rounded bg-surface-subtle px-1 py-0.5 font-mono text-[0.85em] [overflow-wrap:anywhere]'
        >
          {code}
        </code>
      )
    } else if (label !== undefined && target !== undefined) {
      const href = allowLinks ? safeHref(target) : null
      if (href) {
        nodes.push(
          <a key={key} href={href} target='_blank' rel='noopener noreferrer' className={linkClass}>
            {renderPolicyInline(label, false, key)}
          </a>
        )
      } else {
        // An unsafe target keeps the words the author wrote and drops the link.
        nodes.push(...renderPolicyInline(label, false, key))
      }
    } else if (bold !== undefined) {
      nodes.push(
        <strong key={key} className='font-semibold'>
          {renderPolicyInline(bold, allowLinks, key)}
        </strong>
      )
    } else {
      const italic = underscoreItalic ?? starItalic ?? whole
      nodes.push(<em key={key}>{renderPolicyInline(italic, allowLinks, key)}</em>)
    }
    last = start + whole.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

type Block = { kind: 'paragraph'; lines: string[] } | { kind: 'list'; ordered: boolean; start: number; items: string[] }

const ORDERED_ITEM = /^\s*(\d{1,3})[.)]\s+(\S.*)$/
const BULLET_ITEM = /^\s*[-*•]\s+(\S.*)$/

/** Splits text into paragraphs (blank-line separated) and lists (one item per line, indented lines continue it). */
export function parsePolicyBlocks(text: string): Block[] {
  const blocks: Block[] = []
  for (const chunk of text.replace(/\r\n?/g, '\n').split(/\n{2,}/)) {
    let paragraph: string[] = []
    let list: Extract<Block, { kind: 'list' }> | null = null
    const closeParagraph = () => {
      if (paragraph.length) blocks.push({ kind: 'paragraph', lines: paragraph })
      paragraph = []
    }
    const closeList = () => {
      if (list) blocks.push(list)
      list = null
    }
    for (const line of chunk.split('\n')) {
      if (!line.trim()) continue
      const ordered = ORDERED_ITEM.exec(line)
      const bullet = ordered ? null : BULLET_ITEM.exec(line)
      if (ordered || bullet) {
        const isOrdered = Boolean(ordered)
        if (list && list.ordered !== isOrdered) closeList()
        closeParagraph()
        if (!list) list = { kind: 'list', ordered: isOrdered, start: ordered ? Number(ordered[1]) : 1, items: [] }
        list.items.push((ordered?.[2] ?? bullet?.[1] ?? '').trim())
      } else if (list && /^\s/.test(line)) {
        list.items[list.items.length - 1] += ` ${line.trim()}`
      } else {
        closeList()
        paragraph.push(line.trim())
      }
    }
    closeParagraph()
    closeList()
  }
  return blocks
}

export function PolicyMarkdown({ text }: { text: string }) {
  return (
    <div className='space-y-2.5 text-sm leading-relaxed text-foreground/90 [overflow-wrap:anywhere]'>
      {parsePolicyBlocks(text).map((block, blockIndex) => {
        const key = `b-${blockIndex}`
        if (block.kind === 'paragraph') {
          return (
            <p key={key}>
              {block.lines.map((line, lineIndex) => (
                <span key={lineIndex}>
                  {lineIndex > 0 && <br />}
                  {renderPolicyInline(line, true, `${key}-${lineIndex}`)}
                </span>
              ))}
            </p>
          )
        }
        const List = block.ordered ? 'ol' : 'ul'
        return (
          <List
            key={key}
            {...(block.ordered ? { start: block.start } : {})}
            className={`space-y-1.5 pl-5 ${block.ordered ? 'list-decimal' : 'list-disc'}`}
          >
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className='pl-1'>
                {renderPolicyInline(item, true, `${key}-${itemIndex}`)}
              </li>
            ))}
          </List>
        )
      })}
    </div>
  )
}
