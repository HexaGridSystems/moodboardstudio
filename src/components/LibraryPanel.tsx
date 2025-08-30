import React, { useState } from 'react'
import './LibraryPanel.css'

interface LibraryPanelProps { onAdd: (type: string, content: string) => void }

// (Color swatches moved to right ConfigPanel)
// Region-specific ceremony sets
const northCeremonies = [
  'Haldi',
  'Mehendi',
  'Sangeet',
  'Baraat',
  'Pheras',
  'Kanyadaan',
  'Vidaai',
  'Reception'
]

const southCeremonies = [
  'Vratham',
  'Nalangu',
  'Kashi Yatra',
  'Oonjal',
  'Muhurtham',
  'Kanyadanam',
  'Saptapadi',
  'Griha Pravesham',
  'Reception'
]

const LibraryPanel: React.FC<LibraryPanelProps> = ({ onAdd }) => {
  const [region, setRegion] = useState<'north' | 'south'>('north')
  const currentCeremonies = region === 'north' ? northCeremonies : southCeremonies

  return (
    <aside className="library" aria-label="Asset library">
      <div className="library__section" style={{ gap: 8 }}>
        <h4 style={{ marginBottom: 6 }}>Region</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setRegion('north')}
            style={{
              flex: 1,
              background: region === 'north' ? 'var(--color-accent)' : 'var(--color-surface)',
              color: region === 'north' ? '#fff' : 'var(--color-text)',
              border: '1px solid var(--color-border)',
              padding: '6px 10px',
              borderRadius: 6,
              fontSize: 12,
              cursor: 'pointer'
            }}
          >North</button>
          <button
            onClick={() => setRegion('south')}
            style={{
              flex: 1,
              background: region === 'south' ? 'var(--color-accent)' : 'var(--color-surface)',
              color: region === 'south' ? '#fff' : 'var(--color-text)',
              border: '1px solid var(--color-border)',
              padding: '6px 10px',
              borderRadius: 6,
              fontSize: 12,
              cursor: 'pointer'
            }}
          >South</button>
        </div>
      </div>
      <div className="library__section">
        <h4>{region === 'north' ? 'North Indian Ceremonies' : 'South Indian Ceremonies'}</h4>
        <div className="list-buttons">
          {currentCeremonies.map(c => (
            <button key={c} onClick={() => onAdd('ceremony', c)}>{c}</button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default LibraryPanel
