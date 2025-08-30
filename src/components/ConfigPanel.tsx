import React from 'react'
import './ConfigPanel.css'

interface CanvasItem {
  id: string
  type: string
  content: string
  x: number
  y: number
}

interface ConfigPanelProps {
  setItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ setItems }) => {
  const addItem = (type: string, content: string) => {
    const newItem: CanvasItem = {
      id: Date.now().toString(),
      type,
      content,
      x: Math.random() * 400,
      y: Math.random() * 400
    }
    setItems(prev => [...prev, newItem])
  }

  const colorSwatches = ['#B3001B', '#E9B949', '#F5F5F5', '#5A3E36', '#C77D33']

  return (
    <div className="config-panel">
      <h3>Wedding Configuration</h3>
      <div className="config-section">
        <h4>Color Swatches</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          {colorSwatches.map(c => (
            <button
              key={c}
              onClick={() => addItem('color', c)}
              style={{
                width: 36,
                height: 36,
                background: c,
                border: '1px solid var(--color-border)',
                borderRadius: 6,
                cursor: 'pointer'
              }}
              title={c}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Red','Gold','White'].map(col => (
              <button key={col} onClick={() => addItem('color', col)} style={{ flex: '1 0 70px' }}>Add {col}</button>
            ))}
        </div>
      </div>
      <div className="config-section">
        <h4>Elements</h4>
        <button onClick={() => addItem('element', 'Mandap')}>Add Mandap</button>
        <button onClick={() => addItem('element', 'Flowers')}>Add Flowers</button>
        <button onClick={() => addItem('element', 'Lights')}>Add Lights</button>
      </div>
      <div className="config-section">
        <h4>Motifs</h4>
        {['Garland','Diyas','Elephant','Peacock Feather'].map(m => (
          <button key={m} onClick={() => addItem('motif', m)}>{m}</button>
        ))}
      </div>
      <div className="config-section">
        <h4>Themes</h4>
        <button onClick={() => addItem('theme', 'Traditional')}>Traditional</button>
        <button onClick={() => addItem('theme', 'Modern')}>Modern</button>
      </div>
    </div>
  )
}

export default ConfigPanel
