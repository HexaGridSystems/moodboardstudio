import React, { useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import './Canvas.css'

interface CanvasItem {
  id: string
  type: string
  content: string
  x: number
  y: number
}

interface CanvasProps { items: CanvasItem[] }
export interface CanvasHandle { getCenter: () => { x: number; y: number } }

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ items }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [panning, setPanning] = useState<{ startX: number; startY: number; originX: number; originY: number } | null>(null)

  useImperativeHandle(ref, () => ({
    getCenter: () => {
      const el = containerRef.current
      if (!el) return { x: 500, y: 400 }
      const vw = el.clientWidth
      const vh = el.clientHeight
      // Inverse transform to base coordinate space
      const baseX = (vw / 2 - offset.x) / scale
      const baseY = (vh / 2 - offset.y) / scale
      return { x: baseX, y: baseY }
    }
  }), [offset, scale])

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = -e.deltaY
    setScale(s => {
      const next = Math.min(3, Math.max(0.3, s + delta * 0.0015))
      return Number(next.toFixed(2))
    })
  }

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 && e.button !== 1) return
    setPanning({ startX: e.clientX, startY: e.clientY, originX: offset.x, originY: offset.y })
  }

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!panning) return
    const dx = e.clientX - panning.startX
    const dy = e.clientY - panning.startY
    setOffset({ x: panning.originX + dx, y: panning.originY + dy })
  }, [panning])

  const endPan = () => setPanning(null)

  return (
    <div className="studio-canvas" ref={containerRef} onWheel={onWheel} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseLeave={endPan} onMouseUp={endPan}>
      <div className="canvas-transform" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}>
        {items.map(item => {
          if (item.type === 'image') {
            return (
              <div key={item.id} className="canvas-item image" style={{ left: item.x, top: item.y }}>
                <img src={item.content} alt="Generated" />
              </div>
            )
          }
          return (
            <div key={item.id} className="canvas-item" style={{ left: item.x, top: item.y }}>
              {item.type === 'color' ? (
                <div className="color-chip" style={{ background: item.content }} />
              ) : (
                item.content
              )}
            </div>
          )
        })}
      </div>
      <div className="canvas-overlay top-left">{Math.round(scale * 100)}%</div>
    </div>
  )
})

export default Canvas
