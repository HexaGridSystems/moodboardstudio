import React from 'react'
import './LogPanel.css'

export interface LogEntry { level: 'info' | 'error'; message: string; data?: any; ts: number }

interface LogPanelProps { entries: LogEntry[]; onClear: () => void }

const LogPanel: React.FC<LogPanelProps> = ({ entries, onClear }) => {
  if (!entries.length) return null
  return (
    <div className="log-panel">
      <div className="log-panel__header">
        <strong>Generation Logs</strong>
        <button onClick={onClear}>Clear</button>
      </div>
      <div className="log-panel__body">
        {entries.slice().reverse().map(e => (
          <div key={e.ts} className={`log-line ${e.level}`}>[{new Date(e.ts).toLocaleTimeString()}] {e.message}{e.data !== undefined && (
            <pre>{typeof e.data === 'string' ? e.data : JSON.stringify(e.data, null, 2)}</pre>
          )}</div>
        ))}
      </div>
    </div>
  )
}

export default LogPanel
