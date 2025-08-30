import { useState } from 'react'
import './App.css'
import Canvas from './components/Canvas'
import ConfigPanel from './components/ConfigPanel'
import Chat from './components/Chat'
import TopBar from './components/TopBar'
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

  const addItem = (type: string, content: string) => {
    setCanvasItems(prev => [...prev, { id: Date.now().toString() + Math.random(), type, content, x: Math.random()*1000, y: Math.random()*800 }])
  }

  const clearBoard = () => setCanvasItems([])
  const generateBoard = () => {
    const seed = [
      { type: 'theme', content: 'Traditional Rich', x: 120, y: 40 },
      { type: 'color', content: '#B3001B', x: 80, y: 140 },
      { type: 'color', content: '#E9B949', x: 140, y: 140 },
      { type: 'color', content: '#F5F5F5', x: 200, y: 140 },
      { type: 'element', content: 'Mandap', x: 420, y: 260 },
      { type: 'motif', content: 'Garland', x: 320, y: 320 },
      { type: 'motif', content: 'Elephant', x: 520, y: 320 }
    ]
    setCanvasItems(seed.map(s => ({ id: crypto.randomUUID?.() || (Date.now().toString()+Math.random()), ...s })))
  }

  return (
    <div className="app">
      <TopBar
        onNew={() => setCanvasItems([])}
        onClear={clearBoard}
        onGenerate={generateBoard}
      />
      <div className="studio-body">
        {showLibrary && <LibraryPanel onAdd={addItem} onClose={() => setShowLibrary(false)} />}
        <Canvas items={canvasItems} />
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
    </div>
  )
}

export default App
