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

  const addItem = (type: string, content: string) => {
    setCanvasItems(prev => [...prev, { id: Date.now().toString() + Math.random(), type, content, x: Math.random()*1000, y: Math.random()*800 }])
  }

  const clearBoard = () => setCanvasItems([])

  return (
    <div className="app">
      <TopBar onNew={() => setCanvasItems([])} onClear={clearBoard} />
      <div className="studio-body">
        <LibraryPanel onAdd={addItem} />
        <Canvas items={canvasItems} />
        <ConfigPanel setItems={setCanvasItems} />
      </div>
      <Chat />
    </div>
  )
}

export default App
