// Image generation service integrating with AI Studio (Google AI Studio / Gemini) placeholder
// This uses a text model to draft image concepts; replace with actual image model/endpoint when available.

export interface GenerateContextItemSummary {
  colors: string[]
  elements: string[]
  motifs: string[]
  themes: string[]
  ceremonies: string[]
}

export interface GenerateImagesOptions {
  prompt: string
  context: GenerateContextItemSummary
  count?: number
  apiKey?: string
  logger?: (entry: { level: 'info' | 'error'; message: string; data?: any }) => void
}

export interface GeneratedImageResult { id: string; url: string; alt: string }

export function buildPrompt(basePrompt: string, context: GenerateContextItemSummary): string {
  const sections: string[] = []
  if (context.colors.length) sections.push(`Palette: ${context.colors.join(', ')}`)
  if (context.elements.length) sections.push(`Key Elements: ${context.elements.join(', ')}`)
  if (context.motifs.length) sections.push(`Motifs: ${context.motifs.join(', ')}`)
  if (context.themes.length) sections.push(`Themes: ${context.themes.join(', ')}`)
  if (context.ceremonies.length) sections.push(`Ceremony Focus: ${context.ceremonies.slice(0,8).join(', ')}`)
  const contextBlock = sections.length ? `\nContext:\n${sections.join('\n')}` : ''
  return `${basePrompt.trim()}${contextBlock}\nGenerate cohesive Indian wedding moodboard image concepts emphasizing authentic cultural details, rich textures, balanced composition, and cinematic soft lighting.`
}

export async function generateImagesWithAIStudio(opts: GenerateImagesOptions): Promise<GeneratedImageResult[]> {
  const { prompt, apiKey, count = 4, logger } = opts

  const log = (level: 'info' | 'error', message: string, data?: any) => {
    try { logger?.({ level, message, data }) } catch { /* ignore */ }
    if (level === 'error') {
      console.error('[gen]', message, data)
    } else {
      console.log('[gen]', message, data)
    }
  }

  log('info', 'Starting generation', { count, hasKey: !!apiKey })

  // If no key, placeholders.
  if (!apiKey) {
    log('info', 'No API key provided, returning placeholders')
    return placeholderSet(count, 'No API key')
  }

  // Generate textual briefs with Gemini (primary step for now)
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [ { parts: [ { text: `Create ${count} concise distinct Indian wedding moodboard image briefs (no numbering) for:\n${prompt}` } ] } ] })
    })
    log('info', 'Text brief endpoint status', { status: response.status })
    const data = await response.json()
    log('info', 'Text brief response parsed', { keys: Object.keys(data || {}) })
    const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('\n') || ''
    const briefs = text.split(/\n+/).filter(Boolean).slice(0, count)
    if (briefs.length) {
      log('info', 'Generated briefs', { briefs })
      // Use Unsplash themed placeholders to give visual variety (not actual AI images yet)
      const ts = Date.now()
      const raw = briefs.map((b: string, i: number) => {
        const words = b.split(/[ ,]/).filter(Boolean)
        const keyword = encodeURIComponent(words.slice(0,4).join(' ')) || 'wedding'
        const seed = encodeURIComponent(words.slice(0,2).join('-') || 'wedding') + '-' + (ts + i)
        // Candidate URL priority list (will be tried sequentially during validation):
        const candidates = [
          // Unsplash featured (broad)
          `https://source.unsplash.com/featured/400x300?${keyword}&sig=${ts + i}`,
          // Unsplash query variant
          `https://source.unsplash.com/400x300/?${keyword}&sig=${ts + i}`,
          // Picsum deterministic seed
          `https://picsum.photos/seed/${seed}/400/300`
        ]
        return { id: `brief-${ts}-${i}`, url: candidates[0], alt: b, _candidates: candidates }
      }) as (GeneratedImageResult & { _candidates: string[] })[]
      log('info', 'Validating candidate image URLs', { total: raw.length, maxAttemptsPer: 3 })
      const validated = await validateImages(raw, logger)
      return validated as GeneratedImageResult[]
    }
  } catch (e) {
    log('error', 'Gemini brief fallback failed', String(e))
  }

  log('error', 'All strategies failed, returning placeholders')
  return placeholderSet(count, 'Failure')
}

function placeholderSet(count: number, label: string): GeneratedImageResult[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `placeholder-${label}-${i}`,
    url: `https://placehold.co/400x300?text=${encodeURIComponent(label+' '+(i+1))}`,
    alt: `${label} placeholder ${i+1}`
  }))
}

// Attempts to load images (client-side) and replaces failing URLs with placeholders.
async function validateImages(images: (GeneratedImageResult & { _candidates?: string[] })[], logger?: GenerateImagesOptions['logger']): Promise<GeneratedImageResult[]> {
  const loadOne = (img: GeneratedImageResult & { _candidates?: string[] }): Promise<GeneratedImageResult> => {
    return new Promise(resolve => {
      const candidates = img._candidates && img._candidates.length ? [...img._candidates] : [img.url]
      const attempt = (url: string, attemptIndex: number) => {
        // Skip validation for placeholder providers
        if (/placehold\.co/.test(url)) return finish(false, url, attemptIndex)
        const tag = new Image()
        let finished = false
        const timeout = setTimeout(() => {
          if (!finished) {
            tag.src = '' // abort
            finish(false, url, attemptIndex)
          }
        }, 12000)
        tag.onload = () => { if (finished) return; finished = true; clearTimeout(timeout); finish(true, url, attemptIndex) }
        tag.onerror = () => { if (finished) return; finished = true; clearTimeout(timeout); finish(false, url, attemptIndex) }
        const bust = url.includes('?') ? '&' : '?'
        tag.src = url + bust + 'cb=' + Date.now()
      }
      const finish = (ok: boolean, url: string, attemptIndex: number) => {
        if (ok) {
          (logger as any)?.({ level: 'info', message: 'Image validated', data: { url, attempts: attemptIndex + 1 } })
          resolve({ id: img.id, url, alt: img.alt })
        } else {
          const next = candidates.shift()
          if (next) {
            (logger as any)?.({ level: 'info', message: 'Retrying image candidate', data: { next, attempt: attemptIndex + 2 } })
            attempt(next, attemptIndex + 1)
          } else {
            (logger as any)?.({ level: 'error', message: 'All image candidates failed', data: { original: img.url } })
            resolve({ id: img.id + '-fallback', url: `https://placehold.co/400x300?text=${encodeURIComponent('image failed')}`, alt: img.alt + ' (fallback)' })
          }
        }
      }
      // Kick off first attempt
      attempt(candidates.shift() as string, 0)
    })
  }
  const results = await Promise.all(images.map(loadOne))
  return results
}
