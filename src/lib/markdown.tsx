import type { ReactNode } from 'react'
import { WyrmRule } from '../components/WyrmRule'
import { CheeseShield } from '../components/CheeseShield'
import { ScrollRoll } from '../components/ScrollRoll'

// A small, purpose-built markdown renderer — not a CommonMark implementation.
// It covers exactly the shapes our own content uses, and a few signature
// moves that lean into the site's proof-script aesthetic: blockquotes render
// as "note." parchment scrolls, headings carry cheese-shield deep-link
// anchors, ordered lists enumerate like proof premises, fenced
// code can carry a language tag, external links get a trailing arrow, and
// footnotes collect into a "notes." endnote block.

interface Footnotes {
  order: string[]
  defs: Map<string, string>
}

const INLINE_RE =
  /\[!\[([^\]]*)\]\(([^)\s]+)\)\]\(([^)\s]+)\)|!\[([^\]]*)\]\(([^)\s]+)\)|\[\^([^\]]+)\]|\[([^\]]*)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*|_([^_]+)_/g

// Old-book footnote marks (*, †, ‡, §, ‖) instead of numerals, doubling up
// past the fifth reference rather than falling back to digits.
const FOOTNOTE_MARKS = ['*', '†', '‡', '§', '‖']

function footnoteMark(id: string, notes: Footnotes): string {
  let idx = notes.order.indexOf(id)
  if (idx === -1) {
    notes.order.push(id)
    idx = notes.order.length - 1
  }
  const mark = FOOTNOTE_MARKS[idx % FOOTNOTE_MARKS.length]
  return mark.repeat(Math.floor(idx / FOOTNOTE_MARKS.length) + 1)
}

function parseInline(text: string, notes: Footnotes): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0

  for (const match of text.matchAll(INLINE_RE)) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const [
      whole,
      linkedImgAlt,
      linkedImgSrc,
      linkedImgHref,
      imgAlt,
      imgSrc,
      footnoteId,
      linkText,
      linkHref,
      boldText,
      codeText,
      italicStarText,
      italicUnderText,
    ] = match

    if (linkedImgHref !== undefined) {
      nodes.push(
        <a key={key++} href={linkedImgHref} target="_blank" rel="noreferrer">
          <img src={linkedImgSrc} alt={linkedImgAlt} loading="lazy" />
        </a>,
      )
    } else if (imgSrc !== undefined) {
      nodes.push(<img key={key++} src={imgSrc} alt={imgAlt} loading="lazy" />)
    } else if (footnoteId !== undefined) {
      const mark = footnoteMark(footnoteId, notes)
      nodes.push(
        <sup key={key++}>
          <a
            href={`#fn-${footnoteId}`}
            id={`fnref-${footnoteId}`}
            className="footnote-ref"
          >
            {mark}
          </a>
        </sup>,
      )
    } else if (linkHref !== undefined) {
      const external = /^https?:\/\//.test(linkHref)
      nodes.push(
        <a
          key={key++}
          href={linkHref}
          className={external ? 'ext-link' : undefined}
          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {parseInline(linkText, notes)}
        </a>,
      )
    } else if (boldText !== undefined) {
      nodes.push(<strong key={key++}>{parseInline(boldText, notes)}</strong>)
    } else if (codeText !== undefined) {
      nodes.push(<code key={key++}>{codeText}</code>)
    } else if (italicStarText !== undefined) {
      nodes.push(<em key={key++}>{parseInline(italicStarText, notes)}</em>)
    } else if (italicUnderText !== undefined) {
      nodes.push(<em key={key++}>{parseInline(italicUnderText, notes)}</em>)
    }

    lastIndex = match.index + whole.length
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

// Heading ids for deep links. The anchor glyph is the cheese-shield crest
// rather than the usual pilcrow/section sign.
function slugify(text: string, used: Set<string>): string {
  const base =
    text
      .replace(/\[\^[^\]]+\]/g, '')
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  let slug = base
  let n = 2
  while (used.has(slug)) slug = `${base}-${n++}`
  used.add(slug)
  return slug
}

