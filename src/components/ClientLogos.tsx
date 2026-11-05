import { useEffect, useState } from 'react'
import { clients, type ClientLogo } from '../lib/clients'
import './ClientLogos.css'

/**
 * Client logos arrive as whatever the org publishes, and plenty of orgs only
 * publish a light-on-transparent (dark-mode) wordmark, which would vanish on
 * our light plaque. Sample the asset's mean luminance once and flip the ones
 * that are drawn light. `invert:` in the frontmatter overrides this.
 */
const toneCache = new Map<string, boolean>()

async function isLightArtwork(src: string): Promise<boolean> {
  const cached = toneCache.get(src)
  if (cached !== undefined) return cached

  let light: boolean
  try {
    const img = new Image()
    img.src = src
    await img.decode()

    const size = 40
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return false
    ctx.drawImage(img, 0, 0, size, size)

    const { data } = ctx.getImageData(0, 0, size, size)
    let weight = 0
    let luminance = 0
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3]
      if (alpha < 24) continue // ignore the transparent field
      weight += alpha
      luminance +=
        alpha * (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2])
    }
    light = weight > 0 && luminance / weight > 150
  } catch {
    light = false // opaque failure: leave the asset exactly as authored
  }

  toneCache.set(src, light)
  return light
}

function useLightArtwork(): Record<string, boolean> {
  const [light, setLight] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let live = true
    const pending = clients.filter((client) => client.invert === undefined)
    if (pending.length === 0) return

    void Promise.all(
      pending.map(async (client) => [
        client.logo,
        await isLightArtwork(client.logo),
      ] as const),
    ).then((results) => {
      if (!live) return
      setLight(Object.fromEntries(results))
    })

    return () => {
      live = false
    }
  }, [])

  return light
}

function Plaque({
  client,
  clone,
  inverted,
  onError,
}: {
  client: ClientLogo
  clone: boolean
  inverted: boolean
  onError: () => void
}) {
  const inner = (
    <>
      <span className="client-plaque-frame">
        <img
          className={inverted ? 'client-logo is-inverted' : 'client-logo'}
          src={client.logo}
          alt={clone ? '' : client.name}
          loading="lazy"
          draggable={false}
          onError={onError}
        />
      </span>
      <span className="client-name">{client.name}</span>
    </>
  )

  if (!client.url) {
    return <span className="client-plaque">{inner}</span>
  }

  return (
    <a
      className="client-plaque"
      href={client.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={clone ? -1 : undefined}
      draggable={false}
    >
      {inner}
    </a>
  )
}

export function ClientLogos() {
  const light = useLightArtwork()
  // a missing asset drops its plaque rather than parading a broken-image icon
  const [broken, setBroken] = useState<readonly string[]>([])

  const roster = clients.filter((client) => !broken.includes(client.logo))
  if (roster.length === 0) return null

  return (
    <div className="client-grid">
      {roster.map((client) => (
        <Plaque
          key={client.slug}
          client={client}
          clone={false}
          inverted={client.invert ?? light[client.logo] ?? false}
          onError={() =>
            setBroken((prev) =>
              prev.includes(client.logo) ? prev : [...prev, client.logo],
            )
          }
        />
      ))}
    </div>
  )
}
