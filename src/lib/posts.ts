import { parseFrontmatter } from './frontmatter'

const modules = import.meta.glob('/src/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export interface Post {
  slug: string
  date: string
  title: string
  content: string
}

const FILENAME_RE = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/

export const posts: Post[] = Object.entries(modules)
  .map(([path, raw]) => {
    const filename = path.split('/').pop()!
    const match = filename.match(FILENAME_RE)
    if (!match) return null
    const [, date, slug] = match
    const { data, content } = parseFrontmatter(raw)
    return {
      slug,
      date,
      title: data.title ?? slug,
      content: content.trim(),
    }
  })
  .filter((post): post is Post => post !== null)
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}