const HEADING_RE = /^(#{1,4})\s+(.*)$/
const RULE_RE = /^(-{3,}|\*{3,}|_{3,})\s*$/
const QUOTE_RE = /^>\s?(.*)$/
const BULLET_RE = /^\s*[-*]\s+(.*)$/
const ORDERED_RE = /^\s*\d+\.\s+(.*)$/
const FENCE_RE = /^```(\S*)\s*$/
const FOOTNOTE_DEF_RE = /^\[\^([^\]]+)\]:\s?(.*)$/
const TABLE_CELL_RE = /^:?-+:?$/

type Align = 'left' | 'right' | 'center' | undefined

function splitTableRow(line: string): string[] {
  let s = line.trim()
  if (s.startsWith('|')) s = s.slice(1)
  if (s.endsWith('|')) s = s.slice(0, -1)
  return s.split('|').map((cell) => cell.trim())
}

function tableSeparatorAligns(line: string): Align[] | null {
  const cells = splitTableRow(line)
  if (cells.length === 0 || !cells.every((cell) => TABLE_CELL_RE.test(cell))) {
    return null
  }
  return cells.map((cell) => {
    const left = cell.startsWith(':')
    const right = cell.endsWith(':')
    if (left && right) return 'center'
    if (right) return 'right'
    if (left) return 'left'
    return undefined
  })
}

function parseMarkdown(source: string): ReactNode[] {
  // Pull footnote definitions out first — they can live anywhere in the
  // source (by convention, at the bottom) and shouldn't render in place.
  const notes: Footnotes = { order: [], defs: new Map() }
  const rawLines = source.replace(/\r\n/g, '\n').split('\n')
  const lines: string[] = []
  for (const line of rawLines) {
    const def = line.match(FOOTNOTE_DEF_RE)
    if (def) {
      notes.defs.set(def[1], def[2])
    } else {
      lines.push(line)
    }
  }

  const blocks: ReactNode[] = []
  const usedSlugs = new Set<string>()
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i++
      continue
    }

    const fence = line.trim().match(FENCE_RE)
    if (fence) {
      const lang = fence[1]
      const start = i + 1
      let end = start
      while (end < lines.length && !lines[end].trim().startsWith('```')) end++
      const code = lines.slice(start, end).join('\n')
      blocks.push(
        <pre key={key++} {...(lang ? { 'data-lang': lang } : {})}>
          <code>{code}</code>
        </pre>,
      )
      i = end + 1
      continue
    }

    const heading = line.match(HEADING_RE)
    if (heading) {
      const level = heading[1].length
      const Tag = (`h${level}` as unknown) as 'h1'
      const slug = slugify(heading[2], usedSlugs)
      blocks.push(
        <Tag key={key++} id={slug}>
          {parseInline(heading[2], notes)}
          <a
            href={`#${slug}`}
            className="heading-anchor"
            aria-label="Link to this section"
          >
            <CheeseShield className="heading-anchor-shield" />
          </a>
        </Tag>,
      )
      i++
      continue
    }

    if (RULE_RE.test(line.trim())) {
      blocks.push(<WyrmRule key={key++} className="wyrm-rule" />)
      i++
      continue
    }

    if (QUOTE_RE.test(line)) {
      const quoted: string[] = []
      while (i < lines.length && QUOTE_RE.test(lines[i])) {
        quoted.push(lines[i].match(QUOTE_RE)![1])
        i++
      }
      blocks.push(
        <blockquote key={key++} className="note">
          <ScrollRoll className="scroll-roll scroll-roll-top" />
          <div className="scroll-sheet-wrap">
            <div className="scroll-sheet">
              <span className="scroll-rubric" aria-hidden="true">
                note.
              </span>
              <p>{parseInline(quoted.join(' '), notes)}</p>
            </div>
          </div>
          <ScrollRoll className="scroll-roll scroll-roll-bottom" />
        </blockquote>,
      )
      continue
    }

    if (BULLET_RE.test(line)) {
      const items: string[] = []
      while (i < lines.length && BULLET_RE.test(lines[i])) {
        items.push(lines[i].match(BULLET_RE)![1])
        i++
      }
      blocks.push(
        <ul key={key++}>
          {items.map((item, idx) => (
            <li key={idx}>{parseInline(item, notes)}</li>
          ))}
        </ul>,
      )
      continue
    }

    if (ORDERED_RE.test(line)) {
      const items: string[] = []
      while (i < lines.length && ORDERED_RE.test(lines[i])) {
        items.push(lines[i].match(ORDERED_RE)![1])
        i++
      }
      blocks.push(
        <ol key={key++} className="premises">
          {items.map((item, idx) => (
            <li key={idx}>{parseInline(item, notes)}</li>
          ))}
        </ol>,
      )
      continue
    }

    if (line.trim().startsWith('|') && i + 1 < lines.length) {
      const aligns = tableSeparatorAligns(lines[i + 1])
      if (aligns) {
        const headerCells = splitTableRow(line)
        i += 2
        const bodyRows: string[][] = []
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          bodyRows.push(splitTableRow(lines[i]))
          i++
        }
        blocks.push(
          <div className="table-wrap" key={key++}>
            <table>
              <thead>
                <tr>
                  <th className="row-index" aria-hidden="true" />
                  {headerCells.map((cell, idx) => (
                    <th
                      key={idx}
                      style={aligns[idx] ? { textAlign: aligns[idx] } : undefined}
                    >
                      {parseInline(cell, notes)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className="row-index" aria-hidden="true" />
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        style={
                          aligns[cellIdx] ? { textAlign: aligns[cellIdx] } : undefined
                        }
                      >
                        {parseInline(cell, notes)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        )
        continue
      }
    }

    const paragraph: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !FENCE_RE.test(lines[i].trim()) &&
      !HEADING_RE.test(lines[i]) &&
      !RULE_RE.test(lines[i].trim()) &&
      !QUOTE_RE.test(lines[i]) &&
      !BULLET_RE.test(lines[i]) &&
      !ORDERED_RE.test(lines[i])
    ) {
      paragraph.push(lines[i])
      i++
    }
    blocks.push(<p key={key++}>{parseInline(paragraph.join(' '), notes)}</p>)
  }

  if (notes.order.length > 0) {
    blocks.push(
      <div className="notes" key={key}>
        <p className="notes-label">notes.</p>
        <ul className="footnote-list">
          {notes.order.map((id) => (
            <li key={id} id={`fn-${id}`}>
              <span className="footnote-mark">{footnoteMark(id, notes)}</span>{' '}
              {parseInline(notes.defs.get(id) ?? '', notes)}{' '}
              <a
                href={`#fnref-${id}`}
                className="footnote-back"
                aria-label="Back to reference"
              >
                ↩
              </a>
            </li>
          ))}
        </ul>
      </div>,
    )
  }

  return blocks
}

export function Markdown({ source }: { source: string }) {
  return <>{parseMarkdown(source)}</>
}
