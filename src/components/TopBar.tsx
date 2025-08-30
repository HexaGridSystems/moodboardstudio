import React from 'react'
import './TopBar.css'

interface TopBarProps {
  onNew?: () => void
  onClear?: () => void
  onGenerate?: () => void
}

const TopBar: React.FC<TopBarProps> = ({ onNew, onClear, onGenerate }) => {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <div className="brand">🎨 Indian Wedding Studio</div>
        <nav className="topbar__nav">
          <button onClick={onNew}>New Board</button>
          <button onClick={onGenerate}>Generate</button>
          <button onClick={onClear}>Clear</button>
        </nav>
      </div>
      <div className="topbar__right">
        <input className="topbar__search" placeholder="Search assets, themes..." />
      </div>
    </header>
  )
}

export default TopBar
