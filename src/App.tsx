import { useState, useRef } from 'react'
import './App.css'
import Canvas, { type CanvasHandle } from './components/Canvas'
import ConfigPanel from './components/ConfigPanel'
import Chat from './components/Chat'
import TopBar from './components/TopBar'
import PromptPanel from './components/PromptPanel'
import { buildPrompt, generateImagesWithAIStudio } from './services/imageGenerator'
// Removed LogPanel per request
import LibraryPanel from './components/LibraryPanel'

interface CanvasItem {
  id: string
  type: string
  content: string
  x: number
  y: number
}

function App() {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([])
  const [showLibrary, setShowLibrary] = useState(true)
  const [showConfig, setShowConfig] = useState(true)
  const [weddingDetails, setWeddingDetails] = useState('')
  const [promptCollapsed, setPromptCollapsed] = useState(false)
  const [generating, setGenerating] = useState(false)
  const apiKey = import.meta.env?.VITE_GEMINI_API_KEY as string | undefined
  const canvasRef = useRef<CanvasHandle | null>(null)

  const generateImages = async () => {
    if (generating) return
    setGenerating(true)
  console.log('[gen] ---- New Generation Request ----')
    try {
      // Derive context from current board items
      const colors = canvasItems.filter(i => i.type === 'color').map(i => i.content).slice(0,8)
      const elements = canvasItems.filter(i => i.type === 'element').map(i => i.content).slice(0,8)
      const motifs = canvasItems.filter(i => i.type === 'motif').map(i => i.content).slice(0,8)
      const themes = canvasItems.filter(i => i.type === 'theme').map(i => i.content).slice(0,4)
      const ceremonies = canvasItems.filter(i => i.type === 'ceremony').map(i => i.content).slice(0,10)
      const fullPrompt = buildPrompt(weddingDetails || 'Indian wedding moodboard', { colors, elements, motifs, themes, ceremonies })
  console.log('[gen] Built prompt', fullPrompt)
      const imgs = await generateImagesWithAIStudio({
        prompt: fullPrompt,
        context: { colors, elements, motifs, themes, ceremonies },
        apiKey,
        logger: e => {
          if (e.level === 'error') console.error('[gen]', e.message, e.data)
          else console.log('[gen]', e.message, e.data)
        }
      })
  console.log('[gen] Received images', imgs.length)
      // Auto place generated images centered on the visible canvas area
      if (imgs.length) {
  const baseCenter = canvasRef.current?.getCenter() || { x: 600, y: 400 }
  const IMG_W = 240
  const IMG_H = 180
  const padding = 24
  const count = imgs.length
  let cols = Math.ceil(Math.sqrt(count))
  const rows = Math.ceil(count / cols)
  const gridWidth = cols * IMG_W + (cols - 1) * padding
  const gridHeight = rows * IMG_H + (rows - 1) * padding
  const originX = baseCenter.x - gridWidth / 2
  const originY = baseCenter.y - gridHeight / 2
        setCanvasItems(prev => {
          const now = Date.now()
          const placed = imgs.map((img, idx) => {
            const r = Math.floor(idx / cols)
            const c = idx % cols
            const x = originX + c * (IMG_W + padding)
            const y = originY + r * (IMG_H + padding)
            return { id: 'img-' + img.id + '-' + now, type: 'image', content: img.url, x, y }
          })
          return [...prev, ...placed]
        })
  console.log('[gen] Placed generated images on canvas', { count: imgs.length })
      }
    } finally {
      setGenerating(false)
    }
  }

  // Debug key presence once
  if (typeof window !== 'undefined' && !(window as any).__API_KEY_DEBUGGED__) {
    console.log('[apiKey:init]', { hasKey: !!apiKey })
    ;(window as any).__API_KEY_DEBUGGED__ = true
  }

  const addItem = (type: string, content: string) => {
  setCanvasItems(prev => [...prev, { id: Date.now().toString() + Math.random(), type, content, x: Math.random()*1000, y: Math.random()*800 }])
  }

  const clearBoard = () => setCanvasItems([])

  return (
    <div className="app">
      <TopBar
        onNew={() => setCanvasItems([])}
        onClear={clearBoard}
      />
      <div className="studio-body">
        {showLibrary && <LibraryPanel onAdd={addItem} onClose={() => setShowLibrary(false)} />}
  <Canvas items={canvasItems} ref={canvasRef} />
        {showConfig && <ConfigPanel setItems={setCanvasItems} onClose={() => setShowConfig(false)} />}
      </div>
      {!showLibrary && (
        <button
          className="reopen-btn reopen-btn--left"
          aria-label="Show library panel"
          onClick={() => setShowLibrary(true)}
        >▸ Library</button>
      )}
      {!showConfig && (
        <button
          className="reopen-btn reopen-btn--right"
          aria-label="Show configuration panel"
          onClick={() => setShowConfig(true)}
        >Config ◂</button>
      )}
      <Chat />
      <PromptPanel
        value={weddingDetails}
        onChange={setWeddingDetails}
        onGenerateImages={generateImages}
        collapsed={promptCollapsed}
        onToggle={() => setPromptCollapsed(c => !c)}
        leftOffset={showLibrary ? 240 : 0}
        rightOffset={showConfig ? 320 : 0}
      />
      {generating && (
        <div className="generating-overlay">
          <div className="generating-overlay__inner">
            <div className="spinner" />
            <div className="generating-overlay__text">Generating images...</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
