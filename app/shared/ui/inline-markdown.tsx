import { Fragment, type ReactNode } from 'react'

// Bold, italic, inline code and links; anything else stays as plain text. No HTML is ever injected.
const inlinePattern =
  /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(?<![\p{L}\p{N}])_([^_]+)_(?![\p{L}\p{N}])/gu

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(inlinePattern)) {
    const index = match.index ?? 0
    if (index > last) nodes.push(text.slice(last, index))
    const key = `${keyPrefix}-${index}`
    const [, bold, code, label, href, italic] = match
    if (bold !== undefined) nodes.push(<strong key={key}>{renderInline(bold, key)}</strong>)
    else if (code !== undefined)
      nodes.push(
        <code key={key} className='rounded bg-surface-subtle px-1 font-mono text-[0.9em]'>
          {code}
        </code>
      )
    else if (label !== undefined && href !== undefined)
      nodes.push(
        <a
          key={key}
          href={href}
          target='_blank'
          rel='noreferrer noopener'
          className='text-primary-ink underline [overflow-wrap:anywhere]'
        >
          {label}
        </a>
      )
    else if (italic !== undefined) nodes.push(<em key={key}>{renderInline(italic, key)}</em>)
    last = index + match[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/** Renders the small Markdown subset used in server-authored text (policies), keeping line breaks. */
export function InlineMarkdown({ text, className }: { text: string; className?: string }) {
  const lines = text.split('\n')
  return (
    <p className={className}>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index > 0 && <br />}
          {renderInline(line, String(index))}
        </Fragment>
      ))}
    </p>
  )
}
