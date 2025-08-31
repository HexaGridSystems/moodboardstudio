import React from 'react'
import './PromptPanel.css'

interface PromptPanelProps {
  value: string
  onChange: (v: string) => void
  onGenerateImages: () => void
  collapsed: boolean
  onToggle: () => void
  leftOffset?: number
  rightOffset?: number
}

const PromptPanel: React.FC<PromptPanelProps> = ({ value, onChange, onGenerateImages, collapsed, onToggle, leftOffset = 0, rightOffset = 0 }) => {
  return (
    <div
      className={"prompt-panel" + (collapsed ? ' collapsed' : '')}
      style={{ left: leftOffset, right: rightOffset }}
    >
      <div className="prompt-panel__bar">
        <strong style={{ fontSize: 12 }}>Wedding Prompt</strong>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {!collapsed && (
            <button
              className="generate-images-btn"
              onClick={onGenerateImages}
              disabled={!value.trim()}
            >Generate Images</button>
          )}
          <button className="collapse-btn" onClick={onToggle} aria-label={collapsed ? 'Expand prompt panel' : 'Collapse prompt panel'}>
            {collapsed ? '▲' : '▼'}
          </button>
        </div>
      </div>
      {!collapsed && (
        <textarea
          className="prompt-textarea"
          placeholder="Describe wedding style, venue, palette, cultural motifs, mood, lighting..."
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={4}
        />
      )}
    </div>
  )
}

export default PromptPanel
