import { parseFrontmatter } from './frontmatter'

const modules = import.meta.glob('/src/content/staff/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export interface StaffMember {
  slug: string
  name: string
  role: string
  photo: string
  order: number
  /** 1, 2 or 3: which team column this person sits in (unset: spread evenly) */
  column: number
  bio: string
}

export const staff: StaffMember[] = Object.entries(modules)
  .map(([path, raw]) => {
    const filename = path.split('/').pop()!
    const slug = filename.replace(/\.md$/, '')
    const { data, content } = parseFrontmatter(raw)
    return {
      slug,
      name: data.name ?? slug,
      role: data.role ?? '',
      photo: data.photo ?? '',
      order: data.order ? Number(data.order) : Number.MAX_SAFE_INTEGER,
      column: data.column ? Number(data.column) : 0,
      bio: content.trim(),
    }
  })
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
