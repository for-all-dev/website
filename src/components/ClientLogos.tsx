import { useEffect, useRef, useState } from 'react'
import { clients, type ClientLogo } from '../lib/clients'

/** seconds of travel per logo — slow enough to read, not a slideshow */
const SECONDS_PER_LOGO = 7

/** keep the track wide enough that short client lists still fill the rail */
const MIN_PLAQUES = 8

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

/** past this many px of pointer travel, a press is a pan, not a click */
const DRAG_THRESHOLD = 5

const mod = (x: number, m: number) => ((x % m) + m) % m

/**
 * Drives the rail by hand instead of with a CSS animation, so it can keep
 * drifting under the cursor and still be panned: drag (mouse or touch),
 * horizontal wheel / trackpad swipe, or the arrow buttons. The track holds
 * `reps` copies of the roster and the offset wraps at one roster width, so
 * panning in either direction never runs out of logos.
 */
function useRail(rosterSize: number, reps: number) {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const nudgeRef = useRef<(slots: number) => void>(() => {})

  useEffect(() => {
    const marquee = marqueeRef.current
    const track = trackRef.current
    if (!marquee || !track || rosterSize === 0) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let loopWidth = track.scrollWidth / reps
    const resize = new ResizeObserver(() => {
      loopWidth = track.scrollWidth / reps
    })
    resize.observe(track)

    let offset = 0 // px the track is shifted left
    let pending = 0 // px of button nudge still to ease through
    let drag: {
      id: number
      startX: number
      startOffset: number
      moved: boolean
    } | null = null
    let suppressClick = false

    const apply = () => {
      if (loopWidth > 0) offset = mod(offset, loopWidth)
      track.style.transform = `translate3d(${-offset}px, 0, 0)`
    }

    let last = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      if (!drag) {
        if (!reduceMotion.matches && loopWidth > 0) {
          offset += (loopWidth / (rosterSize * SECONDS_PER_LOGO)) * dt
        }
        if (pending !== 0) {
          const step = pending * (1 - Math.exp(-dt * 9))
          offset += step
          pending = Math.abs(pending - step) < 0.5 ? 0 : pending - step
        }
      }
      apply()
      frame = requestAnimationFrame(tick)
    })

    nudgeRef.current = (slots) => {
      pending += (slots * loopWidth) / rosterSize
    }

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      pending = 0
      suppressClick = false
      drag = { id: e.pointerId, startX: e.clientX, startOffset: offset, moved: false }
    }
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const dx = e.clientX - drag.startX
      if (!drag.moved && Math.abs(dx) > DRAG_THRESHOLD) {
        drag.moved = true
        marquee.setPointerCapture(e.pointerId)
        marquee.classList.add('is-dragging')
      }
      if (drag.moved) offset = drag.startOffset - dx
    }
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      suppressClick = drag.moved
      drag = null
      marquee.classList.remove('is-dragging')
    }
    // a drag that ends over a logo must not also follow its link
    const onClick = (e: MouseEvent) => {
      if (suppressClick) {
        e.preventDefault()
        e.stopPropagation()
        suppressClick = false
      }
    }
    // horizontal wheel / two-finger swipe pans; vertical scroll is left alone
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      pending = 0
      offset += e.deltaX
    }

    marquee.addEventListener('pointerdown', onDown)
    marquee.addEventListener('pointermove', onMove)
    marquee.addEventListener('pointerup', onUp)
    marquee.addEventListener('pointercancel', onUp)
    marquee.addEventListener('click', onClick, true)
    marquee.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      marquee.removeEventListener('pointerdown', onDown)
      marquee.removeEventListener('pointermove', onMove)
      marquee.removeEventListener('pointerup', onUp)
      marquee.removeEventListener('pointercancel', onUp)
      marquee.removeEventListener('click', onClick, true)
      marquee.removeEventListener('wheel', onWheel)
    }
  }, [rosterSize, reps])

  return { marqueeRef, trackRef, nudge: (slots: number) => nudgeRef.current(slots) }
}

export function ClientLogos() {
  const light = useLightArtwork()
  // a missing asset drops its plaque rather than parading a broken-image icon
  const [broken, setBroken] = useState<readonly string[]>([])

  const roster = clients.filter((client) => !broken.includes(client.logo))

  // Render the roster `reps` times end to end; the rail wraps its offset at
  // exactly one roster width, so the loop point is invisible. Plaque spacing
  // lives in margin (not `gap`) so one roster is exactly 1 / reps of the track.
  const reps = Math.max(2, Math.ceil(MIN_PLAQUES / Math.max(roster.length, 1)))
  const { marqueeRef, trackRef, nudge } = useRail(roster.length, reps)

  if (roster.length === 0) return null

  return (
    <div className="client-rail">
      <button
        type="button"
        className="client-nudge client-nudge-prev"
        aria-label="Previous logos"
        onClick={() => nudge(-1)}
      >
        ‹
      </button>
      <div className="client-marquee" ref={marqueeRef}>
        <div className="client-track" ref={trackRef}>
          {Array.from({ length: reps }, (_, rep) =>
            roster.map((client) => (
              <div
                key={`${rep}-${client.slug}`}
                className="client-slot"
                aria-hidden={rep > 0 ? true : undefined}
              >
                <Plaque
                  client={client}
                  clone={rep > 0}
                  inverted={client.invert ?? light[client.logo] ?? false}
                  onError={() =>
                    setBroken((prev) =>
                      prev.includes(client.logo) ? prev : [...prev, client.logo],
                    )
                  }
                />
              </div>
            )),
          )}
        </div>
      </div>
      <button
        type="button"
        className="client-nudge client-nudge-next"
        aria-label="Next logos"
        onClick={() => nudge(1)}
      >
        ›
      </button>
    </div>
  )
}
