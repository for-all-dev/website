import { parseFrontmatter } from './frontmatter'

const modules = import.meta.glob('/src/content/clients/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export interface ClientLogo {
  slug: string
  name: string
  url: string
  logo: string
  order: number
  /**
   * Optional override for the light-on-transparent (dark-mode) wordmark case.
   * Left undefined, the marquee samples the asset and decides for itself.
   */
  invert?: boolean
}

export const clients: ClientLogo[] = Object.entries(modules)
  .map(([path, raw]) => {
    const filename = path.split('/').pop()!
    const slug = filename.replace(/\.md$/, '')
    const { data } = parseFrontmatter(raw)
    return {
      slug,
      name: data.name ?? slug,
      url: data.url ?? '',
      logo: data.logo ?? '',
      order: data.order ? Number(data.order) : Number.MAX_SAFE_INTEGER,
      invert: data.invert === undefined ? undefined : data.invert === 'true',
    }
  })
  .filter((client) => client.logo !== '')
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
